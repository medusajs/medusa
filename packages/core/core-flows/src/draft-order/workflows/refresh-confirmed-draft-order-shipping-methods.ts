import {
  CalculateShippingOptionPriceDTO,
  FulfillmentSetDTO,
  ShippingOptionDTO,
  StockLocationDTO,
} from "@medusajs/framework/types"
import { ShippingOptionPriceType } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { calculateShippingOptionsPricesStep } from "../../fulfillment/steps"
import {
  updateOrderShippingMethodsStep,
  updateOrderTaxLinesWorkflow,
} from "../../order"
import {
  filterCartItemsByShippingProfile,
  ItemWithShippingProfile,
} from "../../cart/utils/filter-items-by-shipping-profile"
import { SHIPPING_OPTION_FIELDS_FOR_PRICE_CALCULATION } from "../utils/enrich-preview-line-items-for-shipping-price-calculation"

export const refreshConfirmedDraftOrderShippingMethodsWorkflowId =
  "refresh-confirmed-draft-order-shipping-methods"

/**
 * The details of the draft order whose applied calculated shipping methods
 * should be refreshed.
 */
export interface RefreshConfirmedDraftOrderShippingMethodsWorkflowInput {
  /**
   * The ID of the draft order.
   */
  order_id: string
}

/**
 * Refreshes the prices of *already-applied* calculated shipping methods on a
 * draft order from its now-materialized items. Intended to run AFTER an order
 * change is confirmed (`confirmDraftOrderEditWorkflow`), once item changes are
 * committed and the materialized order is accurate.
 *
 * This is the counterpart to {@link refreshPendingDraftOrderShippingMethodsWorkflow}
 * (which handles pending, in-flight shipping methods during the edit). Together
 * they keep calculated prices correct without ever mutating an applied method
 * for an uncommitted change that could still be cancelled.
 *
 * Custom-amount and flat-rate methods are left untouched.
 *
 * @summary
 *
 * Refresh applied calculated shipping method prices on a draft order.
 */
export const refreshConfirmedDraftOrderShippingMethodsWorkflow = createWorkflow(
  refreshConfirmedDraftOrderShippingMethodsWorkflowId,
  function (
    input: WorkflowData<RefreshConfirmedDraftOrderShippingMethodsWorkflowInput>
  ): WorkflowResponse<void> {
    const { data: order } = useQueryGraphStep({
      entity: "order",
      fields: [
        "id",
        "shipping_address.*",
        "items.*",
        "items.variant.*",
        "items.variant.product.shipping_profile.id",
        "shipping_methods.id",
        "shipping_methods.is_custom_amount",
        "shipping_methods.shipping_option_id",
      ],
      filters: { id: input.order_id },
      options: {
        isList: false,
        throwIfKeyNotFound: true,
      },
    }).config({ name: "refresh-confirmed-order-query" })

    const shippingOptionIds = transform(order, (order) =>
      (order.shipping_methods ?? [])
        .filter((method) => !method.is_custom_amount)
        .map((method) => method.shipping_option_id)
        .filter(Boolean)
    )

    const { data: shippingOptions } = useQueryGraphStep({
      entity: "shipping_option",
      fields: SHIPPING_OPTION_FIELDS_FOR_PRICE_CALCULATION,
      filters: { id: shippingOptionIds },
    }).config({ name: "refresh-confirmed-options-query" })

    const plan = transform({ order, shippingOptions }, (data) => {
      const order = data.order
      const options = (data.shippingOptions ?? []) as ShippingOptionDTO[]
      const optionsById = new Map(options.map((o) => [o.id, o]))

      const calculateData: CalculateShippingOptionPriceDTO[] = []
      const methodIds: string[] = []

      for (const method of order.shipping_methods ?? []) {
        if (method.is_custom_amount) {
          continue
        }

        const option = optionsById.get(method.shipping_option_id ?? "")
        if (option?.price_type !== ShippingOptionPriceType.CALCULATED) {
          continue
        }

        calculateData.push({
          id: option.id,
          optionData: option.data,
          context: {
            id: order.id,
            shipping_address: order.shipping_address,
            // Only the items shipping under this option's profile.
            items: filterCartItemsByShippingProfile(
              (order.items ?? []) as ItemWithShippingProfile[],
              option.shipping_profile_id
            ),
            from_location: (
              option.service_zone.fulfillment_set as FulfillmentSetDTO & {
                location?: StockLocationDTO
              }
            ).location,
          },
          provider_id: option.provider_id,
        } as CalculateShippingOptionPriceDTO)
        methodIds.push(method.id)
      }

      return { calculateData, methodIds }
    })

    const hasCalculatedMethods = transform(
      plan,
      (plan) => plan.calculateData.length > 0
    )

    when(
      { hasCalculatedMethods },
      ({ hasCalculatedMethods }) => hasCalculatedMethods
    ).then(() => {
      const prices = calculateShippingOptionsPricesStep(plan.calculateData)

      const methodUpdates = transform({ plan, prices }, ({ plan, prices }) =>
        plan.methodIds.map((id, index) => ({
          id,
          amount: prices[index].calculated_amount,
          is_custom_amount: false,
        }))
      )

      updateOrderShippingMethodsStep(methodUpdates)

      updateOrderTaxLinesWorkflow.runAsStep({
        input: {
          order_id: input.order_id,
          shipping_method_ids: transform(plan, (plan) => plan.methodIds),
        },
      })
    })

    return new WorkflowResponse(void 0)
  }
)
