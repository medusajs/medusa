import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  CreateProductCategoryDTO,
  IProductModuleService,
} from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateProductCategoryStepInput = {
  product_category: CreateProductCategoryDTO
}

export const createProductCategoryStepId = "create-product-category"
export const createProductCategoryStep = createStep(
  createProductCategoryStepId,
  async (data: CreateProductCategoryStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const created = await service.createCategory(data.product_category)

    return new StepResponse(created, created.id)
  },
  async (createdId, { container }) => {
    if (!createdId) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.deleteCategory(createdId)
  }
)
