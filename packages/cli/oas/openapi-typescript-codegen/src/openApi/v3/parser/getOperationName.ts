import camelCase from "camelcase"

/**
 * Convert the input value to a correct operation (method) classname.
 * This will use the operation ID - if available - and otherwise fallback
 * on a generated name from the URL
 */
export const getOperationName = (
  url: string,
  method: string,
  operationId?: string
): string => {
  if (operationId) {
    return camelCase(
      operationId
        .replace(/^[^a-zA-Z]+/g, "")
        .replace(/[^\w\-]+/g, "-")
        .trim()
    )
  }

  const urlWithoutPlaceholders = url
    .replace(/[^/]*?{api-version}.*?\//g, "")
    .replace(/{(.*?)}/g, "")
    .replace(/\//g, "-")

  return camelCase(`${method}-${urlWithoutPlaceholders}`)
}
