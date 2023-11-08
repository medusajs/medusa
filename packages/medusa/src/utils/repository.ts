import { promiseAll } from "@medusajs/utils"
import { flatten, groupBy, map, merge } from "lodash"
import {
  EntityMetadata,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from "typeorm"
import { ExtendedFindConfig } from "../types/common"

// Regex matches all '.' except the rightmost
export const positiveLookaheadDotReplacer = new RegExp(/\.(?=[^.]*\.)/, "g")
// Replace all '.' with '__' to avoid typeorm's automatic aliasing
export const dotReplacer = new RegExp(/\./, "g")

/**
 * Custom query entity, it is part of the creation of a custom findWithRelationsAndCount needs.
 * Allow to query the relations for the specified entity ids
 *
 * @param repository
 * @param entityIds
 * @param groupedRelations
 * @param withDeleted
 * @param select
 * @param customJoinBuilders
 */
export async function queryEntityWithIds<T extends ObjectLiteral>({
  repository,
  entityIds,
  groupedRelations,
  withDeleted = false,
  select = [],
  customJoinBuilders = [],
}: {
  repository: Repository<T>
  entityIds: string[]
  groupedRelations: { [toplevel: string]: string[] }
  withDeleted?: boolean
  select?: (keyof T)[]
  customJoinBuilders?: ((
    qb: SelectQueryBuilder<T>,
    alias: string,
    toplevel: string
  ) => false | undefined)[]
}): Promise<T[]> {
  const alias = repository.metadata.name.toLowerCase()
  return await promiseAll(
    Object.entries(groupedRelations).map(
      async ([toplevel, topLevelRelations]) => {
        let querybuilder = repository.createQueryBuilder(alias)

        if (select?.length) {
          querybuilder.select(
            (select as string[])
              .filter(function (s) {
                return s.startsWith(toplevel) || !s.includes(".")
              })
              .map((column) => {
                // In case the column is the toplevel relation, we need to replace the dot with a double underscore if it also contains top level relations
                if (column.includes(toplevel)) {
                  return topLevelRelations.some((rel) => column.includes(rel))
                    ? column.replace(positiveLookaheadDotReplacer, "__")
                    : column
                }
                return `${alias}.${column}`
              })
          )
        }

        let shouldAttachDefault: boolean | undefined = true
        for (const customJoinBuilder of customJoinBuilders) {
          const result = customJoinBuilder(querybuilder, alias, toplevel)
          if (result === undefined) {
            continue
          }

          shouldAttachDefault = shouldAttachDefault && result
        }

        if (shouldAttachDefault) {
          const regexp = new RegExp(`^${toplevel}\\.\\w+$`)
          const joinMethod = (select as string[]).filter(
            (key) => !!key.match(regexp)
          ).length
            ? "leftJoin"
            : "leftJoinAndSelect"

          querybuilder = querybuilder[joinMethod](
            `${alias}.${toplevel}`,
            toplevel
          )
        }

        for (const rel of topLevelRelations) {
          const [_, rest] = rel.split(".")
          if (!rest) {
            continue
          }

          const regexp = new RegExp(`^${rel}\\.\\w+$`)
          const joinMethod = (select as string[]).filter(
            (key) => !!key.match(regexp)
          ).length
            ? "leftJoin"
            : "leftJoinAndSelect"

          querybuilder = querybuilder[joinMethod](
            rel.replace(positiveLookaheadDotReplacer, "__"),
            rel.replace(dotReplacer, "__")
          )
        }

        querybuilder = querybuilder.where(`${alias}.id IN (:...entitiesIds)`, {
          entitiesIds: entityIds,
        })

        if (withDeleted) {
          querybuilder.withDeleted()
        }

        return querybuilder.getMany()
      }
    )
  ).then(flatten)
}

/**
 * Custom query entity without relations, it is part of the creation of a custom findWithRelationsAndCount needs.
 * Allow to query the entities without taking into account the relations. The relations will be queried separately
 * using the queryEntityWithIds util
 *
 * @param repository
 * @param optionsWithoutRelations
 * @param shouldCount
 * @param customJoinBuilders
 */
export async function queryEntityWithoutRelations<T extends ObjectLiteral>({
  repository,
  optionsWithoutRelations,
  shouldCount = false,
  customJoinBuilders = [],
}: {
  repository: Repository<T>
  optionsWithoutRelations: Omit<ExtendedFindConfig<T>, "relations">
  shouldCount: boolean
  customJoinBuilders: ((
    qb: SelectQueryBuilder<T>,
    alias: string
  ) => Promise<{ relation: string; preventOrderJoin: boolean } | void>)[]
}): Promise<[T[], number]> {
  const alias = repository.metadata.name.toLowerCase()

  const qb = repository
    .createQueryBuilder(alias)
    .select([`${alias}.id`])
    .skip(optionsWithoutRelations.skip)
    .take(optionsWithoutRelations.take)

  if (optionsWithoutRelations.where) {
    qb.where(optionsWithoutRelations.where)
  }

  const shouldJoins: { relation: string; shouldJoin: boolean }[] = []
  for (const customJoinBuilder of customJoinBuilders) {
    const result = await customJoinBuilder(qb, alias)
    if (result) {
      shouldJoins.push({
        relation: result.relation,
        shouldJoin: !result.preventOrderJoin,
      })
    }
  }

  applyOrdering({
    repository,
    order: (optionsWithoutRelations.order as any) ?? {},
    qb,
    alias,
    shouldJoin: (relationToJoin) => {
      return shouldJoins.every(
        ({ relation, shouldJoin }) =>
          relation !== relationToJoin ||
          (relation === relationToJoin && shouldJoin)
      )
    },
  })

  if (optionsWithoutRelations.withDeleted) {
    qb.withDeleted()
  }

  let entities: T[]
  let count = 0
  if (shouldCount) {
    const result = await promiseAll([qb.getMany(), qb.getCount()])
    entities = result[0]
    count = result[1]
  } else {
    entities = await qb.getMany()
  }

  return [entities, count]
}

/**
 * Grouped the relation to the top level entity
 * @param relations
 */
export function getGroupedRelations(relations: string[]): {
  [toplevel: string]: string[]
} {
  const groupedRelations: { [toplevel: string]: string[] } = {}
  for (const rel of relations) {
    const [topLevel] = rel.split(".")
    if (groupedRelations[topLevel]) {
      groupedRelations[topLevel].push(rel)
    } else {
      groupedRelations[topLevel] = [rel]
    }
  }

  return groupedRelations
}

/**
 * Merged the entities and relations that composed by the result of queryEntityWithIds and queryEntityWithoutRelations
 * call
 * @param entitiesAndRelations
 */
export function mergeEntitiesWithRelations<T>(
  entitiesAndRelations: Array<Partial<T>>
): T[] {
  const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
  return map(entitiesAndRelationsById, (entityAndRelations) =>
    merge({}, ...entityAndRelations)
  )
}

/**
 * Apply the appropriate order depending on the requirements
 * @param repository
 * @param order The field on which to apply the order (e.g { "variants.prices.amount": "DESC" })
 * @param qb
 * @param alias
 * @param shouldJoin In case a join is already applied elsewhere and therefore you want to avoid to re joining the data in that case you can return false for specific relations
 */
export function applyOrdering<T extends ObjectLiteral>({
  repository,
  order,
  qb,
  alias,
  shouldJoin,
}: {
  repository: Repository<T>
  order: Record<string, "ASC" | "DESC">
  qb: SelectQueryBuilder<T>
  alias: string
  shouldJoin: (relation: string) => boolean
}) {
  const toSelect: string[] = []

  const parsed = Object.entries(order).reduce(
    (acc, [orderPath, orderDirection]) => {
      // If the orderPath (e.g variants.prices.amount) includes a point it means that it is to access
      // a child relation of an unknown depth
      if (orderPath.includes(".")) {
        // We are spliting the path and separating the relations from the property to order. (e.g relations ["variants", "prices"] and property "amount"
        const relationsToJoin = orderPath.split(".")
        const propToOrder = relationsToJoin.pop()

        // For each relation we will retrieve the metadata in order to use the right property name from the relation registered in the entity.
        // Each time we will return the child (i.e the relation) and the inverse metadata (corresponding to the child metadata from the parent point of view)
        // In order for the next child to know its parent
        relationsToJoin.reduce(
          ([parent, parentMetadata], child) => {
            // Find the relation metadata from the parent entity
            const relationMetadata = (
              parentMetadata as EntityMetadata
            ).relations.find(
              (relationMetadata) => relationMetadata.propertyName === child
            )

            // The consumer can refuse to apply a join on a relation if the join has already been applied before calling this util
            const shouldApplyJoin = shouldJoin(child)
            if (shouldApplyJoin) {
              qb.leftJoin(`${parent}.${relationMetadata!.propertyPath}`, child)
            }

            // Return the child relation to be the parent for the next one, as well as the metadata corresponding the child in order
            // to find the next relation metadata for the next child
            return [child, relationMetadata!.inverseEntityMetadata]
          },
          [alias, repository.metadata]
        )

        // The key for variants.prices.amount will be "prices.amount" since we are ordering on the join added to its parent "variants" in this example
        const key = `${
          relationsToJoin[relationsToJoin.length - 1]
        }.${propToOrder}`
        acc[key] = orderDirection
        toSelect.push(key)
        return acc
      }

      const key = `${alias}.${orderPath}`
      // Prevent ambiguous column error when top level entity id is ordered
      if (orderPath !== "id") {
        toSelect.push(key)
      }
      acc[key] = orderDirection
      return acc
    },
    {}
  )
  qb.addSelect(toSelect)
  qb.orderBy(parsed)
}
