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
 * This step validates that new items can be removed from a claim.
 */
export const removeClaimAddItemActionValidationStep = createStep(
  "remove-item-claim-add-action-validation",
  async function ({
    order,
    orderChange,
    orderClaim,
    input,
  }: {
    order: OrderDTO
    orderClaim: OrderClaimDTO
    orderChange: OrderChangeDTO
    input: OrderWorkflow.DeleteOrderClaimItemActionWorkflowInput
  }) {
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

export const removeAddItemClaimActionWorkflowId = "remove-item-claim-add-action"
/**
 * This workflow removes new items from a claim.
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
