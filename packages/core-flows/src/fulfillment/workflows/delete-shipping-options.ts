import { FulfillmentWorkflow } from "@medusajs/types"
import { createWorkflow, WorkflowData } from "@medusajs/workflows-sdk"
import { deleteShippingOptionsStep } from "../steps"
import { removeRemoteLinkStep } from "../../common"

export const deleteShippingOptionsWorkflowId =
  "delete-shipping-options-workflow"
export const deleteShippingOptionsWorkflow = createWorkflow(
  deleteShippingOptionsWorkflowId,
  (
    input: WorkflowData<FulfillmentWorkflow.DeleteShippingOptionsWorkflowInput>
  ): WorkflowData => {
    const softDeletedEntities = deleteShippingOptionsStep(input.ids)

    removeRemoteLinkStep(softDeletedEntities)
  }
)
