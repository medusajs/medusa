import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const deleteProductsStepId = "delete-products"
export const deleteProductsStep = createStep(
  deleteProductsStepId,
  async (ids: string[], { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.softDeleteProducts(ids)
    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.restoreProducts(prevIds)
  }
)
