import { IProductModuleService, ProductTypes } from "@medusajs/framework/types"
import {
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdateProductOptionsStepInput = {
  selector: ProductTypes.FilterableProductOptionProps
  update: ProductTypes.UpdateProductOptionDTO
}

export const updateProductOptionsStepId = "update-product-options"
/**
 * This step updates product options matching the specified filters.
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
