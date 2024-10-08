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
import { createOrderChangeStep } from "../../steps/create-order-change"
import { throwIfOrderIsCancelled } from "../../utils/order-validation"

/**
 * This step validates that an order-edit can be requested for an order.
 */
export const beginOrderEditValidationStep = createStep(
  "begin-order-edit-validation",
  async function ({ order }: { order: OrderDTO }) {
    throwIfOrderIsCancelled({ order })
  }
)

export const beginOrderEditOrderWorkflowId = "begin-order-edit-order"
/**
 * This workflow requests an order order-edit.
 */
export const beginOrderEditOrderWorkflow = createWorkflow(
  beginOrderEditOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.BeginorderEditWorkflowInput>
  ): WorkflowResponse<OrderChangeDTO> {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    beginOrderEditValidationStep({ order })

    const orderChangeInput = transform({ input }, ({ input }) => {
      return {
        change_type: "edit" as const,
        order_id: input.order_id,
        created_by: input.created_by,
        description: input.description,
        internal_note: input.internal_note,
      }
    })
    return new WorkflowResponse(createOrderChangeStep(orderChangeInput))
  }
)
