import type {
  CreateTaxRateRuleDTO,
  TaxRateRuleDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createTaxRateRulesStep } from "../steps"

/**
 * The data to create tax rules for rates.
 */
export type CreateTaxRateRulesWorkflowInput = {
  /**
   * The rules to create.
   */
  rules: CreateTaxRateRuleDTO[]
}

/**
 * The created tax rules for rates.
 */
export type CreateTaxRateRulesWorkflowOutput = TaxRateRuleDTO[]

export const createTaxRateRulesWorkflowId = "create-tax-rate-rules"
/**
 * This workflow creates one or more tax rules for rates. It's used by the
 * [Create Tax Rules for Rates Admin API Route](https://docs.medusajs.com/api/admin/tax-rates/create-tax-rule).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create tax rules for rates in your custom flows.
 *
 * @example
 * const { result } = await createTaxRateRulesWorkflow(container)
 * .run({
 *   input: {
 *     rules: [
 *       {
 *         tax_rate_id: "txr_123",
 *         reference: "product_type",
 *         reference_id: "ptyp_123"
 *       }
 *     ]
 *   }
 * })
 *
 * @summary
 *
 * Create one or more tax rules for rates.
 */
export const createTaxRateRulesWorkflow = createWorkflow(
  createTaxRateRulesWorkflowId,
  (
    input: WorkflowData<CreateTaxRateRulesWorkflowInput>
  ): WorkflowResponse<CreateTaxRateRulesWorkflowOutput> => {
    return new WorkflowResponse(createTaxRateRulesStep(input.rules))
  }
)
