export const isObject = (input: unknown) => input instanceof Object
export const isArray = (input: unknown) => Array.isArray(input)
export const isEmpty = (input: unknown) => {
  return (
    input === null ||
    input === undefined ||
    (isObject(input) && Object.keys(input as Record<string, unknown>).length === 0) ||
    (isArray(input) && (input as unknown[]).length === 0) ||
    (typeof input === "string" && input.trim().length === 0)
  )
}
