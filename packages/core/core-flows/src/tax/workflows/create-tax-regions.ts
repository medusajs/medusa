import { CreateTaxRegionDTO, TaxRegionDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createTaxRegionsStep } from "../steps"

export const createTaxRegionsWorkflowId = "create-tax-regions"
/**
 * This workflow creates one or more tax regions.
 */
export const createTaxRegionsWorkflow = createWorkflow(
  createTaxRegionsWorkflowId,
  (input: WorkflowData<CreateTaxRegionDTO[]>): WorkflowResponse<TaxRegionDTO[]> => {
    return new WorkflowResponse(createTaxRegionsStep(input))
  }
)
