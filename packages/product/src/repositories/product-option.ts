import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { ProductOption } from "@models"
import { Context, DAL } from "@medusajs/types"
import { BaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { SoftDeletableKey } from "../utils"

export class ProductOptionRepository extends BaseRepository<ProductOption> {
  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
  }

  async find(
    findOptions: DAL.FindOptions<ProductOption> = { where: {} },
    context: Context = {}
  ): Promise<ProductOption[]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    if (findOptions_.options?.withDeleted) {
      delete findOptions_.options.withDeleted
      findOptions_.options["filters"] ??= {}
      findOptions_.options["filters"][SoftDeletableKey] = {
        withDeleted: true,
      }
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
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    if (findOptions_.options?.withDeleted) {
      delete findOptions_.options.withDeleted
      findOptions_.options["filters"] ??= {}
      findOptions_.options["filters"][SoftDeletableKey] = {
        withDeleted: true,
      }
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
