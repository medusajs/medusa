import { OpenApi } from "../interfaces/OpenApi"
import { Operation } from "../../../client/interfaces/Operation"
import { getOperationParameters } from "./getOperationParameters"
import { unique } from "../../../utils/unique"
import { getOperation } from "./getOperation"

export const listOperations = (openApi: OpenApi): Operation[] => {
  const operations: Operation[] = []
  for (const url in openApi.paths) {
    if (openApi.paths.hasOwnProperty(url)) {
      // Grab path and parse any global path parameters
      const path = openApi.paths[url]
      const pathParams = getOperationParameters(openApi, path.parameters || [])

      // Parse all the methods for this path
      for (const method in path) {
        if (path.hasOwnProperty(method)) {
          switch (method) {
            case "get":
            case "put":
            case "post":
            case "delete":
            case "options":
            case "head":
            case "patch":
              // Each method contains an OpenAPI operation, we parse the operation
              const op = path[method]!
              const tags = op.tags?.length
                ? op.tags.filter(unique)
                : ["Default"]
              tags.forEach((tag) => {
                const operation = getOperation(
                  openApi,
                  url,
                  method,
                  tag,
                  op,
                  pathParams
                )
                operations.push(operation)
              })
              break
          }
        }
      }
    }
  }
  return operations
}
