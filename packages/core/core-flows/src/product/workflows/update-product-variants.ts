import {
  AdditionalData,
  PricingTypes,
  ProductTypes,
} from "@medusajs/framework/types"
import { ProductVariantWorkflowEvents } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { emitEventStep } from "../../common"
import { updatePriceSetsStep } from "../../pricing"
import {
  dismissProductVariantsInventoryStep,
  updateProductVariantsStep,
} from "../steps"
import { getVariantPricingLinkStep } from "../steps/get-variant-pricing-link"

/**
 * The data to update one or more product variants, along with custom data that's passed to the workflow's hooks.
 */
export type UpdateProductVariantsWorkflowInput = (
  | {
      /**
       * A filter to select the product variants to update.
       */
      selector: ProductTypes.FilterableProductVariantProps
      /**
       * The data to update in the product variants.
       */
      update: ProductTypes.UpdateProductVariantDTO & {
        /**
         * The product variant's prices.
         */
        prices?: Partial<PricingTypes.CreateMoneyAmountDTO>[]
      }
    }
  | {
      /**
       * The product variants to update.
       */
      product_variants: (ProductTypes.UpsertProductVariantDTO & {
        /**
         * The product variant's prices.
         */
        prices?: Partial<PricingTypes.CreateMoneyAmountDTO>[]
      })[]
    }
) &
  AdditionalData

export const updateProductVariantsWorkflowId = "update-product-variants"
/**
 * This workflow updates one or more product variants. It's used by the [Update Product Variant Admin API Route](https://docs.medusajs.com/api/admin#products_postproductsidvariantsvariant_id).
 *
 * This workflow has a hook that allows you to perform custom actions on the updated product variants. For example, you can pass under `additional_data` custom data that
 * allows you to update custom data models linked to the product variants.
 *
 * You can also use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around product-variant update.
 *
 * :::note
 *
 * Learn more about adding rules to the product variant's prices in the Pricing Module's
 * [Price Rules](https://docs.medusajs.com/resources/commerce-modules/pricing/price-rules) documentation.
 *
 * :::
 *
 * @example
 * To update product variants by their IDs:
 *
 * ```ts
 * const { result } = await updateProductVariantsWorkflow(container)
 * .run({
 *   input: {
 *     product_variants: [
 *       {
 *         id: "variant_123",
 *         prices: [
 *           {
 *             amount: 10,
 *             currency_code: "usd",
 *           }
 *         ]
 *       },
 *       {
 *         id: "variant_321",
 *         title: "Small Shirt",
 *       },
 *     ],
 *     additional_data: {
 *       erp_id: "123"
 *     }
 *   }
 * })
 * ```
 *
 * You can also update product variants by a selector:
 *
 * ```ts
 * const { result } = await updateProductVariantsWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       product_id: "prod_123"
 *     },
 *     update: {
 *       prices: [
 *         {
 *           amount: 10,
 *           currency_code: "usd"
 *         }
 *       ]
 *     },
 *     additional_data: {
 *       erp_id: "123"
 *     }
 *   }
 * })
 * ```
 *
 * @summary
 *
 * Update one or more product variants.
 *
 * @property hooks.productVariantsUpdated - This hook is executed after the product variants are updated. You can consume this hook to perform custom actions on the updated product variants.
 */
export const updateProductVariantsWorkflow = createWorkflow(
  updateProductVariantsWorkflowId,
  (input: WorkflowData<UpdateProductVariantsWorkflowInput>) => {
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

    const variantsToDismissInventory = transform(
      { input, updatedVariants },
      (data) => {
        const variantIds: string[] = []

        if ("product_variants" in data.input) {
          for (const variant of data.input.product_variants) {
            if (variant.id && variant.manage_inventory === false) {
              variantIds.push(variant.id)
            }
          }
        } else if (
          data.input.update &&
          data.input.update?.manage_inventory === false
        ) {
          variantIds.push(...data.updatedVariants.map((v) => v.id))
        }

        return variantIds
      }
    )

    dismissProductVariantsInventoryStep({
      variantIds: variantsToDismissInventory,
    })

    // We don't want to do any pricing updates if the prices didn't change
    const variantIds = transform({ input, updatedVariants }, (data) => {
      if ("product_variants" in data.input) {
        const variantsWithPriceUpdates = new Set(
          data.input.product_variants.filter((v) => !!v.prices).map((v) => v.id)
        )

        return data.updatedVariants
          .map((v) => v.id)
          .filter((id) => variantsWithPriceUpdates.has(id))
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

    const variantIdEvents = transform({ response }, ({ response }) => {
      return response?.map((v) => {
        return { id: v.id }
      })
    })

    emitEventStep({
      eventName: ProductVariantWorkflowEvents.UPDATED,
      data: variantIdEvents,
    })

    const productVariantsUpdated = createHook("productVariantsUpdated", {
      product_variants: response,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(response, {
      hooks: [productVariantsUpdated],
    })
  }
)
