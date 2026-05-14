import { OrderChangeStatus, } from "@medusajs/framework/utils"
import { createWorkflow, WorkflowResponse, } from "@medusajs/framework/workflows-sdk"
import { OrderChangeDTO, OrderDTO, } from "@medusajs/framework/types"
import { useRemoteQueryStep } from "../../common"
import { createOrUpdateOrderPaymentCollectionWorkflow, previewOrderChangeStep, } from "../../order"
import { confirmOrderChanges } from "../../order/steps/confirm-order-changes"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { acquireLockStep, releaseLockStep } from "../../locking"

export const confirmDraftOrderEditWorkflowId = "confirm-draft-order-edit"

export interface ConfirmDraftOrderEditWorkflowInput {
  /**
   * The ID of the draft order to confirm the edit for.
   */
  order_id: string
  /**
   * The ID of the user confirming the edit.
   */
  confirmed_by: string
}

/**
 * This workflow confirms a draft order edit. It's used by the
 * [Confirm Draft Order Edit Admin API Route](https://docs.medusajs.com/api/admin#draft-orders_postdraftordersideditconfirm).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * confirming a draft order edit.
 *
 * @example
 * const { result } = await confirmDraftOrderEditWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     confirmed_by: "user_123",
 *   }
 * })
 *
 * @summary
 *
 * Confirm a draft order edit.
 */
export const confirmDraftOrderEditWorkflow = createWorkflow(
  confirmDraftOrderEditWorkflowId,
  function (input: ConfirmDraftOrderEditWorkflowInput) {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: [
        "id",
        "status",
        "is_draft_order",
        "version",
        "canceled_at",
        "items.id",
        "items.title",
        "items.variant_title",
        "items.variant_sku",
        "items.variant_barcode",
        "shipping_address.*",
      ],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "id",
        "status",
        "actions.id",
        "actions.order_id",
        "actions.return_id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validateDraftOrderChangeStep({
      order,
      orderChange,
    })

    const orderPreview = previewOrderChangeStep(order.id)

    confirmOrderChanges({
      changes: [orderChange],
      orderId: order.id,
      confirmed_by: input.confirmed_by,
    })

    createOrUpdateOrderPaymentCollectionWorkflow.runAsStep({
      input: {
        order_id: order.id,
      },
    })

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(orderPreview)
  }
)
