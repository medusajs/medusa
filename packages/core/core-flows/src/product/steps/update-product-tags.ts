import { IProductModuleService, ProductTypes } from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdateProductTagsStepInput = {
  selector: ProductTypes.FilterableProductTagProps
  update: ProductTypes.UpdateProductTagDTO
}

export const updateProductTagsStepId = "update-product-tags"
/**
 * This step updates product tags matching the specified filters.
 */
export const updateProductTagsStep = createStep(
  updateProductTagsStepId,
  async (data: UpdateProductTagsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listProductTags(data.selector, {
      select: selects,
      relations,
    })

    const productTags = await service.updateProductTags(
      data.selector,
      data.update
    )
    return new StepResponse(productTags, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.upsertProductTags(prevData)
  }
)
