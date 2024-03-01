import {
  FilterableTaxRateProps,
  TaxRateDTO,
  UpdateTaxRateDTO,
} from "@medusajs/types"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { updateTaxRatesStep } from "../steps"

type UpdateTaxRatesStepInput = {
  selector: FilterableTaxRateProps
  update: UpdateTaxRateDTO
}

type WorkflowInput = UpdateTaxRatesStepInput

export const updateTaxRatesWorkflowId = "update-tax-rates"
export const updateTaxRatesWorkflow = createWorkflow(
  updateTaxRatesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<TaxRateDTO[]> => {
    return updateTaxRatesStep(input)
  }
)
