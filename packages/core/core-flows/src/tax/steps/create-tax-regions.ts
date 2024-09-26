import {
  CreateTaxRegionDTO,
  ITaxModuleService,
} from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { StepResponse, createStep } from "@medusajs/framework/workflows-sdk"

export const createTaxRegionsStepId = "create-tax-regions"
/**
 * This step creates one or more tax regions.
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
