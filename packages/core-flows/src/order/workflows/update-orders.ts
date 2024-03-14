import { FilterableOrderProps, OrderDTO, UpdateOrderDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateOrdersStep } from "../steps"

type UpdateOrdersStepInput = {
  selector: FilterableOrderProps
  update: UpdateOrderDTO
}

type WorkflowInput = UpdateOrdersStepInput

export const updateOrdersWorkflowId = "update-orders"
export const updateOrdersWorkflow = createWorkflow(
  updateOrdersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<OrderDTO[]> => {
    return updateOrdersStep(input)
  }
)
