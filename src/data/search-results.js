import resultsData from './search-results.json'

export const searchResults = resultsData

export function formatPrice(amount, currency = 'UZS') {
  return `${amount.toLocaleString('uz-UZ')} ${currency}`
}

export const PAGE_SIZE = 3
