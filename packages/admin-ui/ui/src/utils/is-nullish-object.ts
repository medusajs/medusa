/**
 * Utility function that checks if every object property is nullish.
 */
const isNullishObject = (obj?: Object | null) => {
  if (!obj) {
    return true
  }

  return Object.values(obj).every(
    (value) => value === null || value === undefined || value === ""
  )
}

export default isNullishObject
