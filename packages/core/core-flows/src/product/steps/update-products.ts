import type {
  IProductModuleService,
  ProductTypes,
} from "@zjedene-medusa/framework/types"
import {
  MedusaError,
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the products update.
 */
export type UpdateProductsStepInput =
  | {
      /**
       * The filters to select the products to update.
       */
      selector: ProductTypes.FilterableProductProps
      /**
       * The data to update the products with.
       */
      update: ProductTypes.UpdateProductDTO
    }
  | {
      /**
       * The data to create or update products.
       */
      products: ProductTypes.UpsertProductDTO[]
    }

export const updateProductsStepId = "update-products"
/**
 * This step updates one or more products.
 *
 * @example
 * To update products by their ID:
 *
 * ```ts
 * const data = updateProductsStep({
 *   products: [
 *     {
 *       id: "prod_123",
 *       title: "Shirt"
 *     }
 *   ]
 * })
 * ```
 *
 * To update products matching a filter:
 *
 * ```ts
 * const data = updateProductsStep({
 *   selector: {
 *     collection_id: "collection_123",
 *   },
 *   update: {
 *     material: "cotton",
 *   }
 * })
 * ```
 */
export const updateProductsStep = createStep(
  updateProductsStepId,
  async (data: UpdateProductsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

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

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.upsertProducts(
      prevData.map((r) => ({
        ...(r as unknown as ProductTypes.UpdateProductDTO),
      }))
    )
  }
)
