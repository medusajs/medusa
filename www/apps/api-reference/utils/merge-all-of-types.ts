import type { PropertiesObject, SchemaObject } from "@/types/openapi"

export default function mergeAllOfTypes(
  allOfSchema: SchemaObject
): SchemaObject {
  if (!allOfSchema.allOf) {
    // return whatever the schema is
    return allOfSchema
  }
  // merge objects' properties in this var
  let properties: PropertiesObject = {}

  allOfSchema.allOf.forEach((item) => {
    if (item.type !== "object") {
      return
    }

    properties = Object.assign(properties, item.properties)
  })

  return {
    type: "object",
    properties,
  }
}
