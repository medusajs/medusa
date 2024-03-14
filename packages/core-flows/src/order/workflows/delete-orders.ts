import { Modules } from "@medusajs/modules-sdk"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteOrdersStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteOrdersWorkflowId = "delete-orders"
export const deleteOrdersWorkflow = createWorkflow(
  deleteOrdersWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    const removedKeys = deleteOrdersStep(input.ids)

    removeRemoteLinkStep({
      [Modules.ORDER]: removedKeys,
    })
  }
)
