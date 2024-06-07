import { ModuleJoinerConfig } from "@medusajs/types"
import { camelToSnakeCase, MapToConfig, pluralize } from "../common"

/**
 * Define joiner config for a module
 * @param moduleName
 * @param publicEntityObject
 * @param primaryKeys
 */
export function defineJoinerConfig(
  moduleName: string,
  {
    publicEntityObject,
    primaryKeys,
  }: { publicEntityObject: { name: string }[]; primaryKeys?: string[] } = {
    publicEntityObject: [],
  }
): Omit<
  ModuleJoinerConfig,
  "serviceName" | "primaryKeys" | "linkableKeys" | "alias"
> &
  Required<
    Pick<
      ModuleJoinerConfig,
      "serviceName" | "primaryKeys" | "linkableKeys" | "alias"
    >
  > {
  return {
    serviceName: moduleName,
    primaryKeys: primaryKeys ?? ["id"],
    linkableKeys: publicEntityObject.reduce((acc, entity) => {
      acc[camelToSnakeCase(entity).toLowerCase()] = entity.name
      return acc
    }, {} as Record<string, string>),
    alias: publicEntityObject.map((entity) => ({
      name: [
        `${camelToSnakeCase(entity).toLowerCase().name}`,
        `${pluralize(camelToSnakeCase(entity).toLowerCase().name)}`,
      ],
      args: {
        entity: entity.name,
        methodSuffix: pluralize(
          camelToSnakeCase(entity.name).toLowerCase().name
        ),
      },
    })),
  }
}

/**
 * Build entities name to linkable keys map
 * @param linkableKeys
 */
export function buildEntitiesNameToLinkableKeysMap(
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
