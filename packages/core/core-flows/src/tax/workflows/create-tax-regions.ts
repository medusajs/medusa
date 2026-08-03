import type {
  CreateTaxRegionDTO,
  TaxRegionDTO,
} from "@medusajs/framework/types"
import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { createTaxRegionsStep } from "../steps"

/**
 * The tax regions to create.
 */
export type CreateTaxRegionsWorkflowInput = CreateTaxRegionDTO[]

/**
 * The created tax regions.
 */
export type CreateTaxRegionsWorkflowOutput = TaxRegionDTO[]

export const createTaxRegionsWorkflowId = "create-tax-regions"
/**
 * This workflow creates one or more tax regions. It's used by the
 * [Create Tax Region Admin API Route](https://docs.medusajs.com/api/admin/tax-regions/create-tax-region).
 *
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to create tax regions in your custom flows.
 *
 * @example
 * const { result } = await createTaxRegionsWorkflow(container)
 * .run({
 *   input: [
 *     {
 *       country_code: "us",
 *     }
 *   ]
 * })
 *
 * @summary
 *
 * Create one or more tax regions.
 */
export const createTaxRegionsWorkflow = createWorkflow(
  createTaxRegionsWorkflowId,
  (
    input: WorkflowData<CreateTaxRegionsWorkflowInput>
  ): WorkflowResponse<CreateTaxRegionsWorkflowOutput> => {
    return new WorkflowResponse(createTaxRegionsStep(input))
  }
)
