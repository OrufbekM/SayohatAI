/** 1 USD = … UZS (Navbar / markaziy bank kursi; .env orqali o‘zgartirish mumkin) */
export const USD_TO_UZS = Number(import.meta.env.VITE_USD_TO_UZS) || 12_640

export function convertToUzs(amount, currency = 'UZS') {
  const value = Number(amount)
  if (!Number.isFinite(value)) return 0

  const code = String(currency).toUpperCase()
  if (code === 'UZS') return Math.round(value)
  if (code === 'USD') return Math.round(value * USD_TO_UZS)
  return Math.round(value)
}

/**
 * @param {number} amount
 * @param {string} [currency] — API valyutasi (USD, UZS, …)
 * @param {{ convertUsd?: boolean }} [options] — USD ni UZS ga aylantirish (default: true)
 */
export function formatPrice(amount, currency = 'UZS', { convertUsd = true } = {}) {
  const code = String(currency).toUpperCase()
  const displayCurrency = convertUsd && code === 'USD' ? 'UZS' : code
  const displayAmount =
    convertUsd && code === 'USD' ? convertToUzs(amount, code) : Number(amount)

  return `${displayAmount.toLocaleString('uz-UZ')} ${displayCurrency}`
}
