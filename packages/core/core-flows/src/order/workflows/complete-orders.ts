import { OrderDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { completeOrdersStep } from "../steps"

type CompleteOrdersStepInput = {
  orderIds: string[]
}

export const completeOrderWorkflowId = "complete-order-workflow"
export const completeOrderWorkflow = createWorkflow(
  completeOrderWorkflowId,
  (
    input: WorkflowData<CompleteOrdersStepInput>
  ): WorkflowResponse<WorkflowData<OrderDTO[]>> => {
    return new WorkflowResponse(completeOrdersStep(input))
  }
)
