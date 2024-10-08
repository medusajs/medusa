import { CreateTaxRateDTO, TaxRateDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
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
