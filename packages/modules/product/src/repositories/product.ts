import { Product, ProductOption } from "@models"

import { Context, DAL, InferEntityType } from "@medusajs/framework/types"
import {
  arrayDifference,
  buildQuery,
  DALUtils,
  MedusaError,
  isPresent,
  mergeMetadata,
  deepCopy,
} from "@medusajs/framework/utils"
import {
  SqlEntityManager,
  wrap,
} from "@medusajs/framework/mikro-orm/postgresql"

export class ProductRepository extends DALUtils.mikroOrmBaseRepositoryFactory(
  Product
) {
  constructor(...args: any[]) {
    // @ts-ignore
    super(...arguments)
  }

  /**
   * Identify the relations to load for the given update.
   * @param update
   * @returns
   */
  static #getProductDeepUpdateRelationsToLoad(
    productsToUpdate: any[]
  ): string[] {
    const relationsToLoad = new Set<string>()
    productsToUpdate.forEach((productToUpdate) => {
      if (productToUpdate.options) {
        relationsToLoad.add("options")
        relationsToLoad.add("options.values")
      }
      if (productToUpdate.variants) {
        relationsToLoad.add("options")
        relationsToLoad.add("options.values")
        relationsToLoad.add("variants")
        relationsToLoad.add("variants.options")
        relationsToLoad.add("variants.options.option")
      }
      if (productToUpdate.tags) relationsToLoad.add("tags")
      if (productToUpdate.categories) relationsToLoad.add("categories")
      if (productToUpdate.images) relationsToLoad.add("images")
      if (productToUpdate.collection) relationsToLoad.add("collection")
      if (productToUpdate.type) relationsToLoad.add("type")
    })
    return Array.from(relationsToLoad)
  }

  async deepUpdate(
    productsToUpdate: ({ id: string } & any)[],
    validateVariantOptions: (
      variants: any[],
      options: InferEntityType<typeof ProductOption>[]
    ) => void,
    context: Context = {}
  ): Promise<InferEntityType<typeof Product>[]> {
    const productsToUpdate_ = deepCopy(productsToUpdate)
    const productIdsToUpdate: string[] = []

    productsToUpdate_.forEach((productToUpdate) => {
      productIdsToUpdate.push(productToUpdate.id)
    })

    const relationsToLoad =
      ProductRepository.#getProductDeepUpdateRelationsToLoad(productsToUpdate_)

    const findOptions = buildQuery(
      { id: productIdsToUpdate },
      {
        relations: relationsToLoad,
        take: productsToUpdate_.length,
      }
    )

    const products = await this.find(findOptions, context)
    const productsMap = new Map(products.map((p) => [p.id, p]))

    const productIds = Array.from(productsMap.keys())
    const productsNotFound = arrayDifference(productIdsToUpdate, productIds)

    if (productsNotFound.length > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Unable to update the products with ids: ${productsNotFound.join(", ")}`
      )
    }

    for (const productToUpdate of productsToUpdate_) {
      const product = productsMap.get(productToUpdate.id)!
      const wrappedProduct = wrap(product)

      // Assign the options first, so they'll be available for the variants loop below
      if (productToUpdate.options) {
        wrappedProduct.assign({ options: productToUpdate.options })
        delete productToUpdate.options // already assigned above, so no longer necessary
      }

      if (productToUpdate.variants) {
        validateVariantOptions(productToUpdate.variants, product.options)

        productToUpdate.variants.forEach((variant: any) => {
          if (variant.options) {
            variant.options = Object.entries(variant.options).map(
              ([key, value]) => {
                const productOption = product.options.find(
                  (option) => option.title === key
                )!
                const productOptionValue = productOption.values?.find(
                  (optionValue) => optionValue.value === value
                )!
                return productOptionValue.id
              }
            )
          }
        })
      }

      if (productToUpdate.tags) {
        productToUpdate.tags = productToUpdate.tags.map(
          (t: { id: string }) => t.id
        )
      }
      if (productToUpdate.categories) {
        productToUpdate.categories = productToUpdate.categories.map(
          (c: { id: string }) => c.id
        )
      }
      if (productToUpdate.images) {
        productToUpdate.images = productToUpdate.images.map(
          (image: any, index: number) => ({
            ...image,
            rank: index,
          })
        )
      }

      if (isPresent(productToUpdate.metadata)) {
        productToUpdate.metadata = mergeMetadata(
          product.metadata ?? {},
          productToUpdate.metadata
        )
      }

      wrappedProduct.assign(productToUpdate)
    }

    // Doing this to ensure updates are returned in the same order they were provided,
    // since some core flows rely on this.
    // This is a high level of coupling though.
    return productsToUpdate_.map(
      (productToUpdate) => productsMap.get(productToUpdate.id)!
    )
  }

  /**
   * In order to be able to have a strict not in categories, and prevent a product
   * to be return in the case it also belongs to other categories, we need to
   * first find all products that are in the categories, and then exclude them
   */
  protected async mutateNotInCategoriesConstraints(
    findOptions: DAL.FindOptions<typeof Product> = {
      where: {},
    },
    context: Context = {}
  ): Promise<void> {
    const manager = this.getActiveManager<SqlEntityManager>(context)

    if (
      "categories" in findOptions.where &&
      findOptions.where.categories?.id?.["$nin"]
    ) {
      const productsInCategories = await manager.find(
        this.entity,
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
