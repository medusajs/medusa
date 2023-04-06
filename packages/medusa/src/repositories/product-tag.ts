import { In } from "typeorm"
import { ProductTag } from "../models/product-tag"
import { ExtendedFindConfig } from "../types/common"
import { dataSource } from "../loaders/database"
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity"

type UpsertTagsInput = (Partial<ProductTag> & {
  value: string
})[]

type ProductTagSelector = Partial<ProductTag> & {
  q?: string
  discount_condition_id?: string
}

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<ProductTag>,
  "relations"
>

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  where: DefaultWithoutRelations["where"] & {
    discount_condition_id?: string
  }
}

export const ProductTagRepository = dataSource
  .getRepository(ProductTag)
  .extend({
    async insertBulk(
      data: QueryDeepPartialEntity<ProductTag>[]
    ): Promise<ProductTag[]> {
      const queryBuilder = this.createQueryBuilder()
        .insert()
        .into(ProductTag)
        .values(data)

      if (!queryBuilder.connection.driver.isReturningSqlSupported("insert")) {
        const rawTags = await queryBuilder.execute()
        return rawTags.generatedMaps.map((d) => this.create(d)) as ProductTag[]
      }

      const rawTags = await queryBuilder.returning("*").execute()
      return rawTags.generatedMaps.map((d) => this.create(d))
    },

    async listTagsByUsage(take = 10): Promise<ProductTag[]> {
      const qb = this.createQueryBuilder("pt")
        .select(["id", "COUNT(pts.product_tag_id) as usage_count", "value"])
        .leftJoin("product_tags", "pts", "pt.id = pts.product_tag_id")
        .groupBy("id")
        .orderBy("usage_count", "DESC")
        .limit(take)

      return await qb.getRawMany()
    },

    async upsertTags(tags: UpsertTagsInput): Promise<ProductTag[]> {
      const tagsValues = tags.map((tag) => tag.value)
      const existingTags = await this.find({
        where: {
          value: In(tagsValues),
        },
      })
      const existingTagsMap = new Map(
        existingTags.map<[string, ProductTag]>((tag) => [tag.value, tag])
      )

      const upsertedTags: ProductTag[] = []
      const tagsToCreate: QueryDeepPartialEntity<ProductTag>[] = []

      for (const tag of tags) {
        const aTag = existingTagsMap.get(tag.value)
        if (aTag) {
          upsertedTags.push(aTag)
        } else {
          const newTag = this.create(tag)
          tagsToCreate.push(newTag as QueryDeepPartialEntity<ProductTag>)
        }
      }

      if (tagsToCreate.length) {
        const newTags = await this.insertBulk(tagsToCreate)
        upsertedTags.push(...newTags)
      }

      return upsertedTags
    },

    async findAndCountByDiscountConditionId(
      conditionId: string,
      query: ExtendedFindConfig<ProductTag>
    ) {
      return await this.createQueryBuilder("pt")
        .where(query.where)
        .setFindOptions(query)
        .innerJoin(
          "discount_condition_product_tag",
          "dc_pt",
          `dc_pt.product_tag_id = pt.id AND dc_pt.condition_id = :dcId`,
          { dcId: conditionId }
        )
        .getManyAndCount()
    },
  })

export default ProductTagRepository
