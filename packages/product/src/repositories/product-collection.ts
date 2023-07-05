import { Product, ProductCollection } from "@models"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { Context, DAL } from "@medusajs/types"
import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { SoftDeletableKey } from "../utils"

export class ProductCollectionRepository extends AbstractBaseRepository<ProductCollection> {
  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
  }

  async find(
    findOptions: DAL.FindOptions<ProductCollection> = { where: {} },
    context: Context = {}
  ): Promise<ProductCollection[]> {
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
      ProductCollection,
      findOptions_.where as MikroFilterQuery<ProductCollection>,
      findOptions_.options as MikroOptions<ProductCollection>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductCollection> = { where: {} },
    context: Context = {}
  ): Promise<[ProductCollection[], number]> {
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
      ProductCollection,
      findOptions_.where as MikroFilterQuery<ProductCollection>,
      findOptions_.options as MikroOptions<ProductCollection>
    )
  }

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    await manager.nativeDelete(Product, { id: { $in: ids } }, {})
  }
}
