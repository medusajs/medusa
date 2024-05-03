import type { OperationParameter } from "../../../client/interfaces/OperationParameter"
import { getPattern } from "../../../utils/getPattern"
import type { OpenApi } from "../interfaces/OpenApi"
import type { OpenApiRequestBody } from "../interfaces/OpenApiRequestBody"
import { getContent } from "./getContent"
import { getModel } from "./getModel"
import { getType } from "./getType"

export const getOperationRequestBody = (
  openApi: OpenApi,
  body: OpenApiRequestBody
): OperationParameter => {
  const requestBody: OperationParameter = {
    spec: body,
    in: "body",
    export: "interface",
    prop: "requestBody",
    name: "requestBody",
    type: "any",
    base: "any",
    template: null,
    link: null,
    description: body.description || null,
    default: undefined,
    isDefinition: false,
    isReadOnly: false,
    isRequired: body.required === true,
    isNullable: body.nullable === true,
    imports: [],
    enum: [],
    enums: [],
    properties: [],
    mediaType: null,
  }

  if (body.content) {
    const content = getContent(openApi, body.content)
    if (content) {
      requestBody.mediaType = content.mediaType
      switch (requestBody.mediaType) {
        case "application/x-www-form-urlencoded":
        case "multipart/form-data":
          requestBody.in = "formData"
          requestBody.name = "formData"
          requestBody.prop = "formData"
          break
      }
      if (content.schema.$ref) {
        const model = getType(content.schema.$ref)
        requestBody.export = "reference"
        requestBody.type = model.type
        requestBody.base = model.base
        requestBody.template = model.template
        requestBody.imports.push(...model.imports)
        return requestBody
      } else {
        const model = getModel(openApi, content.schema)
        requestBody.export = model.export
        requestBody.type = model.type
        requestBody.base = model.base
        requestBody.template = model.template
        requestBody.link = model.link
        requestBody.isReadOnly = model.isReadOnly
        requestBody.isRequired = requestBody.isRequired || model.isRequired
        requestBody.isNullable = requestBody.isNullable || model.isNullable
        requestBody.format = model.format
        requestBody.maximum = model.maximum
        requestBody.exclusiveMaximum = model.exclusiveMaximum
        requestBody.minimum = model.minimum
        requestBody.exclusiveMinimum = model.exclusiveMinimum
        requestBody.multipleOf = model.multipleOf
        requestBody.maxLength = model.maxLength
        requestBody.minLength = model.minLength
        requestBody.maxItems = model.maxItems
        requestBody.minItems = model.minItems
        requestBody.uniqueItems = model.uniqueItems
        requestBody.maxProperties = model.maxProperties
        requestBody.minProperties = model.minProperties
        requestBody.pattern = getPattern(model.pattern)
        requestBody.imports.push(...model.imports)
        requestBody.enum.push(...model.enum)
        requestBody.enums.push(...model.enums)
        requestBody.properties.push(...model.properties)
        return requestBody
      }
    }
  }

  return requestBody
}
