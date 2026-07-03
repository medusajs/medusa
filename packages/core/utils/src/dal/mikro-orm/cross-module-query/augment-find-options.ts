import { CrossModuleJoinSpec, DAL, FindConfigOrder } from "@medusajs/types"
import { isObject, MedusaError } from "../../../common"
import { SoftDeletableFilterKey } from "../mikro-orm-soft-deletable-filter"
import { buildExistsFilter, joinRequiresFilter } from "./filter-sql"
import { DEFAULT_SCHEMA } from "./helpers"
import { transformOrderByForCrossModuleJoins } from "./order-sql"

export type AugmentFindOptionsWithCrossModuleJoinsArgs = {
  entityName: string
  primaryKey?: string
  defaultSchema?: string
}

/**
 * Translates cross-module join metadata into MikroORM-compatible `where` and
 * `orderBy` clauses so callers can keep using `manager.find()` / `findAndCount()`.
 */
export function augmentFindOptionsWithCrossModuleJoins<const T>(
  findOptions: DAL.FindOptions<T>,
  {
    entityName,
    primaryKey = "id",
    defaultSchema = DEFAULT_SCHEMA,
  }: AugmentFindOptionsWithCrossModuleJoinsArgs
): DAL.FindOptions<T> {
  const { crossModuleJoins, ...remainingInternal } =
    findOptions.options?.__internal ?? {}
  if (!crossModuleJoins?.length) {
    return findOptions
  }

  assertValidCrossModuleJoins(crossModuleJoins)

  const rootAlias = getMikroOrmRootAlias(entityName)
  const withDeleted = resolveWithDeleted(findOptions.options)
  const childrenByParent = buildChildrenByParent(crossModuleJoins)
  const existsContext = {
    linkAliasCounter: { value: 0 },
    childrenByParent,
    defaultSchema,
    withDeleted,
  }

  const options = {
    ...findOptions.options,
  }
  if (Object.keys(remainingInternal).length) {
    options.__internal = remainingInternal
  } else {
    delete options.__internal
  }

  const existsFilters = getRootJoins(crossModuleJoins)
    .filter((joinSpec) => joinRequiresFilter(joinSpec, childrenByParent))
    .map((joinSpec) =>
      buildExistsFilter(joinSpec, rootAlias, primaryKey, existsContext)
    )

  let where = {
    ...(findOptions.where ?? {}),
  } as Record<string, unknown>

  if (existsFilters.length) {
    where =
      Object.keys(where).length > 0
        ? {
            $and: [where, ...existsFilters],
          }
        : {
            $and: existsFilters,
          }
  }

  if (options.orderBy) {
    options.orderBy = transformOrderByForCrossModuleJoins(
      options.orderBy as FindConfigOrder | FindConfigOrder[],
      crossModuleJoins,
      primaryKey,
      rootAlias,
      defaultSchema,
      withDeleted
    ) as typeof options.orderBy
  }

  return {
    where: where as DAL.FindOptions<T>["where"],
    options,
  }
}

function assertValidCrossModuleJoins(
  crossModuleJoins: CrossModuleJoinSpec[]
): void {
  assertUniqueAliases(crossModuleJoins)

  const aliases = new Set(crossModuleJoins.map((join) => join.alias))

  for (const join of crossModuleJoins) {
    if (!join.parent) {
      continue
    }

    if (join.parent === join.alias) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cross-module join "${join.alias}" cannot be its own parent.`
      )
    }

    if (!aliases.has(join.parent)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cross-module join "${join.alias}" references unknown parent "${join.parent}".`
      )
    }
  }
}

function assertUniqueAliases(crossModuleJoins: CrossModuleJoinSpec[]): void {
  const seen = new Set<string>()

  for (const join of crossModuleJoins) {
    if (seen.has(join.alias)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Duplicate cross-module join alias "${join.alias}". Each cross-module join must use a unique alias.`
      )
    }
    seen.add(join.alias)
  }
}

// TODO: What happens if two entities have the same first character?
// See if we can use their actual naming alias generation here
/**
 * MikroORM's default naming strategy uses the first character of the entity
 * class name plus the alias counter. The root entity in `find()` always uses
 * counter 0 (e.g. CustomerEntity -> "c0", PricingTierEntity -> "p0").
 */
function getMikroOrmRootAlias(entityName: string): string {
  return entityName.charAt(0).toLowerCase() + "0"
}

/**
 * Resolve whether the current query includes soft-deleted rows, mirroring the
 * `softDeletable` MikroORM filter that `buildQuery` sets from `withDeleted`.
 */
function resolveWithDeleted(
  options: DAL.FindOptions<any>["options"] | undefined
): boolean {
  const filters = options?.filters

  if (!isObject(filters)) {
    return false
  }

  const softDeletable = (filters as Record<string, unknown>)[
    SoftDeletableFilterKey
  ]

  return isObject(softDeletable) && (softDeletable as any).withDeleted === true
}

function buildChildrenByParent(
  crossModuleJoins: CrossModuleJoinSpec[]
): Map<string, CrossModuleJoinSpec[]> {
  const childrenByParent = new Map<string, CrossModuleJoinSpec[]>()

  for (const join of crossModuleJoins) {
    if (!join.parent) {
      continue
    }

    const siblings = childrenByParent.get(join.parent) ?? []
    siblings.push(join)
    childrenByParent.set(join.parent, siblings)
  }

  return childrenByParent
}

function getRootJoins(
  crossModuleJoins: CrossModuleJoinSpec[]
): CrossModuleJoinSpec[] {
  return crossModuleJoins.filter((join) => !join.parent)
}
