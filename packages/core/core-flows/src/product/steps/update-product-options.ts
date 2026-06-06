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
 * The data to identify and update the product options.
 */
export type UpdateProductOptionsStepInput = {
  /**
   * The filters to select the product options to update.
   */
  selector: ProductTypes.FilterableProductOptionProps
  /**
   * The data to update the product options with.
   */
  update: ProductTypes.UpdateProductOptionDTO
}

export const updateProductOptionsStepId = "update-product-options"
/**
 * This step updates product options matching the specified filters.
 *
 * @example
 * const data = updateProductOptionsStep({
 *   selector: {
 *     id: "popt_123"
 *   },
 *   update: {
 *     title: "Size"
 *   }
 * })
 */
export const updateProductOptionsStep = createStep(
  updateProductOptionsStepId,
  async (data: UpdateProductOptionsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listProductOptions(data.selector, {
      select: selects,
      relations,
    })

    const productOptions = await service.updateProductOptions(
      data.selector,
      data.update
    )
    return new StepResponse(productOptions, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.upsertProductOptions(
      prevData.map((o) => ({
        ...o,
        values: o.values?.map((v) => v.value),
        product: undefined,
        product_id: o.product_id ?? undefined,
      }))
    )
  }
)
