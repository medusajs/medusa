import { isDefined, isString } from "@medusajs/utils"

export type ResolvedFieldAlias = {
  path: string
  isList?: boolean
  forwardArgumentsOnPath?: string[]
  entity?: string
}

/**
 * Resolves a fieldAlias config entry (string, object, or entity-scoped array)
 * to the entry applicable for the current path's entity.
 */
export function resolveFieldAliasEntry(
  alias: unknown,
  currentPathEntity?: string
): ResolvedFieldAlias | undefined {
  if (!alias) {
    return undefined
  }

  if (Array.isArray(alias)) {
    if (!currentPathEntity) {
      return alias[0] as ResolvedFieldAlias
    }

    return (
      (alias.find((entry) => entry.entity == currentPathEntity) as
        | ResolvedFieldAlias
        | undefined) ?? (alias[0] as ResolvedFieldAlias)
    )
  }

  if (isString(alias)) {
    return { path: alias }
  }

  // Match legacy RemoteJoiner behavior: a singular entity-scoped alias object
  // is always applied when the property name hits. Entity filtering only
  // applies when multiple aliases share the same property (array form above).
  return alias as ResolvedFieldAlias
}

/**
 * Collects all defined values of `property` across items (flattens arrays).
 */
export function getNestedItems(items: any[], property: string): any[] {
  const result: unknown[] = []
  for (const item of items) {
    const allValues = item?.[property] ?? []
    const values = Array.isArray(allValues) ? allValues : [allValues]
    for (const value of values) {
      if (isDefined(value)) {
        result.push(value)
      }
    }
  }
  return result
}
