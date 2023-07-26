import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import { Product, ProductOption } from "@models"
import { Context, DAL, ProductTypes } from "@medusajs/types"
import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"

export class ProductOptionRepository extends AbstractBaseRepository<ProductOption> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<ProductOption> = { where: {} },
    context: Context = {}
  ): Promise<ProductOption[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.find(
      ProductOption,
      findOptions_.where as MikroFilterQuery<ProductOption>,
      findOptions_.options as MikroOptions<ProductOption>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<ProductOption> = { where: {} },
    context: Context = {}
  ): Promise<[ProductOption[], number]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    return await manager.findAndCount(
      ProductOption,
      findOptions_.where as MikroFilterQuery<ProductOption>,
      findOptions_.options as MikroOptions<ProductOption>
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
    data: (ProductTypes.CreateProductOptionDTO & { product: { id: string } })[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<ProductOption[]> {
    const options = data.map((option) => {
      return (manager as SqlEntityManager).create(ProductOption, option)
    })

    await (manager as SqlEntityManager).persist(options)

    return options
  }
}
