import { IProductModuleService, ProductTypes } from "@medusajs/types"
import {
  MedusaError,
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export type UpdateProductsStepInput =
  | {
      selector: ProductTypes.FilterableProductProps
      update: ProductTypes.UpdateProductDTO
    }
  | {
      products: ProductTypes.UpsertProductDTO[]
    }

export const updateProductsStepId = "update-products"
export const updateProductsStep = createStep(
  updateProductsStepId,
  async (data: UpdateProductsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    if ("products" in data) {
      if (data.products.some((p) => !p.id)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Product ID is required when doing a batch update of products"
        )
      }

      if (!data.products.length) {
        return new StepResponse([], [])
      }

      const prevData = await service.listProducts({
        id: data.products.map((p) => p.id) as string[],
      })

      const products = await service.upsertProducts(data.products)
      return new StepResponse(products, prevData)
    }

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listProducts(data.selector, {
      select: selects,
      relations,
    })

    const products = await service.updateProducts(data.selector, data.update)
    return new StepResponse(products, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    await service.upsertProducts(
      prevData.map((r) => ({
        ...(r as unknown as ProductTypes.UpdateProductDTO),
      }))
    )
  }
)
