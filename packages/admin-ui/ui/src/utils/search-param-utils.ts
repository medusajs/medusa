import { DateComparisonOperator } from "@medusajs/types"

/**
 * Takes a key and a URLSearchParams and returns the parsed DateComparisonOperator if found
 * @param key - The key to search for
 * @param search - The URLSearchParams to search in
 * @returns - The parsed DateComparisonOperator or undefined if not found
 */
export const getDateComparisonOperatorFromSearchParams = (
  key: string,
  search: URLSearchParams
): DateComparisonOperator | undefined => {
  const value = search.get(key)

  if (!value) {
    return undefined
  }

  const parsed = JSON.parse(value)

  const acceptedKeys = ["lt", "gt", "gte", "lte"]

  const filtered = Object.keys(parsed).reduce((acc, key) => {
    if (acceptedKeys.includes(key)) {
      acc[key as keyof DateComparisonOperator] = parsed[key]
    }

    return acc
  }, {} as DateComparisonOperator)

  if (Object.keys(filtered).length === 0) {
    return undefined
  }

  const parsedDates = Object.keys(filtered).reduce((acc, key) => {
    if (filtered[key as keyof DateComparisonOperator]) {
      const stringValue = filtered[
        key as keyof DateComparisonOperator
      ] as unknown as string

      acc[key as keyof DateComparisonOperator] = new Date(stringValue)
    }

    return acc
  }, {} as DateComparisonOperator)

  return parsedDates
}

/**
 * Takes a key and a URLSearchParams and returns the parsed string array if found
 * @param key - The key to search for
 * @param search - The URLSearchParams to search in
 * @returns - The parsed string array or undefined if not found
 */
export const getStringArrayFromSearchParams = (
  key: string,
  search: URLSearchParams
): string[] | undefined => {
  const value = search.get(key)

  if (!value) {
    return undefined
  }

  return value.split(",").filter((s) => !!s)
}

/**
 * Takes a key and a URLSearchParams and returns the parsed string if found
 * @param key - The key to search for
 * @param search - The URLSearchParams to search in
 * @returns - The parsed string or undefined if not found
 */
export const getStringFromSearchParams = (
  key: string,
  search: URLSearchParams
): string | undefined => {
  const value = search.get(key)

  if (!value) {
    return undefined
  }

  return value
}
