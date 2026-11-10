import { BigNumberInput } from "@medusajs/framework/types"
import { MathBN } from "@medusajs/framework/utils"

// Adyen's own exponents, which differ from ISO 4217 for some currencies
// (for example, CLP and ISK have 2 decimals and IDR has 0).
// https://docs.adyen.com/development-resources/currency-codes
const ZERO_DECIMAL_CURRENCIES = new Set([
  "CVE",
  "DJF",
  "GNF",
  "IDR",
  "JPY",
  "KMF",
  "KRW",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
])

const THREE_DECIMAL_CURRENCIES = new Set([
  "BHD",
  "IQD",
  "JOD",
  "KWD",
  "LYD",
  "OMR",
  "TND",
])

export function getCurrencyExponent(currency: string): number {
  const code = currency.toUpperCase()

  if (ZERO_DECIMAL_CURRENCIES.has(code)) {
    return 0
  }

  if (THREE_DECIMAL_CURRENCIES.has(code)) {
    return 3
  }

  return 2
}

export function toMinorUnits(amount: BigNumberInput, currency: string): number {
  const multiplier = 10 ** getCurrencyExponent(currency)

  return MathBN.convert(MathBN.mult(amount, multiplier), 0).toNumber()
}

export function fromMinorUnits(amount: number, currency: string): number {
  const multiplier = 10 ** getCurrencyExponent(currency)

  return MathBN.div(amount, multiplier).toNumber()
}
