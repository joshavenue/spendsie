import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Upload, FileText, TrendingUp, Receipt, Sparkles, X, ChevronUp, ChevronDown, ArrowUpDown, Search, Building2, Bug, User } from 'lucide-react';

// Malaysian-specific category keywords - Expanded
const CATEGORY_KEYWORDS = {
  'Food & Dining': {
    keywords: [
      // International Fast Food
      'restaurant', 'cafe', 'coffee', 'food', 'dining', 'mcd', 'mcdonalds', "mcdonald's", 'kfc', 'pizza', 'pizza hut', 
      'domino', "domino's", 'burger king', 'subway', 'wendys', "wendy's", 'taco bell', 'carl\'s jr', 'a&w',
      // Malaysian Fast Food & Chains
      'marrybrown', 'texas chicken', 'nandos', "nando's", 'kenny rogers', 'the chicken rice shop', 'tcrs',
      'secret recipe', 'oldtown', 'old town', 'papparich', 'pappa rich', 'mamak', 'kopitiam',
      // Asian Chains
      'sushi', 'sushi king', 'sushi zanmai', 'sakae sushi', 'genki sushi', 'boat noodle', 'absolute thai',
      'kim gary', 'dragon-i', 'paradise inn', 'nan xiang', 'din tai fung', 'ramen', 'ichiban',
      // Cafes & Coffee
      'starbucks', 'coffee bean', 'zus coffee', 'zus', 'luckin coffee', 'luckin', 'dôme', 'dome cafe',
      'san francisco coffee', 'toby\'s estate', 'bean brothers', 'breakfast thieves', 'vCR',
      // Bubble Tea & Desserts
      'tealive', 'gong cha', 'tiger sugar', 'the alley', 'daboba', 'liho', 'each a cup', 'coolblog',
      'chatime', 'share tea', 'koi', 'llao llao', 'baskin robbins', 'haagen dazs', 'inside scoop',
      // Bakeries
      'tous les jours', 'lavender', 'rt pastry', 'breadtalk', 'rotiboy', 'komugi', 'barcook',
      // Food Delivery
      'foodpanda', 'grabfood', 'shopeefood', 'delivereat',
      // Local Keywords
      'restoran', 'kedai makan', 'warung', 'gerai', 'nasi', 'mee', 'laksa', 'char kuey teow',
      'roti canai', 'dim sum', 'steamboat', 'bbq', 'buffet', 'catering',
    ],
    priority: 2,
  },
  'Grab/E-hailing': {
    keywords: ['grab', 'grabcar', 'grabpay', 'gojek', 'maxim', 'indriver', 'airasia ride', 'mula'],
    priority: 1,
  },
  'EV & Petrol': {
    keywords: [
      // EV Charging - known providers
      'sonicboom',
      // Petrol
      'petrol', 'shell', 'petronas', 'caltex', 'petron', 'bhp', 'fuel', 'setel', 'petrol station', 'gas station',
    ],
    priority: 1,
  },
  'Parking & Toll': {
    keywords: [
      'parking', 'toll', 'plus', 'touch n go', 'tng', 'smart tag', 'rfid',
      'park easy', 'jomparking', 'flexi parking', 'parkson parking', 'carpark',
      'lpt', 'nkve', 'duke', 'suke', 'mex', 'akleh', 'kesas', 'sprint', 'ldp', 'npe',
    ],
    priority: 1,
  },
  'Public Transport': {
    keywords: [
      'lrt', 'mrt', 'ktm', 'rapidkl', 'prasarana', 'bus', 'transit', 'monorail', 
      'erl', 'klia ekspres', 'klia transit', 'myrapid', 'causeway link', 'aeroline',
      'kkkl', 'transnasional', 'plusliner', 'nice', 'konsortium',
    ],
    priority: 1,
  },
  'Online Shopping': {
    keywords: [
      'shopee', 'lazada', 'zalora', 'shein', 'taobao', 'aliexpress', 'temu', 'amazon',
      'pg mall', 'lelong', 'carousell', 'mudah', 'hermo', 'althea', 'sephora online',
      'h&m online', 'uniqlo online', 'asos', 'fashion valet', 'pomelo', 'love bonito',
    ],
    priority: 1,
  },
  'Retail & Mall': {
    keywords: [
      // Fashion
      'uniqlo', 'h&m', 'zara', 'cotton on', 'padini', 'nike', 'adidas', 'puma', 'new balance',
      'bata', 'vincci', 'charles & keith', 'pedro', 'coach', 'michael kors', 'fossil',
      'brands outlet', 'factory outlet', 'reject shop', 'bundle',
      // Beauty & Health
      'sephora', 'guardian', 'watsons', 'caring pharmacy', 'big pharmacy', 'aa pharmacy',
      // Home & DIY
      'mr diy', 'mr. diy', 'daiso', 'ikea', 'harvey norman', 'courts', 'homelux', 'homepro',
      'ace hardware', 'ssf', 'lorenzo', 'cellini', 'zolano',
      // Electronics
      'senheng', 'thunder match', 'directd', 'urban republic', 'machines', 'switch', 'istudio',
      'logitech', 'samsung store', 'oppo', 'xiaomi', 'huawei',
      // Bookstores
      'popular', 'mph', 'kinokuniya', 'times bookstore', 'bookxcess',
      // Sports
      'decathlon', 'sports direct', 'jd sports', 'al-ikhsan', 'stadium', 'royal sporting house',
      // Department Stores
      'parkson', 'isetan', 'sogo', 'metrojaya', 'aeon', 'robinsons',
      // Malls (generic)
      'sunway pyramid', 'pavilion', 'mid valley', 'one utama', 'ioi city', 'setia city',
      'klcc', 'suria klcc', 'the gardens', 'bangsar village', 'nu sentral', 'mytown',
      'quill city', 'avenue k', 'fahrenheit88', 'lot 10', 'berjaya times square',
      'sunway velocity', 'dpulze', 'empire', 'the curve', 'ikano', 'citta mall',
      'mall', 'shopping', 'retail',
    ],
    priority: 2,
  },
  'Groceries': {
    keywords: [
      // Premium
      'jaya grocer', 'village grocer', 'cold storage', 'ben\'s independent', 'mercato', 'qra',
      // Hypermarket
      'aeon big', 'aeon', 'giant', 'tesco', 'lotus', 'mydin', 'econsave', 'nsk', 'lulu',
      // Value
      '99 speedmart', '99 speed mart', 'speedmart', 'tf value mart', 'hero market', 'billion',
      // Convenience
      'family mart', 'familymart', '7-eleven', '7 eleven', 'kk mart', 'kk super mart',
      'cu', 'emart24', 'mynews', 'petronas mesra',
      // Keywords
      'supermarket', 'grocer', 'grocery', 'pasaraya', 'hypermarket', 'mart', 'minimarket',
    ],
    priority: 1,
  },
  'Entertainment': {
    keywords: [
      // Streaming
      'netflix', 'spotify', 'disney', 'disney+', 'youtube', 'youtube premium', 'apple music',
      'amazon prime', 'hbo', 'hbo go', 'viu', 'wetv', 'iqiyi', 'astro go',
      // Cinema
      'cinema', 'gsc', 'golden screen', 'tgv', 'mbo', 'mmcineplexes', 'lotus five star', 'dadi',
      // Gaming
      'game', 'steam', 'playstation', 'xbox', 'nintendo', 'razer', 'garena', 'pubg', 
      'mobile legends', 'genshin', 'riot games', 'epic games', 'twitch',
      // Recreation
      'karaoke', 'redbox', 'neway', 'k box', 'bowling', 'arcade', 'timezone', 'mollyfantasy',
      'escape room', 'theme park', 'sunway lagoon', 'legoland', 'genting', 'resort world',
      // Events
      'ticket', 'ticket2u', 'ticketcharge', 'axs', 'myticket', 'concert', 'event',
    ],
    priority: 1,
  },
  'Healthcare': {
    keywords: [
      // Keywords
      'clinic', 'hospital', 'pharmacy', 'doctor', 'medical', 'dental', 'dentist', 'klinik', 'farmasi',
      // Private Hospitals
      'kpj', 'pantai', 'gleneagles', 'columbia asia', 'sunway medical', 'prince court', 
      'ijn', 'ijm', 'sjmc', 'assunta', 'beacon', 'tropicana medical', 'thomson',
      // Clinics
      'qualitas', 'bp healthcare', 'pathlab', 'clinipath', 'gribbles',
      // Pharmacies
      'caring', 'big pharmacy', 'aa pharmacy', 'alpro pharmacy',
      // Optical
      'focus point', 'eye hub', 'vision lab', 'optometrist',
      // Health Screening
      'health screening', 'medical checkup', 'blood test',
    ],
    priority: 2,
  },
  'Education': {
    keywords: [
      // Online Learning
      'course', 'udemy', 'coursera', 'skillshare', 'linkedin learning', 'masterclass',
      // Keywords
      'tuition', 'school', 'university', 'college', 'education', 'training', 'akademi', 'sekolah',
      // Local Universities - use full names to avoid false matches
      'universiti malaya', 'universiti sains', 'universiti kebangsaan', 'universiti teknologi',
      'universiti putra', 'universiti islam', 'unimas', 'uitm',
      // Private Universities
      'taylors university', 'sunway university', 'sunway college', 'help university', 
      'inti college', 'monash university', 'nottingham university',
      'ucsi', 'multimedia university', 'asia pacific university', 'limkokwing', 'segi college', 'kdu',
      // Tuition Centers
      'kumon', 'mental arithmetic', 'abacus',
    ],
    priority: 2,
  },
  'Insurance': {
    keywords: [
      'insurance', 'insurans', 'prudential', 'aia', 'great eastern', 'allianz', 'manulife', 
      'zurich', 'takaful', 'etiqa', 'policy', 'premium', 'life insurance', 'motor insurance',
      'tokio marine', 'msig', 'axa', 'generali', 'fwd', 'hong leong assurance', 'tune protect',
    ],
    priority: 1,
  },
  'Utilities': {
    keywords: [
      // Electricity
      'tnb', 'tenaga', 'tenaga nasional', 'sesb', 'sesco', 'sarawak energy',
      // Water
      'syabas', 'air selangor', 'indah water', 'iwk', 'saj', 'sada', 'laku',
      // Internet & Telco
      'unifi', 'maxis', 'celcom', 'digi', 'yes 4g', 'u mobile', 'time', 'allo',
      'hotlink', 'xpax', 'yoodo', 'tune talk',
      // TV
      'astro', 'njoi',
      // Keywords
      'electricity', 'water', 'internet', 'telco', 'broadband', 'bil', 'utility',
    ],
    priority: 1,
  },
  'Subscriptions': {
    keywords: [
      'subscription', 'adobe', 'microsoft', 'microsoft 365', 'office 365', 'google one',
      'icloud', 'apple one', 'canva', 'dropbox', 'zoom', 'chatgpt', 'openai',
      'medium', 'substack', 'patreon', 'onlyfans', 'membership', 'annual fee',
    ],
    priority: 1,
  },
  'Travel': {
    keywords: [
      // Airlines - avoid short codes that match other words
      'airasia', 'air asia', 'malaysia airlines', 'firefly', 'batik air', 'malindo',
      'singapore airlines', 'cathay', 'emirates', 'qatar', 'airline', 'flight',
      // Hotels
      'agoda', 'booking.com', 'trivago', 'expedia', 'hotels.com', 'airbnb', 'oyo',
      'marriott', 'hilton', 'shangri-la', 'sheraton', 'westin', 'hyatt', 'ibis',
      'hotel', 'resort', 'hostel', 'accommodation',
      // Bus/Train
      'easybook', 'busonlineticket', 'catchthatbus', 'redbus', 'ktmb',
      // Car Rental
      'socar', 'gocar', 'trevo', 'flux', 'mayflower', 'hertz', 'avis', 'car rental',
      // Travel Agents
      'tripcom', 'trip.com', 'klook', 'traveloka', 'kkkl',
    ],
    priority: 1,
  },
  'Gym & Fitness': {
    keywords: [
      'gym', 'fitness', 'celebrity fitness', 'fitness first', 'anytime fitness', 
      'chi fitness', 'true fitness', 'kl fitness', 'jetts', 'f45',
      'yoga', 'pilates', 'spin', 'crossfit', 'martial arts', 'boxing',
    ],
    priority: 1,
  },
  'Government': {
    keywords: [
      // Tax
      'lhdn', 'hasil', 'income tax', 'cukai', 'cukai pendapatan',
      // Road
      'jpj', 'road tax', 'puspakom', 'myeg', 'pdrm', 'saman', 'summons', 'fine',
      // Property
      'cukai tanah', 'cukai taksiran', 'assessment', 'quit rent', 'mbpj', 'mbsa', 'dbkl', 'mpkj',
      // Others
      'kwsp', 'perkeso', 'socso', 'zakat', 'fitrah',
    ],
    priority: 1,
  },
  'PTPTN': {
    keywords: ['ptptn'],
    priority: 1,
  },
  'EPF/KWSP': {
    keywords: ['kwsp', 'epf', 'kumpulan wang simpan', 'employees provident'],
    priority: 1,
  },
  'Money Transfer': {
    keywords: [
      'fund transfer', 'ibk fund', 'duitnow', 'mae qr', 'fpx payment',
      'transfer from', 'transfer to', 'instant transfer', 'ibg',
      'wise', 'remittance', 'western union', 'moneygram', 'worldremit',
    ],
    priority: 1,
  },
  'Income': {
    keywords: [
      'salary', 'gaji', 'cr pymt', 'cash deposit', 'interest paid', 'interest earned',
      'cashback', 'rebate', 'dividend', 'bonus', 'commission', 'allowance',
      'reimbursement', 'claim', 'payment received', 'credit',
    ],
    priority: 2,
  },
  'Refund': {
    keywords: ['refund'],
    priority: 0,  // Highest priority - if description contains "refund", always use this category
  },
  'ATM/Cash': {
    keywords: ['atm', 'cash withdrawal', 'withdraw', 'pengeluaran', 'cash out', 'cwd'],
    priority: 1,
  },
  'Fees & Charges': {
    keywords: [
      'fee', 'charge', 'service charge', 'annual fee', 'stamp duty', 'duti setem',
      'caj', 'direct debit', 'cms-direct', 'late payment', 'penalty', 'interest charge',
      'processing fee', 'admin fee', 'bank charge',
    ],
    priority: 1,
  },
  'Investment': {
    keywords: [
      'investment', 'pelaburan', 'unit trust', 'asnb', 'asb', 'amanah saham',
      'pnb', 'stock', 'share', 'trading', 'rakuten', 'mplus', 'cgs-cimb',
      'maybank trade', 'hle', 'fundsupermart', 'stashaway', 'wahed', 'versa',
      'robo advisor', 'crypto', 'bitcoin', 'luno', 'tokenize',
    ],
    priority: 2,
  },
  'Loan & Credit': {
    keywords: [
      'loan', 'pinjaman', 'instalment', 'ansuran', 'hire purchase', 'mortgage',
      'housing loan', 'car loan', 'personal loan', 'credit card', 'bnpl',
      'atome', 'grabpay later', 'shopee paylater', 'split', 'pay later',
    ],
    priority: 2,
  },
  'Pets': {
    keywords: [
      'pet', 'veterinar', 'vet', 'pet shop', 'pet food', 'petster', 'pet lovers',
      'grooming', 'pet boarding',
    ],
    priority: 2,
  },
  'Religious': {
    keywords: [
      'mosque', 'masjid', 'church', 'temple', 'zakat', 'sedekah', 'donation',
      'wakaf', 'tabung haji', 'th', 'haj', 'umrah', 'tithe',
    ],
    priority: 2,
  },
};

// Company/Business-specific category keywords
const COMPANY_CATEGORY_KEYWORDS = {
  'Payments': {
    keywords: [
      // Client payments (money in) - specific payment indicators
      'payment received', 'sales', 'invoice', 'customer payment', 'client payment', 
      'cr pymt', 'cash deposit', 'cheque deposit', 'interest earned', 'interest paid',
      // Vendor payments (money out)
      'supplier', 'vendor', 'purchase', 'inventory', 'stock', 'raw material',
      'wholesale', 'distributor', 'manufacturer',
    ],
    priority: 2,
  },
  'Expenses': {
    keywords: [
      // Office expenses
      'office', 'stationery', 'printing', 'photocopy', 'supplies', 'cleaning',
      'maintenance', 'repair', 'pest control', 'security', 'aircon', 'pantry',
      'water dispenser', 'mr diy', 'daiso', 'popular', 'officeworks',
      // Marketing & Ads
      'marketing', 'advertising', 'ads', 'advertisement', 'promotion',
      'facebook ads', 'google ads', 'instagram', 'social media', 'billboard',
      'flyer', 'brochure', 'banner', 'signage', 'sponsorship', 'event',
      'exhibition', 'trade show', 'booth', 'merchandise',
      // Business Travel
      'airasia', 'air asia', 'malaysia airlines', 'flight', 'airline',
      'agoda', 'booking.com', 'hotel', 'accommodation', 'travel', 'trip',
      'mileage', 'transport', 'grab', 'taxi', 'parking', 'toll',
      // Software & Tools
      'software', 'subscription', 'saas', 'license', 'adobe', 'microsoft',
      'microsoft 365', 'office 365', 'google workspace', 'zoom', 'slack',
      'canva', 'dropbox', 'cloud', 'hosting', 'domain', 'website',
      'sql anywhere', 'autocount', 'ubs', 'myob', 'quickbooks',
    ],
    priority: 2,
  },
  'Payroll & Staff': {
    keywords: [
      'salary', 'gaji', 'wages', 'payroll', 'staff', 'employee', 'bonus',
      'commission', 'allowance', 'overtime', 'epf', 'kwsp', 'socso', 'perkeso',
      'eis', 'pcb', 'hrdf',
    ],
    priority: 1,
  },
  'Rent & Property': {
    keywords: [
      'rent', 'sewa', 'rental', 'lease', 'tenancy', 'deposit', 'landlord',
      'property', 'building', 'premise', 'warehouse', 'factory', 'shop lot',
    ],
    priority: 1,
  },
  'Equipment & Assets': {
    keywords: [
      'equipment', 'machinery', 'computer', 'laptop', 'printer', 'furniture',
      'fixture', 'vehicle', 'car', 'lorry', 'truck', 'forklift', 'tool',
      'machine', 'asset', 'capital', 'senheng', 'harvey norman', 'machines',
    ],
    priority: 2,
  },
  'Professional Services': {
    keywords: [
      'legal', 'lawyer', 'solicitor', 'accounting', 'accountant', 'audit',
      'consultant', 'consulting', 'advisory', 'secretary', 'corporate secretary',
      'company secretary', 'tax agent', 'hr consultant', 'it consultant',
    ],
    priority: 1,
  },
  'Tax & Government': {
    keywords: [
      'lhdn', 'hasil', 'income tax', 'corporate tax', 'cukai', 'ssm',
      'suruhanjaya syarikat', 'company commission', 'annual return',
      'jpj', 'road tax', 'dbkl', 'mbpj', 'mbsa', 'mpkj', 'assessment',
      'cukai taksiran', 'cukai tanah', 'quit rent', 'license', 'lesen',
      'permit', 'myeg', 'saman', 'fine', 'penalty',
    ],
    priority: 1,
  },
  'Owner\'s Draw': {
    keywords: [
      'own', 'owner', 'director', 'shareholder', 'dividend', 'drawing',
      'personal', 'private',
    ],
    priority: 3,
  },
  'Bank Fees': {
    keywords: [
      'fee', 'charge', 'bank charge', 'service charge', 'annual fee',
      'stamp duty', 'duti setem', 'caj', 'commission', 'interest charge',
      'loan interest', 'overdraft', 'facility fee', 'processing fee',
    ],
    priority: 1,
  },
  'Utilities': {
    keywords: [
      'tnb', 'tenaga', 'electricity', 'syabas', 'air selangor', 'water',
      'unifi', 'maxis', 'celcom', 'digi', 'internet', 'broadband', 'telco',
      'astro', 'indah water', 'iwk', 'bil', 'utility',
    ],
    priority: 1,
  },
  'Petrol/EV': {
    keywords: [
      'petrol', 'diesel', 'fuel', 'shell', 'petronas', 'caltex', 'petron',
      'setel', 'sonicboom', 'ev charging', 'chargev',
    ],
    priority: 1,
  },
  'Insurance': {
    keywords: [
      'insurance', 'insurans', 'takaful', 'fire insurance', 'business insurance',
      'public liability', 'professional indemnity', 'workmen compensation',
      'motor insurance', 'cargo insurance', 'etiqa', 'allianz', 'prudential',
    ],
    priority: 1,
  },
  'Loan Repayment': {
    keywords: [
      'loan', 'pinjaman', 'instalment', 'ansuran', 'hire purchase',
      'mortgage', 'financing', 'leasing', 'credit facility', 'term loan',
      'trade financing', 'invoice financing',
    ],
    priority: 2,
  },
  'Money Transfer': {
    keywords: [
      'fund transfer', 'ibk fund', 'duitnow', 'fpx payment',
      'transfer from', 'transfer fr a/c', 'transfer to a/c', 'transfer to',
      'instant transfer', 'ibg', 'wise', 'remittance', 'telegraphic transfer',
    ],
    priority: 1,
  },
  'Refund': {
    keywords: ['refund'],
    priority: 0,
  },
};

const CATEGORY_COLORS = {
  'Food & Dining': '#FF6B6B',
  'Grab/E-hailing': '#4ECDC4',
  'EV & Petrol': '#F39C12',
  'Parking & Toll': '#9B59B6',
  'Public Transport': '#3498DB',
  'Online Shopping': '#FFE66D',
  'Retail & Mall': '#F9A826',
  'Groceries': '#2ECC71',
  'Entertainment': '#E91E63',
  'Healthcare': '#00BCD4',
  'Education': '#FF9800',
  'Insurance': '#673AB7',
  'Utilities': '#607D8B',
  'Subscriptions': '#9C27B0',
  'Travel': '#00ACC1',
  'Gym & Fitness': '#FF5722',
  'Government': '#455A64',
  'PTPTN': '#795548',
  'EPF/KWSP': '#8BC34A',
  'Money Transfer': '#78909C',
  'Income': '#4CAF50',
  'Refund': '#26A69A',
  'ATM/Cash': '#FFC107',
  'Fees & Charges': '#F44336',
  'Investment': '#1E88E5',
  'Loan & Credit': '#D32F2F',
  'Pets': '#8D6E63',
  'Religious': '#7E57C2',
  'Payment': '#BDC3C7',
};

const COMPANY_CATEGORY_COLORS = {
  'Payments': '#4CAF50',
  'Expenses': '#78909C',
  'Payroll & Staff': '#5C6BC0',
  'Rent & Property': '#8D6E63',
  'Equipment & Assets': '#607D8B',
  'Professional Services': '#7E57C2',
  'Tax & Government': '#455A64',
  'Owner\'s Draw': '#FFB300',
  'Bank Fees': '#F44336',
  'Utilities': '#26A69A',
  'Petrol/EV': '#F39C12',
  'Insurance': '#673AB7',
  'Loan Repayment': '#D32F2F',
  'Money Transfer': '#78909C',
  'Income': '#4CAF50',
  'Refund': '#26A69A',
  'Payment': '#BDC3C7',
};

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

// Parse OCR text from Maybank statement
// Structure per user's breakdown:
// - Date (DD/MM/YY) starts each transaction row
// - Same line: transaction type, amount (+/-), balance
// - Following lines without dates are description continuation
function parseMaybankOCR(text) {
  const transactions = [];
  
  // Extract statement date/month from header (before we trim the text)
  // Look for patterns like "STATEMENT DATE : 30/11/25" or "30/11/25" near TARIKH PENYATA
  let statementMonth = null;
  const statementDatePatterns = [
    /STATEMENT DATE\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /TARIKH PENYATA[^:]*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
    /結單日期[^:]*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
  ];
  
  for (const pattern of statementDatePatterns) {
    const match = text.match(pattern);
    if (match) {
      const dateParts = match[1].split(/[\/\-]/);
      if (dateParts.length >= 3) {
        const month = parseInt(dateParts[1]);
        const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        statementMonth = `${monthNames[month - 1]} ${year}`;
        console.log('Found statement month:', statementMonth);
        break;
      }
    }
  }
  
  // First, try to find the transaction table section
  // Skip everything before "ACCOUNT TRANSACTIONS" or "URUSNIAGA AKAUN"
  let tableStart = text.search(/ACCOUNT TRANSACTIONS|URUSNIAGA AKAUN/i);
  if (tableStart > 0) {
    text = text.substring(tableStart);
    console.log('Found table start, trimmed text');
  }
  
  // Trim everything after the footer section (Perhation/Note)
  // But only if it's not followed by another page marker
  const footerPatterns = [
    /Perhation/i,
    /Perhatian/i,
    /\(1\)\s*Semua maklumat/i,
    /All items and balances/i,
    /Please notify us/i,
    /Sila beritahu/i,
    /若银行在21天/,
  ];
  
  // Don't trim footer if there's another page after it
  // Instead, just add footer markers to skip patterns
  
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  console.log('Parsing', lines.length, 'lines after table start'); // Debug
  
  // Skip patterns - headers, footers, and summary rows
  const skipPatterns = [
    /BEGINNING BALANCE/i,
    /ENDING BALANCE/i,
    /TOTAL CREDIT/i,
    /TOTAL DEBIT/i,
    /ENTRY DATE/i,
    /TARIKH MASUK/i,
    /^TRANSACTION DESCRIPTION/i,
    /BUTIR URUSNIAGA/i,
    /TRANSACTION AMOUNT/i,
    /JUMLAH URUSNIAGA/i,
    /STATEMENT BALANCE/i,
    /BAKI PENYATA/i,
    /^URUSNIAGA AKAUN/i,
    /^ACCOUNT TRANSACTIONS/i,
    /PROTECTED BY/i,
    /Malayan Banking/i,
    /^MUKA/i,
    /^PAGE/i,
    /^NOMBOR/i,
    /^ACCOUNT NUMBER/i,
    /^Perhatian/i,
    /^Perhation/i,
    /^Note$/i,
    /All items/i,
    /Please notify/i,
    /^Sila/i,
    /若银行/,
    /請通知/,
    /^---/,
    /结单存余/,
    /银码/,
    /逐支项说明/,
    /Semua maklumat/i,
    /tempoh 21 hari/i,
    /discrepancies within/i,
    /pertukaran alamat/i,
    /change of address/i,
    /^BASIC SAVINGS/i,
    // Page header patterns - to prevent next page headers from being added to descriptions
    /^14th Floor/i,
    /Menara Maybank/i,
    /Jalan Tun Perak/i,
    /Kuala Lumpur,Malaysia/i,
    /^\d{6}\s+[A-Z]/,  // Page number like "000002 KAJANG"
    /^KAJANG$/i,
    /^TARIKH PENYATA/i,
    /^結單日期/,
    /^STATEMENT DATE/i,
    /^NOMBOR AKAUN/i,
    /^戶號/,
    /^ACCOUNT$/i,
    /^NUMBER$/i,
    /^\d{6}-\d{6}$/,  // Account number pattern like "112028-214955"
    /^NO \d+ JALAN/i,  // Address pattern
    /^BDR RINCHING/i,
    /^SEMENYIH/i,
    /^SELANGOR\s*,\s*MYS/i,
    /^進支日期/,
    /^進支項說明/,
    /^結單存餘/,
    // Bank announcements and notices - these appear in statement but are NOT transactions
    /^NOTE:/i,
    /^NOTICE:/i,
    /MAYBANK IS NOT RESPONSIBLE/i,
    /INWARD RETURN CHEQUE/i,
    /CHEQUE ADVICE/i,
    /^PLATFORM FOR/i,
    /TURNAROUND TIME/i,
    /ECONFIRMATION PLATFORM/i,
    /^STARTING \d/i,
    /^BERMULA \d/i,
    /HOUSE CHEQUES DEPOSITED/i,
    /CHEQUE DEPOSIT MACHINES/i,
    /SELF-SERVICE TERMINALS/i,
    /WILL BE CREDITED/i,
    /WORKING DAYS/i,
    /EFFORTLESS FUND TRANSFERS/i,
    /M2U\/M2E\/M2UBIZ/i,
    /WE WOULD LIKE TO DRAW/i,
    /YOUR VALUED ATTENTION/i,
    /STAMP DUTY CHARGES/i,
    /REVISED STAMP DUTY/i,
    /CAWANGAN MAYBANK/i,
    /MAYBANK BRANCH/i,
    /UPDATE YOUR MAILING ADDRESS/i,
    /KEMASKINI ALAMAT/i,
    /SERVICE DISRUPTIONS/i,
    /GANGGUAN PERKHIDMATAN/i,
    /NOTIS PEMULANGAN/i,
    /COURIERED AND YOU WILL/i,
    /NO LONGER BE ABLE TO COLLECT/i,
    /SURAT-MENYURAT/i,
    /MENGELAKKAN DARIPADA/i,
    /PENUKARAN ALAMAT/i,
    /CEK CAWANGAN/i,
    /DIDEPOSITKAN DI/i,
    /HARI BEKERJA/i,
    /PERMUDAHKAN URUSAN/i,
    /PEMINDAHAN DANA/i,
    /^TARIKH NILAI/i,
    /^VALUE DATE/i,
    /^\.\s*$/,  // Lines that are just a period
  ];
  
  let currentTransaction = null;
  let descriptionLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip header/footer lines
    if (skipPatterns.some(p => p.test(line))) {
      continue;
    }
    
    // Check if line starts with a date
    // Supports: DD/MM/YY (30/11/25) or DD/MM (01/04) - year inferred from statement
    // Be flexible with separators: / or - or .
    const dateMatchFull = line.match(/^(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b\s*(.*)/);
    const dateMatchShort = line.match(/^(\d{1,2}[\/\-\.]\d{1,2})\s+([A-Z].*)/i);
    
    const dateMatch = dateMatchFull || dateMatchShort;
    
    if (dateMatch) {
      // Save previous transaction if exists
      if (currentTransaction && currentTransaction.amount > 0) {
        currentTransaction.description = descriptionLines.join(' ').trim();
        if (currentTransaction.description.length > 0) {
          transactions.push(currentTransaction);
          console.log('Saved transaction:', currentTransaction.date, currentTransaction.description, currentTransaction.amount);
        }
      }
      
      // Normalize date format
      let date = dateMatch[1].replace(/[\-\.]/g, '/');
      const restOfLine = dateMatch[2] || '';
      
      // If date is DD/MM format (no year), append year from statement date
      if (date.split('/').length === 2 && statementMonth) {
        const yearMatch = statementMonth.match(/\d{4}/);
        if (yearMatch) {
          const year = yearMatch[0].slice(-2); // Get last 2 digits
          date = date + '/' + year;
        }
      }
      
      console.log('Found date line:', date, '|', restOfLine); // Debug
      
      // Look for amount pattern in the rest of the line
      // Maybank format: DESCRIPTION ... AMOUNT+/- BALANCE
      // Amount patterns to try:
      // 1. 2.90- 835.25 (standard with sign attached)
      // 2. 2,910.00+ 3,613.85 (with commas)
      // 3. Sometimes OCR adds spaces: 2.90 - 835.25
      
      const amountPatterns = [
        // Amount with +/- attached, then balance: "2.90- 835.25" or "2,910.00+ 3,613.85"
        /(\d{1,3}(?:,\d{3})*\.\d{2})([+-])\s+(\d{1,3}(?:,\d{3})*\.\d{2})\s*$/,
        // Amount, space, sign, balance: "2.90 - 835.25"
        /(\d{1,3}(?:,\d{3})*\.\d{2})\s*([+-])\s*(\d{1,3}(?:,\d{3})*\.\d{2})\s*$/,
        // Just two numbers at end (infer sign from description): "2.90 835.25"
        /(\d{1,3}(?:,\d{3})*\.\d{2})\s+(\d{1,3}(?:,\d{3})*\.\d{2})\s*$/,
      ];
      
      let matched = false;
      
      for (let p = 0; p < amountPatterns.length; p++) {
        const pattern = amountPatterns[p];
        const amountMatch = restOfLine.match(pattern);
        
        if (amountMatch) {
          const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
          
          // Determine credit/debit
          let isCredit;
          if (amountMatch[2] === '+') {
            isCredit = true;
          } else if (amountMatch[2] === '-') {
            isCredit = false;
          } else {
            // No explicit sign - infer from transaction type in description
            const upperRest = restOfLine.toUpperCase();
            // Credit indicators (money coming IN)
            if (/CASH DEPOSIT|CR PYMT|FUND TRANSFER TO|IBK FUND TFR TO|TRANSFER TO A\/C|REFUND|INTEREST PAID|SALARY|GAJI/.test(upperRest)) {
              isCredit = true;
            } 
            // Debit indicators (money going OUT)
            else if (/SALE DEBIT|PRE-AUTH|PAYMENT|TRANSFER FROM|TRANSFER FR A\/C|DIRECT DEBIT|CMS-DIRECT/.test(upperRest)) {
              isCredit = false;
            }
            // Default to debit (spending) if unclear
            else {
              isCredit = false;
            }
          }
          
          // Extract description part (everything before the amount)
          const amountIndex = restOfLine.lastIndexOf(amountMatch[1]);
          const descPart = restOfLine.substring(0, amountIndex).trim();
          
          // Convert date to ISO format for sorting
          const dateParts = date.split('/');
          if (dateParts.length === 3) {
            const day = dateParts[0].padStart(2, '0');
            const month = dateParts[1].padStart(2, '0');
            const year = dateParts[2];
            const fullYear = parseInt(year) > 50 ? `19${year}` : `20${year}`;
            const isoDate = `${fullYear}-${month}-${day}`;
            
            currentTransaction = {
              date,
              isoDate,
              amount,
              isCredit,
            };
            
            descriptionLines = descPart ? [descPart] : [];
            matched = true;
            console.log('Matched:', amount, isCredit ? '+' : '-', '| Desc start:', descPart);
          }
          break;
        }
      }
      
      if (!matched) {
        // Date found but no amount - might be a malformed line or header
        // Still start tracking in case amount is on next line
        console.log('Date found but no amount pattern:', restOfLine);
        
        // Check if this looks like start of a transaction anyway
        if (restOfLine.length > 0 && !/ENTRY DATE|TARIKH/i.test(restOfLine)) {
          const dateParts = date.split('/');
          if (dateParts.length === 3) {
            const day = dateParts[0].padStart(2, '0');
            const month = dateParts[1].padStart(2, '0');
            const year = dateParts[2];
            const fullYear = parseInt(year) > 50 ? `19${year}` : `20${year}`;
            
            currentTransaction = {
              date,
              isoDate: `${fullYear}-${month}-${day}`,
              amount: 0,
              isCredit: false,
            };
            descriptionLines = [restOfLine];
          }
        } else {
          currentTransaction = null;
          descriptionLines = [];
        }
      }
    } else if (currentTransaction) {
      // No date = continuation line
      // Could be: merchant name, location, or trailing "SALE DEBIT" label
      
      // Check if this line contains an amount (in case OCR split the line)
      const lateAmountMatch = line.match(/^(\d{1,3}(?:,\d{3})*\.\d{2})([+-])?\s*(\d{1,3}(?:,\d{3})*\.\d{2})?\s*$/);
      
      if (lateAmountMatch && currentTransaction.amount === 0) {
        // This line has the amount we missed
        currentTransaction.amount = parseFloat(lateAmountMatch[1].replace(/,/g, ''));
        if (lateAmountMatch[2]) {
          currentTransaction.isCredit = lateAmountMatch[2] === '+';
        } else {
          // Infer from description we've collected so far
          const descUpper = descriptionLines.join(' ').toUpperCase();
          if (/CASH DEPOSIT|CR PYMT|FUND TRANSFER TO|IBK FUND TFR TO|TRANSFER TO A\/C|REFUND|INTEREST PAID|SALARY|GAJI/.test(descUpper)) {
            currentTransaction.isCredit = true;
          } else {
            currentTransaction.isCredit = false;
          }
        }
        console.log('Found late amount:', currentTransaction.amount, currentTransaction.isCredit ? '+' : '-');
      } else if (
        // Skip these continuation patterns
        !skipPatterns.some(p => p.test(line)) &&  // Check against all skip patterns
        !/^SALE DEBIT$/i.test(line) &&
        !/^REFUND SALE$/i.test(line) &&
        !/^PRE-AUTH DEBIT$/i.test(line) &&
        !/^PRE-AUTH$/i.test(line) &&
        !/^DIRECT DEBIT$/i.test(line) &&
        !/^\d{1,3}(?:,\d{3})*\.\d{2}[+-]?$/.test(line) && // Just an amount
        !/^\d{1,3}(?:,\d{3})*\.\d{2}\s+\d{1,3}(?:,\d{3})*\.\d{2}$/.test(line) && // amount balance
        !/^:\s*\d/.test(line) && // Lines starting with : and a number (like ": 2")
        !/^[A-Z]{2,}\s*,\s*MYS?$/i.test(line) && // State codes like "SELANGOR ,MYS"
        line.length > 1
      ) {
        // This is actual description content
        descriptionLines.push(line);
      }
    }
  }
  
  // Don't forget the last transaction
  if (currentTransaction && currentTransaction.amount > 0) {
    currentTransaction.description = descriptionLines.join(' ').trim();
    if (currentTransaction.description.length > 0) {
      transactions.push(currentTransaction);
      console.log('Saved last transaction:', currentTransaction.date, currentTransaction.description);
    }
  }
  
  console.log('Total transactions found:', transactions.length);
  
  // Clean up descriptions
  const cleanedTransactions = transactions.map(t => ({
    ...t,
    statementMonth, // Add statement month to each transaction
    description: t.description
      .replace(/SALE DEBIT/gi, '')
      .replace(/PRE-AUTH DEBIT/gi, '')
      .replace(/REFUND SALE/gi, 'REFUND:')
      .replace(/CMS-DIRECT DEBIT/gi, '')
      .replace(/\*+/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  })).filter(t => t.description.length > 0 && t.amount > 0);
  
  return { transactions: cleanedTransactions, statementMonth };
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
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [categorySettings, setCategorySettings] = useState(CATEGORY_KEYWORDS);
  const [colorSettings, setColorSettings] = useState(CATEGORY_COLORS);
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

  const updateSpacing = (key, value) => {
    setSpacingSettings(prev => ({ ...prev, [key]: parseInt(value) || 0 }));
  };

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
          
          addLog('Parsing transactions...');
          const { transactions: parsed, statementMonth } = parseMaybankOCR(fullText);
          addLog(`Parser found ${parsed.length} transactions for ${statementMonth || 'unknown month'}`);
          
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
          const { transactions: parsed, statementMonth } = parseMaybankOCR(text);
          addLog(`Text parsed: ${parsed.length} transactions for ${statementMonth || 'unknown month'}`);
          
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

  // Toggle category cycle:
  // Company: Payments → Money Transfer → Income → Payments
  // Personal: Money Transfer → Income → Money Transfer
  // Refund: Refund → Money Transfer (if desc has "refund", can toggle back)
  const toggleTransferIncome = (transactionId) => {
    setTransactions(prev => prev.map(t => {
      if (t.id === transactionId) {
        const hasRefundInDesc = t.description.toLowerCase().includes('refund');
        
        if (t.category === 'Refund') {
          // Refund -> Money Transfer
          return { ...t, category: 'Money Transfer', isCredit: false };
        } else if (t.category === 'Money Transfer') {
          // If original description had "refund", toggle back to Refund
          if (hasRefundInDesc) {
            return { ...t, category: 'Refund', isCredit: true };
          }
          // Money Transfer -> Income (both account types)
          return { ...t, category: 'Income', isCredit: true };
        } else if (t.category === 'Income') {
          // For company: Income -> Payments
          // For personal: Income -> Money Transfer
          if (accountType === 'company') {
            return { ...t, category: 'Payments', isCredit: true };
          } else {
            return { ...t, category: 'Money Transfer', isCredit: false };
          }
        } else if (t.category === 'Payments') {
          // Payments -> Money Transfer (company accounts)
          return { ...t, category: 'Money Transfer', isCredit: false };
        }
      }
      return t;
    }));
  };

  // Admin login handler
  const handleAdminLogin = () => {
    if (adminPassword === 'jojo1994') {
      setIsAdminMode(true);
      setShowAdminLogin(false);
      setAdminPassword('');
      setAdminError('');
    } else {
      setAdminError('Incorrect password');
    }
  };

  // Update category name
  const updateCategoryName = (oldName, newName) => {
    if (oldName === newName || !newName.trim()) return;
    
    // Update category settings
    setCategorySettings(prev => {
      const updated = { ...prev };
      if (updated[oldName]) {
        updated[newName] = updated[oldName];
        delete updated[oldName];
      }
      return updated;
    });
    
    // Update color settings
    setColorSettings(prev => {
      const updated = { ...prev };
      if (updated[oldName]) {
        updated[newName] = updated[oldName];
        delete updated[oldName];
      }
      return updated;
    });
    
    // Update transactions with old category name
    setTransactions(prev => prev.map(t => 
      t.category === oldName ? { ...t, category: newName } : t
    ));
  };

  // Update category color
  const updateCategoryColor = (category, color) => {
    setColorSettings(prev => ({ ...prev, [category]: color }));
  };

  // Update UI accent color
  const updateUiColor = (key, value) => {
    setUiColors(prev => ({ ...prev, [key]: value }));
  };

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
    
    const spending = filteredForStats.filter(t => !t.isCredit);
    const income = filteredForStats.filter(t => t.isCredit && t.category !== 'Refund');
    
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
                <p className="text-slate-400 text-sm mb-3">Total Spending</p>
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
                <p className="text-slate-400 text-sm mb-3">Net Flow</p>
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
                            <td style={{ padding: `${spacingSettings.tableRowPadding}px` }}>
                              {(t.category === 'Money Transfer' || t.category === 'Income' || t.category === 'Refund' || t.category === 'Payments') ? (
                                <span 
                                  className="rounded-full text-xs font-medium cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
                                  style={{ 
                                    display: 'inline-block',
                                    padding: '6px 10px',
                                    whiteSpace: 'nowrap',
                                    background: `${colorSettings[t.category] || colorSettings['Payment']}20`,
                                    color: colorSettings[t.category] || colorSettings['Payment']
                                  }}
                                  onClick={() => toggleTransferIncome(t.id)}
                                  title={
                                    t.category === 'Refund' 
                                      ? 'Click to toggle: Refund → Money Transfer' 
                                      : t.category === 'Money Transfer' && t.description.toLowerCase().includes('refund')
                                        ? 'Click to toggle: Money Transfer → Refund'
                                        : accountType === 'company'
                                          ? 'Click to cycle: Payments → Money Transfer → Income'
                                          : 'Click to toggle: Money Transfer ↔ Income'
                                  }
                                >
                                  {t.category} ⇄
                                </span>
                              ) : (
                                <span 
                                  className="rounded-full text-xs font-medium"
                                  style={{ 
                                    display: 'inline-block',
                                    padding: '6px 10px',
                                    whiteSpace: 'nowrap',
                                    background: `${colorSettings[t.category] || colorSettings['Payment']}20`,
                                    color: colorSettings[t.category] || colorSettings['Payment']
                                  }}
                                >
                                  {t.category}
                                </span>
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

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass rounded-2xl p-6 w-full max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-4">🔐 Admin Access</h3>
              <input
                type="password"
                placeholder="Enter password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 mb-3"
                autoFocus
              />
              {adminError && <p className="text-red-400 text-sm mb-3">{adminError}</p>}
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowAdminLogin(false); setAdminPassword(''); setAdminError(''); }}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdminLogin}
                  className="flex-1 px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {isAdminMode && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">⚙️ Admin Settings</h3>
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* UI Colors Section */}
              <div className="mb-8">
                <h4 className="font-medium text-amber-400 mb-4">🎨 UI Colors</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Accent Color</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={uiColors.accent}
                        onChange={(e) => updateUiColor('accent', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={uiColors.accent}
                        onChange={(e) => updateUiColor('accent', e.target.value)}
                        className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Accent Light</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={uiColors.accentLight}
                        onChange={(e) => updateUiColor('accentLight', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={uiColors.accentLight}
                        onChange={(e) => updateUiColor('accentLight', e.target.value)}
                        className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Spacing Settings Section */}
              <div className="mb-8">
                <h4 className="font-medium text-amber-400 mb-4">📐 Spacing Settings (pixels)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Page Padding (horizontal)</label>
                    <input
                      type="number"
                      value={spacingSettings.pagePadding}
                      onChange={(e) => updateSpacing('pagePadding', e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Page Padding (vertical)</label>
                    <input
                      type="number"
                      value={spacingSettings.pageVerticalPadding}
                      onChange={(e) => updateSpacing('pageVerticalPadding', e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Header Bottom Margin</label>
                    <input
                      type="number"
                      value={spacingSettings.headerMarginBottom}
                      onChange={(e) => updateSpacing('headerMarginBottom', e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Stats Cards Gap</label>
                    <input
                      type="number"
                      value={spacingSettings.statsGap}
                      onChange={(e) => updateSpacing('statsGap', e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Stats Section Bottom Margin</label>
                    <input
                      type="number"
                      value={spacingSettings.statsMarginBottom}
                      onChange={(e) => updateSpacing('statsMarginBottom', e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Stats Card Padding</label>
                    <input
                      type="number"
                      value={spacingSettings.statsCardPadding}
                      onChange={(e) => updateSpacing('statsCardPadding', e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Chart & Table Gap</label>
                    <input
                      type="number"
                      value={spacingSettings.chartTableGap}
                      onChange={(e) => updateSpacing('chartTableGap', e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Card Padding</label>
                    <input
                      type="number"
                      value={spacingSettings.cardPadding}
                      onChange={(e) => updateSpacing('cardPadding', e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 block mb-2">Table Row Padding</label>
                    <input
                      type="number"
                      value={spacingSettings.tableRowPadding}
                      onChange={(e) => updateSpacing('tableRowPadding', e.target.value)}
                      className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>

              {/* Category Settings Section */}
              <div>
                <h4 className="font-medium text-amber-400 mb-4">📊 Category Settings</h4>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {Object.keys(colorSettings).map((category) => (
                    <div key={category} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <input
                        type="color"
                        value={colorSettings[category]}
                        onChange={(e) => updateCategoryColor(category, e.target.value)}
                        className="w-8 h-8 rounded cursor-pointer border-0 flex-shrink-0"
                      />
                      <input
                        type="text"
                        defaultValue={category}
                        onBlur={(e) => updateCategoryName(category, e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && e.target.blur()}
                        className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50"
                      />
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{ 
                          background: `${colorSettings[category]}20`,
                          color: colorSettings[category]
                        }}
                      >
                        Preview
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setCategorySettings(accountType === 'company' ? COMPANY_CATEGORY_KEYWORDS : CATEGORY_KEYWORDS);
                    setColorSettings(accountType === 'company' ? COMPANY_CATEGORY_COLORS : CATEGORY_COLORS);
                    setUiColors({
                      accent: '#F59E0B',
                      accentLight: '#FCD34D',
                      background: 'from-slate-900 via-slate-800 to-amber-900/50',
                    });
                    setSpacingSettings({
                      pagePadding: 24,
                      pageVerticalPadding: 40,
                      headerMarginBottom: 40,
                      statsGap: 24,
                      statsMarginBottom: 40,
                      statsCardPadding: 32,
                      chartTableGap: 32,
                      cardPadding: 32,
                      tableRowPadding: 16,
                    });
                  }}
                  className="px-4 py-2 rounded-lg border border-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={() => setIsAdminMode(false)}
                  className="px-4 py-2 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-colors"
                >
                  Save & Close
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-16 pb-8 text-center text-sm text-slate-500">
          <p>Spendsie • Maybank Statement Analyzer 🇲🇾</p>
          <button
            onClick={() => setShowAdminLogin(true)}
            className="mt-2 text-slate-600 hover:text-slate-400 transition-colors text-xs"
          >
            ⚙️ Admin
          </button>
        </footer>
      </div>
    </div>
  );
}
