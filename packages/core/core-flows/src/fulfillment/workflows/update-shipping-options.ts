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
 * [Update Shipping Options Admin API Route](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptionsid).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * update shipping options within your custom flows.
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
