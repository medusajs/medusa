import BigNumber from "bignumber.js"

/**
 * Gets the number of decimal places in a number
 * @param num - The number for which we are getting the number of decimal places
 * @returns The number of decimal places
 *
 * @example
 * getDecimalPlaces(123.456) // 3
 * getDecimalPlaces(42) // 0
 * getDecimalPlaces(10.0000) // 0
 */
export function getNumberOfDecimalPlaces(num: number): number {
  // Convert to string and check if it contains a decimal point
  const str = num.toString()
  if (str.indexOf(".") === -1) {
    return 0
  }
  // Return the length of the part after the decimal point
  return str.split(".")[1].length
}

/**
 * A private clone so the arithmetic below is immune to any global
 * `BigNumber.config` call elsewhere in the bundle. Twenty decimal places (the
 * library default) only bounds non-terminating division such as `10 / 3`, and
 * comfortably exceeds the ~17 significant digits a JS number can carry, so
 * converting the result back with `toNumber` loses nothing.
 */
const Decimal = BigNumber.clone({ DECIMAL_PLACES: 20 })

/**
 * Multiplies two numbers without the representation error binary floating
 * point introduces for decimal operands
 *
 * @example
 * 3 * 0.1 // 0.30000000000000004
 * multiplyDecimal(3, 0.1) // 0.3
 */
export function multiplyDecimal(a: number, b: number): number {
  return new Decimal(a).times(b).toNumber()
}

/**
 * Divides two numbers without the representation error binary floating point
 * introduces for decimal operands. Matters most when the caller rounds the
 * result, since an error in the last bit changes the rounded value.
 *
 * @example
 * Math.floor(7 / 0.07) // 99
 * Math.floor(divideDecimal(7, 0.07)) // 100
 */
export function divideDecimal(a: number, b: number): number {
  return new Decimal(a).div(b).toNumber()
}
