import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Product } from "@models"
import { FindOptions as MikroFindOptions, LoadStrategy } from "@mikro-orm/core"
import { FindOptions, RepositoryService } from "../types"
import { deduplicateIfNecessary } from "../utils"

export class ProductRepository implements RepositoryService<Product> {
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager
  }

  async find(
    options: FindOptions<Product> = {},
    context: { transaction?: any } = {}
  ): Promise<Product[]> {
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
      Product,
      where,
      findOptions as MikroFindOptions<Product>
    )
  }

  async findAndCount(
    options: FindOptions<Product> = {},
    context: { transaction?: any } = {}
  ): Promise<[Product[], number]> {
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
      Product,
      where,
      findOptions as MikroFindOptions<Product>
    )
  }
}
