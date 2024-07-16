import {
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/types"
import { ChangeActionType } from "@medusajs/utils"
import {
  WorkflowData,
  createStep,
  createWorkflow,
  transform,
  when,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderChangeActionsStep } from "../../steps/create-order-change-actions"
import { createReturnsStep } from "../../steps/create-returns"
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import { updateOrderExchangesStep } from "../../steps/update-order-exchanges"
import {
  throwIfIsCancelled,
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderChangeIsNotActive,
  throwIfOrderIsCancelled,
} from "../../utils/order-validation"

const validationStep = createStep(
  "exchange-request-item-return-validation",
  async function ({
    order,
    orderChange,
    orderReturn,
    orderExchange,
    items,
  }: {
    order: OrderDTO
    orderReturn: ReturnDTO
    orderExchange: OrderExchangeDTO
    orderChange: OrderChangeDTO
    items: OrderWorkflow.OrderExchangeRequestItemReturnWorkflowInput["items"]
  }) {
    throwIfOrderIsCancelled({ order })
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
    throwIfItemsDoesNotExistsInOrder({ order, inputItems: items })
  }
)

export const orderExchangeRequestItemReturnWorkflowId =
  "exchange-request-item-return"
export const orderExchangeRequestItemReturnWorkflow = createWorkflow(
  orderExchangeRequestItemReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderExchangeRequestItemReturnWorkflowInput>
  ): WorkflowData<OrderDTO> {
    const orderExchange = useRemoteQueryStep({
      entry_point: "order_exchange",
      fields: ["id", "order_id", "return_id"],
      variables: { id: input.exchange_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "exchange-query" })

    const existingOrderReturn = when({ orderExchange }, ({ orderExchange }) => {
      return orderExchange.return_id
    }).then(() => {
      return useRemoteQueryStep({
        entry_point: "return",
        fields: ["id", "status", "order_id"],
        variables: { id: orderExchange.return_id },
        list: false,
        throw_if_key_not_found: true,
      }).config({ name: "return-query" }) as ReturnDTO
    })

    const createdReturn = when({ orderExchange }, ({ orderExchange }) => {
      return !orderExchange.return_id
    }).then(() => {
      return createReturnsStep([
        {
          order_id: orderExchange.order_id,
          exchange_id: orderExchange.id,
        },
      ])
    })

    const orderReturn: ReturnDTO = transform(
      { createdReturn, existingOrderReturn, orderExchange },
      ({ createdReturn, existingOrderReturn, orderExchange }) => {
        return existingOrderReturn ?? (createdReturn[0] as ReturnDTO)
      }
    )

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "items.*"],
      variables: { id: orderExchange.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: { order_id: orderExchange.order_id },
      list: false,
    }).config({ name: "order-change-query" })

    validationStep({
      order,
      items: input.items,
      orderExchange,
      orderReturn,
      orderChange,
    })

    when({ orderExchange }, ({ orderExchange }) => {
      return !orderExchange.return_id
    }).then(() => {
      const createdReturnId = transform(
        { createdReturn },
        ({ createdReturn }) => {
          return createdReturn[0]!.id
        }
      )
      updateOrderExchangesStep([
        {
          id: orderExchange.id,
          return_id: createdReturnId,
        },
      ])
    })

    const orderChangeActionInput = transform(
      { order, orderChange, orderExchange, orderReturn, items: input.items },
      ({ order, orderChange, orderExchange, orderReturn, items }) => {
        return items.map((item) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          exchange_id: orderExchange.id,
          return_id: orderReturn.id,
          version: orderChange.version,
          action: ChangeActionType.RETURN_ITEM,
          internal_note: item.internal_note,
          reference: "return",
          reference_id: orderReturn.id,
          details: {
            reference_id: item.id,
            quantity: item.quantity,
            metadata: item.metadata,
          },
        }))
      }
    )

    createOrderChangeActionsStep(orderChangeActionInput)

    return previewOrderChangeStep(orderExchange.order_id)
  }
)
