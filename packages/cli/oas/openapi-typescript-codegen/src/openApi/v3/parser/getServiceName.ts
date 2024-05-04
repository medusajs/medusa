import camelCase from "camelcase"

/**
 * Convert the input value to a correct service name. This converts
 * the input string to PascalCase.
 */
export const getServiceName = (value: string): string => {
  const clean = value
    .replace(/^[^a-zA-Z]+/g, "")
    .replace(/[^\w\-]+/g, "-")
    .trim()
  return camelCase(clean, { pascalCase: true })
}
