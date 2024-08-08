import { CreateTaxRateDTO, TaxRateDTO } from "@medusajs/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { createTaxRatesStep } from "../steps"

export const createTaxRatesWorkflowId = "create-tax-rates"
/**
 * This workflow creates one or more tax rates.
 */
export const createTaxRatesWorkflow = createWorkflow(
  createTaxRatesWorkflowId,
  (input: WorkflowData<CreateTaxRateDTO[]>): WorkflowResponse<TaxRateDTO[]> => {
    return new WorkflowResponse(createTaxRatesStep(input))
  }
)
