import { IProductModuleService, ProductTypes } from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export type UpdateProductTypesStepInput = {
  selector: ProductTypes.FilterableProductTypeProps
  update: ProductTypes.UpdateProductTypeDTO
}

export const updateProductTypesStepId = "update-product-types"
/**
 * This step updates product types matching the specified filters.
 */
export const updateProductTypesStep = createStep(
  updateProductTypesStepId,
  async (data: UpdateProductTypesStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

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

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.upsertProductTypes(prevData)
  }
)
