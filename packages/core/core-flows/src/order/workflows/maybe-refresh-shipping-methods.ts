import {
  CalculatedRMAShippingContext,
  CalculateShippingOptionPriceDTO,
} from "@medusajs/framework/types"
import {
  Hook,
  WorkflowResponse,
  createHook,
  createWorkflow,
  parallelize,
  transform,
  when,
} from "@medusajs/framework/workflows-sdk"
import { ShippingOptionPriceType } from "@medusajs/framework/utils"
import { calculateShippingOptionsPricesStep } from "../../fulfillment/steps"
import {
  updateOrderChangeActionsStep,
  updateOrderShippingMethodsStep,
} from "../steps"
import { useQueryGraphStep } from "../../common"
import { calculatedShippingPricingContextResult } from "../../cart/utils/schemas"

const COMMON_OPTIONS_FIELDS = [
  "id",
  "name",
  "price_type",
  "service_zone_id",
  "service_zone.fulfillment_set_id",
  "service_zone.fulfillment_set.type",
  "service_zone.fulfillment_set.location.*",
  "service_zone.fulfillment_set.location.address.*",
  "shipping_profile_id",
  "provider_id",
  "data",

  "type.id",
  "type.label",
  "type.description",
  "type.code",

  "provider.id",
  "provider.is_enabled",

  "rules.attribute",
  "rules.value",
  "rules.operator",
]

/**
 * The data to create a shipping method for an order edit.
 */
export type MaybeRefreshShippingMethodsWorkflowInput = {
  /**
   * The ID of the shipping method to refresh.
   */
  shipping_method_id: string
  /**
   * The ID of the order.
   */
  order_id: string
  /**
   * The ID of the ADD SHIPPING action to update.
   */
  action_id: string
  /**
   * Data to pass for the shipping calculation.
   */
  context: CalculatedRMAShippingContext
}

/**
 * The `setCalculatedShippingPricingContext` hook of {@link maybeRefreshShippingMethodsWorkflow}.
 */
type SetCalculatedShippingPricingContextHook = Hook<
  "setCalculatedShippingPricingContext",
  { input: MaybeRefreshShippingMethodsWorkflowInput },
  Record<string, any> | undefined
>

export const maybeRefreshShippingMethodsWorkflowId =
  "maybe-refresh-shipping-methods"
/**
 * This workflows refreshes shipping method prices of an order and its changes. It's used in Return Merchandise Authorization (RMA) flows. It's used
 * by other workflows, such as {@link refreshExchangeShippingWorkflow}.
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * refreshing shipping methods in your custom flows.
 *
 * @example
 * const { result } = await maybeRefreshShippingMethodsWorkflow(container)
 * .run({
 *   input: {
 *     shipping_method_id: "shipping_method_123",
 *     order_id: "order_123",
 *     action_id: "orchact_123",
 *     context: {
 *       return_id: "ret_123",
 *       return_items: [
 *         {
 *            id: "orli_123",
 *            quantity: 1,
 *         }
 *       ]
 *     }
 *  }
 * })
 *
 * @summary
 *
 * Refreshes the shipping method prices of an order and its changes.
 *
 * @property hooks.setCalculatedShippingPricingContext - This hook is executed before a calculated shipping method's price is refreshed.
 * You can consume this hook to return any custom context that is forwarded as-is to the fulfillment provider's `calculatePrice` method.
 *
 * ```ts
 * import { maybeRefreshShippingMethodsWorkflow } from "@medusajs/medusa/core-flows"
 * import { StepResponse } from "@medusajs/workflows-sdk"
 *
 * maybeRefreshShippingMethodsWorkflow.hooks.setCalculatedShippingPricingContext(
 *   async ({ input }, { container }) => {
 *     return new StepResponse({
 *       account_number: "acc_123",
 *     })
 *   }
 * )
 * ```
 *
 * The returned object is merged into the `context` parameter of the fulfillment provider's `calculatePrice` method. If a key here conflicts with a framework-provided key, the framework-provided value takes precedence.
 */
export const maybeRefreshShippingMethodsWorkflow = createWorkflow(
  maybeRefreshShippingMethodsWorkflowId,
  function (
    input: MaybeRefreshShippingMethodsWorkflowInput
  ): WorkflowResponse<void, [SetCalculatedShippingPricingContextHook]> {
    const shippingMethodQuery = useQueryGraphStep({
      entity: "order_shipping_method",
      fields: ["id", "shipping_option_id"],
      filters: {
        id: input.shipping_method_id,
      },
    }).config({ name: "fetch-shipping-method" })

    const shippingMethod = transform(shippingMethodQuery, ({ data }) => data[0])

    const shippingOptionQuery = useQueryGraphStep({
      entity: "shipping_option",
      fields: COMMON_OPTIONS_FIELDS,
      filters: { id: shippingMethod.shipping_option_id },
      options: {
        cache: {
          // The shipping option, its type, provider and the resolved location are all
          // computed from the response. These are what computation cannot see: the
          // service zone, fulfillment set and rules are selected without their ids,
          // and the fulfillment set resolves its location through a link row.
          tags: [
            "ServiceZone:list:*",
            "FulfillmentSet:list:*",
            "ShippingOptionRule:list:*",
            "LinkLocationFulfillmentSet:list:*",
          ],
          computeAutomaticTags: true,
        },
      },
    }).config({ name: "calculated-option" })

    const shippingOption = transform(shippingOptionQuery, ({ data }) => data[0])

    const isCalculatedPriceShippingOption = transform(
      shippingOption,
      (option) => option?.price_type === ShippingOptionPriceType.CALCULATED
    )

    const setCalculatedShippingPricingContext = createHook(
      "setCalculatedShippingPricingContext",
      { input },
      { resultValidator: calculatedShippingPricingContextResult }
    )
    const setCalculatedShippingPricingContextResult =
      setCalculatedShippingPricingContext.getResult()

    when(
      { isCalculatedPriceShippingOption },
      ({ isCalculatedPriceShippingOption }) => isCalculatedPriceShippingOption
    ).then(() => {
      const orderQuery = useQueryGraphStep({
        entity: "order",
        fields: ["id", "shipping_address", "items.*", "items.variant.*"],
        filters: { id: input.order_id },
        options: { throwIfKeyNotFound: true },
      }).config({ name: "order-query" })

      const order = transform(orderQuery, (data) => data[0])

      const calculateShippingOptionsPricesData = transform(
        {
          shippingOption,
          order,
          input,
          setCalculatedShippingPricingContextResult,
        },
        ({
          shippingOption,
          order,
          input,
          setCalculatedShippingPricingContextResult,
        }) => {
          return [
            {
              id: shippingOption.id as string,
              optionData: shippingOption.data,
              context: {
                ...setCalculatedShippingPricingContextResult,
                ...order,
                ...input.context,
                from_location:
                  shippingOption.service_zone.fulfillment_set.location,
              },
              // data: {}, // TODO: add data
              provider_id: shippingOption.provider_id,
            } as CalculateShippingOptionPriceDTO,
          ]
        }
      )

      const prices = calculateShippingOptionsPricesStep(
        calculateShippingOptionsPricesData
      )

      const updateData = transform(
        {
          shippingOption,
          prices,
          input,
        },
        ({ prices, input }) => {
          return [
            {
              id: input.action_id,
              amount: prices[0].calculated_amount,
            },
            {
              id: input.shipping_method_id,
              amount: prices[0].calculated_amount,
              is_custom_amount: false,
            },
          ]
        }
      )

      parallelize(
        updateOrderChangeActionsStep([updateData[0]]),
        updateOrderShippingMethodsStep([updateData[1]!])
      )
    })

    return new WorkflowResponse(void 0, {
      hooks: [setCalculatedShippingPricingContext],
    })
  }
)
