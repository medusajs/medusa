import { CalculateShippingOptionPriceDTO } from "@medusajs/framework/types"
import {
  ChangeActionType,
  OrderChangeStatus,
  ShippingOptionPriceType,
} from "@medusajs/framework/utils"
import {
  Hook,
  createHook,
  createWorkflow,
  parallelize,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "../../common"
import { calculateShippingOptionsPricesStep } from "../../fulfillment/steps"
import {
  previewOrderChangeStep,
  updateOrderChangeActionsStep,
  updateOrderShippingMethodsStep,
  updateOrderTaxLinesWorkflow,
} from "../../order"
import { filterCartItemsByShippingProfile } from "../../cart/utils/filter-items-by-shipping-profile"
import {
  enrichPreviewLineItemsForShippingPriceCalculation,
  LINE_ITEM_FIELDS_FOR_SHIPPING_PRICE_CALCULATION,
  SHIPPING_OPTION_FIELDS_FOR_PRICE_CALCULATION,
} from "../utils/enrich-preview-line-items-for-shipping-price-calculation"
import { calculatedShippingPricingContextResult } from "../../cart/utils/schemas"

export const refreshPendingDraftOrderShippingMethodsWorkflowId =
  "refresh-pending-draft-order-shipping-methods"

/**
 * The details of the draft order whose pending calculated shipping methods should be refreshed.
 */
export interface RefreshPendingDraftOrderShippingMethodsWorkflowInput {
  /**
   * The ID of the draft order.
   */
  order_id: string
}

/**
 * The `setCalculatedShippingPricingContext` hook of {@link refreshPendingDraftOrderShippingMethodsWorkflow}.
 */
type SetCalculatedShippingPricingContextHook = Hook<
  "setCalculatedShippingPricingContext",
  { input: RefreshPendingDraftOrderShippingMethodsWorkflowInput },
  Record<string, any> | undefined
>

/**
 * This workflow refreshes the prices of *pending* calculated shipping methods
 * added during the current, uncommitted draft order edit (i.e. methods with a
 * pending `SHIPPING_ADD` action). It re-runs the fulfillment provider's price
 * calculation against the order's **projected** items (base order + pending
 * order-change actions) so the preview stays faithful as items/address change.
 *
 * It deliberately does NOT touch already-applied (confirmed) shipping methods:
 * those are refreshed on confirmation (see {@link confirmDraftOrderEditWorkflow}),
 * so an uncommitted item change that is later cancelled never leaves a stale
 * calculated price behind.
 *
 * Shipping methods with a custom amount, and flat-rate methods, are left
 * untouched.
 *
 * @summary
 *
 * Refresh pending calculated shipping method prices on a draft order edit.
 *
 * @property hooks.setCalculatedShippingPricingContext - This hook is executed before the
 * pending calculated shipping methods' prices are refreshed. You can consume it to
 * return any custom context that is merged into the `context` parameter of the
 * fulfillment provider's `calculatePrice` method (framework-provided properties
 * take precedence on a naming conflict).
 */
export const refreshPendingDraftOrderShippingMethodsWorkflow = createWorkflow(
  refreshPendingDraftOrderShippingMethodsWorkflowId,
  function (
    input: WorkflowData<RefreshPendingDraftOrderShippingMethodsWorkflowInput>
  ): WorkflowResponse<void, [SetCalculatedShippingPricingContextHook]> {
    const { data: orderChange } = useQueryGraphStep({
      entity: "order_change",
      fields: [
        "id",
        "actions.id",
        "actions.action",
        "actions.reference_id",
        "order.id",
        "order.shipping_address.*",
      ],
      filters: {
        order_id: input.order_id,
        status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
      },
      options: { isList: false },
    }).config({ name: "refresh-order-change-query" })

    // Shipping methods added during the current edit (pending SHIPPING_ADD).
    const pendingMethodIds = transform(orderChange, (orderChange) =>
      (orderChange?.actions ?? [])
        .filter((action) => action.action === ChangeActionType.SHIPPING_ADD)
        .map((action) => action.reference_id)
        .filter(Boolean)
    )

    const { data: shippingMethods } = useQueryGraphStep({
      entity: "order_shipping_method",
      filters: { id: pendingMethodIds, is_custom_amount: false },
      fields: ["id", "shipping_option_id"],
    }).config({ name: "refresh-pending-methods-query" })

    const setCalculatedShippingPricingContext = createHook(
      "setCalculatedShippingPricingContext",
      { input },
      { resultValidator: calculatedShippingPricingContextResult }
    )
    const setCalculatedShippingPricingContextResult =
      setCalculatedShippingPricingContext.getResult()

    const plan = when(
      "should-create-calculated-amounts-plan",
      { shippingMethods },
      ({ shippingMethods }) => !!shippingMethods.length
    ).then(() => {
      const shippingOptionIds = transform(shippingMethods, (methods) =>
        ((methods as any[]) ?? [])
          .map((method) => method.shipping_option_id)
          .filter(Boolean)
      )

      const { data: shippingOptions } = useQueryGraphStep({
        entity: "shipping_option",
        filters: { id: shippingOptionIds },
        fields: SHIPPING_OPTION_FIELDS_FOR_PRICE_CALCULATION,
      }).config({ name: "refresh-shipping-options-query" })

      // Projected order state (items reflect pending add/update/remove actions).
      const preview = previewOrderChangeStep(input.order_id)

      const projectedItemIds = transform(preview, (preview) =>
        preview.items.map((item) => item.id)
      )

      const { data: lineItems } = useQueryGraphStep({
        entity: "order_line_item",
        filters: { id: projectedItemIds },
        fields: LINE_ITEM_FIELDS_FOR_SHIPPING_PRICE_CALCULATION,
      }).config({ name: "refresh-line-items-query" })

      // Build the calculation input for pending, calculated, non-custom methods,
      // keeping method/action ids aligned with the calculation array so prices
      // can be mapped back after the provider responds.
      return transform(
        {
          orderChange,
          shippingMethods,
          shippingOptions,
          preview,
          lineItems,
          setCalculatedShippingPricingContextResult,
        },
        (data) => {
          const orderChange = data.orderChange
          const methods = data.shippingMethods
          const options = data.shippingOptions
          const order = orderChange.order

          const items = enrichPreviewLineItemsForShippingPriceCalculation(
            data.preview.items,
            data.lineItems
          )

          const optionsById = new Map(options.map((o) => [o.id, o]))
          const actionByMethodId = new Map(
            orderChange.actions
              .filter((a) => a.action === ChangeActionType.SHIPPING_ADD)
              .map((a) => [a.reference_id, a.id])
          )

          const calculateData: CalculateShippingOptionPriceDTO[] = []
          const methodIds: string[] = []
          const actionIds: string[] = []

          for (const method of methods) {
            const actionId = actionByMethodId.get(method.id)
            if (!actionId) {
              continue
            }

            const option = optionsById.get(method.shipping_option_id)
            if (option?.price_type !== ShippingOptionPriceType.CALCULATED) {
              continue
            }

            calculateData.push({
              id: option.id,
              optionData: option.data,
              context: {
                ...data.setCalculatedShippingPricingContextResult,
                id: order.id,
                shipping_address: order.shipping_address,
                items: filterCartItemsByShippingProfile(
                  items,
                  option.shipping_profile_id
                ),
                from_location: option.service_zone.fulfillment_set.location,
              },
              provider_id: option.provider_id,
            } as unknown as CalculateShippingOptionPriceDTO)
            methodIds.push(method.id)
            actionIds.push(actionId as string)
          }

          return { calculateData, methodIds, actionIds }
        }
      )
    })

    when(
      "should-execute-calculated-amounts-plan",
      { plan },
      ({ plan }) => !!plan && plan.calculateData.length > 0
    ).then(() => {
      const resolvedPlan = plan!
      const prices = calculateShippingOptionsPricesStep(
        resolvedPlan.calculateData
      )

      const updates = transform(
        { resolvedPlan, prices },
        ({ resolvedPlan, prices }) => {
          const methodUpdates = resolvedPlan.methodIds.map((id, index) => ({
            id,
            amount: prices[index].calculated_amount,
            is_custom_amount: false,
          }))

          const actionUpdates = resolvedPlan.actionIds.map((id, index) => ({
            id,
            amount: prices[index].calculated_amount,
          }))

          return {
            methodUpdates,
            actionUpdates,
            methodIds: resolvedPlan.methodIds,
          }
        }
      )

      parallelize(
        updateOrderShippingMethodsStep(updates.methodUpdates),
        updateOrderChangeActionsStep(updates.actionUpdates)
      )

      // Keep shipping tax lines in sync with the refreshed amounts.
      updateOrderTaxLinesWorkflow.runAsStep({
        input: {
          order_id: input.order_id,
          shipping_method_ids: updates.methodIds,
        },
      })
    })

    return new WorkflowResponse(void 0, {
      hooks: [setCalculatedShippingPricingContext],
    })
  }
)
