import { CreateMoneyAmountDTO, ProductTypes } from "@medusajs/types"
import { Modules, arrayDifference } from "@medusajs/utils"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { removeRemoteLinkStep, useRemoteQueryStep } from "../../common"
import { createPriceSetsStep, updatePriceSetsStep } from "../../pricing"
import { createVariantPricingLinkStep } from "../steps"

type WorkflowInput = {
  variantPrices: {
    variant_id: string
    product_id: string
    prices?: CreateMoneyAmountDTO[]
  }[]
  previousVariantIds: string[]
}

export const upsertVariantPricesWorkflowId = "upsert-variant-prices"
export const upsertVariantPricesWorkflow = createWorkflow(
  upsertVariantPricesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    const removedVariantIds = transform({ input }, (data) => {
      return arrayDifference(
        data.input.previousVariantIds,
        data.input.variantPrices.map((v) => v.variant_id)
      )
    })

    removeRemoteLinkStep({
      [Modules.PRODUCT]: { variant_id: removedVariantIds },
    }).config({ name: "remove-variant-link-step" })

    const { newVariants, existingVariants } = transform({ input }, (data) => {
      const previousMap = new Map(
        data.input.previousVariantIds.map((v) => [v, true])
      )

      return {
        existingVariants: data.input.variantPrices.filter((v) =>
          previousMap.has(v.variant_id)
        ),
        newVariants: data.input.variantPrices.filter(
          (v) => !previousMap.has(v.variant_id)
        ),
      }
    })

    const existingVariantIds = transform({ existingVariants }, (data) =>
      data.existingVariants.map((v) => v.variant_id)
    )

    const existingLinks = useRemoteQueryStep({
      entry_point: "product_variant_price_set",
      fields: ["variant_id", "price_set_id"],
      variables: { filters: { variant_id: existingVariantIds } },
    })

    const pricesToUpdate = transform(
      { existingVariants, existingLinks },
      (data) => {
        const linksMap = new Map(
          data.existingLinks.map((l) => [l.variant_id, l.price_set_id])
        )

        return {
          price_sets: data.existingVariants
            .map((v, i) => {
              const priceSetId = linksMap.get(v.variant_id)

              if (!priceSetId) {
                return
              }

              return {
                id: priceSetId,
                prices: v.prices,
              }
            })
            .filter(Boolean),
        }
      }
    )

    updatePriceSetsStep(pricesToUpdate)

    // Note: We rely on the same order of input and output when creating variants here, make sure that assumption holds
    const pricesToCreate = transform({ newVariants }, (data) =>
      data.newVariants.map((v) => {
        return {
          prices: v.prices,
        }
      })
    )

    const createdPriceSets = createPriceSetsStep(pricesToCreate)

    const variantAndPriceSetLinks = transform(
      { newVariants, createdPriceSets },
      (data) => {
        return {
          links: data.newVariants.map((variant, i) => ({
            variant_id: variant.variant_id,
            price_set_id: data.createdPriceSets[i].id,
          })),
        }
      }
    )

    createVariantPricingLinkStep(variantAndPriceSetLinks)
  }
)
