import {
  FilterableTaxRateProps,
  ITaxModuleService,
  TaxRateDTO,
  UpdateTaxRateDTO,
} from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
import {
  StepResponse,
  WorkflowData,
  WorkflowResponse,
  createStep,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createTaxRateRulesStep,
  deleteTaxRateRulesStep,
  updateTaxRatesStep,
} from "../steps"
// import { setTaxRateRulesWorkflow } from "./set-tax-rate-rules"

type UpdateTaxRatesStepInput = {
  selector: FilterableTaxRateProps
  update: UpdateTaxRateDTO
}

type WorkflowInput = UpdateTaxRatesStepInput

type StepInput = {
  tax_rate_ids: string[]
  update: UpdateTaxRateDTO
}

// TODO: When we figure out how to compensate nested workflows, we can use this
//
// export const maybeSetTaxRateRulesStepId = "maybe-set-tax-rate-rules"
// const maybeSetTaxRateRules = createStep(
//   maybeSetTaxRateRulesStepId,
//   async (input: StepInput, { container }) => {
//     const { update } = input
//
//     if (!update.rules) {
//       return new StepResponse([], "")
//     }
//
//     const { result, transaction } = await setTaxRateRulesWorkflow(
//       container
//     ).run({
//       input: {
//         tax_rate_ids: input.tax_rate_ids,
//         rules: update.rules,
//       },
//     })
//
//     return new StepResponse(result, transaction.transactionId)
//   },
//   async (transactionId, { container }) => {
//     if (!transactionId) {
//       return
//     }
//
//     await setTaxRateRulesWorkflow(container).cancel(transactionId)
//   }
// )

const maybeListTaxRateRuleIdsStepId = "maybe-list-tax-rate-rule-ids"
const maybeListTaxRateRuleIdsStep = createStep(
  maybeListTaxRateRuleIdsStepId,
  async (input: StepInput, { container }) => {
    const { update, tax_rate_ids } = input

    if (!update.rules) {
      return new StepResponse([])
    }

    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    const rules = await service.listTaxRateRules(
      { tax_rate_id: tax_rate_ids },
      { select: ["id"] }
    )

    return new StepResponse(rules.map((r) => r.id))
  }
)

export const updateTaxRatesWorkflowId = "update-tax-rates"
export const updateTaxRatesWorkflow = createWorkflow(
  updateTaxRatesWorkflowId,
  (
    input: WorkflowData<WorkflowInput>
  ): WorkflowResponse<WorkflowData<TaxRateDTO[]>> => {
    const cleanedUpdateInput = transform(input, (data) => {
      // Transform clones data so we can safely modify it
      if (data.update.rules) {
        delete data.update.rules
      }

      return {
        selector: data.selector,
        update: data.update,
      }
    })

    const updatedRates = updateTaxRatesStep(cleanedUpdateInput)
    const rateIds = transform(updatedRates, (rates) => rates.map((r) => r.id))

    // TODO: Use when we figure out how to compensate nested workflows
    // maybeSetTaxRateRules({
    //   tax_rate_ids: rateIds,
    //   update: input.update,
    // })

    // COPY-PASTE from set-tax-rate-rules.ts
    const ruleIds = maybeListTaxRateRuleIdsStep({
      tax_rate_ids: rateIds,
      update: input.update,
    })

    deleteTaxRateRulesStep(ruleIds)

    const rulesWithRateId = transform(
      { update: input.update, rateIds },
      ({ update, rateIds }) => {
        if (!update.rules) {
          return []
        }

        const updatedBy = update.updated_by

        return update.rules
          .map((r) => {
            return rateIds.map((id) => {
              return {
                ...r,
                created_by: updatedBy,
                tax_rate_id: id,
              }
            })
          })
          .flat()
      }
    )

    createTaxRateRulesStep(rulesWithRateId)
    // end of COPY-PASTE from set-tax-rate-rules.ts

    return new WorkflowResponse(updatedRates)
  }
)
