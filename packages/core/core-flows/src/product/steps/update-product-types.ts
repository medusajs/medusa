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
export type UpdateProductTypesStepInput = {
  /**
   * The filters to select the product types to update.
   */
  selector: ProductTypes.FilterableProductTypeProps
  /**
   * The data to update the product types with.
   */
  update: ProductTypes.UpdateProductTypeDTO
}

export const updateProductTypesStepId = "update-product-types"
/**
 * This step updates product types matching the specified filters.
 *
 * @example
 * const data = updateProductTypesStep({
 *   selector: {
 *     id: "popt_123"
 *   },
 *   update: {
 *     value: "clothing"
 *   }
 * })
 */
export const updateProductTypesStep = createStep(
  updateProductTypesStepId,
  async (data: UpdateProductTypesStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listProductTypes(data.selector, {
      select: selects,
      relations,
    })

    const productTypes = await service.updateProductTypes(
      data.selector,
      data.update
    )
    return new StepResponse(productTypes, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.upsertProductTypes(prevData)
  }
)
