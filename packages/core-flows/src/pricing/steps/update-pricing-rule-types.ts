import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService, UpdateRuleTypeDTO } from "@medusajs/types"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updatePricingRuleTypesStepId = "update-pricing-rule-types"
export const updatePricingRuleTypesStep = createStep(
  updatePricingRuleTypesStepId,
  async (data: UpdateRuleTypeDTO[], { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const dataBeforeUpdate = await pricingModule.listRuleTypes(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updatedRuleTypes = await pricingModule.updateRuleTypes(data)

    return new StepResponse(updatedRuleTypes, {
      dataBeforeUpdate,
      selects,
      relations,
    })
  },
  async (revertInput, { container }) => {
    if (!revertInput) {
      return
    }

    const { dataBeforeUpdate = [], selects, relations } = revertInput

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await pricingModule.updateRuleTypes(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
