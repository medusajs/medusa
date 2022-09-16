import { In } from "typeorm"
import { ProductTag } from "../models"
import { dataSource } from "../loaders/database"

type UpsertTagsInput = (Partial<ProductTag> & {
  value: string
})[]

export const ProductTagRepository = dataSource
  .getRepository(ProductTag)
  .extend({
    async listTagsByUsage(count = 10): Promise<ProductTag[]> {
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
    },
  })
