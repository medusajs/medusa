import {
  OrderChangeActionDTO,
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
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  deleteOrderChangeActionsStep,
  previewOrderChangeStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

/**
 * The data to validate that a return receival's item can be removed.
 */
export type RemoveItemReceiveReturnActionValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
  /**
   * The return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The order change's details.
   */
  orderChange: OrderChangeDTO
  /**
   * The details of the item to be removed.
   */
  input: OrderWorkflow.DeleteRequestItemReceiveReturnWorkflowInput
}

/**
 * This step validates that a return receival's item can be removed.
 * If the order or return is canceled, the order change is not active,
 * the return request is not found,
 * or the action is not a receive return action, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve an order, return, and order change details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = removeItemReceiveReturnActionValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 *   orderChange: {
 *     id: "orch_123",
 *     // other order change details...
 *   },
 *   orderReturn: {
 *     id: "return_123",
 *     // other return details...
 *   },
 *   input: {
 *     return_id: "return_123",
 *     action_id: "orchac_123",
 *   }
 * })
 */
export const removeItemReceiveReturnActionValidationStep = createStep(
  "remove-item-receive-return-action-validation",
  async function ({
    order,
    orderChange,
    orderReturn,
    input,
  }: RemoveItemReceiveReturnActionValidationStepInput) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
    throwIfOrderChangeIsNotActive({ orderChange })

    const associatedAction = (orderChange.actions ?? []).find(
      (a) => a.id === input.action_id
    ) as OrderChangeActionDTO

    if (!associatedAction) {
      throw new Error(
        `No request return found for return ${input.return_id} in order change ${orderChange.id}`
      )
    } else if (
      ![
        ChangeActionType.RECEIVE_RETURN_ITEM,
        ChangeActionType.RECEIVE_DAMAGED_RETURN_ITEM,
      ].includes(associatedAction.action as ChangeActionType)
    ) {
      throw new Error(
        `Action ${associatedAction.id} is not receiving item return`
      )
    }
  }
)

export const removeItemReceiveReturnActionWorkflowId =
  "remove-item-receive-return-action"
/**
 * This workflow removes an item from a return receival. It's used by the
 * [Remove a Received Item from Return Admin API Route](https://docs.medusajs.com/api/admin/returns/remove-received-item).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to remove an item from a return receival
 * in your custom flow.
 * 
 * @example
 * const { result } = await removeItemReceiveReturnActionWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *     action_id: "orchac_123",
 *   }
 * })
 * 
 * @summary
 * 
 * Remove an item from a return receival.
 */
export const removeItemReceiveReturnActionWorkflow = createWorkflow(
  removeItemReceiveReturnActionWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.DeleteRequestItemReceiveReturnWorkflowInput>
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
      fields: ["id", "status", "version", "actions.*"],
      variables: {
        filters: {
          order_id: orderReturn.order_id,
          return_id: orderReturn.id,
          status: [OrderChangeStatus.PENDING, OrderChangeStatus.REQUESTED],
        },
      },
      list: false,
    }).config({ name: "order-change-query" })

    removeItemReceiveReturnActionValidationStep({
      order,
      input,
      orderReturn,
      orderChange,
    })

    deleteOrderChangeActionsStep({ ids: [input.action_id] })

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
