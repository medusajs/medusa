import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IProductModuleService, ProductTypes } from "@medusajs/types"
import { getSelectsAndRelationsFromObjectArray } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdateProductsStepInput = {
  selector: ProductTypes.FilterableProductProps
  update: ProductTypes.UpdateProductDTO
}

export const updateProductsStepId = "update-products"
export const updateProductsStep = createStep(
  updateProductsStepId,
  async (data: UpdateProductsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.list(data.selector, {
      select: selects,
      relations,
    })

    // TODO: We need to update the module's signature
    // const products = await service.update(data.selector, data.update)
    const products = []
    return new StepResponse(products, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    // TODO: We need to update the module's signature
    // await service.upsert(
    //   prevData.map((r) => ({
    //     ...r,
    //   }))
    // )
  }
)
