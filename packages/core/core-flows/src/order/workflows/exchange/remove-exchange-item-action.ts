import {
  OrderChangeActionDTO,
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
  OrderWorkflow,
} from "@medusajs/types"
import { ChangeActionType, OrderChangeStatus } from "@medusajs/utils"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  deleteOrderChangeActionsStep,
  previewOrderChangeStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

const validationStep = createStep(
  "remove-item-exchange-action-validation",
  async function ({
    order,
    orderChange,
    orderExchange,
    input,
  }: {
    order: OrderDTO
    orderExchange: OrderExchangeDTO
    orderChange: OrderChangeDTO
    input: OrderWorkflow.DeleteOrderExchangeItemActionWorkflowInput
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No item exchange found for exchange ${input.exchange_id} in order change ${orderChange.id}`
      )
    } else if (associatedAction.action !== ChangeActionType.ITEM_ADD) {
      throw new Error(`Action ${associatedAction.id} is not adding an item`)
    }
  }
)

export const removeItemExchangeActionWorkflowId = "remove-item-exchange-action"
export const removeItemExchangeActionWorkflow = createWorkflow(
  removeItemExchangeActionWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteOrderExchangeItemActionWorkflowInput>
  ): WorkflowResponse<OrderDTO> {
    const orderExchange: OrderExchangeDTO = useRemoteQueryStep({
      entry_point: "order_exchange",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.exchange_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at", "items.*"],
      variables: { id: orderExchange.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderExchange.order_id,
          exchange_id: orderExchange.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({ order, input, orderExchange, orderChange })

    deleteOrderChangeActionsStep({ ids: [input.action_id] })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
