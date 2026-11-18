/**
 * SpendAura formatting utilities
 */

/**
 * Formats a number with Indian numbering system (e.g., 1,00,000 or 18,450)
 * and prepends currency symbol (defaults to ₹)
 */
export function formatCurrency(amount, currency = '₹') {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return `${currency} 0`;
  }
  const numeric = Math.abs(Number(amount));
  
  // Format with en-IN locale
  const formatted = numeric.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  return `${amount < 0 ? '- ' : ''}${currency} ${formatted}`;
}

/**
 * Formats a date into a friendly readable string
 * e.g., "Today, 10:24 AM", "Yesterday, 8:15 PM", "Oct 14, 9:00 AM"
 */
export function formatFriendlyDate(dateInput) {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const now = new Date();
  
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) {
    return `Today, ${timeStr}`;
  }
  if (isYesterday) {
    return `Yesterday, ${timeStr}`;
  }

  const dateStr = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return `${dateStr}, ${timeStr}`;
}

/**
 * Abbreviates numbers for chart axes (e.g. 40000 -> 40K)
 */
export function formatCompactNumber(num) {
  if (num >= 1000) {
    return `${Math.round(num / 1000)}K`;
  }
  return num.toString();
}
