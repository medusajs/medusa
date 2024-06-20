import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  FilterableProductCategoryProps,
  IProductModuleService,
  UpdateProductCategoryDTO,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateProductCategoriesStepInput = {
  selector: FilterableProductCategoryProps
  update: UpdateProductCategoryDTO
}

export const updateProductCategoriesStepId = "update-product-categories"
export const updateProductCategoriesStep = createStep(
  updateProductCategoriesStepId,
  async (data: UpdateProductCategoriesStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

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

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.upsertProductCategories(prevData)
  }
)
