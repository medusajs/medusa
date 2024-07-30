import { OrderChangeDTO, OrderDTO, OrderWorkflow } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import { useRemoteQueryStep } from "../../../common"
import { createOrderChangeStep, createReturnsStep } from "../../steps"
import { throwIfOrderIsCancelled } from "../../utils/order-validation"

const validationStep = createStep(
  "begin-return-order-validation",
  async function ({ order }: { order: OrderDTO }) {
    throwIfOrderIsCancelled({ order })
  }
)

export const beginReturnOrderWorkflowId = "begin-return-order"
export const beginReturnOrderWorkflow = createWorkflow(
  beginReturnOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.BeginOrderReturnWorkflowInput>
  ): WorkflowResponse<WorkflowData<OrderChangeDTO>> {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    validationStep({ order })

    const created = createReturnsStep([
      {
        order_id: input.order_id,
        location_id: input.location_id,
        metadata: input.metadata,
      },
    ])

    const orderChangeInput = transform(
      { created, input },
      ({ created, input }) => {
        return {
          change_type: "return" as const,
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
