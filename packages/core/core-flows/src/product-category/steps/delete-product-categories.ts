import type { IProductModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The IDs of the product categories to delete.
 */
export type DeleteProductCategoriesStepInput = string[]

export const deleteProductCategoriesStepId = "delete-product-categories"
/**
 * This step deletes one or more product categories.
 *
 * The IDs are validated and deleted as a single batch, so the input must not contain both a category
 * and any of its descendants. If it does, the step throws an error, as deleting a product category
 * that has child categories isn't allowed. Ordering the input array deepest-first has no effect.
 *
 * @example
 * const data = deleteProductCategoriesStep(["pcat_123"])
 */
export const deleteProductCategoriesStep = createStep(
  deleteProductCategoriesStepId,
  async (ids: DeleteProductCategoriesStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.softDeleteProductCategories(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.restoreProductCategories(prevIds)
  }
)
