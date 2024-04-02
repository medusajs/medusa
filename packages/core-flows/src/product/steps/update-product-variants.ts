import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductTypes } from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateProductVariantsStepInput = {
  selector: ProductTypes.FilterableProductVariantProps
  update: ProductTypes.UpdateProductVariantDTO
}

export const updateProductVariantsStepId = "update-product-variants"
export const updateProductVariantsStep = createStep(
  updateProductVariantsStepId,
  async (data: UpdateProductVariantsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listVariants(data.selector, {
      select: selects,
      relations,
    })

    const productVariants = await service.updateVariants(
      data.selector,
      data.update
    )
    return new StepResponse(productVariants, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.upsertVariants(prevData)
  }
)
