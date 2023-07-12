import { Product } from "@models"
import {
  FilterQuery as MikroFilterQuery,
  FindOptions as MikroOptions,
  LoadStrategy,
  wrap
} from "@mikro-orm/core"
import {
  Context,
  DAL,
  ProductTypes,
  WithRequiredProperty,
} from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { MedusaError, isDefined } from "@medusajs/utils"

import { AbstractBaseRepository } from "./base"
import * as ProductServiceTypes from "../types/services/product"

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
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    if (context.transactionManager) {
      Object.assign(findOptions_.options, { ctx: context.transactionManager })
    }

    Object.assign(findOptions_.options, {
      strategy: LoadStrategy.SELECT_IN,
    })

    await this.mutateNotInCategoriesConstraints(findOptions_)

    return await this.manager_.find(
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
  private async mutateNotInCategoriesConstraints(
    findOptions: DAL.FindOptions<Product> = { where: {} }
  ): Promise<void> {
    if (findOptions.where.categories?.id?.["$nin"]) {
      const productsInCategories = await this.manager_.find(
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

  async delete(ids: string[], context: Context = {}): Promise<void> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    await manager.nativeDelete(Product, { id: { $in: ids } }, {})
  }

  async create(
    data: WithRequiredProperty<ProductTypes.CreateProductOnlyDTO, "status">[],
    context: Context = {}
  ): Promise<Product[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const products = data.map((product) => {
      return manager.create(Product, product)
    })

    await manager.persistAndFlush(products)

    return products
  }

  async update(
    data: WithRequiredProperty<ProductServiceTypes.UpdateProductDTO, "id">[],
    context: Context = {}
  ): Promise<Product[]> {
    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    const products = await Promise.all(
      data.map(async (updateData) => {
        if (!isDefined(updateData.id)) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Cannot update product without id`
          )
        }

        const product = await manager.findOneOrFail(Product, updateData.id);

        return manager.assign(product, updateData, { updateNestedEntities: true, mergeObjects: true })
      })
    )

    await manager.persistAndFlush(products)

    return products
  }
}
