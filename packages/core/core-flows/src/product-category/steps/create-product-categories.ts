import {
  CreateProductCategoryDTO,
  IProductModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type CreateProductCategoriesStepInput = {
  product_categories: CreateProductCategoryDTO[]
}

export const createProductCategoriesStepId = "create-product-categories"
/**
 * This step creates one or more product categories.
 */
export const createProductCategoriesStep = createStep(
  createProductCategoriesStepId,
  async (data: CreateProductCategoriesStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

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

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.deleteProductCategories(createdIds)
  }
)
