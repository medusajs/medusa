import { OpenAPIObject } from "openapi3-ts/oas30"
import { compileErrors, validate } from "@readme/openapi-parser"
import { jsonObjectToYamlString, readYaml } from "./yaml-utils"

export const getCircularReferences = async (
  srcFile: string
): Promise<{ circularRefs: string[]; oas: OpenAPIObject }> => {
  const validation = await validate(srcFile)
  if (!validation.valid) {
    throw new Error(compileErrors(validation))
  }
  const oas = (await readYaml(srcFile)) as OpenAPIObject
  const circularRefs = [
    ...new Set(
      findCircularRefs(oas)
        .map((ref) => ref.match(/#\/components\/schemas\/.*/)?.[0])
        .filter((ref): ref is string => !!ref)
    ),
  ]
  circularRefs.sort()
  return { circularRefs, oas }
}

// @readme/openapi-parser's circular detection reports every ref that reaches a
// cycle, which would over-recommend patches. This reports only the ref that
// closes each cycle, and none for refs already resolved.
const findCircularRefs = (oas: OpenAPIObject): string[] => {
  const circularRefs: string[] = []
  const resolvedRefs = new Set<string>()
  const parents = new Set<unknown>()

  const resolvePointer = (ref: string): unknown =>
    ref
      .slice(2)
      .split("/")
      .map((key) =>
        decodeURIComponent(key).replace(/~1/g, "/").replace(/~0/g, "~")
      )
      .reduce<any>((current, key) => current?.[key], oas)

  const crawl = (node: unknown, path: string) => {
    if (!node || typeof node !== "object") {
      return
    }
    parents.add(node)
    for (const [key, value] of Object.entries(node)) {
      const keyPath = `${path}/${key.replace(/~/g, "~0").replace(/\//g, "~1")}`
      if (typeof value?.$ref !== "string") {
        crawl(value, keyPath)
        continue
      }
      const ref: string = value.$ref
      if (!ref.startsWith("#/") || resolvedRefs.has(ref)) {
        continue
      }
      const target = resolvePointer(ref)
      if (parents.has(target)) {
        circularRefs.push(keyPath)
      } else {
        crawl(target, ref)
      }
      if (Object.keys(value).length === 1) {
        resolvedRefs.add(ref)
      }
    }
    parents.delete(node)
  }

  crawl(oas, "#")
  return circularRefs
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
