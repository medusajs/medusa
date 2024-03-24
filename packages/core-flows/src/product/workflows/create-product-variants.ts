import { ProductTypes, PricingTypes } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createProductVariantsStep,
  createVariantPricingLinkStep,
} from "../steps"
import { createPriceSetsStep } from "../../pricing"

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
    const variantsWithAssociatedPrices = transform(
      { input, createdVariants },
      (data) =>
        data.createdVariants
          .map((variant, i) => {
            return {
              id: variant.id,
              prices: data.input.product_variants[i]?.prices,
            }
          })
          .flat()
          .filter((v) => !!v.prices?.length)
    )

    // TODO: From here until the final transform the code is the same as when creating a product, we can probably refactor
    const createdPriceSets = createPriceSetsStep(variantsWithAssociatedPrices)

    const variantAndPriceSets = transform(
      { variantsWithAssociatedPrices, createdPriceSets },
      (data) => {
        return data.variantsWithAssociatedPrices.map((variant, i) => ({
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
        createdVariants,
        variantAndPriceSets,
      },
      (data) => {
        return data.createdVariants.map((variant) => ({
          ...variant,
          price_set: data.variantAndPriceSets.find(
            (v) => v.variant.id === variant.id
          )?.price_set,
        }))
      }
    )
  }
)
