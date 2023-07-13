import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
  RequiredEntityData,
} from "@mikro-orm/core"
import { Product, ProductVariant } from "@models"
import { Context, DAL } from "@medusajs/types"
import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"
import { doNotForceTransaction } from "../utils"

export class ProductVariantRepository extends AbstractBaseRepository<ProductVariant> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductVariant> = { where: {} },
    context: Context = {}
  ): Promise<ProductVariant[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      ProductVariant,
      findOptions_.where as MikroFilterQuery<ProductVariant>,
      findOptions_.options as MikroOptions<ProductVariant>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductVariant> = { where: {} },
    context: Context = {}
  ): Promise<[ProductVariant[], number]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      ProductVariant,
      findOptions_.where as MikroFilterQuery<ProductVariant>,
      findOptions_.options as MikroOptions<ProductVariant>
    )
  }

  @InjectTransactionManager()
  async delete(
    ids: string[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<void> {
    await (manager as SqlEntityManager).nativeDelete(
      Product,
      { id: { $in: ids } },
      {}
    )
  }

  @InjectTransactionManager()
  async create(
    data: RequiredEntityData<ProductVariant>[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<ProductVariant[]> {
    const variants = data.map((variant) => {
      return (manager as SqlEntityManager).create(ProductVariant, variant)
    })

    await (manager as SqlEntityManager).persist(variants)

    return variants
  }
}
