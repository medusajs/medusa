import { Product } from "@models"

import { Context, DAL } from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { DALUtils } from "@medusajs/utils"

import { UpdateProductInput } from "../types"

// eslint-disable-next-line max-len
export class ProductRepository extends DALUtils.mikroOrmBaseRepositoryFactory<Product>(
  Product
) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
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
    const manager = this.getActiveManager<SqlEntityManager>(context)

    if (
      "categories" in findOptions.where &&
      findOptions.where.categories?.id?.["$nin"]
    ) {
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
}
