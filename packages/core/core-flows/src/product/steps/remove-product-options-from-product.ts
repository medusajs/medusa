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
      return new StepResponse(void 0, { links: [], deletedOptionIds: [] })
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    /**
     * Read the values for PPO pair before removal so we can properly compensate them
     */
    const productIds = [...new Set(pairs.map((pair) => pair.product_id))]
    const products = await service.listProducts(
      { id: productIds },
      { relations: ["options.values"] }
    )

    const valueIdsByPairKey = new Map<string, string[]>()
    for (const product of products) {
      for (const option of product.options ?? []) {
        const valueIds = (option.values ?? []).map((value) => value.id)
        valueIdsByPairKey.set(`${product.id}_${option.id}`, valueIds)
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

    return new StepResponse(void 0, { links, deletedOptionIds })
  },
  async (compensationData, { container }) => {
    const links = compensationData?.links ?? []
    const deletedOptionIds = compensationData?.deletedOptionIds ?? []

    if (!links.length && !deletedOptionIds.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    if (deletedOptionIds.length) {
      await service.restoreProductOptions(deletedOptionIds)
    }

    if (links.length) {
      await service.addProductOptionToProduct(links)
    }
  }
)
