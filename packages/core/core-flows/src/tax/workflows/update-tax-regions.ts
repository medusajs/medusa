import { TaxRegionDTO, UpdateTaxRegionDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { updateTaxRegionsStep } from "../steps/update-tax-regions"

export const updateTaxRegionsWorkflowId = "update-tax-regions"
/**
 * This workflow updates one or more tax regions.
 */
export const updateTaxRegionsWorkflow = createWorkflow(
  updateTaxRegionsWorkflowId,
  (
    input: WorkflowData<UpdateTaxRegionDTO[]>
  ): WorkflowResponse<TaxRegionDTO[]> => {
    return new WorkflowResponse(updateTaxRegionsStep(input))
  }
)
