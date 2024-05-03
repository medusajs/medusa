import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateTaxRegionDTO, ITaxModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createTaxRegionsStepId = "create-tax-regions"
export const createTaxRegionsStep = createStep(
  createTaxRegionsStepId,
  async (data: CreateTaxRegionDTO[], { container }) => {
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

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

    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    await service.delete(createdIds)
  }
)
