import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { CreateTaxRateRuleDTO, ITaxModuleService } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const createTaxRateRulesStepId = "create-tax-rate-rules"
export const createTaxRateRulesStep = createStep(
  createTaxRateRulesStepId,
  async (data: CreateTaxRateRuleDTO[], { container }) => {
    const service = container.resolve<ITaxModuleService>(
      ModuleRegistrationName.TAX
    )

    const created = await service.createTaxRateRules(data)

    return new StepResponse(
      created,
      created.map((rate) => rate.id)
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
