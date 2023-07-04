export const isObject = (input: any) => input instanceof Object
export const isArray = (input: any) => Array.isArray(input)
export const isEmpty = (input: any) => {
  return (
    input === null ||
    input === undefined ||
    (isObject(input) && Object.keys(input).length === 0) ||
    (isArray(input) && (input as any[]).length === 0) ||
    (typeof input === "string" && input.trim().length === 0)
  )
}
