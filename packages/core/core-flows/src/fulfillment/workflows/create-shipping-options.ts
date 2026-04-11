import type { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createShippingOptionsPriceSetsStep,
  upsertShippingOptionsStep,
} from "../steps"
import { setShippingOptionsPriceSetsStep } from "../steps/set-shipping-options-price-sets"
import { validateFulfillmentProvidersStep } from "../steps/validate-fulfillment-providers"
import { validateShippingOptionPricesStep } from "../steps/validate-shipping-option-prices"
import { emitEventStep } from "../../common"
import { ShippingOptionWorkflowEvents } from "@medusajs/framework/utils"

/**
 * The data to create the shipping options.
 */
export type CreateShippingOptionsWorkflowInput =
  FulfillmentWorkflow.CreateShippingOptionsWorkflowInput[]

export const createShippingOptionsWorkflowId =
  "create-shipping-options-workflow"
/**
 * This workflow creates one or more shipping options. It's used by the
 * [Create Shipping Option Admin API Route](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptions).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * create shipping options within your custom flows.
 *
 * @example
 * To calculate a shipping option with flat rate prices:
 *
 * :::note
 *
 * Learn more about adding rules to the shipping option's prices in the Pricing Module's
 * [Price Rules](https://docs.medusajs.com/resources/commerce-modules/pricing/price-rules) documentation.
 *
 * :::
 *
 * ```ts
 * const { result } = await createShippingOptionsWorkflow(container)
 * .run({
 *   input: [
 *     {
 *       name: "Standard Shipping",
 *       service_zone_id: "serzo_123",
 *       shipping_profile_id: "sp_123",
 *       provider_id: "prov_123",
 *       type: {
 *         label: "Standard",
 *         description: "Standard shipping",
 *         code: "standard"
 *       },
 *       price_type: "flat",
 *       prices: [
 *         {
 *           amount: 500,
 *           currency_code: "usd"
 *         }
 *       ]
 *     }
 *   ]
 * })
 * ```
 *
 * To calculate shipping option with calculated prices, set `price_type` to `calculated` and don't pass a `prices` array:
 *
 * :::note
 *
 * You can calculate the shipping option's price for a cart using the [calculateShippingOptionsPricesWorkflow](https://docs.medusajs.com/resources/references/medusa-workflows/calculateShippingOptionsPricesWorkflow).
 *
 * :::
 *
 * ```ts
 * const { result } = await createShippingOptionsWorkflow(container)
 * .run({
 *   input: [
 *     {
 *       name: "Standard Shipping",
 *       service_zone_id: "serzo_123",
 *       shipping_profile_id: "sp_123",
 *       provider_id: "prov_123",
 *       type: {
 *         label: "Standard",
 *         description: "Standard shipping",
 *         code: "standard"
 *       },
 *       price_type: "calculated",
 *     }
 *   ]
 * })
 * ```
 *
 * @summary
 *
 * Create shipping options.
 */
export const createShippingOptionsWorkflow = createWorkflow(
  createShippingOptionsWorkflowId,
  (
    input: WorkflowData<CreateShippingOptionsWorkflowInput>
  ): WorkflowResponse<FulfillmentWorkflow.CreateShippingOptionsWorkflowOutput> => {
    parallelize(
      validateFulfillmentProvidersStep(input),
      validateShippingOptionPricesStep(input)
    )

    const data = transform(input, (data) => {
      const shippingOptionsIndexToPrices = data.map((option, index) => {
        /**
         * Flat rate ShippingOptions always needs to provide a price array.
         *
         * For calculated pricing we create an "empty" price set
         * so we can have simpler update flow for both cases and allow updating price_type.
         */
        const prices = (option as any).prices ?? []
        return {
          shipping_option_index: index,
          prices,
        }
      })

      return {
        shippingOptions: data,
        shippingOptionsIndexToPrices,
      }
    })

    const createdShippingOptions = upsertShippingOptionsStep(
      data.shippingOptions
    )

    const eventData = transform(createdShippingOptions, (data) => {
      return data.map((option) => {
        return { id: option.id }
      })
    })

    const normalizedShippingOptionsPrices = transform(
      {
        shippingOptions: createdShippingOptions,
        shippingOptionsIndexToPrices: data.shippingOptionsIndexToPrices,
      },
      (data) => {
        const shippingOptionsPrices = data.shippingOptionsIndexToPrices.map(
          ({ shipping_option_index, prices }) => {
            return {
              id: data.shippingOptions[shipping_option_index].id,
              prices,
            }
          }
        )

        return {
          shippingOptionsPrices,
        }
      }
    )

    const shippingOptionsPriceSetsLinkData = createShippingOptionsPriceSetsStep(
      normalizedShippingOptionsPrices.shippingOptionsPrices
    )

    const normalizedLinkData = transform(
      {
        shippingOptionsPriceSetsLinkData,
      },
      (data) => {
        return data.shippingOptionsPriceSetsLinkData.map((item) => {
          return {
            id: item.id,
            price_sets: [item.priceSetId],
          }
        })
      }
    )

    parallelize(
      setShippingOptionsPriceSetsStep(normalizedLinkData),
      emitEventStep({
        eventName: ShippingOptionWorkflowEvents.CREATED,
        data: eventData,
      })
    )
    return new WorkflowResponse(createdShippingOptions)
  }
)
