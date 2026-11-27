import type {
  IProductModuleService,
  ProductTypes,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to remove one or more product options from products.
 */
export type RemoveProductOptionsFromProductStepInput =
  ProductTypes.ProductOptionProductPair[]

export const removeProductOptionsFromProductStepId =
  "remove-product-options-from-product"
/**
 * This step removes product options from products.
 *
 * @example
 * const data = removeProductOptionsFromProductStep([
 *   {
 *     product_id: "prod_123",
 *     product_option_id: "opt_123",
 *   },
 * ])
 */
export const removeProductOptionsFromProductStep = createStep(
  removeProductOptionsFromProductStepId,
  async (pairs: RemoveProductOptionsFromProductStepInput, { container }) => {
    if (!pairs.length) {
      return new StepResponse(void 0, {
        links: [],
        deletedOptionIds: [],
        variantsToRestore: [],
      })
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    /**
     * Read the values for PPO pair and variant option values before removal
     * so we can properly compensate them.
     */
    const productIds = [...new Set(pairs.map((pair) => pair.product_id))]
    const products = await service.listProducts(
      { id: productIds },
      { relations: ["options.values", "variants.options"] }
    )

    const removedOptionIdsByProductId = new Map<string, Set<string>>()
    for (const pair of pairs) {
      const optionIds =
        removedOptionIdsByProductId.get(pair.product_id) ?? new Set<string>()
      optionIds.add(pair.product_option_id)
      removedOptionIdsByProductId.set(pair.product_id, optionIds)
    }

    const valueIdsByPairKey = new Map<string, string[]>()
    const variantsToRestore: ProductTypes.UpsertProductVariantDTO[] = []

    for (const product of products) {
      const removedOptionIds = removedOptionIdsByProductId.get(product.id)
      const optionTitleById = new Map<string, string>()
      const removedValueIds = new Set<string>()

      for (const option of product.options ?? []) {
        optionTitleById.set(option.id, option.title)
        const valueIds = (option.values ?? []).map((value) => value.id)
        valueIdsByPairKey.set(`${product.id}_${option.id}`, valueIds)

        if (removedOptionIds?.has(option.id)) {
          valueIds.forEach((valueId) => removedValueIds.add(valueId))
        }
      }

      if (!removedValueIds.size) {
        continue
      }

      for (const variant of product.variants ?? []) {
        const variantOptions = variant.options ?? []
        const hasRemovedValue = variantOptions.some((optionValue) =>
          removedValueIds.has(optionValue.id)
        )

        if (!hasRemovedValue) {
          continue
        }

        const options: Record<string, string> = {}
        for (const optionValue of variantOptions) {
          const optionTitle = optionValue.option_id
            ? optionTitleById.get(optionValue.option_id)
            : undefined
          if (optionTitle) {
            options[optionTitle] = optionValue.value
          }
        }

        if (Object.keys(options).length) {
          variantsToRestore.push({
            id: variant.id,
            options,
          })
        }
      }
    }

    const links = pairs
      .map((pair) => {
        const key = `${pair.product_id}_${pair.product_option_id}`
        const valueIds = valueIdsByPairKey.get(key)
        // this PPO link doesn't exist we don't want to recreate it in compensation
        if (!valueIds) {
          return null
        }

        return {
          ...pair,
          product_option_value_ids: valueIds,
        }
      })
      .filter((pair) => !!pair)

    // Removal soft-deletes any exclusive option it orphans; the returned ids
    // let us restore exactly those on compensation.
    const deletedOptionIds = await service.removeProductOptionFromProduct(pairs)

    return new StepResponse(void 0, {
      links,
      deletedOptionIds,
      variantsToRestore,
    })
  },
  async (compensationData, { container }) => {
    const links = compensationData?.links ?? []
    const deletedOptionIds = compensationData?.deletedOptionIds ?? []
    const variantsToRestore = compensationData?.variantsToRestore ?? []

    if (!links.length && !deletedOptionIds.length && !variantsToRestore.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    if (deletedOptionIds.length) {
      await service.restoreProductOptions(deletedOptionIds)
    }

    if (links.length) {
      await service.addProductOptionToProduct(links)
    }

    if (variantsToRestore.length) {
      await service.upsertProductVariants(variantsToRestore)
    }
  }
)
