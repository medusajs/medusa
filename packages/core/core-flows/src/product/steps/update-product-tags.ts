import type {
  IProductModuleService,
  ProductTypes,
} from "@zjedene-medusa/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to identify and update the product tags.
 */
export type UpdateProductTagsStepInput = {
  /**
   * The filters to select the product tags to update.
   */
  selector: ProductTypes.FilterableProductTagProps
  /**
   * The data to update the product tags with.
   */
  update: ProductTypes.UpdateProductTagDTO
}

export const updateProductTagsStepId = "update-product-tags"
/**
 * This step updates product tags matching the specified filters.
 *
 * @example
 * const data = updateProductTagsStep({
 *   selector: {
 *     id: "popt_123"
 *   },
 *   update: {
 *     value: "clothing"
 *   }
 * })
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
