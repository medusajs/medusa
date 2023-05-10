import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Product } from "@models"
import { FindOptions } from "@mikro-orm/core"
import { GenericFindOptions, RepositoryService } from "../types"

export class ProductRepository implements RepositoryService<Product> {
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager
  }

  async find(
    options: GenericFindOptions<Product> = {},
    context: { transaction?: any } = {}
  ): Promise<Product[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, findOptions } = { ...options }

    return await this.manager_.find(Product, where, {
      ...(findOptions as FindOptions<Product>),
      ctx: context.transaction,
    })
  }

  async findAndCount(
    options: GenericFindOptions<Product> = {},
    context: { transaction?: any } = {}
  ): Promise<[Product[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, findOptions } = { ...options }

    return await this.manager_.findAndCount(Product, where, {
      ...(findOptions as FindOptions<Product>),
      ctx: context.transaction,
    })
  }
}
