import type { OperationResponse } from "../../../client/interfaces/OperationResponse"

export const getOperationResponseHeader = (
  operationResponses: OperationResponse[]
): string | null => {
  const header = operationResponses.find((operationResponses) => {
    return operationResponses.in === "header"
  })
  if (header) {
    return header.name
  }
  return null
}
