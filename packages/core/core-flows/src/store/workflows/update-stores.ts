import { StoreDTO, FilterableStoreProps, UpdateStoreDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateStoresStep } from "../steps"

type UpdateStoresStepInput = {
  selector: FilterableStoreProps
  update: UpdateStoreDTO
}

type WorkflowInput = UpdateStoresStepInput

export const updateStoresWorkflowId = "update-stores"
export const updateStoresWorkflow = createWorkflow(
  updateStoresWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<StoreDTO[]> => {
    return updateStoresStep(input)
  }
)
