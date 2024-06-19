import {
  StockLocationDTO,
  UpdateStockLocationInput,
  FilterableStockLocationProps,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { updateStockLocationsStep } from "../steps"

interface WorkflowInput {
  selector: FilterableStockLocationProps
  update: UpdateStockLocationInput
}
export const updateStockLocationsWorkflowId = "update-stock-locations-workflow"
export const updateStockLocationsWorkflow = createWorkflow(
  updateStockLocationsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<StockLocationDTO[]> => {
    return updateStockLocationsStep(input)
  }
)
