import { SqlEntityManager } from "@mikro-orm/postgresql"
import { FindOptions as MikroOptions, LoadStrategy } from "@mikro-orm/core"

import { ProductTag } from "@models"

import { FindOptions, RepositoryService } from "../types"
import { deduplicateIfNecessary } from "../utils"

export class ProductTagRepository implements RepositoryService<ProductTag> {
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager.fork()
  }

  async find(
    findOptions: FindOptions<ProductTag> = {},
    context: { transaction?: any } = {}
  ): Promise<ProductTag[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, options = {} } = { ...findOptions }

    options.limit ??= 15
    options.populate = deduplicateIfNecessary(options.populate)

    if (context.transaction) {
      Object.assign(options, { ctx: context.transaction })
    }

    Object.assign(options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.find(
      ProductTag,
      where,
      options as MikroOptions<ProductTag>
    )
  }

  async findAndCount(
    findOptions: FindOptions<ProductTag> = {},
    context: { transaction?: any } = {}
  ): Promise<[ProductTag[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, options = {} } = { ...findOptions }

    options.limit ??= 15
    options.populate = deduplicateIfNecessary(options.populate)

    if (context.transaction) {
      Object.assign(options, { ctx: context.transaction })
    }

    Object.assign(options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.findAndCount(
      ProductTag,
      where,
      options as MikroOptions<ProductTag>
    )
  }
}
