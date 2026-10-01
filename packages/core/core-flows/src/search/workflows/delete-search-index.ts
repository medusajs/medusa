import {
  createHook,
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { deleteSearchIndexStep } from "../steps/delete-search-index"
import { validateSearchIndexesExistStep } from "../steps/validate-search-indexes-exist"

/**
 * The data to delete a search index.
 */
export type DeleteSearchIndexWorkflowInput = {
  /**
   * The name of the index to delete.
   */
  index: string
}

export const deleteSearchIndexWorkflowId = "delete-search-index"
/**
 * This workflow deletes a search index, dropping every physical index ever built
 * for it along with the versions and sync history behind them. The next migration
 * rebuilds it from scratch, starting at version 1.
 *
 * @example
 * const { result } = await deleteSearchIndexWorkflow(container)
 *   .run({
 *     input: {
 *       index: "product",
 *     },
 *   })
 *
 * @summary
 *
 * Delete a search index and everything built for it.
 *
 * @property hooks.searchIndexDeleted - This hook is called after the index has been
 * deleted. You can use it to perform any custom actions.
 */
export const deleteSearchIndexWorkflow = createWorkflow(
  deleteSearchIndexWorkflowId,
  function (input: WorkflowData<DeleteSearchIndexWorkflowInput>) {
    validateSearchIndexesExistStep(input)
    const result = deleteSearchIndexStep(input)

    const searchIndexDeleted = createHook("searchIndexDeleted", {
      index: input.index,
    })

    return new WorkflowResponse(result, {
      hooks: [searchIndexDeleted],
    })
  }
)
