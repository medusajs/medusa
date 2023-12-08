import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { ProductTag } from "@models"
import {
  Context,
  CreateProductTagDTO,
  DAL,
  UpdateProductTagDTO,
  UpsertProductTagDTO,
} from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { DALUtils, MedusaError } from "@medusajs/utils"

export class ProductTagRepository extends DALUtils.MikroOrmBaseRepository {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductTag> = { where: {} },
    context: Context = {}
  ): Promise<ProductTag[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      ProductTag,
      findOptions_.where as MikroFilterQuery<ProductTag>,
      findOptions_.options as MikroOptions<ProductTag>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductTag> = { where: {} },
    context: Context = {}
  ): Promise<[ProductTag[], number]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      ProductTag,
      findOptions_.where as MikroFilterQuery<ProductTag>,
      findOptions_.options as MikroOptions<ProductTag>
    )
  }

  async create(
    data: CreateProductTagDTO[],
    context: Context = {}
  ): Promise<ProductTag[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    const productTags = data.map((tagData) => {
      return manager.create(ProductTag, tagData)
    })

    manager.persist(productTags)

    return productTags
  }

  async update(
    data: UpdateProductTagDTO[],
    context: Context = {}
  ): Promise<ProductTag[]> {
    const manager = this.getActiveManager<SqlEntityManager>(context)
    const tagIds = data.map((tagData) => tagData.id)
    const existingTags = await this.find(
      {
        where: {
          id: {
            $in: tagIds,
          },
        },
      },
      context
    )

    const existingTagsMap = new Map(
      existingTags.map<[string, ProductTag]>((tag) => [tag.id, tag])
    )

    const productTags = data.map((tagData) => {
      const existingTag = existingTagsMap.get(tagData.id)

      if (!existingTag) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `ProductTag with id "${tagData.id}" not found`
        )
      }

      return manager.assign(existingTag, tagData)
    })

    manager.persist(productTags)

    return productTags
  }

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

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    await manager.nativeDelete(ProductTag, { id: { $in: ids } }, {})
  }
}
