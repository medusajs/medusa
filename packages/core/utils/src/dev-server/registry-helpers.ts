import { ResourceEntry, ResourceMap, ResourcePath } from "./types"

export function getOrCreateRegistry(
  globalRegistry: Map<ResourcePath, ResourceMap>,
  sourcePath: string
): ResourceMap {
  let registry = globalRegistry.get(sourcePath)

  if (!registry) {
    registry = new Map<string, ResourceEntry[]>()
    globalRegistry.set(sourcePath, registry)
  }

  return registry
}

export function addToRegistry(
  registry: ResourceMap,
  type: string,
  entry: ResourceEntry
): void {
  const entries = registry.get(type) || []
  registry.set(type, [...entries, entry])
}

export function addToInverseRegistry(
  inverseRegistry: Map<string, string[]>,
  key: string,
  sourcePath: string
): void {
  const existing = inverseRegistry.get(key) || []
  const updated = Array.from(new Set([...existing, sourcePath]))
  inverseRegistry.set(key, updated)
}
