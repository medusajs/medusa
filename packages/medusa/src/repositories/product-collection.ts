import { EntityRepository, Repository } from "typeorm"
import { ProductCollection } from "../models"
import { ExtendedFindConfig, Selector } from "../types/common"
import { flatten, groupBy, map, merge } from "lodash"

export type ProductCollectionSelector = Selector<ProductCollection>

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<ProductCollection, ProductCollectionSelector>,
  "relations"
>

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  where: DefaultWithoutRelations["where"]
}

@EntityRepository(ProductCollection)
export class ProductCollectionRepository extends Repository<ProductCollection> {
  private static getGroupedRelations(relations: string[]): {
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

  public async findOneWithRelations(
    relations: string[] = [],
    optionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
  ): Promise<ProductCollection> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const result = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }

  public async findWithRelations(
    relations: string[] = [],
    idsOrOptionsWithoutRelations: FindWithoutRelationsOptions | string[] = {
      where: {},
    },
    withDeleted = false
  ): Promise<ProductCollection[]> {
    let entities: ProductCollection[]
    if (Array.isArray(idsOrOptionsWithoutRelations)) {
      entities = await this.findByIds(idsOrOptionsWithoutRelations, {
        withDeleted,
      })
    } else {
      const result = await this.queryProductCollections(
        idsOrOptionsWithoutRelations,
        false
      )
      entities = result[0]
    }
    const entitiesIds = entities.map(({ id }) => id)

    if (entitiesIds.length === 0) {
      // no need to continue
      return []
    }

    if (
      relations.length === 0 &&
      !Array.isArray(idsOrOptionsWithoutRelations)
    ) {
      return await this.findByIds(entitiesIds, idsOrOptionsWithoutRelations)
    }

    const groupedRelations =
      ProductCollectionRepository.getGroupedRelations(relations)
    const entitiesIdsWithRelations = await this.queryProductCollectionsWithIds(
      entitiesIds,
      groupedRelations,
      withDeleted
    )

    const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)

    return this.mergeEntitiesWithRelations(entitiesAndRelations)
  }

  private async queryProductCollections(
    optionsWithoutRelations: FindWithoutRelationsOptions,
    shouldCount = false
  ): Promise<[ProductCollection[], number]> {
    const qb = this.createQueryBuilder("product_collection")
      .select(["product_collection.id"])
      .skip(optionsWithoutRelations.skip)
      .take(optionsWithoutRelations.take)

    if (optionsWithoutRelations.where) {
      qb.where(optionsWithoutRelations.where)
    }

    if (optionsWithoutRelations.order) {
      const toSelect: string[] = []
      const parsed = Object.entries(optionsWithoutRelations.order).reduce(
        (acc, [k, v]) => {
          const key = `product_collection.${k}`
          toSelect.push(key)
          acc[key] = v
          return acc
        },
        {}
      )
      qb.addSelect(toSelect)
      qb.orderBy(parsed)
    }

    if (optionsWithoutRelations.withDeleted) {
      qb.withDeleted()
    }

    let entities: ProductCollection[]
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

  private async queryProductCollectionsWithIds(
    entityIds: string[],
    groupedRelations: { [toplevel: string]: string[] },
    withDeleted = false,
    select: (keyof ProductCollection)[] = []
  ): Promise<ProductCollection[]> {
    return await Promise.all(
      Object.entries(groupedRelations).map(([toplevel, rels]) => {
        let querybuilder = this.createQueryBuilder("product_collections")

        if (select && select.length) {
          querybuilder.select(select.map((f) => `product_collections.${f}`))
        }

        querybuilder = querybuilder.leftJoinAndSelect(
          `product_collections.${toplevel}`,
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
            .where("product_collections.id IN (:...entitiesIds)", {
              entitiesIds: entityIds,
            })
            .withDeleted()
        } else {
          querybuilder = querybuilder.where(
            "product_collections.deleted_at IS NULL AND product_collections.id IN (:...entitiesIds)",
            {
              entitiesIds: entityIds,
            }
          )
        }

        return querybuilder.getMany()
      })
    ).then(flatten)
  }

  private mergeEntitiesWithRelations(
    entitiesAndRelations: Array<Partial<ProductCollection>>
  ): ProductCollection[] {
    const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
    return map(entitiesAndRelationsById, (entityAndRelations) =>
      merge({}, ...entityAndRelations)
    )
  }
}
