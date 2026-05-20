import { formatDate } from './formatters';

/**
 * Export transactions array to a CSV file download
 * @param {Array} transactions
 * @param {string} filename
 */
export function exportTransactionsToCSV(transactions, filename = 'finora-transactions') {
  if (!transactions || transactions.length === 0) {
    console.warn('No transactions to export');
    return;
  }

  const headers = ['Date', 'Title', 'Amount', 'Type', 'Category', 'Notes'];

  const rows = transactions.map((t) => [
    formatDate(t.date, 'yyyy-MM-dd'),
    t.title,
    t.amount,
    t.type,
    t.category,
    t.notes || '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
    )
    .join('\n');

  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href     = url;
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parse a CSV string into an array of transaction objects
 * @param {string} csvText
 * @returns {Array}
 */
export function parseTransactionsFromCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.replace(/"/g, '').trim().toLowerCase());

  return lines.slice(1).map((line, idx) => {
    const values = line.match(/(".*?"|[^,]+)(?=,|$)/g) || [];
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = (values[i] || '').replace(/^"|"$/g, '').trim();
    });
    return {
      id:       `imported-${Date.now()}-${idx}`,
      title:    obj.title || 'Imported',
      amount:   parseFloat(obj.amount) || 0,
      type:     obj.type === 'income' ? 'income' : 'expense',
      category: obj.category || 'Other',
      date:     obj.date || new Date().toISOString(),
      notes:    obj.notes || '',
    };
  }).filter((t) => t.amount > 0);
}
