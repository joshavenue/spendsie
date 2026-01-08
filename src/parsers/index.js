/**
 * Bank Statement Parsers Registry
 * 
 * To add a new bank:
 * 1. Create a new parser file (e.g., cimb.js) following the maybank.js structure
 * 2. Import and add it to the BANK_PARSERS array below
 * 
 * Each parser must export:
 * - BANK_INFO: { id, name, fullName, logo }
 * - detectBank(text): boolean - returns true if text is from this bank
 * - parseStatement(text): { transactions: Array, statementMonth: string }
 */

import * as maybank from './maybank';
// Future imports:
// import * as cimb from './cimb';
// import * as publicBank from './publicbank';
// import * as rhb from './rhb';
// import * as hongLeong from './hongleong';
// import * as ambank from './ambank';
// import * as bankIslam from './bankislam';

// Registry of all supported bank parsers
export const BANK_PARSERS = [
  maybank,
  // Future banks:
  // cimb,
  // publicBank,
  // rhb,
  // hongLeong,
  // ambank,
  // bankIslam,
];

/**
 * Get list of all supported banks
 * @returns {Array} - Array of bank info objects
 */
export function getSupportedBanks() {
  return BANK_PARSERS.map(parser => parser.BANK_INFO);
}

/**
 * Auto-detect which bank a PDF statement is from
 * @param {string} text - Raw text extracted from PDF
 * @returns {Object|null} - Bank parser module or null if not detected
 */
export function detectBank(text) {
  for (const parser of BANK_PARSERS) {
    if (parser.detectBank(text)) {
      console.log(`[Parser] Detected bank: ${parser.BANK_INFO.name}`);
      return parser;
    }
  }
  console.log('[Parser] Could not detect bank from text');
  return null;
}

/**
 * Get a specific bank parser by ID
 * @param {string} bankId - Bank ID (e.g., 'maybank', 'cimb')
 * @returns {Object|null} - Bank parser module or null if not found
 */
export function getParserById(bankId) {
  return BANK_PARSERS.find(parser => parser.BANK_INFO.id === bankId) || null;
}

/**
 * Parse a bank statement with auto-detection
 * @param {string} text - Raw text extracted from PDF
 * @param {string} bankId - Optional bank ID to skip auto-detection
 * @returns {Object} - { transactions, statementMonth, bank }
 */
export function parseStatement(text, bankId = null) {
  let parser;
  
  if (bankId) {
    parser = getParserById(bankId);
    if (!parser) {
      throw new Error(`Unknown bank: ${bankId}`);
    }
  } else {
    parser = detectBank(text);
    if (!parser) {
      throw new Error('Could not detect bank from statement. Please ensure you are uploading a supported bank statement.');
    }
  }
  
  const result = parser.parseStatement(text);
  return {
    ...result,
    bank: parser.BANK_INFO,
  };
}

export default {
  BANK_PARSERS,
  getSupportedBanks,
  detectBank,
  getParserById,
  parseStatement,
};
