import { FindOptions } from "@mikro-orm/core"
import { SqlEntityManager } from "@mikro-orm/postgresql"

import { ProductTag } from "@models"

import { GenericFindOptions, RepositoryService } from "../types"

export class ProductTagRepository implements RepositoryService<ProductTag> {
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager
  }

  async find(
    options: GenericFindOptions<ProductTag> = {},
    context: { transaction?: any } = {}
  ): Promise<ProductTag[]> {
    const { where = {}, findOptions } = { ...options }

    return await this.manager_.find(ProductTag, where, {
      ...(findOptions as FindOptions<ProductTag>),
      ctx: context.transaction,
    })
  }

  async findAndCount(
    options: GenericFindOptions<ProductTag> = {},
    context: { transaction?: any } = {}
  ): Promise<[ProductTag[], number]> {
    const { where = {}, findOptions } = { ...options }

    return await this.manager_.findAndCount(ProductTag, where, {
      ...(findOptions as FindOptions<ProductTag>),
      ctx: context.transaction,
    })
  }
}
