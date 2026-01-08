import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Upload, FileText, TrendingUp, Receipt, Sparkles, X, ChevronUp, ChevronDown, ArrowUpDown, Search, Building2, Bug, User } from 'lucide-react';
import { 
  PERSONAL_CATEGORIES as CATEGORY_KEYWORDS, 
  COMPANY_CATEGORIES as COMPANY_CATEGORY_KEYWORDS,
  PERSONAL_COLORS as CATEGORY_COLORS,
  COMPANY_COLORS as COMPANY_CATEGORY_COLORS
} from './config/categories';
import { parseStatement, getSupportedBanks } from './parsers';


function classifyTransaction(description, accountType = 'personal') {
  const lowerDesc = description.toLowerCase();
  const matches = [];
  
  // Use appropriate category keywords based on account type
  const categoryKeywords = accountType === 'company' ? COMPANY_CATEGORY_KEYWORDS : CATEGORY_KEYWORDS;
  
  for (const [category, config] of Object.entries(categoryKeywords)) {
    for (const keyword of config.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      
      // For short keywords (4 chars or less), use word boundary matching
      // to prevent partial matches like "mas" in "ELMASI" or "um" in "LUMPUR"
      let isMatch = false;
      if (lowerKeyword.length <= 4) {
        // Create regex with word boundaries
        const regex = new RegExp(`\\b${lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        isMatch = regex.test(lowerDesc);
      } else {
        isMatch = lowerDesc.includes(lowerKeyword);
      }
      
      if (isMatch) {
        matches.push({ category, priority: config.priority, keyword: lowerKeyword });
        break;
      }
    }
  }
  
  if (matches.length === 0) return 'Payment';
  
  // Sort by priority (lower = higher priority), then by keyword length (longer = more specific)
  matches.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return b.keyword.length - a.keyword.length; // Prefer longer/more specific matches
  });
  
  return matches[0].category;
}


// Demo transactions
function generateDemoTransactions() {
  return [
    { date: '01/12/25', isoDate: '2025-12-01', description: 'JAYA GROCER -COURTY SUBANG JAYA, MY', amount: 2.90, isCredit: false },
    { date: '02/12/25', isoDate: '2025-12-02', description: 'CASH DEPOSIT', amount: 50.00, isCredit: true },
    { date: '18/12/25', isoDate: '2025-12-18', description: 'SHOPEE - APPLEPAY-E 0327779222, MY', amount: 176.40, isCredit: false },
    { date: '20/12/25', isoDate: '2025-12-20', description: 'SUNWAY PYRAMID SELANGOR, MY', amount: 5.00, isCredit: false },
    { date: '22/12/25', isoDate: '2025-12-22', description: 'FUND TRANSFER TO A/ SOLID METRICS HUB Own', amount: 2910.00, isCredit: true },
    { date: '22/12/25', isoDate: '2025-12-22', description: 'IBK FUND TFR TO A/C JOSHUA YAP Fund Transfer', amount: 410.00, isCredit: true },
    { date: '22/12/25', isoDate: '2025-12-22', description: 'FPX PAYMENT FR A/ KUMPULAN WANG SIMPAN', amount: 4001.00, isCredit: false },
    { date: '22/12/25', isoDate: '2025-12-22', description: 'CR PYMT SAFE RT NEXT DELTA SDN.BHD.', amount: 500.00, isCredit: true },
    { date: '22/12/25', isoDate: '2025-12-22', description: 'CASH DEPOSIT', amount: 10.00, isCredit: true },
    { date: '25/12/25', isoDate: '2025-12-25', description: 'REFUND: SHOPEE - APPLEPAY-EC Kuala Lumpur MY', amount: 176.40, isCredit: true },
    { date: '26/12/25', isoDate: '2025-12-26', description: 'TRANSFER FROM A/C AZHARI BIN DAWAM MAE QR', amount: 190.00, isCredit: false },
    { date: '28/12/25', isoDate: '2025-12-28', description: '+14156978699, US', amount: 23.00, isCredit: false },
    { date: '29/12/25', isoDate: '2025-12-29', description: 'PTPTN APPS DD ELMASI', amount: 100.00, isCredit: false },
    { date: '31/12/25', isoDate: '2025-12-31', description: 'INTEREST PAID', amount: 0.73, isCredit: true },
  ];
}

export default function Spendsie() {
  const [transactions, setTransactions] = useState([]);
  const [accountType, setAccountType] = useState(null); // 'personal' or 'company'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'isoDate', direction: 'desc' });
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [parseError, setParseError] = useState(null);
  const [debugMode, setDebugMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const [ocrLog, setOcrLog] = useState([]);
  const [statementMonths, setStatementMonths] = useState([]);
  const [monthFilter, setMonthFilter] = useState('all');
  const [transactionsExpanded, setTransactionsExpanded] = useState(false);
  const [categorySettings, setCategorySettings] = useState(CATEGORY_KEYWORDS);
  const [colorSettings, setColorSettings] = useState(CATEGORY_COLORS);
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track which dropdown is open
  const [uiColors, setUiColors] = useState({
    accent: '#F59E0B', // amber
    accentLight: '#FCD34D',
    background: 'from-slate-900 via-slate-800 to-amber-900/50',
  });

  // Update category and color settings when account type changes
  useEffect(() => {
    if (accountType === 'company') {
      setCategorySettings(COMPANY_CATEGORY_KEYWORDS);
      setColorSettings(COMPANY_CATEGORY_COLORS);
    } else {
      setCategorySettings(CATEGORY_KEYWORDS);
      setColorSettings(CATEGORY_COLORS);
    }
  }, [accountType]);

  // Spacing settings (in pixels)
  const [spacingSettings, setSpacingSettings] = useState({
    pagePadding: 24,        // px-6 = 24px
    pageVerticalPadding: 40, // py-10 = 40px
    headerMarginBottom: 40,  // mb-10 = 40px
    statsGap: 24,           // gap-6 = 24px
    statsMarginBottom: 40,  // mb-10 = 40px
    statsCardPadding: 32,   // p-8 = 32px
    chartTableGap: 32,      // gap-8 = 32px
    cardPadding: 32,        // p-8 = 32px
    tableRowPadding: 16,    // p-4 = 16px
  });

  const processTransactions = useCallback((rawTransactions, accType) => {
    return rawTransactions.map((t, idx) => ({
      id: idx + 1,
      ...t,
      category: classifyTransaction(t.description, accType),
    }));
  }, []);

  // Load external scripts
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const handleFileUpload = async (files) => {
    setIsProcessing(true);
    setParseError(null);
    setRawText('');
    setOcrLog([]);
    const newFiles = [];
    let allTransactions = [];
    
    const addLog = (msg) => {
      console.log(msg);
      setOcrLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    for (const file of files) {
      newFiles.push({ name: file.name, size: file.size, type: file.type });
      addLog(`Processing file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      
      try {
        if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
          addLog('Loading PDF.js library...');
          setProcessingStatus('Loading PDF library...');
          
          // Load PDF.js
          await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          addLog('PDF.js loaded successfully');
          
          addLog('Reading PDF file...');
          setProcessingStatus('Reading PDF...');
          
          const arrayBuffer = await file.arrayBuffer();
          addLog(`PDF file read: ${arrayBuffer.byteLength} bytes`);
          
          const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          addLog(`PDF opened: ${pdf.numPages} page(s)`);
          
          let fullText = '';
          
          // Process each page with spatial reconstruction
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            addLog(`Extracting text from page ${pageNum}/${pdf.numPages}...`);
            setProcessingStatus(`Reading page ${pageNum} of ${pdf.numPages}...`);
            
            try {
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();
              
              addLog(`Page ${pageNum}: ${textContent.items.length} text items found`);
              
              // Group text items by Y position (rows)
              // PDF Y coordinates go bottom-to-top, so we'll invert
              const rowTolerance = 5; // Items within 5 units are same row
              const rows = [];
              
              for (const item of textContent.items) {
                if (!item.str || item.str.trim() === '') continue;
                
                const x = item.transform[4];
                const y = item.transform[5];
                
                // Find existing row or create new one
                let foundRow = rows.find(r => Math.abs(r.y - y) < rowTolerance);
                if (foundRow) {
                  foundRow.items.push({ x, text: item.str });
                } else {
                  rows.push({ y, items: [{ x, text: item.str }] });
                }
              }
              
              // Sort rows top-to-bottom (higher Y = higher on page in PDF coords)
              rows.sort((a, b) => b.y - a.y);
              
              // Sort items within each row left-to-right
              for (const row of rows) {
                row.items.sort((a, b) => a.x - b.x);
              }
              
              // Reconstruct text line by line
              let pageText = `\n--- Page ${pageNum} ---\n`;
              for (const row of rows) {
                const lineText = row.items.map(i => i.text).join(' ');
                pageText += lineText + '\n';
              }
              
              fullText += pageText;
              addLog(`Page ${pageNum}: Reconstructed ${rows.length} rows`);
              
            } catch (pageError) {
              addLog(`ERROR on page ${pageNum}: ${pageError.message}`);
              console.error('Page error:', pageError);
            }
          }
          
          setRawText(fullText);
          addLog(`Total extracted text: ${fullText.length} characters`);
          setProcessingStatus('Parsing transactions...');
          
          addLog('Detecting bank and parsing transactions...');
          const { transactions: parsed, statementMonth, bank } = parseStatement(fullText);
          addLog(`Detected ${bank.name} - Found ${parsed.length} transactions for ${statementMonth || 'unknown month'}`);
          
          if (statementMonth) {
            setStatementMonths(prev => {
              if (!prev.includes(statementMonth)) {
                return [...prev, statementMonth].sort((a, b) => {
                  // Sort by year then month
                  const [aMonth, aYear] = a.split(' ');
                  const [bMonth, bYear] = b.split(' ');
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  if (aYear !== bYear) return parseInt(bYear) - parseInt(aYear);
                  return months.indexOf(bMonth) - months.indexOf(aMonth);
                });
              }
              return prev;
            });
          }
          
          allTransactions = [...allTransactions, ...parsed];
          
        } else if (file.name.endsWith('.csv')) {
          addLog('Processing CSV file...');
          const text = await file.text();
          setRawText(text);
          const lines = text.split('\n').filter(l => l.trim());
          for (let i = 1; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length >= 3) {
              const date = parts[0]?.trim() || '';
              const description = parts[1]?.trim() || '';
              const amount = Math.abs(parseFloat(parts[2]?.replace(/[^0-9.-]/g, '') || '0'));
              const isCredit = parseFloat(parts[2] || '0') > 0;
              
              if (description && amount > 0) {
                allTransactions.push({ date, isoDate: date, description, amount, isCredit });
              }
            }
          }
          addLog(`CSV parsed: ${allTransactions.length} transactions`);
        } else {
          addLog('Processing text file...');
          const text = await file.text();
          setRawText(text);
          const { transactions: parsed, statementMonth, bank } = parseStatement(text);
          addLog(`Detected ${bank.name} - ${parsed.length} transactions for ${statementMonth || 'unknown month'}`);
          
          if (statementMonth) {
            setStatementMonths(prev => {
              if (!prev.includes(statementMonth)) {
                return [...prev, statementMonth].sort((a, b) => {
                  const [aMonth, aYear] = a.split(' ');
                  const [bMonth, bYear] = b.split(' ');
                  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  if (aYear !== bYear) return parseInt(bYear) - parseInt(aYear);
                  return months.indexOf(bMonth) - months.indexOf(aMonth);
                });
              }
              return prev;
            });
          }
          
          allTransactions = [...allTransactions, ...parsed];
        }
      } catch (error) {
        addLog(`ERROR: ${error.message}`);
        console.error('Error parsing file:', error);
        setParseError(`Error: ${error.message}`);
      }
    }

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    if (allTransactions.length > 0) {
      addLog(`Success! Processing ${allTransactions.length} transactions...`);
      const processed = processTransactions(allTransactions, accountType);
      setTransactions(prev => {
        const combined = [...prev, ...processed];
        return combined.map((t, i) => ({ ...t, id: i + 1 }));
      });
    } else if (!parseError) {
      addLog('No transactions found in parsed output');
      setDebugMode(true);
      setParseError('No transactions found. Check the extracted text below to see what was read from your PDF.');
    }
    
    setIsProcessing(false);
    setProcessingStatus('');
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleFileUpload(files);
  }, []);

  const loadDemo = () => {
    // Set personal type for demo data since it's personal spending
    if (!accountType) setAccountType('personal');
    const processed = processTransactions(generateDemoTransactions(), accountType || 'personal');
    setTransactions(processed);
    setUploadedFiles([{ name: 'maybank_dec_2025.pdf', size: 45678, type: 'application/pdf' }]);
    setParseError(null);
    setRawText('');
  };

  const clearData = () => {
    setTransactions([]);
    setUploadedFiles([]);
    setSearchTerm('');
    setCategoryFilter('all');
    setMonthFilter('all');
    setParseError(null);
    setRawText('');
    setOcrLog([]);
    setStatementMonths([]);
    setAccountType(null);
  };

  // Change transaction category via dropdown
  const changeTransactionCategory = (transactionId, newCategory) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        // Determine if the new category should be credit (positive) or debit (negative)
        const creditCategories = ['Income', 'Transfer In', 'Refund', 'Payments'];
        const isCredit = creditCategories.includes(newCategory);
        return { ...t, category: newCategory, isCredit };
      }
      return t;
    }));
    setOpenDropdownId(null); // Close dropdown after selection
  };

  // Get available categories based on account type
  const availableCategories = useMemo(() => {
    return Object.keys(colorSettings).sort();
  }, [colorSettings]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.date.includes(term)
      );
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(t => t.category === categoryFilter);
    }
    
    if (monthFilter !== 'all') {
      filtered = filtered.filter(t => t.statementMonth === monthFilter);
    }
    
    filtered.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'amount') {
        aVal = parseFloat(aVal);
        bVal = parseFloat(bVal);
      } else if (sortConfig.key === 'isoDate') {
        aVal = new Date(aVal).getTime() || 0;
        bVal = new Date(bVal).getTime() || 0;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [transactions, searchTerm, categoryFilter, monthFilter, sortConfig]);

  const stats = useMemo(() => {
    // Apply month filter to get filtered transactions for stats
    let filteredForStats = transactions;
    if (monthFilter !== 'all') {
      filteredForStats = transactions.filter(t => t.statementMonth === monthFilter);
    }
    
    // Expenses: all negative transactions (money going out)
    // Income: only transactions categorized as "Income"
    const spending = filteredForStats.filter(t => !t.isCredit);
    const income = filteredForStats.filter(t => t.category === 'Income');
    
    const totalSpending = spending.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
    const categoryBreakdown = spending.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    const pieData = Object.entries(categoryBreakdown)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);

    const categories = [...new Set(transactions.map(t => t.category))].sort();
    
    return { totalSpending, totalIncome, pieData, categories };
  }, [transactions, monthFilter]);

  // Calculate transaction counts per month
  const transactionsByMonth = useMemo(() => {
    const counts = {};
    transactions.forEach(t => {
      if (t.statementMonth) {
        counts[t.statementMonth] = (counts[t.statementMonth] || 0) + 1;
      }
    });
    // Sort by date (newest first)
    return Object.entries(counts)
      .sort((a, b) => {
        const [monthA, yearA] = a[0].split(' ');
        const [monthB, yearB] = b[0].split(' ');
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
        return monthOrder.indexOf(monthB) - monthOrder.indexOf(monthA);
      });
  }, [transactions]);

  const SortIcon = ({ columnKey }) => {
    const actualKey = columnKey === 'date' ? 'isoDate' : columnKey;
    if (sortConfig.key !== actualKey) return <ArrowUpDown className="w-3 h-3 text-slate-500" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-3 h-3 text-amber-400" />
      : <ChevronDown className="w-3 h-3 text-amber-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-900/50 text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Space+Mono:wght@400;700&display=swap');
        
        .mono { font-family: 'Space Mono', monospace; }
        .glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glow-amber { box-shadow: 0 0 40px rgba(245, 158, 11, 0.2); }
        .gradient-text {
          background: linear-gradient(135deg, #F59E0B, #FCD34D);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 40px rgba(245, 158, 11, 0.15);
        }
        .upload-zone {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.02));
          border: 2px dashed rgba(245, 158, 11, 0.3);
          transition: all 0.3s ease;
        }
        .upload-zone.active, .upload-zone:hover {
          border-color: #F59E0B;
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.08));
        }
        .table-row { transition: background 0.2s ease; }
        .table-row:hover { background: rgba(255, 255, 255, 0.05); }
        .sortable { cursor: pointer; user-select: none; }
        .sortable:hover { color: #F59E0B; }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-soft { animation: pulse-soft 2s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.05); }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(245, 158, 11, 0.3); border-radius: 3px; }
      `}</style>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto" style={{ padding: `${spacingSettings.pageVerticalPadding}px ${spacingSettings.pagePadding}px` }}>
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ marginBottom: `${spacingSettings.headerMarginBottom}px` }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center glow-amber">
              <Receipt className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">Spendsie</h1>
              <p className="text-xs md:text-sm text-slate-400">Maybank Statement Analyzer</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center" style={{ gap: '12px' }}>
            <button
              onClick={() => setDebugMode(!debugMode)}
              className={`glass rounded-xl text-sm transition-colors ${debugMode ? 'text-amber-400 border-amber-500/50' : 'text-slate-400 hover:text-white'}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', flexShrink: 0 }}
            >
              <Bug className="w-4 h-4" />
              <span className="hidden sm:inline">Debug</span>
            </button>
            
            <div className="glass rounded-xl" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', flexShrink: 0 }}>
              {accountType === 'personal' ? (
                <User className="w-4 h-4 text-amber-400" />
              ) : (
                <Building2 className="w-4 h-4 text-amber-400" />
              )}
              <span className="text-sm">🇲🇾 Maybank {accountType === 'company' ? '(Company)' : '(Personal)'}</span>
            </div>

            {transactions.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isProcessing ? (
                  <div className="glass rounded-xl text-sm text-amber-400" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', flexShrink: 0 }}>
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Processing...</span>
                  </div>
                ) : (
                  <label className="glass rounded-xl text-sm text-amber-400 hover:text-amber-300 hover:border-amber-500/50 transition-colors cursor-pointer" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', flexShrink: 0 }}>
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Upload More</span>
                    <input
                      type="file"
                      accept=".pdf,.csv,.txt"
                      multiple
                      onChange={(e) => e.target.files && handleFileUpload(Array.from(e.target.files))}
                      className="hidden"
                    />
                  </label>
                )}
                <button 
                  onClick={clearData}
                  className="glass rounded-xl text-sm text-slate-400 hover:text-white hover:border-red-500/50 transition-colors"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', flexShrink: 0 }}
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Debug Panel */}
        {debugMode && (rawText || ocrLog.length > 0) && transactions.length > 0 && (
          <div className="mb-6 glass rounded-xl p-4 space-y-4">
            <h3 className="font-semibold text-amber-400">🔍 Debug Output</h3>
            
            {ocrLog.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Processing Log:</p>
                <pre className="bg-slate-900/50 p-3 rounded-lg text-xs text-green-400 overflow-auto max-h-40 whitespace-pre-wrap font-mono">
                  {ocrLog.join('\n')}
                </pre>
              </div>
            )}
            
            {rawText && (
              <div>
                <p className="text-xs text-slate-500 mb-2">Extracted Text:</p>
                <pre className="bg-slate-900/50 p-3 rounded-lg text-xs text-slate-300 overflow-auto max-h-64 whitespace-pre-wrap font-mono">
                  {rawText}
                </pre>
              </div>
            )}
          </div>
        )}

        {transactions.length === 0 ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '672px' }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h2 className="text-4xl font-bold mb-4">
                  Analyze your<br />
                  <span className="gradient-text">Maybank statements</span>
                </h2>
                <p className="text-slate-400 text-lg">
                  Upload your Maybank PDF statement and get instant spending insights.
                </p>
              </div>

            {/* Account Type Selection */}
            {!accountType ? (
              <div className="glass rounded-2xl p-8 md:p-12">
                <p className="text-center text-lg font-medium mb-6">Select your account type</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setAccountType('personal')}
                    className="glass rounded-xl p-6 hover:border-amber-500/50 transition-all hover-lift text-left"
                  >
                    <div className="w-12 h-12 mb-4 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <User className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="font-semibold mb-1">Personal</p>
                    <p className="text-sm text-slate-400">Individual savings or current account</p>
                  </button>
                  <button
                    onClick={() => setAccountType('company')}
                    className="glass rounded-xl p-6 hover:border-amber-500/50 transition-all hover-lift text-left"
                  >
                    <div className="w-12 h-12 mb-4 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-amber-400" />
                    </div>
                    <p className="font-semibold mb-1">Company</p>
                    <p className="text-sm text-slate-400">Business or SME account</p>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Selected Account Type Badge */}
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="glass rounded-full px-4 py-2 text-sm flex items-center gap-2">
                    {accountType === 'personal' ? (
                      <><User className="w-4 h-4 text-amber-400" /> Personal Account</>
                    ) : (
                      <><Building2 className="w-4 h-4 text-amber-400" /> Company Account</>
                    )}
                  </span>
                  <button
                    onClick={() => setAccountType(null)}
                    className="text-slate-400 hover:text-white text-sm underline"
                  >
                    Change
                  </button>
                </div>

                <div
                  className={`upload-zone rounded-2xl p-8 md:p-12 cursor-pointer hover-lift ${dragActive ? 'active' : ''}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '280px' }}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onClick={() => !isProcessing && document.getElementById('file-input').click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    accept=".pdf,.csv,.txt"
                    className="hidden"
                    onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                    disabled={isProcessing}
                  />
                  
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 mb-6 rounded-2xl bg-amber-500/10 flex items-center justify-center relative overflow-hidden">
                        <FileText className="w-10 h-10 text-amber-400 animate-pulse" />
                      </div>
                      <p className="text-xl font-medium text-amber-400 mb-2">Processing document...</p>
                      <p className="text-sm text-slate-400">{processingStatus}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-20 h-20 mb-6 rounded-2xl bg-amber-500/10 flex items-center justify-center animate-float">
                        <Upload className="w-10 h-10 text-amber-400" />
                      </div>
                      <p className="text-xl font-medium mb-2 text-center">Drop your Maybank statement here</p>
                      <p className="text-slate-400 mb-6 text-center">or click to browse • PDF supported</p>
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                        <FileText className="w-4 h-4" />
                        <span>Reads PDF text with spatial reconstruction</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {parseError && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {parseError}
              </div>
            )}

            {/* Debug Panel - show OCR log and output */}
            {debugMode && (
              <div className="mt-6 glass rounded-xl p-4 space-y-4">
                <h3 className="font-semibold text-amber-400">🔍 Debug Output</h3>
                
                {/* OCR Processing Log */}
                {ocrLog.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Processing Log:</p>
                    <pre className="bg-slate-900/50 p-3 rounded-lg text-xs text-green-400 overflow-auto max-h-40 whitespace-pre-wrap font-mono">
                      {ocrLog.join('\n')}
                    </pre>
                  </div>
                )}
                
                {/* Extracted Text Output */}
                {rawText ? (
                  <div>
                    <p className="text-xs text-slate-500 mb-2">Extracted Text ({rawText.length} chars):</p>
                    <pre className="bg-slate-900/50 p-3 rounded-lg text-xs text-slate-300 overflow-auto max-h-64 whitespace-pre-wrap font-mono">
                      {rawText}
                    </pre>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">No text extracted yet. Upload a PDF to see output.</p>
                )}
              </div>
            )}

            <div className="mt-6 text-center">
              <button 
                onClick={loadDemo}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
                disabled={isProcessing}
              >
                ✨ Try with demo data
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
              {[
                { icon: <FileText className="w-5 h-5" />, title: 'PDF Reading', desc: 'Smart text extraction' },
                { icon: <ArrowUpDown className="w-5 h-5" />, title: 'Auto-categorize', desc: 'MY merchants' },
                { icon: <Sparkles className="w-5 h-5" />, title: 'Visual breakdown', desc: 'Charts & insights' },
              ].map((f, i) => (
                <div key={i} className="glass rounded-xl p-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  <div className="w-10 h-10 mb-3 rounded-lg bg-amber-500/10 text-amber-400" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {f.icon}
                  </div>
                  <p className="font-medium text-sm">{f.title}</p>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              ))}
            </div>
            </div>
          </div>
        ) : (
          <div>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: `${spacingSettings.statsGap}px`, marginBottom: `${spacingSettings.statsMarginBottom}px` }}>
              <div className="glass rounded-2xl hover-lift" style={{ padding: `${spacingSettings.statsCardPadding}px` }}>
                <p className="text-slate-400 text-sm mb-3">Total Expenses</p>
                <p className="text-2xl md:text-3xl font-bold mono text-red-400">
                  RM{stats.totalSpending.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
              </div>
              <div className="glass rounded-2xl hover-lift" style={{ padding: `${spacingSettings.statsCardPadding}px` }}>
                <p className="text-slate-400 text-sm mb-3">Total Income</p>
                <p className="text-2xl md:text-3xl font-bold mono text-emerald-400">
                  RM{stats.totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
              </div>
              <div className="glass rounded-2xl hover-lift" style={{ padding: `${spacingSettings.statsCardPadding}px` }}>
                <p className="text-slate-400 text-sm mb-3">Net Profit/Loss</p>
                <p className={`text-2xl md:text-3xl font-bold mono ${stats.totalIncome - stats.totalSpending >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  RM{(stats.totalIncome - stats.totalSpending).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </p>
              </div>
              <div 
                className="glass rounded-2xl hover-lift cursor-pointer transition-all"
                style={{ padding: `${spacingSettings.statsCardPadding}px` }}
                onClick={() => setTransactionsExpanded(!transactionsExpanded)}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-slate-400 text-sm">Transactions</p>
                  <ChevronDown 
                    className={`w-4 h-4 text-slate-400 transition-transform ${transactionsExpanded ? 'rotate-180' : ''}`} 
                  />
                </div>
                <p className="text-2xl md:text-3xl font-bold mono">{transactions.length}</p>
                
                {transactionsExpanded && transactionsByMonth.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2 max-h-48 overflow-y-auto">
                    {transactionsByMonth.map(([month, count]) => (
                      <div 
                        key={month} 
                        className="flex items-center justify-between text-sm hover:bg-white/5 rounded-lg px-2 py-1.5 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMonthFilter(monthFilter === month ? 'all' : month);
                        }}
                      >
                        <span className={`text-slate-300 ${monthFilter === month ? 'text-amber-400 font-medium' : ''}`}>
                          {month}
                        </span>
                        <span className={`mono ${monthFilter === month ? 'text-amber-400 font-medium' : 'text-slate-400'}`}>
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chart + Table */}
            <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: `${spacingSettings.chartTableGap}px` }}>
              <div className="glass rounded-2xl" style={{ padding: `${spacingSettings.cardPadding}px` }}>
                <h3 className="font-semibold text-lg mb-6">Spending Breakdown</h3>
                {stats.pieData.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={stats.pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={95}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {stats.pieData.map((entry, index) => (
                            <Cell key={index} fill={colorSettings[entry.name] || colorSettings['Payment']} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(30, 41, 59, 0.95)', 
                            border: '1px solid rgba(255,255,255,0.1)', 
                            borderRadius: '12px',
                            color: 'white'
                          }}
                          formatter={(value) => [`RM${value.toLocaleString()}`, '']}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    
                    <div className="space-y-2.5 mt-4 max-h-48 overflow-y-auto scrollbar-thin">
                      {stats.pieData.map((item, i) => (
                        <div 
                          key={i} 
                          className="text-sm cursor-pointer hover:bg-white/5 rounded-lg transition-colors"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px' }}
                          onClick={() => setCategoryFilter(categoryFilter === item.name ? 'all' : item.name)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', flexShrink: 0, background: colorSettings[item.name] || colorSettings['Payment'] }} />
                            <span className={`text-slate-300 ${categoryFilter === item.name ? 'text-amber-400 font-medium' : ''}`} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                          </div>
                          <span className="mono text-slate-400" style={{ flexShrink: 0, marginLeft: '8px' }}>RM{item.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    No spending data
                  </div>
                )}
              </div>

              <div className="lg:col-span-2 glass rounded-2xl" style={{ padding: `${spacingSettings.cardPadding}px` }}>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                  <h3 className="font-semibold text-lg">Transactions</h3>
                  
                  <div className="flex flex-wrap items-center gap-3 flex-1 md:justify-end">
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <Search className="w-4 h-4 text-slate-500" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 1 }} />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-slate-800/50 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-amber-500/50"
                        style={{ paddingLeft: '36px', paddingRight: '16px', paddingTop: '10px', paddingBottom: '10px', width: '180px' }}
                      />
                    </div>
                    
                    {statementMonths.length > 0 && (
                      <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500/50"
                        style={{ flexShrink: 0 }}
                      >
                        <option value="all">All Months</option>
                        {statementMonths.map(month => (
                          <option key={month} value={month}>{month}</option>
                        ))}
                      </select>
                    )}
                    
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-amber-500/50"
                      style={{ flexShrink: 0 }}
                    >
                      <option value="all">All Categories</option>
                      {stats.categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <span className="text-sm text-slate-400">{filteredAndSortedTransactions.length} of {transactions.length}</span>
                </div>
                
                <div className="overflow-hidden rounded-xl border border-white/5">
                  <div className="overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-thin">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-800/50 sticky top-0">
                        <tr>
                          <th className="text-left font-medium text-slate-400 sortable" style={{ padding: `${spacingSettings.tableRowPadding}px` }} onClick={() => handleSort('isoDate')}>
                            <div className="flex items-center gap-1">Date <SortIcon columnKey="date" /></div>
                          </th>
                          <th className="text-left font-medium text-slate-400 sortable" style={{ padding: `${spacingSettings.tableRowPadding}px` }} onClick={() => handleSort('description')}>
                            <div className="flex items-center gap-1">Description <SortIcon columnKey="description" /></div>
                          </th>
                          <th className="text-left font-medium text-slate-400 sortable" style={{ padding: `${spacingSettings.tableRowPadding}px` }} onClick={() => handleSort('category')}>
                            <div className="flex items-center gap-1">Category <SortIcon columnKey="category" /></div>
                          </th>
                          <th className="text-right font-medium text-slate-400 sortable" style={{ padding: `${spacingSettings.tableRowPadding}px` }} onClick={() => handleSort('amount')}>
                            <div className="flex items-center gap-1 justify-end">Amount <SortIcon columnKey="amount" /></div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedTransactions.map((t) => (
                          <tr key={t.id} className="table-row border-t border-white/5">
                            <td className="mono text-slate-400 text-xs whitespace-nowrap" style={{ padding: `${spacingSettings.tableRowPadding}px` }}>{t.date}</td>
                            <td style={{ padding: `${spacingSettings.tableRowPadding}px`, maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={t.description}>{t.description}</td>
                            <td style={{ padding: `${spacingSettings.tableRowPadding}px`, position: 'relative' }}>
                              <span 
                                className="rounded-full text-xs font-medium cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
                                style={{ 
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 10px',
                                  whiteSpace: 'nowrap',
                                  background: `${colorSettings[t.category] || colorSettings['Payment']}20`,
                                  color: colorSettings[t.category] || colorSettings['Payment']
                                }}
                                onClick={() => setOpenDropdownId(openDropdownId === t.id ? null : t.id)}
                                title="Click to change category"
                              >
                                {t.category}
                                <ChevronDown className="w-3 h-3" />
                              </span>
                              
                              {/* Category Dropdown Menu */}
                              {openDropdownId === t.id && (
                                <>
                                  {/* Backdrop to close dropdown */}
                                  <div 
                                    className="fixed inset-0 z-40" 
                                    onClick={() => setOpenDropdownId(null)}
                                  />
                                  <div className="category-dropdown absolute left-0 top-full mt-1 z-50 bg-slate-800 border border-white/10 rounded-lg shadow-xl py-1 min-w-[180px] max-h-[300px] overflow-y-auto">
                                    {availableCategories.map((cat) => (
                                      <button
                                        key={cat}
                                        className={`w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2 ${t.category === cat ? 'bg-white/5' : ''}`}
                                        onClick={() => changeTransactionCategory(t.id, cat)}
                                      >
                                        <span 
                                          className="w-3 h-3 rounded-full flex-shrink-0"
                                          style={{ background: colorSettings[cat] }}
                                        />
                                        <span style={{ color: colorSettings[cat] }}>{cat}</span>
                                        {t.category === cat && <span className="ml-auto text-emerald-400">✓</span>}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </td>
                            <td className={`text-right mono font-medium ${t.isCredit ? 'text-emerald-400' : 'text-red-400'}`} style={{ padding: `${spacingSettings.tableRowPadding}px` }}>
                              {t.isCredit ? '+' : '-'}RM{t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                            </td>
                          </tr>
                        ))}
                        {filteredAndSortedTransactions.length === 0 && (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-500">No transactions match</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Uploaded files and statement months */}
            <div className="mt-8 glass rounded-xl p-5 md:p-6">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm text-slate-400 mb-3">Uploaded statements:</p>
                  <div className="flex flex-wrap gap-2.5">
                    {uploadedFiles.map((f, i) => (
                      <span key={i} className="px-3 py-1.5 bg-amber-500/10 text-amber-300 rounded-full text-xs flex items-center gap-2">
                        <FileText className="w-3 h-3" />
                        {f.name}
                      </span>
                    ))}
                  </div>
                </div>
                {statementMonths.length > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-slate-400 mb-3">Statement months:</p>
                    <div className="flex flex-wrap gap-2.5 justify-end">
                      {statementMonths.map((month, i) => (
                        <span 
                          key={i} 
                          className={`px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors ${
                            monthFilter === month 
                              ? 'bg-amber-500 text-black font-medium' 
                              : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                          }`}
                          onClick={() => setMonthFilter(monthFilter === month ? 'all' : month)}
                        >
                          {month}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <footer className="mt-16 pb-8 text-center text-sm text-slate-500">
          <p>Spendsie • Maybank Statement Analyzer 🇲🇾</p>
        </footer>
      </div>
    </div>
  );
}
