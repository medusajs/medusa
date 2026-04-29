import { OrderChangeStatus } from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { useRemoteQueryStep } from "../../common"
import {
  deleteOrderChangeActionsStep,
  previewOrderChangeStep,
} from "../../order"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { validateDraftOrderRemoveActionItemStep } from "../steps/validate-draft-order-remove-action-item"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { computeDraftOrderAdjustmentsWorkflow } from "./compute-draft-order-adjustments"

export const removeDraftOrderActionItemWorkflowId =
  "remove-draft-order-action-item"

/**
 * This workflow removes an item that was added or updated in a draft order edit. It's used by the
 * [Remove Item from Draft Order Edit Admin API Route](https://docs.medusajs.com/api/admin#draft-orders_deletedraftordersidedititemsaction_id).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * removing an item from a draft order edit.
 *
 * @example
 * const { result } = await removeDraftOrderActionItemWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     action_id: "action_123",
 *   }
 * })
 *
 * @summary
 *
 * Remove an item from a draft order edit.
 */
export const removeDraftOrderActionItemWorkflow = createWorkflow(
  removeDraftOrderActionItemWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteOrderEditItemActionWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO & {
      promotions: {
        code: string
      }[]
    } = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "is_draft_order", "canceled_at", "items.*"],
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

    validateDraftOrderRemoveActionItemStep({
      input,
      orderChange,
    })

    deleteOrderChangeActionsStep({ ids: [input.action_id] })

    const refetchedOrder = useRemoteQueryStep({
      entry_point: "orders",
      fields: draftOrderFieldsForRefreshSteps,
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "refetched-order-query" })

    const appliedPromoCodes: string[] = transform(
      refetchedOrder,
      (refetchedOrder) =>
        refetchedOrder.promotions?.map((promotion) => promotion.code) ?? []
    )

    // If any the order has any promo codes, then we need to refresh the adjustments.
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
