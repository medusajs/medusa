import { OrderDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { archiveOrdersStep } from "../steps"

export type ArchiveOrdersWorkflowInput = {
  orderIds: string[]
}

export const archiveOrderWorkflowId = "archive-order-workflow"
/**
 * This workflow archives an order.
 */
export const archiveOrderWorkflow = createWorkflow(
  archiveOrderWorkflowId,
  (
    input: WorkflowData<ArchiveOrdersWorkflowInput>
  ): WorkflowResponse<OrderDTO[]> => {
    return new WorkflowResponse(archiveOrdersStep(input))
  }
)
