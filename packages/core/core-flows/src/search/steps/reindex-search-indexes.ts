import type { ISearchModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The input for the {@link reindexSearchIndexesStep}.
 */
export interface ReindexSearchIndexesStepInput {
  /**
   * The name of the index to reindex. Defaults to every registered index.
   */
  index?: string | string[]
  /**
   * How to rebuild. `swap` fills a new version and makes it active on
   * completion; `in_place` writes into the active version directly.
   */
  strategy?: "swap" | "in_place"
}

export const reindexSearchIndexesStepId = "reindex-search-indexes"
/**
 * This step rebuilds one or more search indexes from their seed.
 *
 * @example
 * const data = reindexSearchIndexesStep({
 *   index: "product",
 * })
 */
export const reindexSearchIndexesStep = createStep(
  reindexSearchIndexesStepId,
  async (input: ReindexSearchIndexesStepInput, { container }) => {
    const searchModule =
      container.resolve<ISearchModuleService>(Modules.SEARCH)

    const result = await searchModule.reindex(input)

    return new StepResponse(result)
  }
)
