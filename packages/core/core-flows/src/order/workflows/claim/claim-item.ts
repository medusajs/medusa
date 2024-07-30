import {
  OrderChangeDTO,
  OrderClaimDTO,
  OrderDTO,
  OrderWorkflow,
} from "@medusajs/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderChangeActionsStep } from "../../steps/create-order-change-actions"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

const validationStep = createStep(
  "claim-item-validation",
  async function ({
    order,
    orderChange,
    orderClaim,
  }: {
    order: OrderDTO
    orderClaim: OrderClaimDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderClaim, "Claim")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const orderClaimItemWorkflowId = "claim-item"
export const orderClaimItemWorkflow = createWorkflow(
  orderClaimItemWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderClaimItemWorkflowInput>
  ): WorkflowResponse<WorkflowData<OrderDTO>> {
    const orderClaim = useRemoteQueryStep({
      entry_point: "order_claim",
      fields: ["id", "order_id", "canceled_at"],
      variables: { id: input.claim_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "claim-query" })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at", "items.*"],
      variables: { id: orderClaim.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: {
        filters: {
          order_id: orderClaim.order_id,
          claim_id: orderClaim.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({
      order,
      orderClaim,
      orderChange,
    })

    const orderChangeActionInput = transform(
      { order, orderChange, orderClaim, items: input.items },
      ({ order, orderChange, orderClaim, items }) => {
        return items.map((item, index) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          claim_id: orderClaim.id,
          version: orderChange.version,
          action: ChangeActionType.WRITE_OFF_ITEM,
          internal_note: item.internal_note,
          reference: "order_claim",
          reference_id: orderClaim.id,
          details: {
            reference_id: item.id,
            reason: item.reason,
            quantity: item.quantity,
          },
        }))
      }
    )

    createOrderChangeActionsStep(orderChangeActionInput)

    return new WorkflowResponse(previewOrderChangeStep(orderClaim.order_id))
  }
)
