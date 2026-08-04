import type { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  setShippingOptionsPricesStep,
  upsertShippingOptionsStep,
} from "../steps"
import { validateFulfillmentProvidersStep } from "../steps/validate-fulfillment-providers"
import { validateShippingOptionPricesStep } from "../steps/validate-shipping-option-prices"
import {
  ShippingOptionPriceType,
  ShippingOptionWorkflowEvents,
} from "@medusajs/framework/utils"
import { emitEventStep } from "../../common"

/**
 * The data to update the shipping options.
 */
export type UpdateShippingOptionsWorkflowInput =
  FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput[]

export const updateShippingOptionsWorkflowId =
  "update-shipping-options-workflow"
/**
 * This workflow updates one or more shipping options. It's used by the
 * [Update Shipping Options Admin API Route](https://docs.medusajs.com/api/admin/shipping-options/update-a-shipping-option).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * update shipping options within your custom flows.
 * 
 * ### Updating Shipping Option Prices
 *
 * When you provide the `prices` array, it replaces the shipping option's existing flat-rate prices:
 * 
 * - A price with a matching `id` is updated.
 * - A price without an `id` is created.
 * - Any existing price whose `id` isn't included in the array is deleted.
 * 
 * The `rules` you provide for a price similarly replace that price's existing rules, so omit a rule to remove it.
 * 
 * Omitting the `prices` property entirely leaves the existing prices unchanged, whereas setting `price_type` to `calculated` removes all flat-rate prices.
 *
 * :::note
 *
 * Learn more about adding rules to the shipping option's prices in the Pricing Module's
 * [Price Rules](https://docs.medusajs.com/resources/commerce-modules/pricing/price-rules) documentation.
 *
 * :::
 *
 * @example
 * const { result } = await updateShippingOptionsWorkflow(container)
 * .run({
 *   input: [
 *     {
 *       id: "so_123",
 *       name: "Standard Shipping",
 *     }
 *   ]
 * })
 *
 * @summary
 *
 * Update one or more shipping options.
 */
export const updateShippingOptionsWorkflow = createWorkflow(
  updateShippingOptionsWorkflowId,
  (
    input: WorkflowData<UpdateShippingOptionsWorkflowInput>
  ): WorkflowResponse<FulfillmentWorkflow.UpdateShippingOptionsWorkflowOutput> => {
    parallelize(
      validateFulfillmentProvidersStep(input),
      validateShippingOptionPricesStep(input)
    )

    const data = transform(input, (data) => {
      const shippingOptionsIndexToPrices = data.map((option, index) => {
        const prices = (
          option as FulfillmentWorkflow.UpdateFlatRateShippingOptionInput
        ).prices

        delete (option as FulfillmentWorkflow.UpdateFlatRateShippingOptionInput)
          .prices

        /**
         * When we are updating an option to be calculated, remove the prices.
         */
        const isCalculatedOption =
          option.price_type === ShippingOptionPriceType.CALCULATED

        return {
          shipping_option_index: index,
          prices: isCalculatedOption ? [] : prices,
        }
      })

      return {
        shippingOptions: data,
        shippingOptionsIndexToPrices,
      }
    })

    const updatedShippingOptions = upsertShippingOptionsStep(
      data.shippingOptions
    )

    const eventData = transform(updatedShippingOptions, (data) => {
      return data.map((option) => option.id)
    })

    const normalizedShippingOptionsPrices = transform(
      {
        shippingOptions: updatedShippingOptions,
        shippingOptionsIndexToPrices: data.shippingOptionsIndexToPrices,
      },
      (data) => {
        const shippingOptionsPrices = data.shippingOptionsIndexToPrices.map(
          ({ shipping_option_index, prices }) => {
            const option = data.shippingOptions[shipping_option_index]

            return {
              id: option.id,
              prices,
            }
          }
        )

        return {
          shippingOptionsPrices,
        }
      }
    )

    parallelize(
      setShippingOptionsPricesStep(
        normalizedShippingOptionsPrices.shippingOptionsPrices
      ),
      emitEventStep({
        eventName: ShippingOptionWorkflowEvents.UPDATED,
        data: eventData,
      })
    )

    return new WorkflowResponse(updatedShippingOptions)
  }
)
