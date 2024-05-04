import type { OperationResponse } from "../../../client/interfaces/OperationResponse"
import { getPattern } from "../../../utils/getPattern"
import type { OpenApi } from "../interfaces/OpenApi"
import type { OpenApiResponse } from "../interfaces/OpenApiResponse"
import type { OpenApiSchema } from "../interfaces/OpenApiSchema"
import { getContent } from "./getContent"
import { getModel } from "./getModel"
import { getRef } from "./getRef"
import { getType } from "./getType"

export const getOperationResponse = (
  openApi: OpenApi,
  response: OpenApiResponse,
  responseCode: number
): OperationResponse => {
  const operationResponse: OperationResponse = {
    spec: response,
    in: "response",
    name: "",
    code: responseCode,
    description: response.description || null,
    export: "generic",
    type: "any",
    base: "any",
    template: null,
    link: null,
    isDefinition: false,
    isReadOnly: false,
    isRequired: false,
    isNullable: false,
    imports: [],
    enum: [],
    enums: [],
    properties: [],
  }

  if (response.content) {
    const content = getContent(openApi, response.content)
    if (content) {
      if (content.schema.$ref?.startsWith("#/components/responses/")) {
        content.schema = getRef<OpenApiSchema>(openApi, content.schema)
      }
      if (content.schema.$ref) {
        const model = getType(content.schema.$ref)
        operationResponse.export = "reference"
        operationResponse.type = model.type
        operationResponse.base = model.base
        operationResponse.template = model.template
        operationResponse.imports.push(...model.imports)
        return operationResponse
      } else {
        const model = getModel(openApi, content.schema)
        operationResponse.export = model.export
        operationResponse.type = model.type
        operationResponse.base = model.base
        operationResponse.template = model.template
        operationResponse.link = model.link
        operationResponse.isReadOnly = model.isReadOnly
        operationResponse.isRequired = model.isRequired
        operationResponse.isNullable = model.isNullable
        operationResponse.format = model.format
        operationResponse.maximum = model.maximum
        operationResponse.exclusiveMaximum = model.exclusiveMaximum
        operationResponse.minimum = model.minimum
        operationResponse.exclusiveMinimum = model.exclusiveMinimum
        operationResponse.multipleOf = model.multipleOf
        operationResponse.maxLength = model.maxLength
        operationResponse.minLength = model.minLength
        operationResponse.maxItems = model.maxItems
        operationResponse.minItems = model.minItems
        operationResponse.uniqueItems = model.uniqueItems
        operationResponse.maxProperties = model.maxProperties
        operationResponse.minProperties = model.minProperties
        operationResponse.pattern = getPattern(model.pattern)
        operationResponse.imports.push(...model.imports)
        operationResponse.enum.push(...model.enum)
        operationResponse.enums.push(...model.enums)
        operationResponse.properties.push(...model.properties)
        return operationResponse
      }
    }
  }

  // We support basic properties from response headers, since both
  // fetch and XHR client just support string types.
  if (response.headers) {
    for (const name in response.headers) {
      if (response.headers.hasOwnProperty(name)) {
        operationResponse.in = "header"
        operationResponse.name = name
        operationResponse.type = "string"
        operationResponse.base = "string"
        return operationResponse
      }
    }
  }

  return operationResponse
}
