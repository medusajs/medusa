import type { ITaxModuleService } from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The IDs of the tax regions to delete.
 */
export type DeleteTaxRegionsStepInput = string[]

export const deleteTaxRegionsStepId = "delete-tax-regions"
/**
 * This step deletes one or more tax regions.
 */
export const deleteTaxRegionsStep = createStep(
  deleteTaxRegionsStepId,
  async (ids: DeleteTaxRegionsStepInput, { container }) => {
    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    await service.softDeleteTaxRegions(ids)

    return new StepResponse(void 0, ids)
  },
  async (prevIds, { container }) => {
    if (!prevIds?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    await service.restoreTaxRegions(prevIds)
  }
)
