import {
  Product,
  ProductCategory,
  ProductCollection,
  ProductTag,
  ProductType,
} from "@models"

import {
  Context,
  DAL,
  ProductTypes,
  WithRequiredProperty,
} from "@medusajs/types"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import {
  DALUtils,
  isDefined,
  MedusaError,
  ProductUtils,
  promiseAll,
} from "@medusajs/utils"

import { ProductServiceTypes } from "../types/services"

// eslint-disable-next-line max-len
export class ProductRepository extends DALUtils.mikroOrmBaseRepositoryFactory<Product>(
  Product
) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }

  async find(
    findOptions: DAL.FindOptions<Product & { q?: string }> = { where: {} },
    context: Context = {}
  ): Promise<Product[]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    await this.mutateNotInCategoriesConstraints(findOptions_)

    this.applyFreeTextSearchFilters<Product>(
      findOptions_,
      this.getFreeTextSearchConstraints
    )

    return await super.find(findOptions_, context)
  }

  async findAndCount(
    findOptions: DAL.FindOptions<Product & { q?: string }> = { where: {} },
    context: Context = {}
  ): Promise<[Product[], number]> {
    const findOptions_ = { ...findOptions }
    findOptions_.options ??= {}

    await this.mutateNotInCategoriesConstraints(findOptions_)

    this.applyFreeTextSearchFilters<Product>(
      findOptions_,
      this.getFreeTextSearchConstraints
    )

    return await super.findAndCount(findOptions_, context)
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

  async create(
    data: WithRequiredProperty<ProductTypes.CreateProductOnlyDTO, "status">[],
    context: Context = {}
  ): Promise<Product[]> {
    data.forEach((productData) => {
      productData.status ??= ProductUtils.ProductStatus.DRAFT
    })

    return await super.create(data, context)
  }

  async update(
    data: {
      entity: Product
      update: WithRequiredProperty<ProductServiceTypes.UpdateProductDTO, "id">
    }[],
    context: Context = {}
  ): Promise<Product[]> {
    let categoryIds: string[] = []
    let tagIds: string[] = []
    const collectionIds: string[] = []
    const typeIds: string[] = []
    // TODO: use the getter method (getActiveManager)
    const manager = this.getActiveManager<SqlEntityManager>(context)

    data.forEach(({ update: productData }) => {
      categoryIds = categoryIds.concat(
        productData?.categories?.map((c) => c.id) || []
      )

      tagIds = tagIds.concat(productData?.tags?.map((c) => c.id) || [])

      if (productData.collection_id) {
        collectionIds.push(productData.collection_id)
      }

      if (productData.type_id) {
        typeIds.push(productData.type_id)
      }
    })

    const collectionsToAssign = collectionIds.length
      ? await manager.find(ProductCollection, {
          id: collectionIds,
        })
      : []

    const typesToAssign = typeIds.length
      ? await manager.find(ProductType, {
          id: typeIds,
        })
      : []

    const categoriesToAssign = categoryIds.length
      ? await manager.find(ProductCategory, {
          id: categoryIds,
        })
      : []

    const tagsToAssign = tagIds.length
      ? await manager.find(ProductTag, {
          id: tagIds,
        })
      : []

    const categoriesToAssignMap = new Map<string, ProductCategory>(
      categoriesToAssign.map((category) => [category.id, category])
    )

    const tagsToAssignMap = new Map<string, ProductTag>(
      tagsToAssign.map((tag) => [tag.id, tag])
    )

    const collectionsToAssignMap = new Map<string, ProductCollection>(
      collectionsToAssign.map((collection) => [collection.id, collection])
    )

    const typesToAssignMap = new Map<string, ProductType>(
      typesToAssign.map((type) => [type.id, type])
    )

    const productsToUpdateMap = new Map<string, Product>(
      data.map(({ entity }) => [entity.id, entity])
    )

    const products = await promiseAll(
      data.map(async ({ update: updateData }) => {
        const product = productsToUpdateMap.get(updateData.id)

        if (!product) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Product with id "${updateData.id}" not found`
          )
        }

        const {
          categories: categoriesData = [],
          tags: tagsData = [],
          collection_id: collectionId,
          type_id: typeId,
        } = updateData

        delete updateData?.categories
        delete updateData?.tags
        delete updateData?.collection_id
        delete updateData?.type_id

        if (isDefined(categoriesData)) {
          await product.categories.init()

          for (const categoryData of categoriesData) {
            const productCategory = categoriesToAssignMap.get(categoryData.id)

            if (productCategory) {
              product.categories.add(productCategory)
            }
          }

          const categoryIdsToAssignSet = new Set(
            categoriesData.map((cd) => cd.id)
          )
          const categoriesToDelete = product.categories
            .getItems()
            .filter(
              (existingCategory) =>
                !categoryIdsToAssignSet.has(existingCategory.id)
            )

          product.categories.remove(categoriesToDelete)
        }

        if (isDefined(tagsData)) {
          await product.tags.init()

          for (const tagData of tagsData) {
            let productTag = tagsToAssignMap.get(tagData.id)

            if (tagData instanceof ProductTag) {
              productTag = tagData
            }

            if (productTag) {
              product.tags.add(productTag)
            }
          }

          const tagIdsToAssignSet = new Set(tagsData.map((cd) => cd.id))
          const tagsToDelete = product.tags
            .getItems()
            .filter((existingTag) => !tagIdsToAssignSet.has(existingTag.id))

          product.tags.remove(tagsToDelete)
        }

        if (isDefined(collectionId)) {
          const collection = collectionsToAssignMap.get(collectionId!)

          product.collection = collection || null
        }

        if (isDefined(typeId)) {
          const type = typesToAssignMap.get(typeId!)

          if (type) {
            product.type = type
          }
        }

        return manager.assign(product, updateData)
      })
    )

    manager.persist(products)

    return products
  }

  protected getFreeTextSearchConstraints(q: string) {
    return [
      {
        description: {
          $ilike: `%${q}%`,
        },
      },
      {
        title: {
          $ilike: `%${q}%`,
        },
      },
      {
        collection: {
          title: {
            $ilike: `%${q}%`,
          },
        },
      },
      {
        variants: {
          $or: [
            {
              title: {
                $ilike: `%${q}%`,
              },
            },
            {
              sku: {
                $ilike: `%${q}%`,
              },
            },
          ],
        },
      },
    ]
  }
}
