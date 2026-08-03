import {
  OrderChangeDTO,
  OrderDTO,
  OrderWorkflow,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderChangeStep, createReturnsStep } from "../../steps"
import { throwIfOrderIsCancelled } from "../../utils/order-validation"

/**
 * The data to validate that a return can be created for an order.
 */
export type BeginReturnOrderValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
}

/**
 * This step validates that a return can be created for an order.
 * If the order is canceled, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve an order details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = beginReturnOrderValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   }
 * })
 */
export const beginReturnOrderValidationStep = createStep(
  "begin-return-order-validation",
  async function ({ order }: BeginReturnOrderValidationStepInput) {
    throwIfOrderIsCancelled({ order })
  }
)

export const beginReturnOrderWorkflowId = "begin-return-order"
/**
 * This workflow creates an order return that can be later requested or confirmed.
 * It's used by the [Create Return Admin API Route](https://docs.medusajs.com/api/admin/returns/create-return).
 * 
 * You can start the return receival using the {@link beginReceiveReturnWorkflow}.
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you
 * to create a return for an order in your custom flow.
 * 
 * @example
 * const { result } = await beginReturnOrderWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123"
 *   }
 * })
 * 
 * @summary
 * 
 * Create a return for an order.
 */
export const beginReturnOrderWorkflow = createWorkflow(
  beginReturnOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.BeginOrderReturnWorkflowInput>
  ): WorkflowResponse<OrderChangeDTO> {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    beginReturnOrderValidationStep({ order })

    const created = createReturnsStep([
      {
        order_id: input.order_id,
        location_id: input.location_id,
        metadata: input.metadata,
        created_by: input.created_by,
      },
    ])

    const orderChangeInput = transform(
      { created, input },
      ({ created, input }) => {
        return {
          change_type: "return_request" as const,
          order_id: input.order_id,
          return_id: created[0].id,
          created_by: input.created_by,
          description: input.description,
          internal_note: input.internal_note,
        }
      }
    )
    return new WorkflowResponse(createOrderChangeStep(orderChangeInput))
  }
)
