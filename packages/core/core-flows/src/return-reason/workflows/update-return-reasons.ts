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

export type UpdateReturnReasonsWorkflowInput = {
  selector: FilterableOrderReturnReasonProps
  update: ReturnReasonUpdatableFields
}

export const updateReturnReasonsWorkflowId = "update-return-reasons"
/**
 * This workflow updates return reasons matching the specified filters.
 */
export const updateReturnReasonsWorkflow = createWorkflow(
  updateReturnReasonsWorkflowId,
  (
    input: WorkflowData<UpdateReturnReasonsWorkflowInput>
  ): WorkflowResponse<OrderReturnReasonDTO[]> => {
    return new WorkflowResponse(updateReturnReasonsStep(input))
  }
)
