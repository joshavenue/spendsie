/**
 * [BANK NAME] Statement Parser Template
 * 
 * Copy this file and rename to match the bank (e.g., cimb.js, publicbank.js)
 * Then implement the detection and parsing logic specific to that bank.
 * 
 * After creating the parser, add it to parsers/index.js:
 * 1. Import: import * as cimb from './cimb';
 * 2. Add to BANK_PARSERS array: cimb,
 */

// Bank identification info
export const BANK_INFO = {
  id: 'bank-id',           // Unique identifier (lowercase, no spaces)
  name: 'Bank Name',       // Display name
  fullName: 'Full Bank Name Berhad',
  logo: '🏦',              // Emoji or can be replaced with image path
};

// Patterns to detect if a PDF is from this bank
// Add unique text that appears in this bank's statements
export const DETECTION_PATTERNS = [
  /Bank Name/i,
  /BANK NAME/,
  // Add more patterns unique to this bank
];

// Patterns to find the start of transaction table
const TABLE_START_PATTERNS = [
  /TRANSACTION HISTORY/i,
  // Add patterns that mark the start of transactions
];

// Patterns to extract statement date
const STATEMENT_DATE_PATTERNS = [
  /STATEMENT DATE\s*:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i,
  // Add bank-specific date patterns
];

// Skip patterns - headers, footers, and lines to ignore
const SKIP_PATTERNS = [
  /OPENING BALANCE/i,
  /CLOSING BALANCE/i,
  // Add patterns for lines that should be skipped
];

// Credit indicators - money coming IN
const CREDIT_PATTERNS = /DEPOSIT|CREDIT|SALARY|TRANSFER IN/i;

// Debit indicators - money going OUT  
const DEBIT_PATTERNS = /WITHDRAWAL|DEBIT|PAYMENT|TRANSFER OUT/i;

/**
 * Check if the given text is from this bank
 * @param {string} text - Raw text from PDF
 * @returns {boolean}
 */
export function detectBank(text) {
  return DETECTION_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Parse bank statement text into transactions
 * @param {string} text - Raw text extracted from PDF
 * @returns {Object} - { transactions: Array, statementMonth: string }
 */
export function parseStatement(text) {
  const transactions = [];
  let statementMonth = null;
  
  // TODO: Implement parsing logic specific to this bank
  // 
  // 1. Extract statement month from header
  // 2. Find transaction table start
  // 3. Parse each transaction line
  // 4. Handle multi-line descriptions
  // 5. Determine credit/debit
  // 6. Clean up descriptions
  
  // Example transaction structure:
  // transactions.push({
  //   date: '01/12/25',           // Display date
  //   isoDate: '2025-12-01',      // For sorting
  //   description: 'PAYMENT TO MERCHANT',
  //   amount: 100.00,
  //   isCredit: false,            // true = money in, false = money out
  //   statementMonth: 'Dec 2025', // From statement header
  // });
  
  console.log(`[${BANK_INFO.name}] Parsing not yet implemented`);
  
  return { transactions, statementMonth };
}

export default {
  BANK_INFO,
  detectBank,
  parseStatement,
};
