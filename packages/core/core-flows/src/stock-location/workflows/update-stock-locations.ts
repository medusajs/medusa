import {
  StockLocationDTO,
  UpdateStockLocationInput,
  FilterableStockLocationProps,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"

import { updateStockLocationsStep } from "../steps"

export interface UpdateStockLocationsWorkflowInput {
  selector: FilterableStockLocationProps
  update: UpdateStockLocationInput
}
export const updateStockLocationsWorkflowId = "update-stock-locations-workflow"
/**
 * This workflow updates stock locations matching the specified filters.
 */
export const updateStockLocationsWorkflow = createWorkflow(
  updateStockLocationsWorkflowId,
  (
    input: WorkflowData<UpdateStockLocationsWorkflowInput>
  ): WorkflowResponse<StockLocationDTO[]> => {
    return new WorkflowResponse(updateStockLocationsStep(input))
  }
)
