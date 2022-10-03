import { FindManyOptions, In, OrderByCondition } from "typeorm"
import { flatten, groupBy, map, merge } from "lodash"
import { ProductVariant } from "../models/product-variant"
import { dataSource } from "../loaders/database"

export type FindWithRelationsOptions = FindManyOptions<ProductVariant> & {
  order?: OrderByCondition
  withDeleted?: boolean
}

export const ProductVariantRepository = dataSource
  .getRepository(ProductVariant)
  .extend({
    async queryProductVariantsWithIds(
      entityIds: string[],
      groupedRelations: { [toplevel: string]: string[] },
      withDeleted = false
    ): Promise<ProductVariant[]> {
      return await Promise.all(
        Object.entries(groupedRelations).map(async ([toplevel, rels]) => {
          const querybuilder = this.createQueryBuilder("pv").leftJoinAndSelect(
            `pv.${toplevel}`,
            toplevel
          )

          for (const rel of rels) {
            const [_, rest] = rel.split(".")
            if (!rest) {
              continue
            }
            // Regex matches all '.' except the rightmost
            querybuilder.leftJoinAndSelect(
              rel.replace(/\.(?=[^.]*\.)/g, "__"),
              rel.replace(".", "__")
            )
          }

          if (withDeleted) {
            querybuilder
              .where("pv.id IN (:...entitiesIds)", {
                entitiesIds: entityIds,
              })
              .withDeleted()
          } else {
            querybuilder.where(
              "pv.deleted_at IS NULL AND pv.id IN (:...entitiesIds)",
              {
                entitiesIds: entityIds,
              }
            )
          }

          return querybuilder.getMany()
        })
      ).then(flatten)
    },

    async findWithRelationsAndCount(
      relations: string[] = [],
      idsOrOptionsWithoutRelations: FindWithRelationsOptions | string[] = {
        where: {},
      },
      withDeleted?: boolean
    ): Promise<[ProductVariant[], number]> {
      let count: number
      let entities: ProductVariant[]
      if (Array.isArray(idsOrOptionsWithoutRelations)) {
        entities = await this.find({
          where: {
            id: In(idsOrOptionsWithoutRelations),
          },
          withDeleted: withDeleted ?? false,
        })
        count = entities.length
      } else {
        const result = await this.queryProductsVariants_(
          idsOrOptionsWithoutRelations,
          true
        )
        entities = result[0]
        count = result[1]
      }
      const entitiesIds = entities.map(({ id }) => id)

      if (entitiesIds.length === 0) {
        // no need to continue
        return [[], count]
      }

      if (relations.length === 0) {
        const toReturn = await this.find({
          where: {
            id: In(entitiesIds),
            ...idsOrOptionsWithoutRelations,
          },
        })
        return [toReturn, toReturn.length]
      }

      const groupedRelations = this.getGroupedRelations_(
        relations as (keyof ProductVariant)[]
      )
      const entitiesIdsWithRelations = await this.queryProductVariantsWithIds(
        entitiesIds,
        groupedRelations,
        withDeleted
      )

      const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
      const entitiesToReturn =
        this.mergeEntitiesWithRelations_(entitiesAndRelations)

      return [entitiesToReturn, count]
    },

    async findWithRelations(
      relations: string[] = [],
      idsOrOptionsWithoutRelations: FindWithRelationsOptions | string[] = {},
      withDeleted = false
    ): Promise<ProductVariant[]> {
      let entities: ProductVariant[]
      if (Array.isArray(idsOrOptionsWithoutRelations)) {
        entities = await this.find({
          where: {
            id: In(idsOrOptionsWithoutRelations),
          },
          withDeleted: withDeleted ?? false,
        })
      } else {
        const result = await this.queryProductsVariants_(
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

      if (relations.length === 0) {
        return await this.find({
          where: {
            id: In(entitiesIds),
            ...idsOrOptionsWithoutRelations,
          },
        })
      }

      const groupedRelations = this.getGroupedRelations_(
        relations as (keyof ProductVariant)[]
      )
      const entitiesIdsWithRelations = await this.queryProductVariantsWithIds(
        entitiesIds,
        groupedRelations,
        withDeleted
      )

      const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
      return this.mergeEntitiesWithRelations_(entitiesAndRelations)
    },

    async findOneWithRelations(
      relations: Array<keyof ProductVariant> = [],
      optionsWithoutRelations: FindWithRelationsOptions = { where: {} }
    ): Promise<ProductVariant> {
      // Limit 1
      optionsWithoutRelations.take = 1

      const result = await this.findWithRelations(
        relations,
        optionsWithoutRelations
      )
      return result[0]
    },
    mergeEntitiesWithRelations_(
      entitiesAndRelations: Array<Partial<ProductVariant>>
    ): ProductVariant[] {
      const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
      return map(entitiesAndRelationsById, (entityAndRelations) =>
        merge({}, ...entityAndRelations)
      )
    },

    async queryProductsVariants_(
      optionsWithoutRelations: FindWithRelationsOptions,
      shouldCount = false
    ): Promise<[ProductVariant[], number]> {
      let qb = this.createQueryBuilder("pv")
        .select(["pv.id"])
        .skip(optionsWithoutRelations.skip)
        .take(optionsWithoutRelations.take)

      qb = optionsWithoutRelations.where
        ? qb.where(optionsWithoutRelations.where)
        : qb

      qb = optionsWithoutRelations.order
        ? qb.orderBy(optionsWithoutRelations.order)
        : qb

      if (optionsWithoutRelations.withDeleted) {
        qb = qb.withDeleted()
      }

      let entities: ProductVariant[]
      let count = 0
      if (shouldCount) {
        const result = await qb.getManyAndCount()
        entities = result[0]
        count = result[1]
      } else {
        entities = await qb.getMany()
      }

      return [entities, count]
    },

    getGroupedRelations_(relations: Array<keyof ProductVariant>): {
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
    },
  })
export default ProductVariantRepository
