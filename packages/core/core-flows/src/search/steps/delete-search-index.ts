import type {
  ISearchModuleService,
  SearchTypes,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The input for the {@link deleteSearchIndexStep}.
 */
export interface DeleteSearchIndexStepInput {
  /**
   * The name of the index to delete.
   */
  index: string
}

export const deleteSearchIndexStepId = "delete-search-index"
/**
 * This step deletes a search index: every physical index ever built for it is
 * dropped from its engine, along with the versions and sync history behind them.
 * There is no compensation — a dropped index can only be rebuilt.
 *
 * @example
 * const data = deleteSearchIndexStep({
 *   index: "product",
 * })
 */
export const deleteSearchIndexStep = createStep(
  deleteSearchIndexStepId,
  async (input: DeleteSearchIndexStepInput, { container }) => {
    const searchModule = container.resolve<ISearchModuleService>(Modules.SEARCH)

    const result: SearchTypes.SearchIndexDeleteResult =
      await searchModule.deleteIndex(input.index)

    return new StepResponse(result)
  }
)
