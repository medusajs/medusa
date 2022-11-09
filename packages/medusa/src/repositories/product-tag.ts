import { EntityRepository, In, Repository } from "typeorm"
import { ProductTag } from "../models/product-tag"
import { ExtendedFindConfig, Selector } from "../types/common"

type UpsertTagsInput = (Partial<ProductTag> & {
  value: string
})[]

type ProductTagSelector = Partial<ProductTag> & {
  q?: string
  discount_condition_id?: string
}

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<ProductTag, ProductTagSelector>,
  "relations"
>

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
  where: DefaultWithoutRelations["where"] & {
    discount_condition_id?: string
  }
}

@EntityRepository(ProductTag)
export class ProductTagRepository extends Repository<ProductTag> {
  public async listTagsByUsage(count = 10): Promise<ProductTag[]> {
    return await this.query(
      `
          SELECT id, COUNT(pts.product_tag_id) as usage_count, pt.value
          FROM product_tag pt
                   LEFT JOIN product_tags pts ON pt.id = pts.product_tag_id
          GROUP BY id
          ORDER BY usage_count DESC
              LIMIT $1
      `,
      [count]
    )
  }

  public async upsertTags(tags: UpsertTagsInput): Promise<ProductTag[]> {
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

    for (const tag of tags) {
      const aTag = existingTagsMap.get(tag.value)
      if (aTag) {
        upsertedTags.push(aTag)
      } else {
        const newTag = this.create(tag)
        const savedTag = await this.save(newTag)
        upsertedTags.push(savedTag)
      }
    }

    return upsertedTags
  }

  async findAndCountByDiscountConditionId(
    conditionId: string,
    query: ExtendedFindConfig<ProductTag, Selector<ProductTag>>
  ) {
    const qb = this.createQueryBuilder("pt")

    if (query?.select) {
      qb.select(query.select.map((select) => `pt.${select}`))
    }

    if (query.skip) {
      qb.skip(query.skip)
    }

    if (query.take) {
      qb.take(query.take)
    }

    return await qb
      .where(query.where)
      .innerJoin(
        "discount_condition_product_tag",
        "dc_pt",
        `dc_pt.product_tag_id = pt.id AND dc_pt.condition_id = :dcId`,
        { dcId: conditionId }
      )
      .getManyAndCount()
  }
}
