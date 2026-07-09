import type {
  IProductModuleService,
  ProductTypes,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The data to update product option values linked to products.
 */
export type UpdateProductOptionValuesOnProductStepInput =
  ProductTypes.ProductOptionProductValueUpdate[]

export const updateProductOptionValuesOnProductStepId =
  "update-product-option-values-on-product"
/**
 * This step updates product option values linked to products.
 */
export const updateProductOptionValuesOnProductStep = createStep(
  updateProductOptionValuesOnProductStepId,
  async (
    updates: UpdateProductOptionValuesOnProductStepInput,
    { container }
  ) => {
    const effectiveUpdates = updates.filter(
      (pair) => pair.add?.length || pair.remove?.length
    )

    if (!effectiveUpdates.length) {
      return new StepResponse(void 0, [])
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)
    const productIds = [
      ...new Set(effectiveUpdates.map((pair) => pair.product_id)),
    ]
    const products = await service.listProducts(
      { id: productIds },
      { relations: ["options.values"] }
    )

    const existingValueIdsByPairKey = new Map<string, Set<string>>()
    for (const product of products) {
      for (const option of product.options ?? []) {
        const valueIds = (option.values ?? []).map((value) => value.id)
        existingValueIdsByPairKey.set(
          `${product.id}_${option.id}`,
          new Set(valueIds)
        )
      }
    }

    await service.updateProductOptionValuesOnProduct(effectiveUpdates)

    const updatedProducts = await service.listProducts(
      { id: productIds },
      { relations: ["options.values"] }
    )

    const updatedValueIdsByPairKey = new Map<string, Set<string>>()
    for (const product of updatedProducts) {
      for (const option of product.options ?? []) {
        const valueIds = (option.values ?? []).map((value) => value.id)
        updatedValueIdsByPairKey.set(
          `${product.id}_${option.id}`,
          new Set(valueIds)
        )
      }
    }

    const compensation = effectiveUpdates
      .map((pair) => {
        const key = `${pair.product_id}_${pair.product_option_id}`
        const existingValueIds = existingValueIdsByPairKey.get(key) ?? new Set()
        const updatedValueIds = updatedValueIdsByPairKey.get(key) ?? new Set()

        const actualAdds = [...updatedValueIds].filter(
          (valueId) => !existingValueIds.has(valueId)
        )
        const actualRemoves = [...existingValueIds].filter(
          (valueId) => !updatedValueIds.has(valueId)
        )

        return {
          product_id: pair.product_id,
          product_option_id: pair.product_option_id,
          add: actualRemoves,
          remove: actualAdds,
        }
      })
      .filter((pair) => pair.add?.length || pair.remove?.length)

    return new StepResponse(void 0, compensation)
  },
  async (
    compensation: UpdateProductOptionValuesOnProductStepInput | void,
    { container }
  ) => {
    if (!compensation?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.updateProductOptionValuesOnProduct(compensation)
  }
)
