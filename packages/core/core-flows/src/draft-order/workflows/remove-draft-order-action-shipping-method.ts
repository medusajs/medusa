import { OrderChangeStatus } from "@medusajs/framework/utils"
import {
  createWorkflow,
  parallelize,
  transform,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { useRemoteQueryStep } from "../../common"
import {
  deleteOrderChangeActionsStep,
  deleteOrderShippingMethods,
  previewOrderChangeStep,
} from "../../order"
import { validateDraftOrderChangeStep } from "../steps/validate-draft-order-change"
import { validateDraftOrderShippingMethodActionStep } from "../steps/validate-draft-order-shipping-method-action"
import { draftOrderFieldsForRefreshSteps } from "../utils/fields"
import { acquireLockStep, releaseLockStep } from "../../locking"
import { computeDraftOrderAdjustmentsWorkflow } from "./compute-draft-order-adjustments"

export const removeDraftOrderActionShippingMethodWorkflowId =
  "remove-draft-order-action-shipping-method"

/**
 * This workflow removes a shipping method that was added to an edited draft order. It's used by the
 * [Remove Shipping Method from Draft Order Edit Admin API Route](https://docs.medusajs.com/api/admin/draft-orders/remove-new-shipping-method).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to wrap custom logic around
 * removing a shipping method from an edited draft order.
 *
 * @example
 * const { result } = await removeDraftOrderActionShippingMethodWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     action_id: "action_123",
 *   }
 * })
 *
 * @summary
 *
 * Remove a shipping method from an edited draft order.
 */
export const removeDraftOrderActionShippingMethodWorkflow = createWorkflow(
  removeDraftOrderActionShippingMethodWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteOrderEditShippingMethodWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    acquireLockStep({
      key: input.order_id,
      timeout: 2,
      ttl: 10,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: draftOrderFieldsForRefreshSteps,
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
    validateDraftOrderShippingMethodActionStep({ orderChange, input })

    const dataToRemove = transform(
      { orderChange, input },
      ({ orderChange, input }) => {
        const associatedAction = (orderChange.actions ?? []).find(
          (a) => a.id === input.action_id
        ) as OrderChangeActionDTO

        return {
          actionId: associatedAction.id,
          shippingMethodId: associatedAction.reference_id,
        }
      }
    )

    parallelize(
      deleteOrderChangeActionsStep({ ids: [dataToRemove.actionId] }),
      deleteOrderShippingMethods({ ids: [dataToRemove.shippingMethodId] })
    )

    // Always refresh the adjustments so that eligible automatic promotions are
    // discovered even when no promotion is attached to the draft order yet.
    computeDraftOrderAdjustmentsWorkflow.runAsStep({
      input: {
        order_id: input.order_id,
      },
    })

    releaseLockStep({
      key: input.order_id,
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
