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
  let foundObjects = false

  allOfSchema.allOf.forEach((item) => {
    if (item.type !== "object") {
      return
    }

    properties = Object.assign(properties, item.properties)
    foundObjects = true
  })

  if (!foundObjects && allOfSchema.allOf.length) {
    // return the first item in the union.
    // allOf should always include an object but just in case
    return allOfSchema.allOf[0]
  }

  return {
    type: "object",
    properties,
  }
}
