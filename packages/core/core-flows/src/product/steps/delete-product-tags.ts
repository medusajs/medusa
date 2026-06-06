import type { IProductModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the product tags to delete.
 */
export type DeleteProductTagsStepInput = string[]

export const deleteProductTagsStepId = "delete-product-tags"
/**
 * This step deletes one or more product tags.
 */
export const deleteProductTagsStep = createStep(
  deleteProductTagsStepId,
  async (ids: DeleteProductTagsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.softDeleteProductTags(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.restoreProductTags(prevIds)
  }
)
