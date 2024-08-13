import {
  FilterableProductVariantProps,
  FindConfig,
  IProductModuleService,
  ProductVariantDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export interface GetVariantsStepInput {
  filter?: FilterableProductVariantProps
  config?: FindConfig<ProductVariantDTO>
}

export const getVariantsStepId = "get-variants"
/**
 * This step retrieves variants matching the specified filters.
 */
export const getVariantsStep = createStep(
  getVariantsStepId,
  async (data: GetVariantsStepInput, { container }) => {
    const productModuleService = container.resolve<IProductModuleService>(
      ModuleRegistrationName.PRODUCT
    )

    const variants = await productModuleService.listProductVariants(
      data.filter,
      data.config
    )

    return new StepResponse(variants)
  }
)
