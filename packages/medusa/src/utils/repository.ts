import { flatten, groupBy, map, merge } from "lodash"
import { EntityMetadata, Repository, SelectQueryBuilder } from "typeorm"
import { FindWithoutRelationsOptions } from "../repositories/customer-group"

// TODO: All the utilities expect (applyOrdering) needs to be re worked depending on the outcome of the product repository

/**
 * Custom query entity, it is part of the creation of a custom findWithRelationsAndCount needs.
 * Allow to query the relations for the specified entity ids
 * @param repository
 * @param entityIds
 * @param groupedRelations
 * @param withDeleted
 * @param select
 */
export async function queryEntityWithIds<T>(
  repository: Repository<T>,
  entityIds: string[],
  groupedRelations: { [toplevel: string]: string[] },
  withDeleted = false,
  select: (keyof T)[] = []
): Promise<T[]> {
  const alias = repository.constructor.name
  return await Promise.all(
    Object.entries(groupedRelations).map(async ([toplevel, rels]) => {
      let querybuilder = repository.createQueryBuilder(`${alias}`)

      if (select && select.length) {
        querybuilder.select(select.map((f) => `${alias}.${f as string}`))
      }

      querybuilder = querybuilder.leftJoinAndSelect(
        `${alias}.${toplevel}`,
        toplevel
      )

      for (const rel of rels) {
        const [_, rest] = rel.split(".")
        if (!rest) {
          continue
        }
        // Regex matches all '.' except the rightmost
        querybuilder = querybuilder.leftJoinAndSelect(
          rel.replace(/\.(?=[^.]*\.)/g, "__"),
          rel.replace(".", "__")
        )
      }

      if (withDeleted) {
        querybuilder = querybuilder
          .where(`${alias}.id IN (:...entitiesIds)`, {
            entitiesIds: entityIds,
          })
          .withDeleted()
      } else {
        querybuilder = querybuilder.where(
          `${alias}.deleted_at IS NULL AND products.id IN (:...entitiesIds)`,
          {
            entitiesIds: entityIds,
          }
        )
      }

      return querybuilder.getMany()
    })
  ).then(flatten)
}

/**
 * Custom query entity without relations, it is part of the creation of a custom findWithRelationsAndCount needs.
 * Allow to query the entities without taking into account the relations. The relations will be queried separately
 * using the queryEntityWithIds util
 * @param repository
 * @param optionsWithoutRelations
 * @param shouldCount
 * @param customJoinBuilders
 */
export async function queryEntityWithoutRelations<T>(
  repository: Repository<T>,
  optionsWithoutRelations: FindWithoutRelationsOptions,
  shouldCount = false,
  customJoinBuilders: ((
    qb: SelectQueryBuilder<T>,
    alias: string
  ) => void)[] = []
): Promise<[T[], number]> {
  const alias = repository.constructor.name

  const qb = repository
    .createQueryBuilder(alias)
    .select([`${alias}.id`])
    .skip(optionsWithoutRelations.skip)
    .take(optionsWithoutRelations.take)

  if (optionsWithoutRelations.where) {
    qb.where(optionsWithoutRelations.where)
  }

  if (optionsWithoutRelations.order) {
    const toSelect: string[] = []
    const parsed = Object.entries(optionsWithoutRelations.order).reduce(
      (acc, [k, v]) => {
        const key = `${alias}.${k}`
        toSelect.push(key)
        acc[key] = v
        return acc
      },
      {}
    )
    qb.addSelect(toSelect)
    qb.orderBy(parsed)
  }

  for (const customJoinBuilder of customJoinBuilders) {
    customJoinBuilder(qb, alias)
  }

  if (optionsWithoutRelations.withDeleted) {
    qb.withDeleted()
  }

  let entities: T[]
  let count = 0
  if (shouldCount) {
    const result = await qb.getManyAndCount()
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
 * @param order
 * @param qb
 * @param alias
 * @param shouldJoin
 */
export function applyOrdering<T>({
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
  shouldJoin: (relation: string) => boolean // In case a join is applied elsewhere and therefore should not be re applied here
}) {
  const toSelect: string[] = []
  const parsed = Object.entries(order).reduce(
    (acc, [orderPath, orderDirection]) => {
      if (orderPath.includes(".")) {
        const relationsToJoin = orderPath.split(".")
        const propToOrder = relationsToJoin.pop()

        relationsToJoin.reduce(
          ([parent, parentMetadata], child) => {
            const relationMetadata = (
              parentMetadata as EntityMetadata
            ).relations.find(
              (relationMetadata) => relationMetadata.propertyName === child
            )
            const shouldApplyJoin = shouldJoin(child)
            if (shouldApplyJoin) {
              qb.leftJoin(`${parent}.${relationMetadata!.propertyPath}`, child)
            }
            return [child, relationMetadata!.inverseEntityMetadata]
          },
          [alias, repository.metadata]
        )

        const key = `${
          relationsToJoin[relationsToJoin.length - 1]
        }.${propToOrder}`
        acc[key] = orderDirection
        toSelect.push(key)
        return acc
      }

      const key = `${alias}.${orderPath}`
      toSelect.push(key)
      acc[key] = orderDirection
      return acc
    },
    {}
  )
  qb.addSelect(toSelect)
  qb.orderBy(parsed)
}
