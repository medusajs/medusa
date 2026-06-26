import type {
  IProductModuleService,
  ProductTypes,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

/**
 * The data to update a product option value.
 */
export type UpdateProductOptionValuesStepInput = {
  /**
   * The ID of the product option value to update.
   */
  id: string
  /**
   * The data to update in the product option value.
   */
  update: ProductTypes.UpdateProductOptionValueDTO
}

export const updateProductOptionValuesStepId = "update-product-option-values"
/**
 * This step updates a product option value.
 *
 * @example
 * const data = updateProductOptionValuesStep({
 *   id: "optval_123",
 *   update: {
 *     metadata: { is_default: true }
 *   }
 * })
 */
export const updateProductOptionValuesStep = createStep(
  updateProductOptionValuesStepId,
  async (data: UpdateProductOptionValuesStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    const prevData = await service.retrieveProductOptionValue(data.id, {
      select: ["id", "value", "metadata"],
    })

    const productOptionValue = await service.updateProductOptionValues(
      data.id,
      data.update
    )

    return new StepResponse(productOptionValue, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.updateProductOptionValues(prevData.id, {
      value: prevData.value,
      metadata: prevData.metadata,
    })
  }
)
