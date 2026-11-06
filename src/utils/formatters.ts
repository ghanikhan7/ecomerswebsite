import { brandConfig } from '../config/brandConfig';

/**
 * Format a number into currency (INR by default)
 */
export function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat(brandConfig.currency.locale, {
      style: 'currency',
      currency: brandConfig.currency.code,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${brandConfig.currency.symbol}${amount.toLocaleString('en-IN')}`;
  }
}

/**
 * Format date string into editorial human-readable format
 */
export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Generate a random order ID (e.g., #AA-84291)
 */
export function generateOrderId(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `AA-${randomNum}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(price: number, originalPrice?: number): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

