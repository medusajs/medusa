import { OpenAPIObject } from "openapi3-ts/oas30"
import $RefParser from "@readme/json-schema-ref-parser"
import { compileErrors, validate } from "@readme/openapi-parser"
import { jsonObjectToYamlString } from "./yaml-utils"

export const getCircularReferences = async (
  srcFile: string
): Promise<{ circularRefs: string[]; oas: OpenAPIObject }> => {
  const validation = await validate(srcFile)
  if (!validation.valid) {
    throw new Error(compileErrors(validation))
  }
  // @readme/openapi-parser's own circular detection reports every path through
  // a cycle, which would over-recommend patches; this keeps one edge per cycle.
  const parser = new $RefParser()
  const oas = (await parser.dereference(srcFile, {
    dereference: {
      circular: "ignore",
    },
  })) as OpenAPIObject
  if (parser.$refs.circular) {
    let circularRefs = parser.$refs.circularRefs.map(
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
): CircularReferenceSchema => {
  const schemaPointerPrefix = "#/components/schemas/"
  const schemas: CircularReferenceSchema = {}
  for (const ref of circularRefs) {
    const path = ref
      .slice(ref.indexOf(schemaPointerPrefix) + schemaPointerPrefix.length)
      .split("/")
    const node = path.reduce<any>(
      (current, key) => current?.[key],
      oas.components?.schemas
    )
    const referencedSchema = node?.$ref?.match(
      /#\/components\/schemas\/(.*)/
    )?.[1]
    if (!referencedSchema) {
      continue
    }
    const schema = path[0]
    schemas[schema] ??= []
    if (!schemas[schema].includes(referencedSchema)) {
      schemas[schema].push(referencedSchema)
    }
  }
  return schemas
}

export const formatHintRecommendation = (
  recommendation: CircularReferenceSchema
) => {
  return jsonObjectToYamlString({
    decorators: { "medusa/circular-patch": { schemas: recommendation } },
  })
}
