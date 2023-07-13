import { Product, ProductCollection } from "@models"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { Context, DAL } from "@medusajs/types"
import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"

export class ProductCollectionRepository extends AbstractBaseRepository<ProductCollection> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductCollection> = { where: {} },
    context: Context = {}
  ): Promise<ProductCollection[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      ProductCollection,
      findOptions_.where as MikroFilterQuery<ProductCollection>,
      findOptions_.options as MikroOptions<ProductCollection>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductCollection> = { where: {} },
    context: Context = {}
  ): Promise<[ProductCollection[], number]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
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

  async create(
    data: unknown[],
    context: Context = {}
  ): Promise<ProductCollection[]> {
    throw new Error("Method not implemented.")
  }
}
