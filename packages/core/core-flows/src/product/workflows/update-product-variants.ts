import { PricingTypes, ProductTypes } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { updateProductVariantsStep } from "../steps"
import { updatePriceSetsStep } from "../../pricing"
import { getVariantPricingLinkStep } from "../steps/get-variant-pricing-link"

type UpdateProductVariantsStepInput =
  | {
      selector: ProductTypes.FilterableProductVariantProps
      update: ProductTypes.UpdateProductVariantDTO & {
        prices?: Partial<PricingTypes.CreateMoneyAmountDTO>[]
      }
    }
  | {
      product_variants: (ProductTypes.UpsertProductVariantDTO & {
        prices?: Partial<PricingTypes.CreateMoneyAmountDTO>[]
      })[]
    }

type WorkflowInput = UpdateProductVariantsStepInput & {
  additional_data?: Record<string, unknown>
}

export const updateProductVariantsWorkflowId = "update-product-variants"
export const updateProductVariantsWorkflow = createWorkflow(
  updateProductVariantsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    // Passing prices to the product module will fail, we want to keep them for after the variant is updated.
    const updateWithoutPrices = transform({ input }, (data) => {
      if ("product_variants" in data.input) {
        return {
          product_variants: data.input.product_variants.map((variant) => {
            return {
              ...variant,
              prices: undefined,
            }
          }),
        }
      }

      return {
        selector: data.input.selector,
        update: {
          ...data.input.update,
          prices: undefined,
        },
      }
    })

    const updatedVariants = updateProductVariantsStep(updateWithoutPrices)

    // We don't want to do any pricing updates if the prices didn't change
    const variantIds = transform({ input, updatedVariants }, (data) => {
      if ("product_variants" in data.input) {
        return data.updatedVariants.map((v) => v.id)
      }

      if (!data.input.update.prices) {
        return []
      }

      return data.updatedVariants.map((v) => v.id)
    })

    const variantPriceSetLinks = getVariantPricingLinkStep({
      ids: variantIds,
    })

    const pricesToUpdate = transform(
      { input, variantPriceSetLinks },
      (data) => {
        if (!data.variantPriceSetLinks.length) {
          return {}
        }

        if ("product_variants" in data.input) {
          const priceSets = data.variantPriceSetLinks
            .map((link) => {
              if (!("product_variants" in data.input)) {
                return
              }

              const variant = data.input.product_variants.find(
                (v) => v.id === link.variant_id
              )!

              return {
                id: link.price_set_id,
                prices: variant.prices,
              } as PricingTypes.UpsertPriceSetDTO
            })
            .filter(Boolean)

          return { price_sets: priceSets }
        }

        return {
          selector: {
            id: data.variantPriceSetLinks.map((link) => link.price_set_id),
          } as PricingTypes.FilterablePriceSetProps,
          update: {
            prices: data.input.update.prices,
          } as PricingTypes.UpdatePriceSetDTO,
        }
      }
    )

    const updatedPriceSets = updatePriceSetsStep(pricesToUpdate)

    // We want to correctly return the variants with their associated price sets and the prices coming from it
    const response = transform(
      {
        variantPriceSetLinks,
        updatedVariants,
        updatedPriceSets,
      },
      (data) => {
        return data.updatedVariants.map((variant) => {
          const linkForVariant = data.variantPriceSetLinks?.find(
            (link) => link.variant_id === variant.id
          )

          const priceSetForVariant = data.updatedPriceSets?.find(
            (priceSet) => priceSet.id === linkForVariant?.price_set_id
          )

          return { ...variant, price_set: priceSetForVariant }
        })
      }
    )

    const productVariantsUpdated = createHook("productVariantsUpdated", {
      update: updateWithoutPrices.update,
      selector: updateWithoutPrices.selector,
      product_variants: updateWithoutPrices.product_variants,
      additional_data: input.additional_data,
      variants: response,
    })

    return new WorkflowResponse(response, {
      hooks: [productVariantsUpdated],
    })
  }
)
