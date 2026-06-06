import type {
  CreateTaxRateRuleDTO,
  TaxRateRuleDTO,
} from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
  transform,
} from "@zjedene-medusa/framework/workflows-sdk"
import {
  createTaxRateRulesStep,
  deleteTaxRateRulesStep,
  listTaxRateRuleIdsStep,
} from "../steps"

/**
 * The data to set the rules for tax rates.
 */
export type SetTaxRatesRulesWorkflowInput = {
  /**
   * The IDs of the tax rates to set their rules.
   */
  tax_rate_ids: string[]
  /**
   * The rules to create for the tax rates.
   */
  rules: Omit<CreateTaxRateRuleDTO, "tax_rate_id">[]
}

export const setTaxRateRulesWorkflowId = "set-tax-rate-rules"
/**
 * This workflow sets the rules of tax rates.
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to set the rules of tax rates in your custom flows.
 *
 * @example
 * const { result } = await setTaxRateRulesWorkflow(container)
 * .run({
 *   input: {
 *     tax_rate_ids: ["txr_123"],
 *     rules: [
 *       {
 *         reference: "product_type",
 *         reference_id: "ptyp_123"
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Set the rules of tax rates.
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
