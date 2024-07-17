import { OrderChangeDTO, OrderDTO, ReturnDTO } from "@medusajs/types"
import { OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { deleteOrderChangesStep } from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

const validationStep = createStep(
  "validate-cancel-return-shipping-method",
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

export const cancelReturnReceiveWorkflowId = "cancel-receive-return"
export const cancelReturnReceiveWorkflow = createWorkflow(
  cancelReturnReceiveWorkflowId,
  function (input: { return_id: string }): WorkflowData<void> {
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
      fields: ["id", "status", "version"],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({ order, orderReturn, orderChange })

    deleteOrderChangesStep({ ids: [orderChange.id] })
  }
)
