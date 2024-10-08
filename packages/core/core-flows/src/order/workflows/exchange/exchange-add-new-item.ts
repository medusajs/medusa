import {
  OrderChangeDTO,
  OrderDTO,
  OrderExchangeDTO,
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
import { previewOrderChangeStep } from "../../steps/preview-order-change"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { addOrderLineItemsWorkflow } from "../add-line-items"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"
import { updateOrderTaxLinesWorkflow } from "../update-tax-lines"

/**
 * This step validates that new items can be added to an exchange.
 */
export const exchangeAddNewItemValidationStep = createStep(
  "exchange-add-new-item-validation",
  async function ({
    order,
    orderChange,
    orderExchange,
  }: {
    order: OrderDTO
    orderExchange: OrderExchangeDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderExchange, "Exchange")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const orderExchangeAddNewItemWorkflowId = "exchange-add-new-item"
/**
 * This workflow adds new items to an exchange.
 */
export const orderExchangeAddNewItemWorkflow = createWorkflow(
  orderExchangeAddNewItemWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderExchangeAddNewItemWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderExchange = useRemoteQueryStep({
      entry_point: "order_exchange",
      fields: ["id", "order_id", "canceled_at"],
      variables: { id: input.exchange_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "exchange-query" })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at", "items.*"],
      variables: { id: orderExchange.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: {
        filters: {
          order_id: orderExchange.order_id,
          exchange_id: orderExchange.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    exchangeAddNewItemValidationStep({
      order,
      orderExchange,
      orderChange,
    })

    const lineItems = addOrderLineItemsWorkflow.runAsStep({
      input: {
        order_id: order.id,
        items: input.items,
      },
    })

    const lineItemIds = transform(lineItems, (lineItems) => {
      return lineItems.map((item) => item.id)
    })

    updateOrderTaxLinesWorkflow.runAsStep({
      input: {
        order_id: order.id,
        item_ids: lineItemIds,
      },
    })

    const orderChangeActionInput = transform(
      { order, orderChange, orderExchange, items: input.items, lineItems },
      ({ order, orderChange, orderExchange, items, lineItems }) => {
        return items.map((item, index) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          exchange_id: orderExchange.id,
          version: orderChange.version,
          action: ChangeActionType.ITEM_ADD,
          internal_note: item.internal_note,
          reference: "order_exchange",
          reference_id: orderExchange.id,
          details: {
            reference_id: lineItems[index].id,
            quantity: item.quantity,
            unit_price: item.unit_price ?? lineItems[index].unit_price,
            metadata: item.metadata,
          },
        }))
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

    return new WorkflowResponse(previewOrderChangeStep(orderExchange.order_id))
  }
)
