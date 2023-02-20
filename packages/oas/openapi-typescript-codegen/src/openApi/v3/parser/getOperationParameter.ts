import type { OperationParameter } from "../../../client/interfaces/OperationParameter"
import { getPattern } from "../../../utils/getPattern"
import type { OpenApi } from "../interfaces/OpenApi"
import type { OpenApiParameter } from "../interfaces/OpenApiParameter"
import type { OpenApiSchema } from "../interfaces/OpenApiSchema"
import { getModel } from "./getModel"
import { getModelDefault } from "./getModelDefault"
import { getOperationParameterName } from "./getOperationParameterName"
import { getRef } from "./getRef"
import { getType } from "./getType"

export const getOperationParameter = (
  openApi: OpenApi,
  parameter: OpenApiParameter
): OperationParameter => {
  const operationParameter: OperationParameter = {
    spec: parameter,
    in: parameter.in,
    prop: parameter.name,
    export: "interface",
    name: getOperationParameterName(parameter.name),
    type: "any",
    base: "any",
    template: null,
    link: null,
    description: parameter.description || null,
    deprecated: parameter.deprecated === true,
    isDefinition: false,
    isReadOnly: false,
    isRequired: parameter.required === true,
    isNullable: parameter.nullable === true,
    imports: [],
    enum: [],
    enums: [],
    properties: [],
    mediaType: null,
  }

  if (parameter.$ref) {
    const definitionRef = getType(parameter.$ref)
    operationParameter.export = "reference"
    operationParameter.type = definitionRef.type
    operationParameter.base = definitionRef.base
    operationParameter.template = definitionRef.template
    operationParameter.imports.push(...definitionRef.imports)
    return operationParameter
  }

  let schema = parameter.schema
  if (schema) {
    if (schema.$ref?.startsWith("#/components/parameters/")) {
      schema = getRef<OpenApiSchema>(openApi, schema)
    }
    if (schema.$ref) {
      const model = getType(schema.$ref)
      operationParameter.export = "reference"
      operationParameter.type = model.type
      operationParameter.base = model.base
      operationParameter.template = model.template
      operationParameter.imports.push(...model.imports)
      operationParameter.default = getModelDefault(schema)
      return operationParameter
    } else {
      const model = getModel(openApi, schema)
      operationParameter.export = model.export
      operationParameter.type = model.type
      operationParameter.base = model.base
      operationParameter.template = model.template
      operationParameter.link = model.link
      operationParameter.isReadOnly = model.isReadOnly
      operationParameter.isRequired =
        operationParameter.isRequired || model.isRequired
      operationParameter.isNullable =
        operationParameter.isNullable || model.isNullable
      operationParameter.format = model.format
      operationParameter.maximum = model.maximum
      operationParameter.exclusiveMaximum = model.exclusiveMaximum
      operationParameter.minimum = model.minimum
      operationParameter.exclusiveMinimum = model.exclusiveMinimum
      operationParameter.multipleOf = model.multipleOf
      operationParameter.maxLength = model.maxLength
      operationParameter.minLength = model.minLength
      operationParameter.maxItems = model.maxItems
      operationParameter.minItems = model.minItems
      operationParameter.uniqueItems = model.uniqueItems
      operationParameter.maxProperties = model.maxProperties
      operationParameter.minProperties = model.minProperties
      operationParameter.pattern = getPattern(model.pattern)
      operationParameter.default = model.default
      operationParameter.imports.push(...model.imports)
      operationParameter.enum.push(...model.enum)
      operationParameter.enums.push(...model.enums)
      operationParameter.properties.push(...model.properties)
      return operationParameter
    }
  }

  return operationParameter
}
