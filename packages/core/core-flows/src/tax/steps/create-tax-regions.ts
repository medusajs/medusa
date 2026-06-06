import {
  CreateTaxRegionDTO,
  ITaxModuleService,
} from "@zjedene-medusa/framework/types"
import { Modules } from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

export const createTaxRegionsStepId = "create-tax-regions"
/**
 * This step creates one or more tax regions.
 * 
 * @example
 * const data = createTaxRegionsStep([
 *   {
 *     country_code: "us",
 *   }
 * ])
 */
export const createTaxRegionsStep = createStep(
  createTaxRegionsStepId,
  async (data: CreateTaxRegionDTO[], { container }) => {
    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    const created = await service.createTaxRegions(data)

    return new StepResponse(
      created,
      created.map((region) => region.id)
    )
  },
  async (createdIds, { container }) => {
    if (!createdIds?.length) {
      return
    }

    const service = container.resolve<ITaxModuleService>(Modules.TAX)

    await service.deleteTaxRegions(createdIds)
  }
)
