import { DAL, FindConfigOrder } from "@medusajs/types"
import { isObject } from "../../../common"
import { SoftDeletableFilterKey } from "../mikro-orm-soft-deletable-filter"
import { buildExistsFilter, joinRequiresFilter } from "./filter-sql"
import { resolveCrossModuleJoins, ResolvedCrossModuleJoinSpec } from "./helpers"
import { transformOrderByForCrossModuleJoins } from "./order-sql"

export type AugmentFindOptionsWithCrossModuleJoinsArgs = {
  entityName: string
  entityTable: string
  primaryKey?: string
  defaultSchema?: string
}

const DEFAULT_SCHEMA = "public"

/**
 * Translates cross-module join metadata into MikroORM-compatible `where` and
 * `orderBy` clauses so callers can keep using `manager.find()` / `findAndCount()`.
 */
export function augmentFindOptionsWithCrossModuleJoins<const T>(
  findOptions: DAL.FindOptions<T>,
  {
    entityName,
    entityTable,
    primaryKey = "id",
    defaultSchema = DEFAULT_SCHEMA,
  }: AugmentFindOptionsWithCrossModuleJoinsArgs
): DAL.FindOptions<T> {
  const { crossModuleJoins, ...remainingInternal } =
    findOptions.options?.__internal ?? {}
  if (!crossModuleJoins?.length) {
    return findOptions
  }

  const resolvedJoins = resolveCrossModuleJoins(crossModuleJoins)

  const rootAlias = getMikroOrmRootAlias(entityName)
  const withDeleted = resolveWithDeleted(findOptions.options)
  const childrenByParent = buildChildrenByParent(resolvedJoins)
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

  const rootCorrelateSpec = {
    table: entityTable,
    alias: rootAlias,
    key: primaryKey,
  }

  const existsFilters = getRootJoins(resolvedJoins)
    .filter((joinSpec) => joinRequiresFilter(joinSpec, childrenByParent))
    .map((joinSpec) =>
      buildExistsFilter(joinSpec, rootCorrelateSpec, existsContext)
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
      resolvedJoins,
      rootCorrelateSpec,
      defaultSchema,
      withDeleted
    ) as typeof options.orderBy
  }

  return {
    where: where as DAL.FindOptions<T>["where"],
    options,
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
  crossModuleJoins: ResolvedCrossModuleJoinSpec[]
): Map<string, ResolvedCrossModuleJoinSpec[]> {
  const tableToAlias = new Map(
    crossModuleJoins.map((join) => [join.target.table, join.alias])
  )
  const childrenByParent = new Map<string, ResolvedCrossModuleJoinSpec[]>()

  for (const join of crossModuleJoins) {
    if (!join.parent) {
      continue
    }

    const parentAlias = tableToAlias.get(join.parent)
    if (!parentAlias) {
      continue
    }

    const siblings = childrenByParent.get(parentAlias) ?? []
    siblings.push(join)
    childrenByParent.set(parentAlias, siblings)
  }

  return childrenByParent
}

function getRootJoins(
  crossModuleJoins: ResolvedCrossModuleJoinSpec[]
): ResolvedCrossModuleJoinSpec[] {
  return crossModuleJoins.filter((join) => !join.parent)
}
