import {
  CalculatedRMAShippingContext,
  CalculateShippingOptionPriceDTO,
} from "@medusajs/framework/types"
import {
  WorkflowResponse,
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
 */
export const maybeRefreshShippingMethodsWorkflow = createWorkflow(
  maybeRefreshShippingMethodsWorkflowId,
  function (
    input: MaybeRefreshShippingMethodsWorkflowInput
  ): WorkflowResponse<void> {
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
          enable: true,
        },
      },
    }).config({ name: "calculated-option" })

    const shippingOption = transform(shippingOptionQuery, ({ data }) => data[0])

    const isCalculatedPriceShippingOption = transform(
      shippingOption,
      (option) => option?.price_type === ShippingOptionPriceType.CALCULATED
    )

    when(
      { isCalculatedPriceShippingOption, shippingOption },
      ({ isCalculatedPriceShippingOption, shippingOption }) =>
        isCalculatedPriceShippingOption
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
        },
        ({ shippingOption, order, input }) => {
          return [
            {
              id: shippingOption.id as string,
              optionData: shippingOption.data,
              context: {
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

    return new WorkflowResponse(void 0)
  }
)
