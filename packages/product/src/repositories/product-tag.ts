import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductTag } from "@models"
import { FindOptions as MikroFindOptions, LoadStrategy } from "@mikro-orm/core"
import { FindOptions, RepositoryService } from "../types"
import { deduplicateIfNecessary } from "../utils"

export class ProductTagRepository implements RepositoryService<ProductTag> {
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager
  }

  async find(
    options: FindOptions<ProductTag> = {},
    context: { transaction?: any } = {}
  ): Promise<ProductTag[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, findOptions = {} } = { ...options }

    findOptions.limit ??= 15
    findOptions.populate = deduplicateIfNecessary(findOptions.populate)

    if (context.transaction) {
      Object.assign(findOptions, { ctx: context.transaction })
    }

    Object.assign(findOptions, {
      strategy: LoadStrategy.SELECT_IN,
      cache: 1000,
    })

    return await this.manager_.find(
      ProductTag,
      where,
      findOptions as MikroFindOptions<ProductTag>
    )
  }

  async findAndCount(
    options: FindOptions<ProductTag> = {},
    context: { transaction?: any } = {}
  ): Promise<[ProductTag[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, findOptions = {} } = { ...options }

    findOptions.limit ??= 15
    findOptions.populate = deduplicateIfNecessary(findOptions.populate)

    if (context.transaction) {
      Object.assign(findOptions, { ctx: context.transaction })
    }

    Object.assign(findOptions, {
      strategy: LoadStrategy.SELECT_IN,
      cache: 1000,
    })

    return await this.manager_.findAndCount(
      ProductTag,
      where,
      findOptions as MikroFindOptions<ProductTag>
    )
  }
}
