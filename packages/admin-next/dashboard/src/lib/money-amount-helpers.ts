import { currencies } from "./currencies"

/**
 * Converts an amount from the database format (cents) to the presentational format
 *
 * @param amount - The amount to format
 * @param currency - The currency code to format the amount in
 * @returns The formatted amount
 *
 * @example
 * getPresentationalAmount(1000, "usd") // 10
 * getPresentationalAmount(1000, "jpy") // 1000
 */
export const getPresentationalAmount = (amount: number, currency: string) => {
  const decimalDigits = currencies[currency.toUpperCase()].decimal_digits

  if (decimalDigits === 0) {
    throw new Error("Currency has no decimal digits")
  }

  return amount / 10 ** decimalDigits
}

/**
 * Converts an amount to the database format (cents)
 * @param amount - The amount to convert to the database amount
 * @param currency - The currency code to convert the amount to
 * @returns The amount in the database format
 *
 * @example
 * getDbAmount(10.5, "usd") // 1050
 * getDbAmount(10, "jpy") // 10
 */
export const getDbAmount = (amount: number, currency: string) => {
  const decimalDigits = currencies[currency.toUpperCase()].decimal_digits

  if (decimalDigits === 0) {
    throw new Error("Currency has no decimal digits")
  }

  return amount * 10 ** decimalDigits
}

/**
 * Returns a formatted amount based on the currency code using the browser's locale
 * @param amount - The amount to format
 * @param currencyCode - The currency code to format the amount in
 * @returns - The formatted amount
 *
 * @example
 * getFormattedAmount(1000, "usd") // '$10.00' if the browser's locale is en-US
 * getFormattedAmount(1000, "usd") // '10,00 $' if the browser's locale is fr-FR
 */
export const getFormattedAmount = (amount: number, currencyCode: string) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency: currencyCode,
  })

  return formatter.format(getPresentationalAmount(amount, currencyCode))
}

export const getNativeSymbol = (currencyCode: string) => {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
  }).resolvedOptions().currency
}
