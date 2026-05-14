import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  BigNumberInput,
  OrderChangeDTO,
  OrderDTO,
} from "@medusajs/framework/types"
import { useRemoteQueryStep } from "../../common"
import {
  createOrderChangeActionsWorkflow,
  previewOrderChangeStep,
  updateOrderTaxLinesWorkflow,
} from "../../order"
import { updateDraftOrderShippingMethodStep } from "../steps/update-draft-order-shipping-metod"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { computeDraftOrderAdjustmentsWorkflow } from "./compute-draft-order-adjustments"

export const updateDraftOrderShippingMethodWorkflowId =
  "update-draft-order-shipping-method"

/**
 * The details of the shipping method to update in the order edit.
 */
export interface UpdateDraftOrderShippingMethodWorkflowInput {
  /**
   * The ID of the order to update the shipping method in its edit.
   */
  order_id: string
  data: {
    /**
     * The ID of the shipping method to update.
     */
    shipping_method_id: string
    /**
     * The ID of the shipping method's option.
     */
    shipping_option_id?: string
    /**
     * Set a custom amount for the shipping method.
     */
    custom_amount?: BigNumberInput
    /**
     * A note viewed by admins only related to the shipping method.
     */
    internal_note?: string | null
  }
}

/**
 * This workflow updates an existing shipping method in a draft order edit. It's used by the
 * [Update Shipping Method in Draft Order Edit Admin API Route](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditshippingmethodsmethodmethod_id).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * updating an existing shipping method in a draft order edit.
 *
 * @example
 * const { result } = await updateDraftOrderShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     data: {
 *       shipping_method_id: "sm_123",
 *       custom_amount: 10,
 *     }
 *   }
 * })
 *
 * @summary
 *
 * Update an existing shipping method in a draft order edit.
 */
export const updateDraftOrderShippingMethodWorkflow = createWorkflow(
  updateDraftOrderShippingMethodWorkflowId,
  function (input: WorkflowData<UpdateDraftOrderShippingMethodWorkflowInput>) {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "is_draft_order"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validateDraftOrderChangeStep({ order, orderChange })

    const { before, after } = updateDraftOrderShippingMethodStep({
      order_id: input.order_id,
      shipping_method_id: input.data.shipping_method_id,
      shipping_option_id: input.data.shipping_option_id,
      amount: input.data.custom_amount,
    })

    updateOrderTaxLinesWorkflow.runAsStep({
      input: {
        order_id: order.id,
        shipping_method_ids: [input.data.shipping_method_id],
      },
    })

    const orderChangeActionInput = transform(
      { order, orderChange, data: input.data, before, after },
      ({ order, orderChange, data, before, after }) => {
        return {
          order_change_id: orderChange.id,
          reference: "order_shipping_method",
          reference_id: data.shipping_method_id,
          order_id: order.id,
          version: orderChange.version,
          action: ChangeActionType.SHIPPING_UPDATE,
          internal_note: data.internal_note,
          details: {
            old_shipping_option_id: before.shipping_option_id,
            new_shipping_option_id: after.shipping_option_id,
            old_amount: before.amount,
            new_amount: after.amount,
          },
        }
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: [orderChangeActionInput as any],
    })

    const refetchedOrder = useRemoteQueryStep({
      entry_point: "orders",
      fields: draftOrderFieldsForRefreshSteps,
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "refetched-order-query" })

    const appliedPromoCodes = transform(
      refetchedOrder,
      (refetchedOrder) =>
        refetchedOrder.promotions?.map((promotion) => promotion.code) ?? []
    )

    when(
      appliedPromoCodes,
      (appliedPromoCodes) => appliedPromoCodes.length > 0
    ).then(() => {
      computeDraftOrderAdjustmentsWorkflow.runAsStep({
        input: {
          order_id: input.order_id,
        },
      })
    })

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
