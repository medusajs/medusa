import { EntityClass, EntityProperty } from "@mikro-orm/core/typings"
import { EntityMetadata, EntitySchema, ReferenceType } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import type { FindOneOptions, FindOptions } from "@mikro-orm/core/drivers"

export const FreeTextSearchFilterKey = "freeTextSearch"

interface FilterArgument {
  value: string
  fromEntity: string
}

function getEntityProperties(entity: EntityClass<any> | EntitySchema): {
  [key: string]: EntityProperty<any>
} {
  return (
    (entity as EntityClass<any>)?.prototype.__meta?.properties ??
    (entity as EntitySchema).meta?.properties
  )
}

function retrieveRelationsConstraints(
  relation: {
    targetMeta?: EntityMetadata
    searchable?: boolean
    mapToPk?: boolean
    type: string
    name: string
  },
  models: (EntityClass<any> | EntitySchema)[],
  searchValue: string,
  visited: Set<string> = new Set(),
  shouldStop: boolean = false
) {
  if (shouldStop || !relation.searchable) {
    return
  }

  const relationClassName = relation.targetMeta!.className

  visited.add(relationClassName)

  const relationFreeTextSearchWhere: any = []

  const relationClass = models.find((m) => m.name === relation.type)!
  const relationProperties = getEntityProperties(relationClass)

  for (const propertyConfiguration of Object.values(relationProperties)) {
    if (
      !(propertyConfiguration as any).searchable ||
      propertyConfiguration.reference !== ReferenceType.SCALAR
    ) {
      continue
    }

    relationFreeTextSearchWhere.push({
      [propertyConfiguration.name]: {
        $ilike: `%${searchValue}%`,
      },
    })
  }

  const innerRelations: EntityProperty[] =
    (relationClass as EntityClass<any>)?.prototype.__meta?.relations ??
    (relationClass as EntitySchema).meta?.relations

  for (const innerRelation of innerRelations) {
    const branchVisited = new Set(Array.from(visited))
    const innerRelationClassName = innerRelation.targetMeta!.className
    const isSelfCircularDependency =
      innerRelationClassName === relationClassName

    if (
      !isSelfCircularDependency &&
      branchVisited.has(innerRelationClassName)
    ) {
      continue
    }

    branchVisited.add(innerRelationClassName)

    const innerRelationName = !innerRelation.mapToPk
      ? innerRelation.name
      : relation.targetMeta!.relations.find(
          (r) => r.type === innerRelation.type && !r.mapToPk
        )?.name

    if (!innerRelationName) {
      throw new Error(
        `Unable to retrieve the counter part relation definition for the mapToPk relation ${innerRelation.name} on entity ${relation.name}`
      )
    }

    const relationConstraints = retrieveRelationsConstraints(
      {
        name: innerRelationName,
        targetMeta: innerRelation.targetMeta,
        searchable: (innerRelation as any).searchable,
        mapToPk: innerRelation.mapToPk,
        type: innerRelation.type,
      },
      models,
      searchValue,
      branchVisited,
      isSelfCircularDependency
    )

    if (!relationConstraints?.length) {
      continue
    }

    relationFreeTextSearchWhere.push({
      [innerRelationName]: {
        $or: relationConstraints,
      },
    })
  }

  return relationFreeTextSearchWhere
}

export const mikroOrmFreeTextSearchFilterOptionsFactory = (
  models: (EntityClass<any> | EntitySchema)[]
) => {
  return {
    cond: (
      freeTextSearchArgs: FilterArgument,
      operation: string,
      manager: SqlEntityManager,
      options?: (FindOptions<any, any> | FindOneOptions<any, any>) & {
        visited?: Set<EntityClass<any>>
      }
    ) => {
      if (!freeTextSearchArgs || !freeTextSearchArgs.value) {
        return {}
      }

      const { value, fromEntity } = freeTextSearchArgs

      if (options?.visited?.size) {
        /**
         * When being in select in strategy, the filter gets applied to all queries even the ones that are not related to the entity
         */
        const hasFilterAlreadyBeenAppliedForEntity = [
          ...options.visited.values(),
        ].some((v) => v.constructor.name === freeTextSearchArgs.fromEntity)
        if (hasFilterAlreadyBeenAppliedForEntity) {
          return {}
        }
      }

      const entityMetadata = manager.getDriver().getMetadata().get(fromEntity)

      const freeTextSearchWhere = retrieveRelationsConstraints(
        {
          targetMeta: entityMetadata,
          mapToPk: false,
          searchable: true,
          type: fromEntity,
          name: entityMetadata.name!,
        },
        models,
        value
      )

      if (!freeTextSearchWhere.length) {
        return {}
      }

      return {
        $or: freeTextSearchWhere,
      }
    },
    default: true,
    args: false,
    entity: models.map((m) => m.name) as string[],
  }
}
