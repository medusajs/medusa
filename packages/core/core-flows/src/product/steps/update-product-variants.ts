import { IProductModuleService, ProductTypes } from "@medusajs/framework/types"
import {
  MedusaError,
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export type UpdateProductVariantsStepInput =
  | {
      selector: ProductTypes.FilterableProductVariantProps
      update: ProductTypes.UpdateProductVariantDTO
    }
  | {
      product_variants: ProductTypes.UpsertProductVariantDTO[]
    }

export const updateProductVariantsStepId = "update-product-variants"
/**
 * This step updates one or more product variants.
 */
export const updateProductVariantsStep = createStep(
  updateProductVariantsStepId,
  async (data: UpdateProductVariantsStepInput, { container }) => {
    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    if ("product_variants" in data) {
      if (data.product_variants.some((p) => !p.id)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Product variant ID is required when doing a batch update of product variants"
        )
      }

      const prevData = await service.listProductVariants({
        id: data.product_variants.map((p) => p.id) as string[],
      })

      const productVariants = await service.upsertProductVariants(
        data.product_variants
      )
      return new StepResponse(productVariants, prevData)
    }

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const prevData = await service.listProductVariants(data.selector, {
      select: selects,
      relations,
    })

    const productVariants = await service.updateProductVariants(
      data.selector,
      data.update
    )
    return new StepResponse(productVariants, prevData)
  },
  async (prevData, { container }) => {
    if (!prevData?.length) {
      return
    }

    const service = container.resolve<IProductModuleService>(Modules.PRODUCT)

    await service.upsertProductVariants(prevData)
  }
)
