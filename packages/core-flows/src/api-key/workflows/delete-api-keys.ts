import { Modules } from "@medusajs/modules-sdk"
import { WorkflowData, createWorkflow } from "@medusajs/workflows-sdk"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteApiKeysStep } from "../steps"

type WorkflowInput = { ids: string[] }

export const deleteApiKeysWorkflowId = "delete-api-keys"
export const deleteApiKeysWorkflow = createWorkflow(
  deleteApiKeysWorkflowId,
  (input: WorkflowData<WorkflowInput>): WorkflowData<void> => {
    deleteApiKeysStep(input.ids)

    // Please note, the ids here should be publishable key IDs
    removeRemoteLinkStep({
      [Modules.API_KEY]: { publishable_key_id: input.ids },
    })
  }
)
