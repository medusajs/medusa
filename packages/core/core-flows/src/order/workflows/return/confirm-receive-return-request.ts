import {
  BigNumberInput,
  OrderChangeDTO,
  OrderDTO,
  ReturnDTO,
} from "@medusajs/types"
import { ChangeActionType, MathBN, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { previewOrderChangeStep, updateReturnItemsStep } from "../../steps"
import { confirmOrderChanges } from "../../steps/confirm-order-changes"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

type WorkflowInput = {
  return_id: string
}

const validationStep = createStep(
  "validate-confirm-return-receive",
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

export const confirmReturnReceiveWorkflowId = "confirm-return-receive"
export const confirmReturnReceiveWorkflow = createWorkflow(
  confirmReturnReceiveWorkflowId,
  function (input: WorkflowInput): WorkflowData<OrderDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at", "items.*"],
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

    const updateReturnItem = transform({ orderChange, orderReturn }, (data) => {
      const retItems = data.orderReturn.items!
      const received = data.orderChange.actions.filter((act) =>
        [
          ChangeActionType.RECEIVE_RETURN_ITEM,
          ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM,
        ].includes(act.action as ChangeActionType)
      )

      const itemMap = retItems.reduce((acc, item: any) => {
        acc[item.item_id] = item.id
        return acc
      }, {})

      const itemUpdates = {}
      received.forEach((act) => {
        const itemId = act.details!.reference_id as string
        if (itemUpdates[itemId]) {
          itemUpdates[itemId].received_quantity = MathBN.add(
            itemUpdates[itemId].received_quantity,
            act.details!.quantity as BigNumberInput
          )
          return
        }

        itemUpdates[itemId] = {
          id: itemMap[itemId],
          received_quantity: act.details!.quantity,
        }
      })

      return Object.values(itemUpdates) as any
    })

    validationStep({ order, orderReturn, orderChange })

    updateReturnItemsStep(updateReturnItem)

    confirmOrderChanges({ changes: [orderChange], orderId: order.id })

    return previewOrderChangeStep(order.id)
  }
)
