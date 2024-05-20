import { OrderDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { completeOrdersStep } from "../steps"

type CompleteOrdersStepInput = {
  order_ids: string[]
}

export const completeOrderWorkflowId = "complete-order-workflow"
export const completeOrderWorkflow = createWorkflow(
  completeOrderWorkflowId,
  (input: WorkflowData<CompleteOrdersStepInput>): WorkflowData<OrderDTO[]> => {
    const completedOrders = completeOrdersStep(input)

    // TODO: Emit event "OrderModuleService.Order.COMPLETED"
    // id + no_notification

    return completedOrders
  }
)
