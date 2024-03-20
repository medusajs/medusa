import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import {
  deleteProductVariantsStep,
  removeVariantPricingLinkStep,
} from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteProductVariantsWorkflowId = "delete-product-variants"
export const deleteProductVariantsWorkflow = createWorkflow(
  deleteProductVariantsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    // Question: Should we also remove the price set manually, or would that be cascaded?
    removeVariantPricingLinkStep({ variant_ids: input.ids })
    return deleteProductVariantsStep(input.ids)
  }
)
