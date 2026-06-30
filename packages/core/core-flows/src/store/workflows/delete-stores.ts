import { Modules } from "@medusajs/framework/utils"
import { WorkflowData, createWorkflow } from "@medusajs/framework/workflows-sdk"
import { removeRemoteLinkStep } from "../../common/steps/remove-remote-links"
import { deleteStoresStep } from "../steps"

/**
 * The data to delete stores.
 */
export type DeleteStoresWorkflowInput = {
  /**
   * The IDs of the stores to delete.
   */
  ids: string[]
}

export const deleteStoresWorkflowId = "delete-stores"
/**
 * This workflow deletes one or more stores.
 *
 * :::note
 *
 * By default, Medusa uses a single store. This is useful
 * if you're building a multi-tenant application or a marketplace where each tenant has its own store.
 * If you delete the only store in your application, the Medusa application will re-create it on application start-up.
 *
 * :::
 *
 * You can use this workflow within your customizations or your own custom workflows, allowing you to
 * delete stores within your custom flows.
 *
 * @example
 * const { result } = await deleteStoresWorkflow(container)
 * .run({
 *   input: {
 *     ids: ["store_123"]
 *   }
 * })
 *
 * @summary
 *
 * Delete one or more stores.
 */
export const deleteStoresWorkflow = createWorkflow(
  deleteStoresWorkflowId,
  (input: WorkflowData<DeleteStoresWorkflowInput>): WorkflowData<void> => {
    deleteStoresStep(input.ids)

    removeRemoteLinkStep({
      [Modules.STORE]: {
        store_id: input.ids,
      },
    })
  }
)
