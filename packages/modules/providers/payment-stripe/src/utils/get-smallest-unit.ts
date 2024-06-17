import { BigNumberInput } from "@medusajs/types"
import { BigNumber, MathBN } from "@medusajs/utils"

function getCurrencyMultiplier(currency) {
  const currencyMultipliers = {
    0: [
      "BIF",
      "CLP",
      "DJF",
      "GNF",
      "JPY",
      "KMF",
      "KRW",
      "MGA",
      "PYG",
      "RWF",
      "UGX",
      "VND",
      "VUV",
      "XAF",
      "XOF",
      "XPF",
    ],
    3: ["BHD", "IQD", "JOD", "KWD", "OMR", "TND"],
  }

  currency = currency.toUpperCase()
  let power = 2
  for (const [key, value] of Object.entries(currencyMultipliers)) {
    if (value.includes(currency)) {
      power = parseInt(key, 10)
      break
    }
  }
  return Math.pow(10, power)
}

/**
 * Converts an amount to the format required by Stripe based on currency.
 * https://docs.stripe.com/currencies
 * @param {BigNumberInput} amount - The amount to be converted.
 * @param {string} currency - The currency code (e.g., 'USD', 'JOD').
 * @returns {number} - The converted amount in the smallest currency unit.
 */
export function getSmallestUnit(
  amount: BigNumberInput,
  currency: string
): number {
  const multiplier = getCurrencyMultiplier(currency)
  const smallestAmount = new BigNumber(MathBN.mult(amount, multiplier))

  let numeric = smallestAmount.numeric

  // Check if the currency requires rounding to the nearest ten
  if (multiplier === 1e3) {
    numeric = Math.ceil(numeric / 10) * 10
  }

  return numeric
}

/**
 * Converts an amount from the smallest currency unit to the standard unit based on currency.
 * @param {BigNumberInput} amount - The amount in the smallest currency unit.
 * @param {string} currency - The currency code (e.g., 'USD', 'JOD').
 * @returns {number} - The converted amount in the standard currency unit.
 */
export function getAmountFromSmallestUnit(
  amount: BigNumberInput,
  currency: string
): number {
  const multiplier = getCurrencyMultiplier(currency)
  const standardAmount = new BigNumber(MathBN.div(amount, multiplier))
  return standardAmount.numeric
}
