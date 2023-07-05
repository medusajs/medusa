import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { ProductVariant } from "@models"
import { Context, DAL } from "@medusajs/types"
import { BaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { SoftDeletableKey } from "../utils"

export class ProductVariantRepository extends BaseRepository<ProductVariant> {
  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
  }

  async find(
    findOptions: DAL.FindOptions<ProductVariant> = { where: {} },
    context: Context = {}
  ): Promise<ProductVariant[]> {
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
      ProductVariant,
      findOptions_.where as MikroFilterQuery<ProductVariant>,
      findOptions_.options as MikroOptions<ProductVariant>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductVariant> = { where: {} },
    context: Context = {}
  ): Promise<[ProductVariant[], number]> {
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
      ProductVariant,
      findOptions_.where as MikroFilterQuery<ProductVariant>,
      findOptions_.options as MikroOptions<ProductVariant>
    )
  }
}
