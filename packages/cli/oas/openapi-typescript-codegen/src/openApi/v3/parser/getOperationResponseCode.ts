export const getOperationResponseCode = (
  value: string | "default"
): number | null => {
  // You can specify a "default" response, this is treated as HTTP code 200
  if (value === "default") {
    return 200
  }

  // Check if we can parse the code and return of successful.
  if (/[0-9]+/g.test(value)) {
    const code = parseInt(value)
    if (Number.isInteger(code)) {
      return Math.abs(code)
    }
  }

  return null
}
