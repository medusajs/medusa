import type { OperationResponse } from "../../../client/interfaces/OperationResponse"
import type { OpenApi } from "../interfaces/OpenApi"
import type { OpenApiResponse } from "../interfaces/OpenApiResponse"
import type { OpenApiResponses } from "../interfaces/OpenApiResponses"
import { getOperationResponse } from "./getOperationResponse"
import { getOperationResponseCode } from "./getOperationResponseCode"
import { getRef } from "./getRef"

export const getOperationResponses = (
  openApi: OpenApi,
  responses: OpenApiResponses
): OperationResponse[] => {
  const operationResponses: OperationResponse[] = []

  // Iterate over each response code and get the
  // status code and response message (if any).
  for (const code in responses) {
    if (responses.hasOwnProperty(code)) {
      const responseOrReference = responses[code]
      const response = getRef<OpenApiResponse>(openApi, responseOrReference)
      const responseCode = getOperationResponseCode(code)

      if (responseCode) {
        const operationResponse = getOperationResponse(
          openApi,
          response,
          responseCode
        )
        operationResponses.push(operationResponse)
      }
    }
  }

  // Sort the responses to 2XX success codes come before 4XX and 5XX error codes.
  return operationResponses.sort((a, b): number => {
    return a.code < b.code ? -1 : a.code > b.code ? 1 : 0
  })
}
