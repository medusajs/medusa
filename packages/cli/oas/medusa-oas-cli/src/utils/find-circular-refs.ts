import { OpenAPIObject } from "openapi3-ts/oas30"

// @readme/openapi-parser's circular detection reports every ref that reaches a
// cycle, which would over-recommend patches. This reports only the ref that
// closes each cycle, and none for refs already resolved.
export const findCircularRefs = (oas: OpenAPIObject): string[] => {
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
      // External refs are skipped: `docs` passes a Redocly bundle, where
      // every ref is local.
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
