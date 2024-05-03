import { CreateTaxRateDTO, TaxRateDTO } from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { createTaxRatesStep } from "../steps"

type WorkflowInput = CreateTaxRateDTO[]

export const createTaxRatesWorkflowId = "create-tax-rates"
export const createTaxRatesWorkflow = createWorkflow(
  createTaxRatesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<TaxRateDTO[]> => {
    return createTaxRatesStep(input)
  }
)
