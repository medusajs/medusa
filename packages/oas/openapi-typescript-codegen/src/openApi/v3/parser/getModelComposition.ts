import type { Model } from "../../../client/interfaces/Model"
import type { ModelComposition } from "../../../client/interfaces/ModelComposition"
import type { OpenApi } from "../interfaces/OpenApi"
import type { OpenApiSchema } from "../interfaces/OpenApiSchema"
import type { getModel } from "./getModel"
import { getModelProperties } from "./getModelProperties"
import { getRequiredPropertiesFromComposition } from "./getRequiredPropertiesFromComposition"

// Fix for circular dependency
export type GetModelFn = typeof getModel

export const getModelComposition = (
  openApi: OpenApi,
  definition: OpenApiSchema,
  definitions: OpenApiSchema[],
  type: "one-of" | "any-of" | "all-of",
  getModel: GetModelFn
): ModelComposition => {
  const composition: ModelComposition = {
    type,
    imports: [],
    enums: [],
    properties: [],
  }

  const properties: Model[] = []

  definitions
    .map((definition) => getModel(openApi, definition))
    .filter((model) => {
      const hasProperties = model.properties.length
      const hasEnums = model.enums.length
      const isObject = model.type === "any"
      const isDictionary = model.export === "dictionary"
      const isEmpty = isObject && !hasProperties && !hasEnums
      return !isEmpty || isDictionary
    })
    .forEach((model) => {
      composition.imports.push(...model.imports)
      composition.enums.push(...model.enums)
      composition.properties.push(model)
    })

  if (definition.required) {
    const requiredProperties = getRequiredPropertiesFromComposition(
      openApi,
      definition.required,
      definitions,
      getModel
    )
    requiredProperties.forEach((requiredProperty) => {
      composition.imports.push(...requiredProperty.imports)
      composition.enums.push(...requiredProperty.enums)
    })
    properties.push(...requiredProperties)
  }

  if (definition.properties) {
    const modelProperties = getModelProperties(openApi, definition, getModel)
    modelProperties.forEach((modelProperty) => {
      composition.imports.push(...modelProperty.imports)
      composition.enums.push(...modelProperty.enums)
      if (modelProperty.export === "enum") {
        composition.enums.push(modelProperty)
      }
    })
    properties.push(...modelProperties)
  }

  if (properties.length) {
    composition.properties.push({
      spec: definition,
      name: "properties",
      export: "interface",
      type: "any",
      base: "any",
      template: null,
      link: null,
      description: "",
      isDefinition: false,
      isReadOnly: false,
      isNullable: false,
      isRequired: false,
      imports: [],
      enum: [],
      enums: [],
      properties,
    })
  }

  return composition
}
