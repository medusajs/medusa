import { SqlEntityManager } from "@mikro-orm/postgresql"
import { FindOptions as MikroOptions, LoadStrategy } from "@mikro-orm/core"

import { ProductCollection } from "@models"

import { FindOptions, RepositoryService } from "../types"
import { deduplicateIfNecessary } from "../utils"

export class ProductCollectionRepository
  implements RepositoryService<ProductCollection>
{
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager.fork()
  }

  async find(
    findOptions: FindOptions<ProductCollection> = {},
    context: { transaction?: any } = {}
  ): Promise<ProductCollection[]> {
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
      ProductCollection,
      where,
      options as MikroOptions<ProductCollection>
    )
  }

  async findAndCount(
    findOptions: FindOptions<ProductCollection> = {},
    context: { transaction?: any } = {}
  ): Promise<[ProductCollection[], number]> {
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
      ProductCollection,
      where,
      options as MikroOptions<ProductCollection>
    )
  }
}
