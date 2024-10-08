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
 * This step validates that a return can be created for an order.
 */
export const beginReturnOrderValidationStep = createStep(
  "begin-return-order-validation",
  async function ({ order }: { order: OrderDTO }) {
    throwIfOrderIsCancelled({ order })
  }
)

export const beginReturnOrderWorkflowId = "begin-return-order"
/**
 * This workflow requests a return.
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
