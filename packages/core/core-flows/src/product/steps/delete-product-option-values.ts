import type { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The IDs of the product option values to delete.
 */
export type DeleteProductOptionValuesStepInput = string[]

export const deleteProductOptionValuesStepId = "delete-product-option-values"
/**
 * This step deletes one or more product option values.
 */
export const deleteProductOptionValuesStep = createStep(
  deleteProductOptionValuesStepId,
  async (ids: DeleteProductOptionValuesStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.softDeleteProductOptionValues(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.restoreProductOptionValues(prevIds)
  }
)
