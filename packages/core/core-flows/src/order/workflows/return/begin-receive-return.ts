import {
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
  ReturnDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderChangeStep } from "../../steps"
import { throwIfIsCancelled } from "../../utils/order-validation"

/**
 * The data to validate that a return can be received.
 */
export type BeginReceiveReturnValidationStepInput = {
  /**
   * The order return's details.
   */
  orderReturn: ReturnDTO
  /**
   * The order's details.
   */
  order: OrderDTO
}

/**
 * This step validates that a return can be received.
 * If the order or return is canceled, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve an order and return details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = beginReceiveReturnValidationStep({
 *   orderReturn: {
 *     id: "return_123",
 *     // other order return details...
 *   },
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   }
 * })
 */
export const beginReceiveReturnValidationStep = createStep(
  "begin-receive-return-validation",
  async function (
    {
      orderReturn,
      order,
    }: BeginReceiveReturnValidationStepInput,
    context
  ) {
    throwIfIsCancelled(order, "Order")
    throwIfIsCancelled(orderReturn, "Return")
  }
)

export const beginReceiveReturnWorkflowId = "begin-receive-return"
/**
 * This workflow requests return receival. It's used by the
 * [Start Return Receival Admin API Route](https://docs.medusajs.com/api/admin/returns/start-return-receival).
 * 
 * You can confirm the return receival using the {@link confirmReturnRequestWorkflow}.
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to receive a return in your custom flows.
 * 
 * @example
 * const { result } = await beginReceiveReturnWorkflow(container)
 * .run({
 *   input: {
 *     return_id: "return_123",
 *   }
 * })
 * 
 * @summary
 * 
 * Request a return receival.
 */
export const beginReceiveReturnWorkflow = createWorkflow(
  beginReceiveReturnWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.BeginReceiveOrderReturnWorkflowInput>
  ): WorkflowResponse<OrderChangeDTO> {
    const orderReturn: ReturnDTO = useRemoteQueryStep({
      entry_point: "return",
      fields: ["id", "status", "order_id", "canceled_at"],
      variables: { id: input.return_id },
      list: false,
      throw_if_key_not_found: true,
    })

    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "version", "status", "canceled_at"],
      variables: { id: orderReturn.order_id },
      list: false,
      throw_if_key_not_found: true,
    }).config({ name: "order-query" })

    beginReceiveReturnValidationStep({ order, orderReturn })

    const orderChangeInput = transform(
      { orderReturn, order, input },
      ({ orderReturn, order, input }) => {
        return {
          change_type: "return_receive" as const,
          order_id: order.id,
          return_id: orderReturn.id,
          created_by: input.created_by,
          description: input.description,
          internal_note: input.internal_note,
        }
      }
    )
    return new WorkflowResponse(createOrderChangeStep(orderChangeInput))
  }
)
