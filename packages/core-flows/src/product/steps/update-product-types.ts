import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductTypes } from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
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

    const prevData = await service.listTypes(data.selector, {
      select: selects,
      relations,
    })

    const productTypes = await service.updateTypes(data.selector, data.update)
    return new StepResponse(productTypes, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.upsertTypes(prevData)
  }
)
