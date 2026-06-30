import { Product, ProductOption } from "@models"

import { Context, DAL, InferEntityType } from "@medusajs/framework/types"
import {
  arrayDifference,
  DALUtils,
  deepCopy,
  isPresent,
  MedusaError,
  mergeMetadata,
} from "@medusajs/framework/utils"
import {
  SqlEntityManager,
  wrap,
} from "@medusajs/framework/mikro-orm/postgresql"
import { resolveAllowedOptionValues } from "../utils/resolve-allowed-option-values"

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
      options: InferEntityType<typeof ProductOption>[],
      productId: string,
      allowedValueIds?: Set<string>
    ) => void,
    expectedOptionIdsMap: Map<string, Set<string>> = new Map(),
    valueIdsByProductId: Map<string, Set<string>> = new Map(),
    context: Context = {}
  ): Promise<InferEntityType<typeof Product>[]> {
    const productsToUpdate_ = deepCopy(productsToUpdate)
    const productIdsToUpdate: string[] = []

    productsToUpdate_.forEach((productToUpdate) => {
      productIdsToUpdate.push(productToUpdate.id)
    })

    const relationsToLoad =
      ProductRepository.#getProductDeepUpdateRelationsToLoad(productsToUpdate_)

    // Splitting the populate into per-relation calls avoids a pathological
    // slow path in MikroORM where a combined `find({populate})` over deep
    // relations becomes orders of magnitude slower at moderate batch sizes
    const products = await this.findByIdsWithSplitPopulate(
      productIdsToUpdate,
      relationsToLoad,
      context
    )
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

      if (productToUpdate.options) {
        wrappedProduct.assign({ options: productToUpdate.options })
        delete productToUpdate.options
      }

      if (productToUpdate.variants) {
        const expectedOptionIds = expectedOptionIdsMap.get(product.id)
        const optionsForValidation = expectedOptionIds
          ? product.options.filter((o) => expectedOptionIds.has(o.id))
          : product.options
        const allowedValueIds = valueIdsByProductId.get(product.id)

        validateVariantOptions(
          productToUpdate.variants,
          optionsForValidation,
          product.id,
          allowedValueIds
        )

        productToUpdate.variants.forEach((variant: any) => {
          if (variant.options) {
            variant.options = Object.entries(variant.options).map(
              ([key, value]) => {
                const productOption = product.options.find(
                  (option) => option.title === key
                )!
                const productOptionValue = resolveAllowedOptionValues({
                  optionTitle: key,
                  value,
                  optionValues: productOption.values,
                  allowedValueIds,
                })
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
   * Loads products by id with the given relations using sequential per-relation
   * populate() calls instead of one combined find({populate}) — see deepUpdate
   * for the rationale (combined populate is dramatically slower for moderate
   * batch sizes with multiple deep relations).
   * 
   * Callers of this method should call flush() on the manager for pending writes
   * to relations passed for population to be visible in the loaded entities.
   */
  async findByIdsWithSplitPopulate(
    productIds: string[],
    relations: string[],
    context: Context = {}
  ): Promise<InferEntityType<typeof Product>[]> {
    if (!productIds.length) {
      return []
    }
    const manager = super.getActiveManager<SqlEntityManager>(context)
    const products = await manager.find<InferEntityType<typeof Product>>(
      Product.name,
      { id: productIds },
      { limit: productIds.length, refresh: true } as any
    )
    // `refresh: true` ensures that if the entities are already in the identity
    // map (e.g. created earlier in the same transaction), their collections
    // are re-hydrated from the DB instead of returning stale empty ones.
    for (const relation of relations) {
      await (manager as any).populate(products, [relation], { refresh: true })
    }
    return products
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

  /**
   * Checks if any variants of products use the specified option values.
   * Queries the product_variant_option pivot table directly in bulk.
   *
   * @param pairs - Array of { productId, optionValueIds } pairs to check
   * @param context - The context
   * @returns Map keyed by `${productId}_${valueId}` with arrays of variant info (id and title) that use those values
   */
  async checkVariantsUsingOptionValues(
    pairs: Array<{ productId: string; optionValueIds: string[] }> = [],
    context: Context = {}
  ): Promise<
    Map<
      string,
      Array<{ variant_id: string; title: string | null; product_id: string }>
    >
  > {
    if (pairs.length === 0) {
      return new Map()
    }

    const validPairs = pairs.filter((p) => p.optionValueIds.length > 0)
    if (validPairs.length === 0) {
      return new Map()
    }

    const manager = this.getActiveManager<SqlEntityManager>(context)
    // Use the transaction-bound knex so we see writes made earlier in the
    // same transaction (e.g. pivot rows just inserted by another service call).
    const knex = manager.getTransactionContext() ?? manager.getKnex()

    const allProductIds = [...new Set(validPairs.map((p) => p.productId))]
    const allValueIds = [
      ...new Set(validPairs.flatMap((p) => p.optionValueIds)),
    ]

    const result = await knex
      .select(
        "pvo.variant_id",
        "pv.title",
        "pv.product_id",
        "pvo.option_value_id"
      )
      .distinct()
      .from("product_variant_option as pvo")
      .innerJoin("product_variant as pv", "pv.id", "pvo.variant_id")
      .whereIn("pv.product_id", allProductIds)
      .whereNull("pv.deleted_at")
      .whereIn("pvo.option_value_id", allValueIds)

    const resultMap = new Map<
      string,
      Array<{ variant_id: string; title: string | null; product_id: string }>
    >()

    for (const row of result) {
      const key = `${row.product_id}_${row.option_value_id}`
      if (!resultMap.has(key)) {
        resultMap.set(key, [])
      }
      resultMap.get(key)!.push({
        variant_id: row.variant_id,
        title: row.title,
        product_id: row.product_id,
      })
    }

    return resultMap
  }

  /**
   * Checks if product options can be deleted.
   * An option cannot be deleted if there are non-deleted products using it.
   *
   * @param optionIds - Array of option IDs to check
   * @param context - The context
   * @returns true if all options can be deleted, false if any cannot be deleted
   */
  async canDeleteProductOption(
    optionIds: string[],
    context: Context = {}
  ): Promise<boolean> {
    if (!optionIds.length) {
      return true
    }

    const manager = this.getActiveManager<SqlEntityManager>(context)
    // Use the transaction-bound knex so we see writes made earlier in the
    // same transaction (e.g. pivot rows just inserted by another service call).
    const knex = manager.getTransactionContext() ?? manager.getKnex()

    const blockingOptions = await knex
      .select("ppo.product_option_id")
      .from("product_product_option as ppo")
      .innerJoin("product as p", "p.id", "ppo.product_id")
      .innerJoin("product_option as po", "po.id", "ppo.product_option_id")
      .whereIn("ppo.product_option_id", optionIds)
      .whereNull("ppo.deleted_at")
      .whereNull("p.deleted_at") // <- allow soft deleting an option that is associated with a soft deleted product
      .whereNull("po.deleted_at")
      .limit(1)

    return !blockingOptions.length
  }

  /**
   * Checks whether product options can be assigned to products.
   *
   * Returns conflicting option ids if:
   *    - the option is already assigned to that product
   *    - the option is exclusive and is assigned to another product
   *
   * @param pairs - Array of { productId, optionId } pairs to check
   * @param context - The context
   */
  async canAssignProductOptionToProduct(
    pairs: Array<{ productId: string; optionId: string }> = [],
    context: Context = {}
  ): Promise<{
    exclusiveOptionIds: string[]
    alreadyLinkedOptionIds: string[]
  }> {
    if (!pairs.length) {
      return { exclusiveOptionIds: [], alreadyLinkedOptionIds: [] }
    }

    // Reject duplicate (product, option) pairs within the input itself. Without
    // this check, downstream `INSERT … ON CONFLICT DO NOTHING` silently dedupes
    // the rows and the caller never finds out they double-assigned.
    const seenKeys = new Set<string>()
    const duplicateKeys: string[] = []
    for (const pair of pairs) {
      const key = `${pair.productId}_${pair.optionId}`
      if (seenKeys.has(key)) {
        duplicateKeys.push(key)
      } else {
        seenKeys.add(key)
      }
    }
    if (duplicateKeys.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Duplicate product option assignments are not allowed; remove duplicate pairs: ${duplicateKeys.join(
          ", "
        )}`
      )
    }

    const optionToProductIds = new Map<string, Set<string>>()

    pairs.forEach((pair) => {
      const productIds = optionToProductIds.get(pair.optionId) ?? new Set()
      productIds.add(pair.productId)
      optionToProductIds.set(pair.optionId, productIds)
    })

    const optionIds = [...optionToProductIds.keys()]

    const manager = this.getActiveManager<SqlEntityManager>(context)
    // Use the transaction-bound knex so we see writes made earlier in the
    // same transaction (e.g. pivot rows just inserted by another service call).
    const knex = manager.getTransactionContext() ?? manager.getKnex()

    const pairPlaceholders = pairs.map(() => "(?, ?)").join(", ")
    const pairBindings = pairs.flatMap((p) => [p.productId, p.optionId])

    const { rows: alreadyLinkedRows } = await knex.raw(
      `SELECT DISTINCT product_option_id as option_id
       FROM product_product_option
       WHERE (product_id, product_option_id) IN (${pairPlaceholders})`,
      pairBindings
    )

    const alreadyLinkedOptionIds = alreadyLinkedRows.map(
      (row: { option_id: string }) => row.option_id
    )

    const { rows: exclusiveConflictRows } = await knex.raw(
      `WITH input_pairs(product_id, option_id) AS (VALUES ${pairPlaceholders})
       SELECT DISTINCT po.id as option_id
       FROM product_option po
       WHERE po.is_exclusive = true
         AND po.id IN (SELECT option_id FROM input_pairs)
         AND (
           (SELECT COUNT(DISTINCT ip.product_id) FROM input_pairs ip WHERE ip.option_id = po.id) > 1
           OR EXISTS (
             SELECT 1 FROM product_product_option ppo
             WHERE ppo.product_option_id = po.id
               AND ppo.product_id NOT IN (SELECT ip.product_id FROM input_pairs ip WHERE ip.option_id = po.id)
           )
         )`,
      pairBindings
    )

    const exclusiveOptionIds = exclusiveConflictRows.map(
      (row: { option_id: string }) => row.option_id
    )

    return {
      exclusiveOptionIds: optionIds.filter((id) =>
        exclusiveOptionIds.includes(id)
      ),
      alreadyLinkedOptionIds: optionIds.filter((id) =>
        alreadyLinkedOptionIds.includes(id)
      ),
    }
  }

  async getOptionIdsByProductIds(
    productIds: string[],
    context: Context = {}
  ): Promise<Map<string, Set<string>>> {
    const optionIdsByProduct = new Map<string, Set<string>>()

    if (!productIds.length) {
      return optionIdsByProduct
    }

    const manager = this.getActiveManager<SqlEntityManager>(context)
    const knex = manager.getTransactionContext() ?? manager.getKnex()

    const rows = await knex("product_product_option")
      .select("product_id", "product_option_id")
      .whereIn("product_id", productIds)
      .whereNull("deleted_at")

    rows.forEach((row) => {
      if (!optionIdsByProduct.has(row.product_id)) {
        optionIdsByProduct.set(row.product_id, new Set())
      }
      optionIdsByProduct.get(row.product_id)!.add(row.product_option_id)
    })

    return optionIdsByProduct
  }

  async getOptionValueIdsByProductIds(
    productIds: string[],
    context: Context = {}
  ): Promise<Map<string, Set<string>>> {
    const allowedValueIdsByProduct = new Map<string, Set<string>>()

    if (!productIds.length) {
      return allowedValueIdsByProduct
    }

    const manager = this.getActiveManager<SqlEntityManager>(context)
    // Use the transaction-bound knex so we see pivot rows written earlier in
    // the same transaction (e.g. by addProductOptionToProduct_).
    const knex = manager.getTransactionContext() ?? manager.getKnex()

    const rows = await knex("product_product_option_value as ppov")
      .select("ppo.product_id", "ppov.product_option_value_id")
      .innerJoin("product_product_option as ppo", function (this: any) {
        this.on("ppo.id", "ppov.product_product_option_id").andOnNull(
          "ppo.deleted_at"
        )
      })
      .whereIn("ppo.product_id", productIds)
      .whereNull("ppov.deleted_at")

    rows.forEach((row) => {
      if (!allowedValueIdsByProduct.has(row.product_id)) {
        allowedValueIdsByProduct.set(row.product_id, new Set())
      }
      allowedValueIdsByProduct
        .get(row.product_id)!
        .add(row.product_option_value_id)
    })

    return allowedValueIdsByProduct
  }
}
