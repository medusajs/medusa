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
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import {
  previewOrderChangeStep,
  updateOrderChangeActionsStep,
} from "../../steps"
import {
  throwIfIsCancelled,
  throwIfOrderChangeIsNotActive,
} from "../../utils/order-validation"

/**
 * The data to validate that an item can be updated in a return receival request.
 */
export type UpdateReceiveItemReturnRequestValidationStepInput = {
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
   * The details of the item update.
   */
  input: OrderWorkflow.UpdateReceiveItemReturnRequestWorkflowInput
}

/**
 * This step validates that an item can be updated in a return receival request.
 * If the order or return is canceled, the order change is not active,
 * the return request is not found, or the action is not receiving an item return request,
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
 * const data = updateReceiveItemReturnRequestValidationStep({
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
 *   input: {
 *     return_id: "return_123",
 *     action_id: "orchac_123",
 *     data: {
 *       quantity: 1,
 *     }
 *   }
 * })
 */
export const updateReceiveItemReturnRequestValidationStep = createStep(
  "update-receive-item-return-request-validation",
  async function (
    {
      order,
      orderChange,
      orderReturn,
      input,
    }: UpdateReceiveItemReturnRequestValidationStepInput,
    context
  ) {
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
        `Action ${associatedAction.id} is not receiving an item return request`
      )
    }
  }
)

export const updateReceiveItemReturnRequestWorkflowId =
  "update-receive-item-return-request"
/**
 * This workflow updates an item in a return receival request. It's used by the
 * [Update a Received Item in a Return Admin API Route](https://docs.medusajs.com/api/admin/returns/update-received-item).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to update an item in a return receival request
 * in your custom flows.
 * 
 * @example
 * const { result } = await updateReceiveItemReturnRequestWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *     action_id: "orchac_123",
 *     data: {
 *       quantity: 1,
 *     }
 *   }
 * })
 * 
 * @summary
 * 
 * Update an item in a return receival request.
 */
export const updateReceiveItemReturnRequestWorkflow = createWorkflow(
  updateReceiveItemReturnRequestWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.UpdateReceiveItemReturnRequestWorkflowInput>
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

    updateReceiveItemReturnRequestValidationStep({
      order,
      input,
      orderReturn,
      orderChange,
    })

    const updateData = transform(
      { orderChange, input },
      ({ input, orderChange }) => {
        const originalAction = (orderChange.actions ?? []).find(
          (a) => a.id === input.action_id
        ) as OrderChangeActionDTO

        const data = input.data
        return {
          id: input.action_id,
          details: {
            quantity: data.quantity ?? originalAction.details?.quantity,
          },
          internal_note: data.internal_note,
        }
      }
    )

    updateOrderChangeActionsStep([updateData])

    return new WorkflowResponse(previewOrderChangeStep(order.id))
  }
)
