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
  createStep,
  createWorkflow,
  transform,
  when,
  WorkflowData,
  WorkflowResponse,
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
import { removeClaimShippingMethodWorkflow } from "./remove-claim-shipping-method"

/**
 * The data to validate that outbound (new) items can be removed from a claim.
 */
export type RemoveClaimAddItemActionValidationStepInput = {
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
   * The details of removing the outbound items.
   */
  input: OrderWorkflow.DeleteOrderClaimItemActionWorkflowInput
}

/**
 * This step validates that outbound (new) items can be removed from a claim.
 * If the order, claim, or order change is canceled, or the action is not adding an item, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve an order, order claim, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = removeClaimAddItemActionValidationStep({
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
export const removeClaimAddItemActionValidationStep = createStep(
  "remove-item-claim-add-action-validation",
  async function ({
    order,
    orderChange,
    orderClaim,
    input,
  }: RemoveClaimAddItemActionValidationStepInput) {
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
    } else if (associatedAction.action !== ChangeActionType.ITEM_ADD) {
      throw new Error(`Action ${associatedAction.id} is not adding an item`)
    }
  }
)

/**
 * The data to remove outbound (new) items from a claim.
 * 
 * @property action_id - The ID of the action associated with the outbound items.
 * Every item has an `actions` property, whose value is an array of actions. 
 * You can find the action name `ITEM_ADD` using its `action` property, 
 * and use the value of its `id` property.
 */
export type RemoveAddItemClaimActionWorkflowInput = OrderWorkflow.DeleteOrderClaimItemActionWorkflowInput

export const removeAddItemClaimActionWorkflowId = "remove-item-claim-add-action"
/**
 * This workflow removes outbound (new) items from a claim. It's used by the
 * [Remove Outbound Items Admin API Route](https://docs.medusajs.com/api/admin/claims/remove-outbound-item).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to remove outbound items from a claim
 * in your custom flows.
 * 
 * @example
 * const { result } = await removeAddItemClaimActionWorkflow(container)
 * .run({
 *   input: {
 *     claim_id: "claim_123",
 *     action_id: "orchact_123",
 *   }
 * })
 * 
 * @summary
 * 
 * Remove outbound (new) items from a claim.
 */
export const removeAddItemClaimActionWorkflow = createWorkflow(
  removeAddItemClaimActionWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteOrderClaimItemActionWorkflowInput>
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

    removeClaimAddItemActionValidationStep({
      order,
      input,
      orderClaim,
      orderChange,
    })

    deleteOrderChangeActionsStep({ ids: [input.action_id] })

    const updatedOrderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "actions.action",
        "actions.claim_id",
        "actions.id",
        "actions.return_id",
      ],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "updated-order-change-query" })

    const actionIdToDelete = transform(
      { updatedOrderChange, orderClaim },
      ({
        updatedOrderChange: { actions = [] },
        orderClaim: { id: orderClaimId },
      }) => {
        const itemActions = actions.filter((c) => c.action === "ITEM_ADD")

        if (itemActions.length) {
          return null
        }

        const shippingAction = actions.find(
          (c) =>
            c.action === "SHIPPING_ADD" &&
            c.claim_id === orderClaimId &&
            !c.return_id
        )

        if (!shippingAction) {
          return null
        }

        return shippingAction.id
      }
    )

    when({ actionIdToDelete }, ({ actionIdToDelete }) => {
      return !!actionIdToDelete
    }).then(() => {
      removeClaimShippingMethodWorkflow.runAsStep({
        input: {
          claim_id: orderClaim.id!,
          action_id: actionIdToDelete,
        },
      })
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
