import {
  OrderChangeDTO,
  OrderDTO,
  OrderPreviewDTO,
  OrderWorkflow,
  ReturnDTO,
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
import { previewOrderChangeStep } from "../../steps"
import {
  throwIfIsCancelled,
  throwIfItemsDoesNotExistsInReturn,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"

/**
 * The data to validate that a return request can have its items dismissed.
 */
export type DismissItemReturnRequestValidationStepInput = {
  /**
   * The order's details.
   */
  order: Pick<OrderDTO, "id" | "items">
  /**
   * The return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The items to dismiss.
   */
  items: OrderWorkflow.ReceiveOrderReturnItemsWorkflowInput["items"]
}

/**
 * This step validates that a return request can have its items dismissed.
 * If the order or return is canceled, the order change is not active, 
 * or the items do not exist in the return, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve an order, return, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = dismissItemReturnRequestValidationStep({
 *   order: {
 *     id: "order_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         // other item details...
 *       }
 *     ]
 *   },
 *   orderReturn: {
 *     id: "return_123",
 *     // other return details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   items: [
 *     {
 *       id: "orli_123",
 *       quantity: 1,
 *     }
 *   ]
 * })
 */
export const dismissItemReturnRequestValidationStep = createStep(
  "dismiss-item-return-request-validation",
  async function (
    {
      order,
      orderChange,
      orderReturn,
      items,
    }: DismissItemReturnRequestValidationStepInput,
    context
  ) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
    throwIfItemsDoesNotExistsInReturn({ orderReturn, inputItems: items })
  }
)

/**
 * The data to dismiss items from a return request.
 * 
 * @property return_id - The ID of the return to dismiss items from.
 * @property items - The items to dismiss.
 */
export type DismissItemReturnRequestWorkflowInput = OrderWorkflow.ReceiveOrderReturnItemsWorkflowInput

export const dismissItemReturnRequestWorkflowId = "dismiss-item-return-request"
/**
 * This workflow dismisses items from a return request due to them being damaged. It's used
 * by the [Add Damaged Items Admin API Route](https://docs.medusajs.com/api/admin/returns/add-damaged-items).
 * 
 * A damaged item's quantity is dismissed, meaning it's not returned to the inventory.
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to dismiss items from a return request in your custom flow.
 * 
 * @example
 * const { result } = await dismissItemReturnRequestWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         quantity: 1,
 *       }
 *     ]
 *   }
 * })
 * 
 * @summary
 * 
 * Dismiss items from a return request.
 */
export const dismissItemReturnRequestWorkflow = createWorkflow(
  dismissItemReturnRequestWorkflowId,
  function (
    input: WorkflowData<DismissItemReturnRequestWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at", "items.*"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    const orderChange: OrderChangeDTO = useRemoteQueryStep({
      entry_point: "order_change",
      fields: ["id", "status", "order_id", "return_id"],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    dismissItemReturnRequestValidationStep({
      order,
      items: input.items,
      orderReturn,
      orderChange,
    })

    const orderChangeActionInput = transform(
      { order, orderChange, orderReturn, items: input.items },
      ({ order, orderChange, orderReturn, items }) => {
        return items.map((item) => ({
          order_change_id: orderChange.id,
          order_id: order.id,
          return_id: orderReturn.id,
          version: orderChange.version,
          action: ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM,
          internal_note: item.internal_note,
          reference: "return",
          reference_id: orderReturn.id,
          details: {
            reference_id: item.id,
            quantity: item.quantity,
          },
        }))
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
