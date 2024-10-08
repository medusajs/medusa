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
import { createOrderClaimsStep } from "../../steps/claim/create-claims"
import { createOrderChangeStep } from "../../steps/create-order-change"
import { throwIfIsCancelled } from "../../utils/order-validation"

/**
 * This step validates that the order associated with the claim isn't canceled.
 */
export const beginClaimOrderValidationStep = createStep(
  "begin-claim-order-validation",
  async function ({ order }: { order: OrderDTO }) {
    throwIfIsCancelled(order, "Order")
  }
)

export const beginClaimOrderWorkflowId = "begin-claim-order"
/**
 * This workflow creates an order claim in requested state.
 */
export const beginClaimOrderWorkflow = createWorkflow(
  beginClaimOrderWorkflowId,
  function (
    input: WorkflowData<OrderWorkflow.BeginOrderClaimWorkflowInput>
  ): WorkflowResponse<OrderChangeDTO> {
    const order: OrderDTO = useRemoteQueryStep({
      entry_point: "orders",
      fields: ["id", "status"],
      variables: { id: input.order_id },
      list: false,
      throw_if_key_not_found: true,
    })

    beginClaimOrderValidationStep({ order })

    const created = createOrderClaimsStep([
      {
        type: input.type,
        order_id: input.order_id,
        metadata: input.metadata,
        created_by: input.created_by,
      },
    ])

    const orderChangeInput = transform(
      { created, input },
      ({ created, input }) => {
        return {
          change_type: "claim" as const,
          order_id: input.order_id,
          claim_id: created[0].id,
          created_by: input.created_by,
          description: input.description,
          internal_note: input.internal_note,
        }
      }
    )
    return new WorkflowResponse(createOrderChangeStep(orderChangeInput))
  }
)
