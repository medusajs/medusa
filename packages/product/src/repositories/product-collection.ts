import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ProductCollection } from "@models"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { deduplicateIfNecessary } from "../utils"
import { DAL } from "@medusajs/types"

export class ProductCollectionRepository implements DAL.RepositoryService {
  protected readonly manager_: SqlEntityManager
  constructor({ manager }) {
    this.manager_ = manager.fork()
  }

  async find<T = ProductCollection>(
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
      ProductCollection,
      findOptions_.where as MikroFilterQuery<ProductCollection>,
      findOptions_.options as MikroOptions<ProductCollection>
    )) as unknown as T[]
  }

  async findAndCount<T = ProductCollection>(
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
      ProductCollection,
      findOptions_.where as MikroFilterQuery<ProductCollection>,
      findOptions_.options as MikroOptions<ProductCollection>
    )) as unknown as [T[], number]
  }
}
