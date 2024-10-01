import {
  WorkflowData,
  WorkflowResponse,
  createHook,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { completeOrdersStep } from "../steps"
import { AdditionalData } from "@medusajs/framework/types"

export type CompleteOrdersWorkflowInput = {
  orderIds: string[]
} & AdditionalData

export const completeOrderWorkflowId = "complete-order-workflow"
/**
 * This workflow completes one or more orders.
 */
export const completeOrderWorkflow = createWorkflow(
  completeOrderWorkflowId,
  (input: WorkflowData<CompleteOrdersWorkflowInput>) => {
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
