import { CreateTaxRegionDTO, TaxRegionDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createTaxRegionsStep } from "../steps"

type WorkflowInput = CreateTaxRegionDTO[]

export const createTaxRegionsWorkflowId = "create-tax-regions"
export const createTaxRegionsWorkflow = createWorkflow(
  createTaxRegionsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowResponse<TaxRegionDTO[]> => {
    return new WorkflowResponse(createTaxRegionsStep(input))
  }
)
