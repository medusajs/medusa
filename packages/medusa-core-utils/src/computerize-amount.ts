import zeroDecimalCurrencies from "./zero-decimal-currencies"

const computerizeAmount = (amount: number, currency: string): number => {
  let divisor = 100

  if (zeroDecimalCurrencies.includes(currency.toLowerCase())) {
    divisor = 1
  }

  return Math.round(amount * divisor)
}

export default computerizeAmount
