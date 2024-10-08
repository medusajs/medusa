import { createWorkflow, WorkflowData } from "@medusajs/framework/workflows-sdk"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteApiKeysStep } from "../steps"
import { Modules } from "@medusajs/framework/utils"

export type DeleteApiKeysWorkflowInput = { ids: string[] }

export const deleteApiKeysWorkflowId = "delete-api-keys"
/**
 * This workflow deletes one or more API keys.
 */
export const deleteApiKeysWorkflow = createWorkflow(
  deleteApiKeysWorkflowId,
  (input: WorkflowData<DeleteApiKeysWorkflowInput>): WorkflowData<void> => {
    deleteApiKeysStep(input.ids)

    // Please note, the ids here should be publishable key IDs
    removeRemoteLinkStep({
      [Modules.API_KEY]: { publishable_key_id: input.ids },
    })
  }
)
