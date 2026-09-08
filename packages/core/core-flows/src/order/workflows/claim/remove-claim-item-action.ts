import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderClaimDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/framework/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  deleteOrderChangeActionsStep,
  previewOrderChangeStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { refreshClaimShippingWorkflow } from "./refresh-shipping"

/**
 * The data to validate that claim items can be removed.
 */
export type RemoveClaimItemActionValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The order claim's details.
   */
  orderClaim: OrderClaimDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The details of removing the claim items.
   */
  input: OrderWorkflow.DeleteOrderClaimItemActionWorkflowInput
}

/**
 * This step confirms that a claim's items, added as order items, can be removed.
 * If the order, claim, or order change is canceled, or the action is not claiming an item, the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, order claim, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = removeClaimItemActionValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderClaim: {
 *     id: "claim_123",
 *     // other order claim details...
 *   },
 *   input: {
 *     claim_id: "claim_123",
 *     action_id: "orchact_123",
 *   }
 * })
 */
export const removeClaimItemActionValidationStep = createStep(
  "remove-item-claim-action-validation",
  async function ({
    order,
    orderChange,
    orderClaim,
    input,
  }: RemoveClaimItemActionValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No item claim found for claim ${input.claim_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.WRITE_OFF_ITEM) {
      throw new Error(`Action ${associatedAction.id} is not claiming an item`)
    }
  }
)

/**
 * The data to remove order items from a claim.
 *
 * @property action_id - The ID of the action associated with the outbound items.
 * Every item has an `actions` property, whose value is an array of actions.
 * You can find the action name `WRITE_OFF_ITEM` using its `action` property,
 * and use the value of its `id` property.
 */
export type RemoveItemClaimActionWorkflowInput =
  OrderWorkflow.DeleteOrderClaimItemActionWorkflowInput

export const removeItemClaimActionWorkflowId = "remove-item-claim-action"
/**
 * This workflow removes order items from a claim. It's used by the
 * [Remove Claim Item Admin API Route](https://docs.medusajs.com/api/admin/claims/remove-claim-item).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to remove order items from a claim
 * in your custom flows.
 *
 * @example
 * const { result } = await removeItemClaimActionWorkflow(container)
 * .run({
 *   input: {
 *     claim_id: "claim_123",
 *     action_id: "orchact_123",
 *   }
 * })
 *
 * @summary
 *
 * Remove order items from a claim.
 */
export const removeItemClaimActionWorkflow = createWorkflow(
  removeItemClaimActionWorkflowId,
  function (
    input: WorkflowData<RemoveItemClaimActionWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderClaim: OrderClaimDTO = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at", "items.*"],
      variables: { id: orderClaim.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    removeClaimItemActionValidationStep({
      order,
      input,
      orderClaim,
      orderChange,
    })

    deleteOrderChangeActionsStep({ ids: [input.action_id] })

    const refreshArgs = transform(
      { orderChange, orderClaim },
      ({ orderChange, orderClaim }) => {
        return {
          order_change_id: orderChange.id,
          claim_id: orderClaim.id,
          order_id: orderClaim.order_id,
        }
      }
    )

    refreshClaimShippingWorkflow.runAsStep({
      input: refreshArgs,
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
