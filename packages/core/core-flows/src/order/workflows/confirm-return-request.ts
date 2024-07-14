import { OrderChangeDTO, OrderDTO, ReturnDTO } from "@medusajs/types"
import { ChangeActionType } from "@medusajs/utils"
import {
  createStep,
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../common"
import { confirmOrderChanges } from "../steps/confirm-order-changes"
import { createReturnItems } from "../steps/create-return-items"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../utils/order-validation"

const validationStep = createStep(
  "validate-create-return-shipping-method",
  async function ({
    order,
    orderChanges,
    orderReturn,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderChanges: OrderChangeDTO[]
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange: orderChanges })
  }
)

export const confirmReturnRequestWorkflowId = "confirm-return-request"
export const confirmReturnRequestWorkflow = createWorkflow(
  confirmReturnRequestWorkflowId,
  function (input: { return_id: string }): WorkflowData<string> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "items"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChanges: OrderChangeDTO[] = useRemoteQueryStep({
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
        },
      },
    }).config({ name: "order-change-query" })

    const returnItemActions = transform({ orderChanges }, (data) => {
      return data.orderChanges
        .map((change) => {
          return change.actions.filter(
            (act) => act.action === ChangeActionType.RETURN_ITEM
          )
        })
        .flat()
    })

    validationStep({ order, orderReturn, orderChanges })

    createReturnItems({ returnId: orderReturn.id, changes: returnItemActions })

    confirmOrderChanges({ changes: orderChanges, orderId: order.id })

    // @ts-ignore
    return order.id
  }
)
