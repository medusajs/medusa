import { PricingTypes, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { createPriceSetsStep } from "../../pricing"
import { createProductVariantsStep } from "../steps/create-product-variants"
import { createVariantPricingLinkStep } from "../steps/create-variant-pricing-link"

// TODO: Create separate typings for the workflow input
type WorkflowInput = {
  product_variants: (ProductTypes.CreateProductVariantDTO & {
    prices?: PricingTypes.CreateMoneyAmountDTO[]
  })[]
}

export const createProductVariantsWorkflowId = "create-product-variants"
export const createProductVariantsWorkflow = createWorkflow(
  createProductVariantsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<ProductTypes.ProductVariantDTO[]> => {
    // Passing prices to the product module will fail, we want to keep them for after the variant is created.
    const variantsWithoutPrices = transform({ input }, (data) =>
      data.input.product_variants.map((v) => ({
        ...v,
        prices: undefined,
      }))
    )

    const createdVariants = createProductVariantsStep(variantsWithoutPrices)

    // Note: We rely on the same order of input and output when creating variants here, make sure that assumption holds
    const pricesToCreate = transform({ input, createdVariants }, (data) =>
      data.createdVariants.map((v, i) => {
        return {
          prices: data.input.product_variants[i]?.prices,
        }
      })
    )

    // TODO: From here until the final transform the code is the same as when creating a product, we can probably refactor
    const createdPriceSets = createPriceSetsStep(pricesToCreate)

    const variantAndPriceSets = transform(
      { createdVariants, createdPriceSets },
      (data) => {
        return data.createdVariants.map((variant, i) => ({
          variant: variant,
          price_set: data.createdPriceSets[i],
        }))
      }
    )

    const variantAndPriceSetLinks = transform(
      { variantAndPriceSets },
      (data) => {
        return {
          links: data.variantAndPriceSets.map((entry) => ({
            variant_id: entry.variant.id,
            price_set_id: entry.price_set.id,
          })),
        }
      }
    )

    createVariantPricingLinkStep(variantAndPriceSetLinks)

    return transform(
      {
        variantAndPriceSets,
      },
      (data) => {
        return data.variantAndPriceSets.map((variantAndPriceSet) => ({
          ...variantAndPriceSet.variant,
          ...variantAndPriceSet.price_set,
        }))
      }
    )
  }
)
