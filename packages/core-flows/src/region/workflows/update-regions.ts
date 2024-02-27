import {
  FilterableRegionProps,
  RegionDTO,
  UpdateRegionDTO,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateRegionsStep } from "../steps"

type UpdateRegionsStepInput = {
  selector: FilterableRegionProps
  update: UpdateRegionDTO
}

type WorkflowInput = UpdateRegionsStepInput

export const updateRegionsWorkflowId = "update-regions"
export const updateRegionsWorkflow = createWorkflow(
  updateRegionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<RegionDTO[]> => {
    return updateRegionsStep(input)
  }
)
