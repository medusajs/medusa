import {
  Context,
  CreateProductTagDTO,
  UpdateProductTagDTO,
  UpsertProductTagDTO,
} from "@medusajs/types"
import { DALUtils } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductTag } from "@models"

export class ProductTagRepository extends DALUtils.mikroOrmBaseRepositoryFactory<
  ProductTag,
  {
    create: CreateProductTagDTO
    update: UpdateProductTagDTO
  }
>(ProductTag) {
  async upsert(
    tags: UpsertProductTagDTO[],
    context: Context = {}
  ): Promise<ProductTag[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const tagsValues = tags.map((tag) => tag.value)
    const existingTags = await this.find(
      {
        where: {
          value: {
            $in: tagsValues,
          },
        },
      },
      context
    )

    const existingTagsMap = new Map(
      existingTags.map<[string, ProductTag]>((tag) => [tag.value, tag])
    )

    const upsertedTags: ProductTag[] = []
    const tagsToCreate: ProductTag[] = []
    const tagsToUpdate: ProductTag[] = []

    tags.forEach((tag) => {
      const aTag = existingTagsMap.get(tag.value)
      if (aTag) {
        const updatedTag = manager.assign(aTag, tag)
        tagsToUpdate.push(updatedTag)
      } else {
        const newTag = manager.create(ProductTag, tag)
        tagsToCreate.push(newTag)
      }
    })

    if (tagsToCreate.length) {
      manager.persist(tagsToCreate)
      upsertedTags.push(...tagsToCreate)
    }

    if (tagsToUpdate.length) {
      manager.persist(tagsToUpdate)
      upsertedTags.push(...tagsToUpdate)
    }

    return upsertedTags
  }
}
