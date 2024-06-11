import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteProductCategoryStepId = "delete-product-category"
export const deleteProductCategoryStep = createStep(
  deleteProductCategoryStepId,
  async (id: string, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.deleteCategory(id)
    return new StepResponse(void 0, id)
  },
  async (prevId, { container }) => {
    if (!prevId) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    // TODO: There is no soft delete support for categories yet
    // await service.restoreCategory(prevId)
  }
)
