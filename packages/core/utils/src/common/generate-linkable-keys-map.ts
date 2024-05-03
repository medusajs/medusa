import { MapToConfig } from "./map-object-to"

export function generateLinkableKeysMap(
  linkableKeys: Record<string, string>
): MapToConfig {
  const entityLinkableKeysMap: MapToConfig = {}

  Object.entries(linkableKeys).forEach(([key, value]) => {
    entityLinkableKeysMap[value] ??= []
    entityLinkableKeysMap[value].push({
      mapTo: key,
      valueFrom: key.split("_").pop()!,
    })
  })

  return entityLinkableKeysMap
}
