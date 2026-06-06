import {
  FilterableProductVariantProps,
  FindConfig,
  IProductModuleService,
  ProductVariantDTO,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The details of the variants to retrieve.
 */
export interface GetVariantsStepInput {
  filter?: FilterableProductVariantProps
  config?: FindConfig<ProductVariantDTO>
}

export const getVariantsStepId = "get-variants"
/**
 * This step retrieves variants matching the specified filters.
 *
 * @example
 * const data = getVariantsStep({
 *   filter: {
 *     id: "variant_123"
 *   }
 * })
 */
export const getVariantsStep = createStep(
  getVariantsStepId,
  async (data: GetVariantsStepInput, { container }) => {
    const productModuleService = container.resolve<IProductModuleService>(
      Modules.PRODUCT
    )

    const variants = await productModuleService.listProductVariants(
      data.filter,
      data.config
    )

    return new StepResponse(variants)
  }
)
