import {
  FilterableOrderReturnReasonProps,
  OrderReturnReasonDTO,
  ReturnReasonUpdatableFields,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateReturnReasonsStep } from "../steps"

type WorkflowInput = {
  selector: FilterableOrderReturnReasonProps
  update: ReturnReasonUpdatableFields
}

export const updateReturnReasonsWorkflowId = "update-return-reasons"
export const updateReturnReasonsWorkflow = createWorkflow(
  updateReturnReasonsWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowData<OrderReturnReasonDTO[]> => {
    return updateReturnReasonsStep(input)
  }
)
