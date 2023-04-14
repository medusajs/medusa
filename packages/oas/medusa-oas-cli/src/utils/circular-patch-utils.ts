import { OpenAPIObject, SchemaObject } from "openapi3-ts"
import OpenAPIParser from "@readme/openapi-parser"
import { $Refs } from "@readme/json-schema-ref-parser"
import { jsonObjectToYamlString } from "./yaml-utils"

export const getCircularReferences = async (
  srcFile: string
): Promise<{ circularRefs: string[]; oas: OpenAPIObject }> => {
  const parser = new OpenAPIParser()
  const oas = (await parser.validate(srcFile, {
    dereference: {
      circular: "ignore",
    },
  })) as OpenAPIObject
  if (parser.$refs.circular) {
    const $refs = parser.$refs as $Refs
    let circularRefs = $refs.circularRefs.map(
      (ref) => ref.match(/#\/components\/schemas\/.*/)![0]
    )
    circularRefs = [...new Set(circularRefs)]
    circularRefs.sort()
    return { circularRefs, oas }
  }
  return { circularRefs: [], oas }
}

export const getCircularPatchRecommendation = (
  circularRefs: string[],
  oas: OpenAPIObject
): Record<string, string[]> => {
  type circularReferenceMatch = {
    schema: string
    property: string
    isArray: boolean
    referencedSchema: string
  }
  const matches: circularReferenceMatch[] = circularRefs
    .map((ref) => {
      let match =
        ref.match(
          /(?:.*)(?:#\/components\/schemas\/)(.*)(?:\/properties\/?)(.*)/
        ) ?? []
      let schema = match[1]
      let property = match[2]
      let isArray = false
      if (property.endsWith("/items")) {
        property = property.replace("/items", "")
        isArray = true
      }
      return { schema, property, isArray }
    })
    .filter((match) => match.property !== "")
    .map((match) => {
      const baseSchema = oas.components!.schemas![match.schema] as SchemaObject
      const propertySpec = match.isArray
        ? (baseSchema.properties![match.property] as SchemaObject).items!
        : baseSchema.properties![match.property]
      const referencedSchema = propertySpec["$ref"].match(
        /(?:#\/components\/schemas\/)(.*)/
      )![1]
      return {
        schema: match.schema,
        property: match.property,
        isArray: match.isArray,
        referencedSchema,
      }
    })

  const schemas = {}
  for (const match of matches) {
    if (!schemas.hasOwnProperty(match.schema)) {
      schemas[match.schema] = []
    }
    schemas[match.schema].push(match.referencedSchema)
  }
  return schemas
}

export const formatHintRecommendation = (
  recommendation: Record<string, string[]>
) => {
  return jsonObjectToYamlString({
    decorators: { "medusa/circular-patch": { schemas: recommendation } },
  })
}
