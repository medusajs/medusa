import type { PricingWorkflow } from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createPricePreferencesStep } from "../steps"

/**
 * The price preferences to create.
 */
export type CreatePricePreferencesWorkflowInput =
  PricingWorkflow.CreatePricePreferencesWorkflowInput[]

export const createPricePreferencesWorkflowId = "create-price-preferences"
/**
 * This workflow creates one or more price preferences. It's used by the
 * [Create Price Preferences Admin API Route](https://docs.medusajs.com/api/admin/price-preferences/create-price-preference).
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * create price preferences in your custom flows.
 *
 * @example
 * const { result } = await createPricePreferencesWorkflow(container)
 * .run({
 *   input: [
 *     {
 *       attribute: "region_id",
 *       value: "reg_123",
 *       is_tax_inclusive: true
 *     }
 *   ]
 * })
 *
 * @summary
 *
 * Create one or more price preferences.
 */
export const createPricePreferencesWorkflow = createWorkflow(
  createPricePreferencesWorkflowId,
  (input: WorkflowData<CreatePricePreferencesWorkflowInput>) => {
    return new WorkflowResponse(createPricePreferencesStep(input))
  }
)
