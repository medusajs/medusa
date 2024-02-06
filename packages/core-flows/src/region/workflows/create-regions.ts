import { CreateRegionDTO, RegionDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createRegionsStep } from "../steps"

type WorkflowInput = { regionsData: CreateRegionDTO[] }

export const createRegionsWorkflowId = "create-regions"
export const createRegionsWorkflow = createWorkflow(
  createRegionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<RegionDTO[]> => {
    return createRegionsStep(input.regionsData)
  }
)
