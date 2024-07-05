import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"

import { CreateStockLocationInput } from "@medusajs/types"
import { createStockLocations } from "../steps"

interface WorkflowInput {
  locations: CreateStockLocationInput[]
}

export const createStockLocationsWorkflowId = "create-stock-locations-workflow"
export const createStockLocationsWorkflow = createWorkflow(
  createStockLocationsWorkflowId,
  (input: WorkflowData<WorkflowInput>) => {
    const locations = createStockLocations(input.locations)

    return locations
  }
)
