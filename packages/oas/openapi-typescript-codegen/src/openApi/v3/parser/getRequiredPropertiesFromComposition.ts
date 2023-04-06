import type { Model } from "../../../client/interfaces/Model"
import type { OpenApi } from "../interfaces/OpenApi"
import type { OpenApiSchema } from "../interfaces/OpenApiSchema"
import type { getModel } from "./getModel"
import { getRef } from "./getRef"

// Fix for circular dependency
export type GetModelFn = typeof getModel

export const getRequiredPropertiesFromComposition = (
  openApi: OpenApi,
  required: string[],
  definitions: OpenApiSchema[],
  getModel: GetModelFn
): Model[] => {
  return definitions
    .reduce((properties, definition) => {
      if (definition.$ref) {
        const schema = getRef<OpenApiSchema>(openApi, definition)
        return [...properties, ...getModel(openApi, schema).properties]
      }
      return [...properties, ...getModel(openApi, definition).properties]
    }, [] as Model[])
    .filter((property) => {
      return !property.isRequired && required.includes(property.name)
    })
    .map((property) => {
      return {
        ...property,
        isRequired: true,
      }
    })
}
