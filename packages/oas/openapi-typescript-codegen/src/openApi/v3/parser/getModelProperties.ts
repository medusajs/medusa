import type { Model } from "../../../client/interfaces/Model"
import {
  findOneOfParentDiscriminator,
  mapPropertyValue,
} from "../../../utils/discriminator"
import { getPattern } from "../../../utils/getPattern"
import type { OpenApi } from "../interfaces/OpenApi"
import type { OpenApiSchema } from "../interfaces/OpenApiSchema"
import { escapeName } from "./escapeName"
import type { getModel } from "./getModel"
import { getType } from "./getType"

// Fix for circular dependency
export type GetModelFn = typeof getModel

export const getModelProperties = (
  openApi: OpenApi,
  definition: OpenApiSchema,
  getModel: GetModelFn,
  parent?: Model
): Model[] => {
  const models: Model[] = []
  const discriminator = findOneOfParentDiscriminator(openApi, parent)
  for (const propertyName in definition.properties) {
    if (definition.properties.hasOwnProperty(propertyName)) {
      const property = definition.properties[propertyName]
      const propertyRequired = !!definition.required?.includes(propertyName)
      const propertyValues: Omit<
        Model,
        | "export"
        | "type"
        | "base"
        | "template"
        | "link"
        | "isNullable"
        | "imports"
        | "enum"
        | "enums"
        | "properties"
      > = {
        spec: definition,
        name: escapeName(propertyName),
        description: property.description || null,
        deprecated: property.deprecated === true,
        isDefinition: false,
        isReadOnly: property.readOnly === true,
        isRequired: propertyRequired,
        format: property.format,
        maximum: property.maximum,
        exclusiveMaximum: property.exclusiveMaximum,
        minimum: property.minimum,
        exclusiveMinimum: property.exclusiveMinimum,
        multipleOf: property.multipleOf,
        maxLength: property.maxLength,
        minLength: property.minLength,
        maxItems: property.maxItems,
        minItems: property.minItems,
        uniqueItems: property.uniqueItems,
        maxProperties: property.maxProperties,
        minProperties: property.minProperties,
        pattern: getPattern(property.pattern),
      }
      if (parent && discriminator?.propertyName == propertyName) {
        models.push({
          export: "reference",
          type: "string",
          base: `'${mapPropertyValue(discriminator, parent)}'`,
          template: null,
          isNullable: property.nullable === true,
          link: null,
          imports: [],
          enum: [],
          enums: [],
          properties: [],
          ...propertyValues,
        })
      } else if (property.$ref) {
        const model = getType(property.$ref)
        models.push({
          export: "reference",
          type: model.type,
          base: model.base,
          template: model.template,
          link: null,
          isNullable: model.isNullable || property.nullable === true,
          imports: model.imports,
          enum: [],
          enums: [],
          properties: [],
          ...propertyValues,
        })
      } else {
        const model = getModel(openApi, property)
        models.push({
          export: model.export,
          type: model.type,
          base: model.base,
          template: model.template,
          link: model.link,
          isNullable: model.isNullable || property.nullable === true,
          imports: model.imports,
          enum: model.enum,
          enums: model.enums,
          properties: model.properties,
          ...propertyValues,
        })
      }
    }
  }

  return models
}
