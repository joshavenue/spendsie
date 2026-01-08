/**
 * Maybank Statement Parser
 * Parses PDF bank statements from Maybank Malaysia
 */

// Bank identification info
export const BANK_INFO = {
  id: 'maybank',
  name: 'Maybank',
  fullName: 'Malayan Banking Berhad',
  logo: '🏦', // Can be replaced with actual logo
};

// Patterns to detect if a PDF is from Maybank
export const DETECTION_PATTERNS = [
  /Malayan Banking Berhad/i,
  /Maybank/i,
  /MAYBANK/,
  /M2U/i,
  /MAE/i,
];

// Patterns to find the start of transaction table
const TABLE_START_PATTERNS = [
  /ACCOUNT TRANSACTIONS/i,
  /URUSNIAGA AKAUN/i,
];

// Patterns to extract statement date
const STATEMENT_DATE_PATTERNS = [
  /STATEMENT DATE\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
  /TARIKH PENYATA[^:]*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
  /結單日期[^:]*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,
];

// Patterns for footer sections (informational, not to trim)
const FOOTER_PATTERNS = [
  /Perhation/i,
  /Perhatian/i,
  /\(1\)\s*Semua maklumat/i,
  /All items and balances/i,
  /Please notify us/i,
  /Sila beritahu/i,
  /若银行在21天/,
];

// Skip patterns - headers, footers, and summary rows that should be ignored
const SKIP_PATTERNS = [
  // Summary rows
  /BEGINNING BALANCE/i,
  /ENDING BALANCE/i,
  /TOTAL CREDIT/i,
  /TOTAL DEBIT/i,
  
  // Table headers (English)
  /ENTRY DATE/i,
  /^TRANSACTION DESCRIPTION/i,
  /TRANSACTION AMOUNT/i,
  /STATEMENT BALANCE/i,
  
  // Table headers (Malay)
  /TARIKH MASUK/i,
  /BUTIR URUSNIAGA/i,
  /JUMLAH URUSNIAGA/i,
  /BAKI PENYATA/i,
  /^URUSNIAGA AKAUN/i,
  /^ACCOUNT TRANSACTIONS/i,
  
  // Bank branding
  /PROTECTED BY/i,
  /Malayan Banking/i,
  
  // Page markers
  /^MUKA/i,
  /^PAGE/i,
  /^NOMBOR/i,
  /^ACCOUNT NUMBER/i,
  
  // Notes and disclaimers (English)
  /^Perhatian/i,
  /^Perhation/i,
  /^Note$/i,
  /All items/i,
  /Please notify/i,
  
  // Notes and disclaimers (Malay)
  /^Sila/i,
  /Semua maklumat/i,
  /tempoh 21 hari/i,
  /discrepancies within/i,
  /pertukaran alamat/i,
  /change of address/i,
  
  // Chinese text
  /若银行/,
  /請通知/,
  /结单存余/,
  /银码/,
  /逐支项说明/,
  /^進支日期/,
  /^進支項說明/,
  /^結單存餘/,
  
  // Dividers
  /^---/,
  
  // Account type headers
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

// Credit indicators - money coming IN
const CREDIT_PATTERNS = /CASH DEPOSIT|CR PYMT|FUND TRANSFER TO|IBK FUND TFR TO|TRANSFER TO A\/C|REFUND|INTEREST PAID|SALARY|GAJI/;

// Debit indicators - money going OUT
const DEBIT_PATTERNS = /SALE DEBIT|PRE-AUTH|PAYMENT|TRANSFER FROM|TRANSFER FR A\/C|DIRECT DEBIT|CMS-DIRECT/;

// Amount patterns to match in transaction lines
const AMOUNT_PATTERNS = [
  // Amount with +/- attached, then balance: "2.90- 835.25" or "2,910.00+ 3,613.85"
  /(\d{1,3}(?:,\d{3})*\.\d{2})([+-])\s+(\d{1,3}(?:,\d{3})*\.\d{2})\s*$/,
  // Amount, space, sign, balance: "2.90 - 835.25"
  /(\d{1,3}(?:,\d{3})*\.\d{2})\s*([+-])\s*(\d{1,3}(?:,\d{3})*\.\d{2})\s*$/,
  // Just two numbers at end (infer sign from description): "2.90 835.25"
  /(\d{1,3}(?:,\d{3})*\.\d{2})\s+(\d{1,3}(?:,\d{3})*\.\d{2})\s*$/,
];

/**
 * Check if the given text is from a Maybank statement
 * @param {string} text - Raw text from PDF
 * @returns {boolean}
 */
export function detectBank(text) {
  return DETECTION_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Extract statement month from header text
 * @param {string} text - Raw text from PDF
 * @returns {string|null} - Statement month in "Mon YYYY" format
 */
function extractStatementMonth(text) {
  for (const pattern of STATEMENT_DATE_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      const dateParts = match[1].split(/[\/\-]/);
      if (dateParts.length >= 3) {
        const month = parseInt(dateParts[1]);
        const year = dateParts[2].length === 2 ? `20${dateParts[2]}` : dateParts[2];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${monthNames[month - 1]} ${year}`;
      }
    }
  }
  return null;
}

/**
 * Find the start of the transaction table
 * @param {string} text - Raw text from PDF
 * @returns {string} - Text starting from transaction table
 */
function findTableStart(text) {
  for (const pattern of TABLE_START_PATTERNS) {
    const match = text.search(pattern);
    if (match > 0) {
      console.log('[Maybank] Found table start');
      return text.substring(match);
    }
  }
  return text;
}

/**
 * Determine if a transaction is credit (money in) or debit (money out)
 * @param {string} description - Transaction description
 * @param {string} sign - Explicit sign (+/-) if available
 * @returns {boolean} - true for credit, false for debit
 */
function isTransactionCredit(description, sign) {
  if (sign === '+') return true;
  if (sign === '-') return false;
  
  const upperDesc = description.toUpperCase();
  if (CREDIT_PATTERNS.test(upperDesc)) return true;
  if (DEBIT_PATTERNS.test(upperDesc)) return false;
  
  // Default to debit (spending) if unclear
  return false;
}

/**
 * Convert date string to ISO format for sorting
 * @param {string} date - Date in DD/MM/YY format
 * @returns {string} - Date in YYYY-MM-DD format
 */
function toIsoDate(date) {
  const dateParts = date.split('/');
  if (dateParts.length === 3) {
    const day = dateParts[0].padStart(2, '0');
    const month = dateParts[1].padStart(2, '0');
    const year = dateParts[2];
    const fullYear = parseInt(year) > 50 ? `19${year}` : `20${year}`;
    return `${fullYear}-${month}-${day}`;
  }
  return date;
}

/**
 * Clean up transaction description
 * @param {string} description - Raw description
 * @returns {string} - Cleaned description
 */
function cleanDescription(description) {
  return description
    .replace(/SALE DEBIT/gi, '')
    .replace(/PRE-AUTH DEBIT/gi, '')
    .replace(/REFUND SALE/gi, 'REFUND:')
    .replace(/CMS-DIRECT DEBIT/gi, '')
    .replace(/\*+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parse Maybank bank statement text into transactions
 * @param {string} text - Raw text extracted from PDF
 * @returns {Object} - { transactions: Array, statementMonth: string }
 */
export function parseStatement(text) {
  const transactions = [];
  
  // Extract statement month from header
  const statementMonth = extractStatementMonth(text);
  console.log('[Maybank] Statement month:', statementMonth);
  
  // Find transaction table start
  text = findTableStart(text);
  
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  console.log('[Maybank] Parsing', lines.length, 'lines');
  
  let currentTransaction = null;
  let descriptionLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip header/footer lines
    if (SKIP_PATTERNS.some(p => p.test(line))) {
      continue;
    }
    
    // Check if line starts with a date
    // Supports: DD/MM/YY (30/11/25) or DD/MM (01/04) - year inferred from statement
    const dateMatchFull = line.match(/^(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b\s*(.*)/);
    const dateMatchShort = line.match(/^(\d{1,2}[\/\-\.]\d{1,2})\s+([A-Z].*)/i);
    const dateMatch = dateMatchFull || dateMatchShort;
    
    if (dateMatch) {
      // Save previous transaction if exists
      if (currentTransaction && currentTransaction.amount > 0) {
        currentTransaction.description = descriptionLines.join(' ').trim();
        if (currentTransaction.description.length > 0) {
          transactions.push(currentTransaction);
          console.log('[Maybank] Saved:', currentTransaction.date, currentTransaction.description.substring(0, 40));
        }
      }
      
      // Normalize date format
      let date = dateMatch[1].replace(/[\-\.]/g, '/');
      const restOfLine = dateMatch[2] || '';
      
      // If date is DD/MM format (no year), append year from statement date
      if (date.split('/').length === 2 && statementMonth) {
        const yearMatch = statementMonth.match(/\d{4}/);
        if (yearMatch) {
          const year = yearMatch[0].slice(-2);
          date = date + '/' + year;
        }
      }
      
      // Look for amount pattern in the rest of the line
      let matched = false;
      
      for (const pattern of AMOUNT_PATTERNS) {
        const amountMatch = restOfLine.match(pattern);
        
        if (amountMatch) {
          const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
          const sign = amountMatch[2] || null;
          
          // Extract description part (everything before the amount)
          const amountIndex = restOfLine.lastIndexOf(amountMatch[1]);
          const descPart = restOfLine.substring(0, amountIndex).trim();
          
          const isCredit = isTransactionCredit(restOfLine, sign);
          
          currentTransaction = {
            date,
            isoDate: toIsoDate(date),
            amount,
            isCredit,
          };
          
          descriptionLines = descPart ? [descPart] : [];
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        // Date found but no amount - might be a malformed line
        if (restOfLine.length > 0 && !/ENTRY DATE|TARIKH/i.test(restOfLine)) {
          currentTransaction = {
            date,
            isoDate: toIsoDate(date),
            amount: 0,
            isCredit: false,
          };
          descriptionLines = [restOfLine];
        } else {
          currentTransaction = null;
          descriptionLines = [];
        }
      }
    } else if (currentTransaction) {
      // No date = continuation line
      
      // Check if this line contains an amount (in case OCR split the line)
      const lateAmountMatch = line.match(/^(\d{1,3}(?:,\d{3})*\.\d{2})([+-])?\s*(\d{1,3}(?:,\d{3})*\.\d{2})?\s*$/);
      
      if (lateAmountMatch && currentTransaction.amount === 0) {
        currentTransaction.amount = parseFloat(lateAmountMatch[1].replace(/,/g, ''));
        if (lateAmountMatch[2]) {
          currentTransaction.isCredit = lateAmountMatch[2] === '+';
        } else {
          currentTransaction.isCredit = isTransactionCredit(descriptionLines.join(' '), null);
        }
      } else if (
        !SKIP_PATTERNS.some(p => p.test(line)) &&
        !/^SALE DEBIT$/i.test(line) &&
        !/^REFUND SALE$/i.test(line) &&
        !/^PRE-AUTH DEBIT$/i.test(line) &&
        !/^PRE-AUTH$/i.test(line) &&
        !/^DIRECT DEBIT$/i.test(line) &&
        !/^\d{1,3}(?:,\d{3})*\.\d{2}[+-]?$/.test(line) &&
        !/^\d{1,3}(?:,\d{3})*\.\d{2}\s+\d{1,3}(?:,\d{3})*\.\d{2}$/.test(line) &&
        !/^:\s*\d/.test(line) &&
        !/^[A-Z]{2,}\s*,\s*MYS?$/i.test(line) &&
        line.length > 1
      ) {
        descriptionLines.push(line);
      }
    }
  }
  
  // Don't forget the last transaction
  if (currentTransaction && currentTransaction.amount > 0) {
    currentTransaction.description = descriptionLines.join(' ').trim();
    if (currentTransaction.description.length > 0) {
      transactions.push(currentTransaction);
    }
  }
  
  console.log('[Maybank] Total transactions found:', transactions.length);
  
  // Clean up descriptions and add statement month
  const cleanedTransactions = transactions
    .map(t => ({
      ...t,
      statementMonth,
      description: cleanDescription(t.description),
    }))
    .filter(t => t.description.length > 0 && t.amount > 0);
  
  return { transactions: cleanedTransactions, statementMonth };
}

export default {
  BANK_INFO,
  detectBank,
  parseStatement,
};
