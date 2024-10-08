import { CreateTaxRateRuleDTO, TaxRateRuleDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@medusajs/framework/workflows-sdk"
import {
  createTaxRateRulesStep,
  deleteTaxRateRulesStep,
  listTaxRateRuleIdsStep,
} from "../steps"

export type SetTaxRatesRulesWorkflowInput = {
  tax_rate_ids: string[]
  rules: Omit<CreateTaxRateRuleDTO, "tax_rate_id">[]
}

export const setTaxRateRulesWorkflowId = "set-tax-rate-rules"
/**
 * This workflow sets the rules of tax rates.
 */
export const setTaxRateRulesWorkflow = createWorkflow(
  setTaxRateRulesWorkflowId,
  (
    input: WorkflowData<SetTaxRatesRulesWorkflowInput>
  ): WorkflowResponse<TaxRateRuleDTO[]> => {
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

    return new WorkflowResponse(createTaxRateRulesStep(rulesWithRateId))
  }
)
