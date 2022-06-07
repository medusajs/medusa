import { EntityRepository, In, Repository } from "typeorm"
import { ProductTag } from "../models/product-tag"

type UpsertTagsInput = (Partial<ProductTag> & {
  value: string
})[]

@EntityRepository(ProductTag)
export class ProductTagRepository extends Repository<ProductTag> {
  public async listTagsByUsage(count = 10): Promise<ProductTag[]> {
    const tags = await this.query(
      `
        SELECT ID, O.USAGE_COUNT, PT.VALUE
        FROM PRODUCT_TAG PT
        LEFT JOIN
          (SELECT COUNT(*) AS USAGE_COUNT,
            PRODUCT_TAG_ID
            FROM PRODUCT_TAGS
            GROUP BY PRODUCT_TAG_ID) O ON O.PRODUCT_TAG_ID = PT.ID
        ORDER BY O.USAGE_COUNT DESC
        LIMIT $1`,
      [count]
    )

    return tags
  }

  public async upsertTags(tags: UpsertTagsInput): Promise<ProductTag[]> {
    const tagsValues = tags.map((tag) => tag.value)
    const existingTags = await this.find({
      where: {
        value: In(tagsValues),
      },
    })
    const existingTagsMap = this.buildTagsMap_(existingTags)

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

  private buildTagsMap_(tags: ProductTag[]): Map<string, ProductTag> {
    return new Map(
      tags.map<[string, ProductTag]>((tag) => [tag.value, tag])
    )
  }
}
