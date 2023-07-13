import {
  Product,
  ProductCategory,
  ProductCollection,
  ProductType,
} from "@models"
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
import { ProductServiceTypes } from "../types/services"

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
  private async mutateNotInCategoriesConstraints(
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

    await manager.persist(products)

    return products
  }

  async update(
    data: WithRequiredProperty<ProductServiceTypes.UpdateProductDTO, "id">[],
    context: Context = {}
  ): Promise<Product[]> {
    let categoryIds: string[] = []
    let collectionIds: string[] = []
    let typeIds: string[] = []

    const manager = (context.transactionManager ??
      this.manager_) as SqlEntityManager

    data.forEach((productData) => {
      categoryIds = categoryIds.concat(
        productData?.categories?.map(c => c.id) || []
      )

      if (productData.collection_id) {
        collectionIds.push(productData.collection_id)
      }

      if (productData.type_id) {
        typeIds.push(productData.type_id)
      }
    })

    const productsToUpdate = await manager.find(Product, {
      id: data.map((updateData) => updateData.id)
    })

    const collectionsToAssign = collectionIds.length ? await manager.find(ProductCollection, {
      id: collectionIds
    }) : []

    const typesToAssign = typeIds.length ? await manager.find(ProductType, {
      id: typeIds
    }) : []

    const categoriesToAssign = categoryIds.length ? await manager.find(ProductCategory, {
      id: categoryIds
    }) : []

    const categoriesToAssignMap = new Map<string, ProductCategory>(
      categoriesToAssign.map((category) => [category.id, category])
    )

    const collectionsToAssignMap = new Map<string, ProductCollection>(
      collectionsToAssign.map((collection) => [collection.id, collection])
    )

    const typesToAssignMap = new Map<string, ProductType>(
      typesToAssign.map((type) => [type.id, type])
    )

    const productsToUpdateMap = new Map<string, Product>(
      productsToUpdate.map((product) => [product.id, product])
    )

    const products = await Promise.all(
      data.map(async (updateData) => {
        const product = productsToUpdateMap.get(updateData.id)

        if (!product) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Product with id "${updateData.id}" not found`
          )
        }

        const {
          categories: categoriesData,
          tags: tagsData,
          collection_id: collectionId,
          type_id: typeId,
        } = updateData

        delete updateData?.categories
        delete updateData?.collection_id
        delete updateData?.type_id

        if (isDefined(categoriesData)) {
          await product.categories.init()
          await product.categories.removeAll()

          for (const categoryData of categoriesData) {
            const productCategory = categoriesToAssignMap.get(categoryData.id)

            if (productCategory) {
              await product.categories.add(productCategory)
            }
          }
        }

        if (isDefined(tagsData)) {
          await product.tags.init()
          await product.tags.removeAll()
        }

        if (isDefined(collectionId)) {
          const collection = collectionsToAssignMap.get(collectionId)

          if (collection) {
            product.collection = collection
          }
        }

        if (isDefined(typeId)) {
          const type = typesToAssignMap.get(typeId)

          if (type) {
            product.type = type
          }
        }

        return manager.assign(product, updateData)
      })
    )

    await manager.persistAndFlush(products)

    return products
  }
}
