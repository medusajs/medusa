import { createWorkflow, WorkflowData } from "@medusajs/framework/workflows-sdk"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteApiKeysStep } from "../steps"
import { Modules } from "@medusajs/framework/utils"

/**
 * The data to delete API keys.
 */
export type DeleteApiKeysWorkflowInput = { 
  /**
   * The IDs of the API keys to delete.
   */
  ids: string[]
}

export const deleteApiKeysWorkflowId = "delete-api-keys"
/**
 * This workflow deletes one or more secret or publishable API keys. It's used by the
 * [Delete API Key Admin API Route](https://docs.medusajs.com/api/admin/api-keys/delete-an-api-key).
 * 
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete API keys within your custom flows.
 * 
 * @example
 * const { result } = await deleteApiKeysWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["apk_123"]
 *   }
 * })
 * 
 * @summary
 * 
 * Delete secret or publishable API keys.
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
