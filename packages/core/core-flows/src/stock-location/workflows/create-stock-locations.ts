import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"

import { CreateStockLocationInput } from "@medusajs/framework/types"
import { createStockLocations } from "../steps"

export interface CreateStockLocationsWorkflowInput {
  locations: CreateStockLocationInput[]
}

export const createStockLocationsWorkflowId = "create-stock-locations-workflow"
/**
 * This workflow creates one or more stock locations.
 */
export const createStockLocationsWorkflow = createWorkflow(
  createStockLocationsWorkflowId,
  (input: WorkflowData<CreateStockLocationsWorkflowInput>) => {
    return new WorkflowResponse(createStockLocations(input.locations))
  }
)
