import { RegionDTO } from "@medusajs/types"
import {
  createWorkflow,
  transform,
  WorkflowData,
} from "@medusajs/workflows-sdk"
import { updateRegionsStep } from "../steps"
import { UpdateRegionsWorkflowInput } from "@medusajs/types/dist/workflow/region"

export const updateRegionsWorkflowId = "update-regions"
export const updateRegionsWorkflow = createWorkflow(
  updateRegionsWorkflowId,
  (
    input: WorkflowData<UpdateRegionsWorkflowInput>
  ): WorkflowData<RegionDTO[]> => {
    const data = transform(input, (data) => {
      const { selector, update } = data
      const { payment_provider_ids, ...rest } = update
      return {
        selector,
        update: rest,
        payment_provider_ids,
      }
    })

    const regions = updateRegionsStep(data)



    return regions
  }
)
