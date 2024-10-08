import { CreateTaxRegionDTO, TaxRegionDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createTaxRegionsStep } from "../steps"

export const createTaxRegionsWorkflowId = "create-tax-regions"
/**
 * This workflow creates one or more tax regions.
 */
export const createTaxRegionsWorkflow = createWorkflow(
  createTaxRegionsWorkflowId,
  (
    input: WorkflowData<CreateTaxRegionDTO[]>
  ): WorkflowResponse<TaxRegionDTO[]> => {
    return new WorkflowResponse(createTaxRegionsStep(input))
  }
)
