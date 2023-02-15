import type { Model } from "../../../client/interfaces/Model"
import type { OpenApi } from "../interfaces/OpenApi"
import { getModel } from "./getModel"
import { reservedWords } from "./getOperationParameterName"
import { getType } from "./getType"
import { getOperationParameters } from "./getOperationParameters"
import { unique } from "../../../utils/unique"
import { getOperation } from "./getOperation"
import { OperationParameter } from "../../../client/interfaces/OperationParameter"
import { OpenApiSchema } from "../interfaces/OpenApiSchema"
import { Dictionary } from "../../../utils/types"
import { OpenApiParameter } from "../interfaces/OpenApiParameter"

export const getModels = (openApi: OpenApi): Model[] => {
  const models: Model[] = []
  if (openApi.components) {
    for (const definitionName in openApi.components.schemas) {
      if (openApi.components.schemas.hasOwnProperty(definitionName)) {
        const definition = openApi.components.schemas[definitionName]
        const definitionType = getType(definitionName)
        const model = getModel(
          openApi,
          definition,
          true,
          definitionType.base.replace(reservedWords, "_$1")
        )
        models.push(model)
      }
    }
  }

  /**
   * Generate query param type from x-codegen.
   * Same discovery mechanism as getServices.ts
   */
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
                if (operation.codegen.queryParams) {
                  const definition = getDefinitionFromParametersQuery(
                    operation.parametersQuery
                  )
                  const model = getModel(
                    openApi,
                    definition,
                    true,
                    operation.codegen.queryParams
                  )
                  models.push(model)
                }
              })
              break
          }
        }
      }
    }
  }

  return models
}

const getDefinitionFromParametersQuery = (
  parametersQuery: OperationParameter[]
): OpenApiSchema => {
  const required = parametersQuery
    .filter((parameter) => parameter.spec.required)
    .map((parameter) => parameter.prop)
  const properties: Dictionary<OpenApiSchema> = {}
  for (const parameter of parametersQuery) {
    const spec = parameter.spec as OpenApiParameter
    properties[parameter.prop] = Object.assign(
      { ...spec.schema },
      {
        description: spec.description,
        deprecated: spec.deprecated,
      }
    )
  }
  return {
    type: "object",
    required,
    properties,
  }
}
