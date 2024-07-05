import { StoreDTO, CreateStoreDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createStoresStep } from "../steps"

type WorkflowInput = { stores: CreateStoreDTO[] }

export const createStoresWorkflowId = "create-stores"
export const createStoresWorkflow = createWorkflow(
  createStoresWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<StoreDTO[]> => {
    return createStoresStep(input)
  }
)
