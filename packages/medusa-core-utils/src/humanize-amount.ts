import zeroDecimalCurrencies from "./zero-decimal-currencies"

const humanizeAmount = (amount: number, currency: string): number => {
  let divisor = 100

  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    divisor = 1
  }

  return amount / divisor
}

export default humanizeAmount
