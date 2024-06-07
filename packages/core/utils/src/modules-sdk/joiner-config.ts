import { ModuleJoinerConfig } from "@medusajs/types"
import {
  camelToSnakeCase,
  MapToConfig,
  pluralize,
  upperCaseFirst,
} from "../common"

/**
 * Define joiner config for a module
 * @param moduleName
 * @param publicEntityObjects the first entity object is considered the main one meaning it will be consumed through non suffixed method such as list and listAndCount
 * @param linkableKeys
 * @param primaryKeys
 */
export function defineJoinerConfig(
  moduleName: string,
  {
    publicEntityObjects,
    linkableKeys,
    primaryKeys,
  }: {
    publicEntityObjects: { name: string }[]
    linkableKeys?: Record<string, string>
    primaryKeys?: string[]
  } = {
    publicEntityObjects: [],
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
    linkableKeys:
      linkableKeys ??
      publicEntityObjects.reduce((acc, entity) => {
        acc[`${camelToSnakeCase(entity.name).toLowerCase()}_id`] = entity.name
        return acc
      }, {} as Record<string, string>),
    alias: publicEntityObjects.map((entity, i) => ({
      name: [
        `${camelToSnakeCase(entity.name).toLowerCase()}`,
        `${pluralize(camelToSnakeCase(entity.name).toLowerCase())}`,
      ],
      args: {
        entity: entity.name,
        methodSuffix:
          i === 0 ? undefined : pluralize(upperCaseFirst(entity.name)),
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
