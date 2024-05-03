import {
  InventoryNext,
  StockLocationDTO,
  UpdateStockLocationNextInput,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { FilterableStockLocationProps } from "@medusajs/types"
import { UpdateStockLocationInput } from "@medusajs/types"
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
