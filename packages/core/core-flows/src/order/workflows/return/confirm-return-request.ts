import { OrderChangeDTO, OrderDTO, ReturnDTO } from "@medusajs/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { previewOrderChangeStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import { createReturnItemsStep } from "../../steps/create-return-items"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

type WorkflowInput = {
  return_id: string
}

const validationStep = createStep(
  "validate-confirm-return-request",
  async function ({
    order,
    orderChange,
    orderReturn,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const confirmReturnRequestWorkflowId = "confirm-return-request"
export const confirmReturnRequestWorkflow = createWorkflow(
  confirmReturnRequestWorkflowId,
  function (input: WorkflowInput): WorkflowData<OrderDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "canceled_at"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: [
        "id",
        "actions.id",
        "actions.action",
        "actions.details",
        "actions.reference",
        "actions.reference_id",
        "actions.internal_note",
      ],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    const returnItemActions = transform({ orderChange }, (data) => {
      return data.orderChange.actions.filter(
        (act) => act.action === ChangeActionType.RETURN_ITEM
      )
    })

    validationStep({ order, orderReturn, orderChange })

    createReturnItemsStep({
      returnId: orderReturn.id,
      changes: returnItemActions,
    })

    confirmOrderChanges({ changes: [orderChange], orderId: order.id })

    return previewOrderChangeStep(order.id)
  }
)
