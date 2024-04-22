import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { Modules } from "@medusajs/modules-sdk"
import { deleteProductVariantsStep } from "../steps"
import { removeRemoteLinkStep } from "../../common"

type WorkflowInput = { ids: string[] }

export const deleteProductVariantsWorkflowId = "delete-product-variants"
export const deleteProductVariantsWorkflow = createWorkflow(
  deleteProductVariantsWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    removeRemoteLinkStep({
      [Modules.PRODUCT]: { variant_id: input.ids },
    }).config({ name: "remove-variant-link-step" })

    return deleteProductVariantsStep(input.ids)
  }
)
