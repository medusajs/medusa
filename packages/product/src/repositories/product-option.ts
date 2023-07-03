import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { ProductOption } from "@models"
import { Context, DAL } from "@medusajs/types"
import { BaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { ModuleUtils } from "@medusajs/utils"

export class ProductOptionRepository extends BaseRepository<ProductOption> {
  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
  }

  async find(
    findOptions: DAL.FindOptions<ProductOption> = { where: {} },
    context: Context = {}
  ): Promise<ProductOption[]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      ModuleUtils.deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.find(
      ProductOption,
      findOptions_.where as MikroFilterQuery<ProductOption>,
      findOptions_.options as MikroOptions<ProductOption>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductOption> = { where: {} },
    context: Context = {}
  ): Promise<[ProductOption[], number]> {
    // Spread is used to copy the options in case of manipulation to prevent side effects
    const findOptions_ = { ...findOptions }

    findOptions_.options ??= {}
    findOptions_.options.limit ??= 15

    if (findOptions_.options.populate) {
      ModuleUtils.deduplicateIfNecessary(findOptions_.options.populate)
    }

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await this.manager_.findAndCount(
      ProductOption,
      findOptions_.where as MikroFilterQuery<ProductOption>,
      findOptions_.options as MikroOptions<ProductOption>
    )
  }
}
