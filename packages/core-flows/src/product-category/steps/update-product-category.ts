import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IProductModuleService,
  UpdateProductCategoryDTO,
} from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateProductCategoryStepInput = {
  id: string
  data: UpdateProductCategoryDTO
}

export const updateProductCategoryStepId = "update-product-category"
export const updateProductCategoryStep = createStep(
  updateProductCategoryStepId,
  async (data: UpdateProductCategoryStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.data,
    ])

    const prevData = await service.listCategories(
      { id: data.id },
      {
        select: selects,
        relations,
      }
    )

    const updated = await service.updateCategory(data.id, data.data)

    return new StepResponse(updated, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    // TODO: Should be removed when bulk update is implemented
    const category = prevData[0]

    await service.updateCategory(category.id, {
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      is_internal: category.is_internal,
      rank: category.rank,
      handle: category.handle,
      metadata: category.metadata,
      parent_category_id: category.parent_category_id,
    })
  }
)
