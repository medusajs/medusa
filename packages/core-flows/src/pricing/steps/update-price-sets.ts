import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService, UpdatePriceSetDTO } from "@medusajs/types"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

export const updatePriceSetsStepId = "update-price-sets"
export const updatePriceSetsStep = createStep(
  updatePriceSetsStepId,
  async (data: UpdatePriceSetDTO[], { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(data)
    const dataBeforeUpdate = await pricingModule.list(
      { id: data.map((d) => d.id) },
      { relations, select: selects }
    )

    const updatedPriceSets = await pricingModule.update(data)

    return new StepResponse(updatedPriceSets, {
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

    await pricingModule.update(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
