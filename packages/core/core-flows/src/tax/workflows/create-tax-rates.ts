import { CreateTaxRateDTO, TaxRateDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createTaxRatesStep } from "../steps"

type WorkflowInput = CreateTaxRateDTO[]

export const createTaxRatesWorkflowId = "create-tax-rates"
export const createTaxRatesWorkflow = createWorkflow(
  createTaxRatesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowResponse<TaxRateDTO[]> => {
    return new WorkflowResponse(createTaxRatesStep(input))
  }
)
