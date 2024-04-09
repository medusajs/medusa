import { currencies } from "./currencies"

export const getDecimalDigits = (currency: string) => {
  return currencies[currency.toUpperCase()]?.decimal_digits ?? 0
}

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
  const decimalDigits = getDecimalDigits(currency)

  if (decimalDigits === undefined) {
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
  const decimalDigits = getDecimalDigits(currency)

  if (decimalDigits === undefined) {
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
export const getLocaleAmount = (amount: number, currencyCode: string) => {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currencyDisplay: "narrowSymbol",
    currency: currencyCode,
  })

  return formatter.format(getPresentationalAmount(amount, currencyCode))
}

export const getNativeSymbol = (currencyCode: string) => {
  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(0)

  return formatted.replace(/\d/g, "").replace(/[.,]/g, "").trim()
}

/**
 * In some cases we want to display the amount with the currency code and symbol,
 * in the format of "symbol amount currencyCode". This breaks from the
 * user's locale and is only used in cases where we want to display the
 * currency code and symbol explicitly, e.g. for totals.
 */
export const getStylizedAmount = (amount: number, currencyCode: string) => {
  const symbol = getNativeSymbol(currencyCode)
  const decimalDigits = getDecimalDigits(currencyCode)
  const presentationAmount = getPresentationalAmount(amount, currencyCode)

  const total = presentationAmount.toLocaleString(undefined, {
    minimumFractionDigits: decimalDigits,
    maximumFractionDigits: decimalDigits,
  })

  return `${symbol} ${total} ${currencyCode.toUpperCase()}`
}
