import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';
import { MONTHS, SHORT_MONTHS } from './constants';

/**
 * Format a number as currency
 * @param {number} amount
 * @param {string} currency - ISO currency code (default: USD)
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${Number(amount).toFixed(2)}`;
  }
}

/**
 * Format a date using date-fns format string
 * @param {string|Date} date
 * @param {string} fmt - date-fns format string
 * @returns {string}
 */
export function formatDate(date, fmt = 'MMM dd, yyyy') {
  if (!date) return '—';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsed)) return '—';
    return format(parsed, fmt);
  } catch {
    return '—';
  }
}

/**
 * Format a date as relative time ("2 days ago")
 * @param {string|Date} date
 * @returns {string}
 */
export function formatRelativeDate(date) {
  if (!date) return '—';
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(parsed)) return '—';
    return formatDistanceToNow(parsed, { addSuffix: true });
  } catch {
    return '—';
  }
}

/**
 * Get full month name from 0-indexed month
 * @param {number} monthIndex - 0-11
 * @returns {string}
 */
export function getMonthName(monthIndex) {
  return MONTHS[monthIndex] || '';
}

/**
 * Get short month name from 0-indexed month
 * @param {number} monthIndex - 0-11
 * @returns {string}
 */
export function getShortMonthName(monthIndex) {
  return SHORT_MONTHS[monthIndex] || '';
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} length
 * @returns {string}
 */
export function truncateText(text, length = 50) {
  if (!text) return '';
  return text.length > length ? `${text.substring(0, length)}...` : text;
}

/**
 * Capitalize first letter of a string
 * @param {string} str
 * @returns {string}
 */
export function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get initials from a full name (max 2 chars)
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Format a percentage value
 * @param {number} value
 * @param {number} decimals
 * @returns {string}
 */
export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
}

/**
 * Add comma separators to a number
 * @param {number|string} x
 * @returns {string}
 */
export function numberWithCommas(x) {
  if (x === null || x === undefined) return '0';
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format a large number with K/M suffixes
 * @param {number} num
 * @returns {string}
 */
export function formatCompactNumber(num) {
  if (Math.abs(num) >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (Math.abs(num) >= 1_000)     return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

/**
 * Get current month (1-12) and year
 */
export function getCurrentMonthYear() {
  const now = new Date();
  return { month: now.getMonth() + 1, year: now.getFullYear() };
}

/**
 * Generate an ISO date string for N months ago
 * @param {number} monthsBack
 * @returns {string}
 */
export function monthsAgo(monthsBack) {
  const d = new Date();
  d.setMonth(d.getMonth() - monthsBack);
  return d.toISOString();
}

/**
 * Get YYYY-MM from a date
 * @param {Date|string} date
 * @returns {string}
 */
export function getYearMonth(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
