import {
  WorkflowData,
  WorkflowResponse,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { deleteTaxRegionsStep } from "../steps"

/**
 * The data to delete tax regions.
 */
export type DeleteTaxRegionsWorkflowInput = { 
  /**
   * The IDs of the tax regions to delete.
   */
  ids: string[]
}

export const deleteTaxRegionsWorkflowId = "delete-tax-regions"
/**
 * This workflow deletes one or more tax regions. It's used by the
 * [Delete Tax Region Admin API Route](https://docs.medusajs.com/api/admin/tax-regions/delete-a-tax-region).
 * 
 * You can use this workflow within your own customizations or custom workflows, allowing you
 * to delete tax regions in your custom flows.
 * 
 * @example
 * const { result } = await deleteTaxRegionsWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["txreg_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete one or more tax regions.
 */
export const deleteTaxRegionsWorkflow = createWorkflow(
  deleteTaxRegionsWorkflowId,
  (
    input: WorkflowData<DeleteTaxRegionsWorkflowInput>
  ): WorkflowResponse<void> => {
    return new WorkflowResponse(deleteTaxRegionsStep(input.ids))
  }
)
