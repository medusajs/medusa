import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductVariant } from "@models"
import { FindOptions } from "@mikro-orm/core"
import { GenericFindOptions, RepositoryService } from "../types"

export class ProductVariantRepository
  implements RepositoryService<ProductVariant>
{
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager
  }

  async find(
    options: GenericFindOptions<ProductVariant> = {},
    context: { transaction?: any } = {}
  ): Promise<ProductVariant[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, findOptions } = { ...options }

    return await this.manager_.find(ProductVariant, where, {
      ...(findOptions as FindOptions<ProductVariant>),
      ctx: context.transaction,
    })
  }

  async findAndCount(
    options: GenericFindOptions<ProductVariant> = {},
    context: { transaction?: any } = {}
  ): Promise<[ProductVariant[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const { where = {}, findOptions } = { ...options }

    return await this.manager_.findAndCount(ProductVariant, where, {
      ...(findOptions as FindOptions<ProductVariant>),
      ctx: context.transaction,
    })
  }
}
