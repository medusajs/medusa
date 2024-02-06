import { CartDTO, CreateCartDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createCartsStep } from "../steps"

type WorkflowInput = { cartData: CreateCartDTO[] }

export const createCartsWorkflowId = "create-carts"
export const createCartsWorkflow = createWorkflow(
  createCartsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<CartDTO[]> => {
    return createCartsStep(input.cartData)
  }
)
