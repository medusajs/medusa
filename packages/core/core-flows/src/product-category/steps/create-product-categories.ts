import {
  CreateProductCategoryDTO,
  IProductModuleService,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type CreateProductCategoriesStepInput = {
  product_categories: CreateProductCategoryDTO[]
}

export const createProductCategoriesStepId = "create-product-categories"
export const createProductCategoriesStep = createStep(
  createProductCategoriesStepId,
  async (data: CreateProductCategoriesStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const created = await service.createProductCategories(
      data.product_categories
    )

    return new StepResponse(
      created,
      created.map((c) => c.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.deleteProductCategories(createdIds)
  }
)
