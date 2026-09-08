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
 * The data to validate that an order can have a claim
 */
export type BeginClaimOrderValidationStepInput = {
  /**
   * The order's details.
   */
  order: OrderDTO
}

/**
 * This step validates that the order associated with the claim isn't canceled.
 * If not valid, the step will throw an error.
 * 
 * :::note
 * 
 * You can retrieve an order's details using [Query](https://docs.medusajs.com/learn/fundamentals/module-links/query),
 * or [useQueryGraphStep](https://docs.medusajs.com/resources/references/medusa-workflows/steps/useQueryGraphStep).
 * 
 * :::
 * 
 * @example
 * const data = beginClaimOrderValidationStep({
 *   order: {
 *     id: "order_123",
 *     // other order details...
 *   },
 * })
 */
export const beginClaimOrderValidationStep = createStep(
  "begin-claim-order-validation",
  async function ({ order }: BeginClaimOrderValidationStepInput) {
    throwIfIsCancelled(order, "Order")
  }
)

export const beginClaimOrderWorkflowId = "begin-claim-order"
/**
 * This workflow creates an order claim in requested state. It's used by the 
 * [Create Claim Admin API Route](https://docs.medusajs.com/api/admin/claims/create-a-claim).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to create a claim
 * for an order in your custom flows.
 * 
 * @example
 * const { result } = await beginClaimOrderWorkflow(container)
 * .run({
 *   input: {
 *     order_id: "order_123",
 *     type: "refund",
 *   }
 * })
 * 
 * @summary
 * 
 * Create an order claim in requested state.
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
