import type {
  TaxRegionDTO,
  UpdateTaxRegionDTO,
} from "@zjedene-medusa/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@zjedene-medusa/framework/workflows-sdk"
import { updateTaxRegionsStep } from "../steps/update-tax-regions"

/**
 * The tax regions to update.
 */
export type UpdateTaxRegionsWorkflowInput = UpdateTaxRegionDTO[]

/**
 * The updated tax regions.
 */
export type UpdateTaxRegionsWorkflowOutput = TaxRegionDTO[]

export const updateTaxRegionsWorkflowId = "update-tax-regions"
/**
 * This workflow updates one or more tax regions. It's used by the
 * [Update Tax Regions Admin API Route](https://docs.medusajs.com/api/admin#tax-regions_posttaxregionsid).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to update tax regions in your custom flows.
 *
 * @example
 * const { result } = await updateTaxRegionsWorkflow(container)
 * .run({
 *   input: [
 *     {
 *       id: "txreg_123",
 *       province_code: "CA",
 *     }
 *   ]
 * })
 *
 * @summary
 *
 * Update one or more tax regions.
 */
export const updateTaxRegionsWorkflow = createWorkflow(
  updateTaxRegionsWorkflowId,
  (
    input: WorkflowData<UpdateTaxRegionsWorkflowInput>
  ): WorkflowResponse<UpdateTaxRegionsWorkflowOutput> => {
    return new WorkflowResponse(updateTaxRegionsStep(input))
  }
)
