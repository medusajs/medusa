import type {
  IProductModuleService,
  ProductTypes,
} from "@medusajs/framework/types"
import {
  getSelectsAndRelationsFromObjectArray,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"

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

    const { ranks, ...cleanedUpdate } = data.update
    const { selects } = getSelectsAndRelationsFromObjectArray([cleanedUpdate])

    const prevData = await service.listProductOptions(data.selector, {
      select: selects,
      relations: ["values"],
    })

    if (!prevData.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product option with id "${data.selector.id}" not found`
      )
    }

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
      }))
    )
  }
)
