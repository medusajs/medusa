import { OrderDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { archiveOrdersStep } from "../steps"

type ArchiveOrdersStepInput = {
  orderIds: string[]
}

export const archiveOrderWorkflowId = "archive-order-workflow"
export const archiveOrderWorkflow = createWorkflow(
  archiveOrderWorkflowId,
  (
    input: WorkflowData<ArchiveOrdersStepInput>
  ): WorkflowResponse<WorkflowData<OrderDTO[]>> => {
    return new WorkflowResponse(archiveOrdersStep(input))
  }
)
