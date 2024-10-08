const formatter = new Intl.NumberFormat([], {
  style: "percent",
  minimumFractionDigits: 2,
})

/**
 * Formats a number as a percentage
 * @param value - The value to format
 * @param isPercentageValue - Whether the value is already a percentage value (where `0` is 0%, `0.5` is 50%, `0.75` is 75%, etc). Defaults to false
 * @returns The formatted percentage in the form of a localized string
 *
 * @example
 * formatPercentage(0.5, true) // "50%"
 * formatPercentage(50) // "50%"
 */
export const formatPercentage = (
  value?: number | null,
  isPercentageValue = false
) => {
  let val = value || 0

  if (!isPercentageValue) {
    val = val / 100
  }

  return formatter.format(val)
}
