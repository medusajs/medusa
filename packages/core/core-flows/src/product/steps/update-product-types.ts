import { IProductModuleService, ProductTypes } from "@medusajs/types"
import {
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateProductTypesStepInput = {
  selector: ProductTypes.FilterableProductTypeProps
  update: ProductTypes.UpdateProductTypeDTO
}

export const updateProductTypesStepId = "update-product-types"
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

    console.log("Product types selector", data.selector)

    const productTypes = await service.updateProductTypes(
      data.selector,
      data.update
    )
    console.log("PRODUCT TYPES result", productTypes)
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
