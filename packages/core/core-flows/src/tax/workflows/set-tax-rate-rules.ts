import { CreateTaxRateRuleDTO, TaxRateRuleDTO } from "@medusajs/types"
import {
  WorkflowData,
  createWorkflow,
  transform,
} from "@medusajs/workflows-sdk"
import {
  createTaxRateRulesStep,
  deleteTaxRateRulesStep,
  listTaxRateRuleIdsStep,
} from "../steps"

type WorkflowInput = {
  tax_rate_ids: string[]
  rules: Omit<CreateTaxRateRuleDTO, "tax_rate_id">[]
}

export const setTaxRateRulesWorkflowId = "set-tax-rate-rules"
export const setTaxRateRulesWorkflow = createWorkflow(
  setTaxRateRulesWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<TaxRateRuleDTO[]> => {
    const ruleIds = listTaxRateRuleIdsStep({
      selector: { tax_rate_id: input.tax_rate_ids },
    })

    deleteTaxRateRulesStep(ruleIds)

    const rulesWithRateId = transform(
      { rules: input.rules, rateIds: input.tax_rate_ids },
      ({ rules, rateIds }) => {
        return rules
          .map((r) => {
            return rateIds.map((id) => {
              return {
                ...r,
                tax_rate_id: id,
              }
            })
          })
          .flat()
      }
    )

    return createTaxRateRulesStep(rulesWithRateId)
  }
)
