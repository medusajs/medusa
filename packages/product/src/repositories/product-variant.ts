import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { deduplicateIfNecessary } from "../utils"
import { ProductVariant } from "@models"
import { DAL } from "@medusajs/types"

export class ProductVariantRepository implements DAL.RepositoryService {
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager.fork()
  }

  async find<T = ProductVariant>(
    findOptions: DAL.FindOptions<T> = { where: {} },
    context: { transaction?: any } = {}
  ): Promise<T[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transaction) {
      Object.assign(findOptions_.options, { ctx: context.transaction })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return (await this.manager_.find(
      ProductVariant,
      findOptions_.where as MikroFilterQuery<ProductVariant>,
      findOptions_.options as MikroOptions<ProductVariant>
    )) as unknown as T[]
  }

  async findAndCount<T = ProductVariant>(
    findOptions: DAL.FindOptions<T> = { where: {} },
    context: { transaction?: any } = {}
  ): Promise<[T[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transaction) {
      Object.assign(findOptions_.options, { ctx: context.transaction })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return (await this.manager_.findAndCount(
      ProductVariant,
      findOptions_.where as MikroFilterQuery<ProductVariant>,
      findOptions_.options as MikroOptions<ProductVariant>
    )) as unknown as [T[], number]
  }
}
