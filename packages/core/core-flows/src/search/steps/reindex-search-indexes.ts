import type { ISearchModuleService } from "@medusajs/framework/types"
import { MedusaError, Modules } from "@medusajs/framework/utils"
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
   * completion; `in_place` writes into the active version directly. Ignored
   * — always in place — when `filters` or `since` is set.
   */
  strategy?: "swap" | "in_place"
  /**
   * Filters passed to the index definition's `seed` function to rebuild only
   * a subset of the index's documents. The shape is index-defined.
   */
  filters?: Record<string, unknown>
  /**
   * Rebuilds only documents that changed at or after this date (ISO 8601).
   */
  since?: string
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
    const searchModule = container.resolve<ISearchModuleService>(Modules.SEARCH)

    // An unparseable date would otherwise reach `seed` as an Invalid Date and
    // quietly rebuild nothing, so it fails here instead.
    let since: Date | undefined
    if (input.since) {
      since = new Date(input.since)

      if (isNaN(since.getTime())) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `"${input.since}" is not a valid date to reindex since`
        )
      }
    }

    const result = await searchModule.reindex({ ...input, since })

    return new StepResponse(result)
  }
)
