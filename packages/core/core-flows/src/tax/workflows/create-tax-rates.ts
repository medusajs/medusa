import type { CreateTaxRateDTO, TaxRateDTO } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createTaxRatesStep } from "../steps"

/**
 * The tax rates to create.
 */
export type CreateTaxRatesWorkflowInput = CreateTaxRateDTO[]

/**
 * The created tax rates.
 */
export type CreateTaxRatesWorkflowOutput = TaxRateDTO[]

export const createTaxRatesWorkflowId = "create-tax-rates"
/**
 * This workflow creates one or more tax rates. It's used by the
 * [Create Tax Rates Admin API Route](https://docs.medusajs.com/api/admin/tax-rates/create-tax-rate).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create tax rates in your custom flows.
 *
 * @example
 * const { result } = await createTaxRatesWorkflow(container)
 * .run({
 *   input: [
 *     {
 *       tax_region_id: "txreg_123",
 *       name: "Default"
 *     }
 *   ]
 * })
 *
 * @summary
 *
 * Create one or more tax rates.
 */
export const createTaxRatesWorkflow = createWorkflow(
  createTaxRatesWorkflowId,
  (
    input: WorkflowData<CreateTaxRatesWorkflowInput>
  ): WorkflowResponse<CreateTaxRatesWorkflowOutput> => {
    return new WorkflowResponse(createTaxRatesStep(input))
  }
)
