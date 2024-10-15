import {
  OrderChangeDTO,
  OrderDTO,
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
 * This step validates that new items can be added to an order edit.
 */
export const orderEditAddNewItemValidationStep = createStep(
  "order-edit-add-new-item-validation",
  async function ({
    order,
    orderChange,
  }: {
    order: OrderDTO
    orderChange: OrderChangeDTO
  }) {
    throwIfIsCancelled(order, "Order")
    throwIfOrderChangeIsNotActive({ orderChange })
  }
)

export const orderEditAddNewItemWorkflowId = "order-edit-add-new-item"
/**
 * This workflow adds new items to an order edit.
 */
export const orderEditAddNewItemWorkflow = createWorkflow(
  orderEditAddNewItemWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderEditAddNewItemWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at", "items.*"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status"],
      variables: {
        filters: {
          order_id: input.order_id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    orderEditAddNewItemValidationStep({
      order,
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
      { order, orderChange, items: input.items, lineItems },
      ({ order, orderChange, items, lineItems }) => {
        return items.map((item, index) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          version: orderChange.version,
          action: ChangeActionType.ITEM_ADD,
          internal_note: item.internal_note,
          details: {
            reference_id: lineItems[index].id,
            quantity: item.quantity,
            unit_price: item.unit_price ?? lineItems[index].unit_price,
            compare_at_unit_price:
              item.compare_at_unit_price ??
              lineItems[index].compare_at_unit_price,
            metadata: item.metadata,
          },
        }))
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

    return new WorkflowResponse(previewOrderChangeStep(input.order_id))
  }
)
