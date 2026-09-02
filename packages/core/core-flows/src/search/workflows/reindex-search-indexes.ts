import {
  createHook,
  createWorkflow,
  WorkflowData,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { reindexSearchIndexesStep } from "../steps/reindex-search-indexes"
import { validateSearchIndexesExistStep } from "../steps/validate-search-indexes-exist"

/**
 * The data to reindex one or more search indexes.
 */
export type ReindexSearchIndexesWorkflowInput = {
  /**
   * The name of the index to reindex. Defaults to every registered index.
   */
  index?: string | string[]
  /**
   * How to rebuild. `swap` fills a shadow index and aliases over; `in_place`
   * writes into the live index.
   */
  strategy?: "swap" | "in_place"
}

export const reindexSearchIndexesWorkflowId = "reindex-search-indexes"
/**
 * This workflow rebuilds one or more search indexes from their seed.
 *
 *
 * @example
 * const { transaction } = await reindexSearchIndexesWorkflow(container)
 *   .run({
 *     input: {
 *       index: "product",
 *     },
 *   })
 *
 * @summary
 *
 * Reindex one or more search indexes.
 *
 * @property hooks.searchIndexesReindexed - This hook is called after the indexes have been
 * reindexed. You can use it to perform any custom actions.
 */
export const reindexSearchIndexesWorkflow = createWorkflow(
  reindexSearchIndexesWorkflowId,
  function (input: WorkflowData<ReindexSearchIndexesWorkflowInput>) {
    validateSearchIndexesExistStep(input)
    const result = reindexSearchIndexesStep(input).config({
      async: true,
      backgroundExecution: true,
    })

    const searchIndexesReindexed = createHook("searchIndexesReindexed", {
      job_id: result.job_id,
      indexes: result.indexes,
    })

    return new WorkflowResponse(void 0, {
      hooks: [searchIndexesReindexed],
    })
  }
)
