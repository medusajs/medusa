import type { Model } from "../../../client/interfaces/Model"
import type { OpenApi } from "../interfaces/OpenApi"
import { getModel } from "./getModel"
import { reservedWords } from "./getOperationParameterName"
import { getType } from "./getType"
import { OperationParameter } from "../../../client/interfaces/OperationParameter"
import { OpenApiSchema } from "../interfaces/OpenApiSchema"
import { Dictionary } from "../../../utils/types"
import { OpenApiParameter } from "../interfaces/OpenApiParameter"
import { listOperations } from "./listOperations"
import { handleExpandedRelations } from "./getModelsExpandedRelations"

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

  for (const model of models) {
    handleExpandedRelations(model, models)
  }

  /**
   * Bundle all query parameters in a single typed object
   * when x-codegen.queryParams is declared on the operation.
   */
  const operations = listOperations(openApi)
  for (const operation of operations) {
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
  }

  return models
}

/**
 * Combines and converts query parameters into schema properties.
 * Given a typical parameter OAS:
 * ```
 * parameters:
 *   - in: query
 *     name: limit
 *     schema:
 *       type: integer
 *       default: 10
 *     required: true
 *     description: Limit the number of results returned.
 * ```
 * Convert into a schema property:
 * ```
 * UnnamedSchema:
 *   type: object
 *   required:
 *     - limit
 *   properties:
 *     limit:
 *       description: Limit the number of results returned.
 *       type: integer
 *       default: 10
 * ```
 */
const getDefinitionFromParametersQuery = (
  parametersQuery: OperationParameter[]
): OpenApiSchema => {
  /**
   * Identify query parameters that are required (non-optional).
   */
  const required = parametersQuery
    .filter((parameter) => (parameter.spec as OpenApiParameter).required)
    .map((parameter) => (parameter.spec as OpenApiParameter).name)

  const properties: Dictionary<OpenApiSchema> = {}
  for (const parameter of parametersQuery) {
    const spec = parameter.spec as OpenApiParameter
    /**
     * Augment a copy of schema with description and deprecated
     * and assign it as a named property on the schema.
     */
    properties[spec.name] = Object.assign(
      { ...spec.schema },
      {
        description: spec.description,
        deprecated: spec.deprecated,
      }
    )
  }
  /**
   * Return an unnamed schema definition.
   */
  return {
    type: "object",
    required,
    properties,
  }
}
