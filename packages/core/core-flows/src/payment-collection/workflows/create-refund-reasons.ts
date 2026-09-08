import { CreateRefundReasonDTO, RefundReasonDTO, } from "@medusajs/framework/types"
import { createWorkflow, WorkflowData, WorkflowResponse, } from "@medusajs/framework/workflows-sdk"
import { createRefundReasonStep } from "../steps/create-refund-reasons"

/**
 * The data to create refund reasons.
 */
export type CreateRefundReasonsWorkflowInput = {
  /**
   * The refund reasons to create.
   */
  data: CreateRefundReasonDTO[]
}

export const createRefundReasonsWorkflowId = "create-refund-reasons-workflow"
/**
 * This workflow creates one or more refund reasons. It's used by the
 * [Create Refund Reason Admin API Route](https://docs.medusajs.com/api/admin/refund-reasons/create-refund-reason).
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create refund reasons in your custom flows.
 * 
 * @example
 * const { result } = await createRefundReasonsWorkflow(container)
 * .run({
 *   input: {
 *     data: [
 *       {
 *         label: "Damaged",
 *         code: "damaged"
 *       }
 *     ]
 *   }
 * })
 * 
 * @summary
 * 
 * Create refund reasons.
 */
export const createRefundReasonsWorkflow = createWorkflow(
  createRefundReasonsWorkflowId,
  (
    input: WorkflowData<CreateRefundReasonsWorkflowInput>
  ): WorkflowResponse<RefundReasonDTO[]> => {
    return new WorkflowResponse(createRefundReasonStep(input.data))
  }
)
