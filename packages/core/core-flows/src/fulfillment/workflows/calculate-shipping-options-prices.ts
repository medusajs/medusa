import type { FulfillmentWorkflow } from "@medusajs/framework/types"
import {
  Hook,
  createHook,
  createWorkflow,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { calculateShippingOptionsPricesStep } from "../steps"
import { useQueryGraphStep } from "../../common"
import { cartFieldsForCalculateShippingOptionsPrices } from "../../cart/utils/fields"
import { filterCartItemsByShippingProfile } from "../../cart/utils/filter-items-by-shipping-profile"
import { calculatedShippingPricingContextResult } from "../../cart/utils/schemas"

export const calculateShippingOptionsPricesWorkflowId =
  "calculate-shipping-options-prices-workflow"
/**
 * The `setCalculatedShippingPricingContext` hook of {@link calculateShippingOptionsPricesWorkflow}.
 */
type SetCalculatedShippingPricingContextHook = Hook<
  "setCalculatedShippingPricingContext",
  {
    input: FulfillmentWorkflow.CalculateShippingOptionsPricesWorkflowInput
  },
  Record<string, any> | undefined
>

/**
 * This workflow calculates the prices for one or more shipping options in a cart. It's used by the
 * [Calculate Shipping Option Price Store API Route](https://docs.medusajs.com/api/store/shipping-options/calculate-shipping-option-price).
 *
 * :::note
 *
 * Calculating shipping option prices may require sending requests to third-party fulfillment services.
 * This depends on the implementation of the fulfillment provider associated with the shipping option.
 *
 * :::
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you to
 * calculate the prices of shipping options within your custom flows.
 *
 * @example
 * const { result } = await calculateShippingOptionsPricesWorkflow(container)
 * .run({
 *   input: {
 *     cart_id: "cart_123",
 *     shipping_options: [
 *       {
 *         id: "so_123",
 *         data: {
 *           // custom data relevant for the fulfillment provider
 *           carrier_code: "ups",
 *         }
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Calculate shipping option prices in a cart.
 *
 * @property hooks.setCalculatedShippingPricingContext - This hook is executed after the cart is retrieved and before the shipping option prices are calculated.
 * You can consume this hook to return any custom context that is forwarded as-is to the fulfillment provider's `calculatePrice` method.
 *
 * For example, you can consume the hook to pass a negotiated carrier contract to the provider:
 *
 * ```ts
 * import { calculateShippingOptionsPricesWorkflow } from "@medusajs/medusa/core-flows"
 * import { StepResponse } from "@medusajs/workflows-sdk"
 *
 * calculateShippingOptionsPricesWorkflow.hooks.setCalculatedShippingPricingContext(
 *   async ({ input }, { container }) => {
 *     const query = container.resolve("query")
 *
 *     const { data: [cart]} = await query.graph({
 *       entity: "cart",
 *       filters: { id: input.cart_id },
 *       fields: ["customer_id"],
 *     })
 *
 *     const { data: contracts } = await query.graph({
 *       entity: "carrier_contract",
 *       filters: { customer_id: cart.customer_id },
 *       fields: ["account_number"],
 *     })
 *
 *     return new StepResponse({
 *       account_number: contracts[0]?.account_number,
 *     })
 *   }
 * )
 * ```
 *
 * The returned object is merged into the `context` parameter of the fulfillment provider's `calculatePrice` method. If a key here conflicts with a framework-provided key, the framework-provided value takes precedence.
 */
export const calculateShippingOptionsPricesWorkflow = createWorkflow(
  calculateShippingOptionsPricesWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.CalculateShippingOptionsPricesWorkflowInput>
  ): WorkflowResponse<
    FulfillmentWorkflow.CalculateShippingOptionsPricesWorkflowOutput,
    [SetCalculatedShippingPricingContextHook]
  > => {
    const ids = transform({ input }, ({ input }) =>
      input.shipping_options.map((so) => so.id)
    )

    const shippingOptionsQuery = useQueryGraphStep({
      entity: "shipping_option",
      filters: { id: ids },
      fields: [
        "id",
        "provider_id",
        "data",
        "shipping_profile_id",
        "service_zone.fulfillment_set_id",
      ],
    }).config({ name: "shipping-options-query" })

    const cartQuery = useQueryGraphStep({
      entity: "cart",
      filters: { id: input.cart_id },
      fields: cartFieldsForCalculateShippingOptionsPrices,
    }).config({ name: "cart-query" })

    const fulfillmentSetId = transform(
      { shippingOptionsQuery },
      ({ shippingOptionsQuery }) =>
        shippingOptionsQuery.data.map(
          (so) => so.service_zone.fulfillment_set_id
        )
    )

    const locationFulfillmentSetQuery = useQueryGraphStep({
      entity: "location_fulfillment_set",
      filters: { fulfillment_set_id: fulfillmentSetId },
      fields: ["id", "stock_location_id", "fulfillment_set_id"],
    }).config({ name: "location-fulfillment-set-query" })

    const locationIds = transform(
      { locationFulfillmentSetQuery },
      ({ locationFulfillmentSetQuery }) =>
        locationFulfillmentSetQuery.data.map((lfs) => lfs.stock_location_id)
    )

    const locationQuery = useQueryGraphStep({
      entity: "stock_location",
      filters: { id: locationIds },
      fields: ["id", "name", "address.*"],
    }).config({ name: "location-query" })

    const setCalculatedShippingPricingContext = createHook(
      "setCalculatedShippingPricingContext",
      {
        input,
      },
      { resultValidator: calculatedShippingPricingContextResult }
    )
    const setCalculatedShippingPricingContextResult =
      setCalculatedShippingPricingContext.getResult()

    const data = transform(
      {
        shippingOptionsQuery,
        cartQuery,
        input,
        locationFulfillmentSetQuery,
        locationQuery,
        setCalculatedShippingPricingContextResult,
      },
      ({
        shippingOptionsQuery,
        cartQuery,
        input,
        locationFulfillmentSetQuery,
        locationQuery,
        setCalculatedShippingPricingContextResult,
      }) => {
        const shippingOptions = shippingOptionsQuery.data
        const cart = cartQuery.data[0]

        const locations = locationQuery.data
        const locationFulfillmentSetMap = new Map(
          locationFulfillmentSetQuery.data.map((lfs) => [
            lfs.fulfillment_set_id,
            lfs.stock_location_id,
          ])
        )

        const shippingOptionDataMap = new Map(
          input.shipping_options.map((so) => [so.id, so.data])
        )

        return shippingOptions.map((shippingOption) => ({
          id: shippingOption.id,
          provider_id: shippingOption.provider_id,
          optionData: shippingOption.data,
          data: shippingOptionDataMap.get(shippingOption.id) ?? {},
          context: {
            ...setCalculatedShippingPricingContextResult,
            ...cart,
            items: filterCartItemsByShippingProfile(
              cart.items,
              shippingOption.shipping_profile_id
            ),
            from_location: locations.find(
              (l) =>
                l.id ===
                locationFulfillmentSetMap.get(
                  shippingOption.service_zone.fulfillment_set_id
                )
            ),
          },
        }))
      }
    )

    const prices = calculateShippingOptionsPricesStep(data)

    return new WorkflowResponse(prices, {
      hooks: [setCalculatedShippingPricingContext] as const,
    })
  }
)
