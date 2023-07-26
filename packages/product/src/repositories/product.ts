import { Product } from "@models"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
} from "@mikro-orm/core"
import {
  Context,
  DAL,
  ProductTypes,
  WithRequiredProperty,
} from "@medusajs/types"
import { AbstractBaseRepository } from "./base"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { InjectTransactionManager, MedusaContext } from "@medusajs/utils"

export class ProductRepository extends AbstractBaseRepository<Product> {
  protected readonly manager_: SqlEntityManager

  constructor({ manager }: { manager: SqlEntityManager }) {
    // @ts-ignore
    super(...arguments)
    this.manager_ = manager
  }

  async find(
    findOptions: DAL.FindOptions<Product> = { where: {} },
    context: Context = {}
  ): Promise<Product[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    await this.mutateNotInCategoriesConstraints(findOptions_)

    return await manager.find(
      Product,
      findOptions_.where as MikroFilterQuery<Product>,
      findOptions_.options as MikroOptions<Product>
    )
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Product> = { where: {} },
    context: Context = {}
  ): Promise<[Product[], number]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    await this.mutateNotInCategoriesConstraints(findOptions_)

    return await this.manager_.findAndCount(
      Product,
      findOptions_.where as MikroFilterQuery<Product>,
      findOptions_.options as MikroOptions<Product>
    )
  }
  /**
   * In order to be able to have a strict not in categories, and prevent a product
   * to be return in the case it also belongs to other categories, we need to
   * first find all products that are in the categories, and then exclude them
   */
  protected async mutateNotInCategoriesConstraints(
    findOptions: DAL.FindOptions<Product> = { where: {} },
    context: Context = {}
  ): Promise<void> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    if (findOptions.where.categories?.id?.["$nin"]) {
      const productsInCategories = await manager.find(
        Product,
        {
          categories: {
            id: { $in: findOptions.where.categories.id["$nin"] },
          },
        },
        {
          fields: ["id"],
        }
      )

      const productIds = productsInCategories.map((product) => product.id)

      if (productIds.length) {
        findOptions.where.id = { $nin: productIds }
        delete findOptions.where.categories?.id

        if (Object.keys(findOptions.where.categories).length === 0) {
          delete findOptions.where.categories
        }
      }
    }
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
    data: WithRequiredProperty<ProductTypes.CreateProductOnlyDTO, "status">[],
    @MedusaContext()
    { transactionManager: manager }: Context = {}
  ): Promise<Product[]> {
    const products = data.map((product) => {
      return (manager as SqlEntityManager).create(Product, product)
    })

    await (manager as SqlEntityManager).persist(products)

    return products
  }
}
