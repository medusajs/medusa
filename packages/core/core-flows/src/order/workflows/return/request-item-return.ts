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
  throwIfItemsDoesNotExistsInOrder,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"
import { validateReturnReasons } from "../../utils/validate-return-reason"
import { createOrderChangeActionsWorkflow } from "../create-order-change-actions"
import { refreshReturnShippingWorkflow } from "./refresh-shipping"
/**
 * The data to validate that items can be added to a return.
 */
export type RequestItemReturnValidationStepInput = {
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
   * The items to be added to the return.
   */
  items: OrderWorkflow.RequestItemReturnWorkflowInput["items"]
}

/**
 * This step validates that items can be added to a return.
 * If the order or return is canceled, the order change is not active,
 * the items do not exist in the order, or the return reasons are invalid,
 * the step will throw an error.
 *
 * :::note
 *
 * You can retrieve an order, return, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 *
 * :::
 *
 * @example
 * const data = requestItemReturnValidationStep({
 *   order: {
 *     id: "order_123",
 *     items: [
 *       {
 *         id: "orli_123",
 *         // other item details...
 *       }
 *     ]
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderReturn: {
 *     id: "return_123",
 *     // other return details...
 *   },
 *   items: [
 *     {
 *       id: "orli_123",
 *       quantity: 1,
 *     }
 *   ]
 * })
 */
export const requestItemReturnValidationStep = createStep(
  "request-item-return-validation",
  async function (
    {
      order,
      orderChange,
      orderReturn,
      items,
    }: RequestItemReturnValidationStepInput,
    context
  ) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })
    throwIfItemsDoesNotExistsInOrder({ order, inputItems: items })

    await validateReturnReasons(
      { orderId: order.id, inputItems: items },
      context
    )
  }
)

export const requestItemReturnWorkflowId = "request-item-return"
/**
 * This workflow adds items to a return. It's used by the
 * [Add Requested Items to Return Admin API Route](https://docs.medusajs.com/api/admin/returns/add-items).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to add items to a return
 * in your custom flows.
 *
 * @example
 * const { result } = await requestItemReturnWorkflow(container)
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
 * Add items to a return.
 */
export const requestItemReturnWorkflow = createWorkflow(
  requestItemReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.RequestItemReturnWorkflowInput>
  ): WorkflowResponse<OrderPreviewDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status", "canceled_at", "items.*"],
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

    requestItemReturnValidationStep({
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
          action: ChangeActionType.RETURN_ITEM,
          internal_note: item.internal_note,
          reference: "return",
          reference_id: orderReturn.id,
          details: {
            reference_id: item.id,
            reason_id: item.reason_id,
            quantity: item.quantity,
            metadata: item.metadata,
          },
        }))
      }
    )

    createOrderChangeActionsWorkflow.runAsStep({
      input: orderChangeActionInput,
    })

    const refreshArgs = transform(
      { orderChange, orderReturn },
      ({ orderChange, orderReturn }) => {
        return {
          order_change_id: orderChange.id,
          return_id: orderReturn.id,
          order_id: orderReturn.order_id,
        }
      }
    )

    refreshReturnShippingWorkflow.runAsStep({
      input: refreshArgs,
    })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
