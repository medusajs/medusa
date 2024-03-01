import {
  FilterableTaxRateProps,
  ITaxModuleService,
  TaxRateDTO,
  UpdateTaxRateDTO,
} from "@medusajs/types"
import {
  StepResponse,
  WorkflowData,
  createStep,
  createWorkflow,
} from "@medusajs/workflows-sdk"
import { updateTaxRatesStep } from "../steps"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { setTaxRateRulesWorkflow } from "./set-tax-rate-rules"

type UpdateTaxRatesStepInput = {
  selector: FilterableTaxRateProps
  update: UpdateTaxRateDTO
}

type WorkflowInput = UpdateTaxRatesStepInput

// // Special step in the workflow to restore tax rate rules that
// // might be soft deleted during the update step
// const maybeListTaxRulesToSoftDelete = createStep(
//   "maybe-list-tax-rate-rules",
//   async (input: WorkflowData<WorkflowInput>, { container }) => {
//     const { selector, update } = input
//
//     if (!update.rules) {
//       return new StepResponse([])
//     }
//
//     const service = container.resolve<ITaxModuleService>(
//       ModuleRegistrationName.TAX
//     )
//
//     const taxRates = await service.listTaxRateRules(
//       { tax_rate: selector },
//       { select: ["id"] }
//     )
//
//     return new StepResponse(taxRates.map((taxRate) => taxRate.id))
//   },
//   async (prevData, { container }) => {
//     if (!prevData?.length) {
//       return
//     }
//
//     const service = container.resolve<ITaxModuleService>(
//       ModuleRegistrationName.TAX
//     )
//
//     await service.restoreTaxRateRules(prevData)
//   }
// )

export const updateTaxRatesWorkflowId = "update-tax-rates"
export const updateTaxRatesWorkflow = createWorkflow(
  updateTaxRatesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<TaxRateDTO[]> => {
    return updateTaxRatesStep(input)
  }
)
