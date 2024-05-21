import { OrderDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { archiveOrdersStep } from "../steps"

type ArchiveOrdersStepInput = {
  orderIds: string[]
}

export const archiveOrderWorkflowId = "archive-order-workflow"
export const archiveOrderWorkflow = createWorkflow(
  archiveOrderWorkflowId,
  (input: WorkflowData<ArchiveOrdersStepInput>): WorkflowData<OrderDTO[]> => {
    const archivedOrders = archiveOrdersStep(input)

    return archivedOrders
  }
)
