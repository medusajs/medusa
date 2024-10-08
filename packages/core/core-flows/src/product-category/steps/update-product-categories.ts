import {
  FilterableProductCategoryProps,
  IProductModuleService,
  UpdateProductCategoryDTO,
} from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdateProductCategoriesStepInput = {
  selector: FilterableProductCategoryProps
  update: UpdateProductCategoryDTO
}

export const updateProductCategoriesStepId = "update-product-categories"
/**
 * This step updates product categories matching specified filters.
 */
export const updateProductCategoriesStep = createStep(
  updateProductCategoriesStepId,
  async (data: UpdateProductCategoriesStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listProductCategories(data.selector, {
      select: selects,
      relations,
    })

    const productCategories = await service.updateProductCategories(
      data.selector,
      data.update
    )
    return new StepResponse(productCategories, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.upsertProductCategories(prevData)
  }
)
