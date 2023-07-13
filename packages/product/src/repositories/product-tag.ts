import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
  RequiredEntityData,
} from "@mikro-orm/core"
import { Product, ProductTag } from "@models"
import { Context, CreateProductTagDTO, DAL } from "@medusajs/types"
import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export class ProductTagRepository extends AbstractBaseRepository<ProductTag> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductTag> = { where: {} },
    context: Context = {}
  ): Promise<ProductTag[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

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
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

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

  async upsert(
    tags: CreateProductTagDTO[],
    context: Context = {}
  ): Promise<ProductTag[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

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
    const tagsToCreate: RequiredEntityData<ProductTag>[] = []

    tags.forEach((tag) => {
      const aTag = existingTagsMap.get(tag.value)
      if (aTag) {
        upsertedTags.push(aTag)
      } else {
        const newTag = manager.create(ProductTag, tag)
        tagsToCreate.push(newTag)
      }
    })

    if (tagsToCreate.length) {
      const newTags: ProductTag[] = []
      tagsToCreate.forEach((tag) => {
        newTags.push(manager.create(ProductTag, tag))
      })

      await manager.persist(newTags)
      upsertedTags.push(...newTags)
    }

    return upsertedTags
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    await manager.nativeDelete(Product, { id: { $in: ids } }, {})
  }

  async create(data: unknown[], context: Context = {}): Promise<ProductTag[]> {
    throw new Error("Method not implemented.")
  }
}
