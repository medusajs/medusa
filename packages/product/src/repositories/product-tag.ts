import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
  RequiredEntityData,
} from "@mikro-orm/core"
import { deduplicateIfNecessary } from "../utils"
import { ProductTag } from "@models"
import { Context, CreateProductTagDTO, DAL } from "@medusajs/types"
import { BaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export class ProductTagRepository extends BaseRepository<ProductTag> {
  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
  }

  async find(
    findOptions: DAL.FindOptions<ProductTag> = { where: {} },
    context: Context = {}
  ): Promise<ProductTag[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.find(
      ProductTag,
      findOptions_.where as MikroFilterQuery<ProductTag>,
      findOptions_.options as MikroOptions<ProductTag>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductTag> = { where: {} },
    context: Context = {}
  ): Promise<[ProductTag[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.findAndCount(
      ProductTag,
      findOptions_.where as MikroFilterQuery<ProductTag>,
      findOptions_.options as MikroOptions<ProductTag>
    )
  }

  async upsert(
    tags: CreateProductTagDTO[],
    context: Context = {}
  ): Promise<ProductTag[]> {
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
        const newTag = this.manager_.create(ProductTag, tag)
        tagsToCreate.push(newTag)
      }
    })

    if (tagsToCreate.length) {
      const newTags: ProductTag[] = []
      tagsToCreate.forEach((tag) => {
        newTags.push(this.manager_.create(ProductTag, tag))
      })

      await this.manager_.persist(newTags)
      upsertedTags.push(...newTags)
    }

    return upsertedTags
  }
}
