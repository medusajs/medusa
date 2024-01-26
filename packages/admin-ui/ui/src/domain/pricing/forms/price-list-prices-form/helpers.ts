import { currencies as CURRENCY_MAP } from "../../../../utils/currencies"

/**
 * Gets the presentational amount for a given currency code
 * @param code - currency code
 * @param amount - amount in cents
 */
export const getDefaultAmount = (code: string, amount?: number) => {
  const meta = CURRENCY_MAP[code.toUpperCase()]

  if (!amount) {
    return null
  }

  if (!meta) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`No currency meta found for ${code}. Cannot format.`)
    }

    return null
  }

  const num = amount / Math.pow(10, meta.decimal_digits)

  return parseFloat(num.toFixed(meta.decimal_digits))
}

export const getDbSafeAmount = (code: string, amount?: number) => {
  const meta = CURRENCY_MAP[code.toUpperCase()]

  if (!amount) {
    return null
  }

  if (!meta) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`No currency meta found for ${code}. Cannot format.`)
    }

    return null
  }

  const num = amount * Math.pow(10, meta.decimal_digits)

  return parseFloat(num.toFixed(0))
}
