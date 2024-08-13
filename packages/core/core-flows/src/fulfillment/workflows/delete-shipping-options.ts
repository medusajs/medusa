import { FulfillmentWorkflow } from "@medusajs/types"
import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { deleteShippingOptionsStep } from "../steps"
import { removeRemoteLinkStep } from "../../common"

export const deleteShippingOptionsWorkflowId =
  "delete-shipping-options-workflow"
/**
 * This workflow deletes one or more shipping options.
 */
export const deleteShippingOptionsWorkflow = createWorkflow(
  deleteShippingOptionsWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.DeleteShippingOptionsWorkflowInput>
  ) => {
    const softDeletedEntities = deleteShippingOptionsStep(input.ids)

    removeRemoteLinkStep(softDeletedEntities)
  }
)
