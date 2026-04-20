/**
 * OdusIA Utilities & Helpers
 */

/**
 * Escapes HTML characters in a string to prevent XSS.
 * @param {string} str 
 * @returns {string}
 */
export function escapeHTML(val) {
  // VERSION: 1.0.3 - FORCED STRING CONVERSION
  const s = val === null || val === undefined ? "" : String(val);
  return s.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
}

/**
 * Returns a formatted date string (YYYY-MM-DD).
 * @param {Date|string|number} date 
 * @returns {string}
 */
export function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Generates a unique ID based on current timestamp.
 * @returns {number}
 */
export function generateId() {
  return Date.now();
}

/**
 * Formats a number as EUR currency string.
 * @param {number} amount 
 * @returns {string}
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(amount).replace(/\s/g, '');
}
