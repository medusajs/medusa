import {
  CartDTO,
  FilterableCartProps,
  UpdateCartDataDTO,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateCartsStep } from "../steps/update-carts"

type WorkflowInput = {
  selector: FilterableCartProps
  update: UpdateCartDataDTO
}

export const updateCartsWorkflowId = "update-carts"
export const updateCartsWorkflow = createWorkflow(
  updateCartsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CartDTO[]> => {
    return updateCartsStep(input)
  }
)
