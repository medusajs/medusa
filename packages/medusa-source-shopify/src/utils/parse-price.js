export function parsePrice(price) {
  return parseInt(Number(price).toFixed(2) * 100)
}
