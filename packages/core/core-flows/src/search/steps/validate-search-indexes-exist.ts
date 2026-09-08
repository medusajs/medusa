import type { ISearchModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

/**
 * The input for the {@link validateSearchIndexesExistStep}.
 */
export interface ValidateSearchIndexesExistStepInput {
  /**
   * The name of the index to validate. Defaults to every registered index,
   * in which case there is nothing to check.
   */
  index?: string | string[]
}

export const validateSearchIndexesExistStepId = "validate-search-indexes-exist"
/**
 * This step validates that each requested search index is registered. If an
 * index is missing, the step throws an error.
 *
 * @example
 * validateSearchIndexesExistStep({
 *   index: "product",
 * })
 */
export const validateSearchIndexesExistStep = createStep(
  validateSearchIndexesExistStepId,
  async (input: ValidateSearchIndexesExistStepInput, { container }) => {
    if (!input.index) {
      return new StepResponse(void 0)
    }

    const names = Array.isArray(input.index) ? input.index : [input.index]
    const searchModule =
      container.resolve<ISearchModuleService>(Modules.SEARCH)

    for (const name of names) {
      searchModule.getIndex(name)
    }

    return new StepResponse(void 0)
  }
)
