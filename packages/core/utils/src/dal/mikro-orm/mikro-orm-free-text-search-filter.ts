import type {
  EntityClass,
  EntityProperty,
  FindOneOptions,
  FindOptions,
  EntityMetadata,
} from "@medusajs/deps/mikro-orm/core"
import { raw, ReferenceKind } from "@medusajs/deps/mikro-orm/postgresql"
import { SqlEntityManager } from "@medusajs/deps/mikro-orm/postgresql"

export const FreeTextSearchFilterKeyPrefix = "freeTextSearch_"

interface FilterArgument {
  value: string
  fromEntity: string
}

function getEntityProperties(metadata: EntityMetadata<any>): {
  [key: string]: EntityProperty<any>
} {
  return metadata.properties
}

function retrieveRelationsConstraints(
  relation: {
    targetMeta?: EntityMetadata
    searchable?: boolean
    mapToPk?: boolean
    type: string
    name: string
  },
  metadata: EntityMetadata<any>,
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

  const relationProperties = getEntityProperties(metadata)

  for (const propertyConfiguration of Object.values(relationProperties)) {
    if (
      !(propertyConfiguration as any).searchable ||
      propertyConfiguration.kind !== ReferenceKind.SCALAR
    ) {
      continue
    }

    const isText = propertyConfiguration?.columnTypes?.includes("text")

    const columnName = isText
      ? propertyConfiguration.name
      : raw((alias) => `cast(${alias}.${propertyConfiguration.name} as text)`)

    relationFreeTextSearchWhere.push({
      [columnName]: {
        $ilike: `%${searchValue}%`,
      },
    })
  }

  const innerRelations: EntityProperty[] = metadata.relations

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
      innerRelation.targetMeta!,
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

export const mikroOrmFreeTextSearchFilterOptionsFactory = (model: string) => {
  return {
    name: FreeTextSearchFilterKeyPrefix + model,
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

      const { value } = freeTextSearchArgs
      const tokens = value.split(/\s+/).filter(Boolean)

      if (tokens.length === 0) {
        return {}
      }

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

      const entityMetadata = manager.getDriver().getMetadata().get(model)

      const andConditions = tokens
        .map((token) => {
          const freeTextSearchWhere = retrieveRelationsConstraints(
            {
              targetMeta: entityMetadata,
              mapToPk: false,
              searchable: true,
              type: model,
              name: entityMetadata.name!,
            },
            entityMetadata,
            token
          )

          if (!freeTextSearchWhere.length) {
            return null
          }

          return {
            $or: freeTextSearchWhere,
          }
        })
        .filter((condition): condition is { $or: any[] } => !!condition)

      if (!andConditions.length) {
        return {}
      }

      return andConditions.length === 1
        ? andConditions[0]
        : {
            $and: andConditions,
          }
    },
  }
}
