export function formatPrice(amount, currency = 'UZS') {
  return `${Number(amount).toLocaleString('uz-UZ')} ${currency}`
}
