import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { completeOrdersStep } from "../steps"
import { AdditionalData } from "@medusajs/types"

type CompleteOrdersStepInput = {
  orderIds: string[]
} & AdditionalData

export const completeOrderWorkflowId = "complete-order-workflow"
export const completeOrderWorkflow = createWorkflow(
  completeOrderWorkflowId,
  (input: WorkflowData<CompleteOrdersStepInput>) => {
    const completedOrders = completeOrdersStep(input)
    const ordersCompleted = createHook("ordersCompleted", {
      orders: completedOrders,
      additional_data: input.additional_data,
    })

    return new WorkflowResponse(completedOrders, {
      hooks: [ordersCompleted],
    })
  }
)
