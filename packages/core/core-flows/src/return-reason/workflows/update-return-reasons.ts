import {
  FilterableOrderReturnReasonProps,
  OrderReturnReasonDTO,
  ReturnReasonUpdatableFields,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateReturnReasonsStep } from "../steps"

/**
 * The data to update return reasons.
 */
export type UpdateReturnReasonsWorkflowInput = {
  /**
   * The filters to select the return reasons to update.
   */
  selector: FilterableOrderReturnReasonProps
  /**
   * The data to update the return reasons.
   */
  update: ReturnReasonUpdatableFields
}

/**
 * The updated return reasons.
 */
export type UpdateReturnReasonsWorkflowOutput = OrderReturnReasonDTO[]

export const updateReturnReasonsWorkflowId = "update-return-reasons"
/**
 * This workflow updates return reasons matching the specified filters. It's used by the
 * [Update Return Reason Admin API Route](https://docs.medusajs.com/api/admin/return-reasons/update-a-return-reason).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * update return reasons within your custom flows.
 * 
 * @example
 * const { result } = await updateReturnReasonsWorkflow(container)
 * .run({
 *   input: {
 *     selector: {
 *       id: "rr_123",
 *     },
 *     update: {
 *       value: "damaged",
 *     }
 *   }
 * })
 * 
 * @summary
 * 
 * Update return reasons.
 */
export const updateReturnReasonsWorkflow = createWorkflow(
  updateReturnReasonsWorkflowId,
  (
    input: WorkflowData<UpdateReturnReasonsWorkflowInput>
  ): WorkflowResponse<UpdateReturnReasonsWorkflowOutput> => {
    return new WorkflowResponse(updateReturnReasonsStep(input))
  }
)
