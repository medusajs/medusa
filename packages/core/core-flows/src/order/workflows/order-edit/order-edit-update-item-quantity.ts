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
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"

/**
 * This step validates that item quantity updated can be added to an order edit.
 */
export const orderEditUpdateItemQuantityValidationStep = createStep(
  "order-edit-update-item-quantity-validation",
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

export const orderEditUpdateItemQuantityWorkflowId =
  "order-edit-update-item-quantity"
/**
 * This workflow update item's quantity of an order.
 */
export const orderEditUpdateItemQuantityWorkflow = createWorkflow(
  orderEditUpdateItemQuantityWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.OrderEditUpdateItemQuantityWorkflowInput>
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

    orderEditUpdateItemQuantityValidationStep({
      order,
      orderChange,
    })

    const orderChangeActionInput = transform(
      { order, orderChange, items: input.items },
      ({ order, orderChange, items }) => {
        return items.map((item) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          version: orderChange.version,
          action: ChangeActionType.ITEM_UPDATE,
          internal_note: item.internal_note,
          details: {
            reference_id: item.id,
            quantity: item.quantity,
            unit_price: item.unit_price,
            compare_at_unit_price: item.compare_at_unit_price,
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
