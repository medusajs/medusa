import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService, PricingTypes } from "@medusajs/types"
import {
  convertItemResponseToUpdateRequest,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdatePriceSetsStepInput = {
  selector?: PricingTypes.FilterablePriceSetProps
  update?: PricingTypes.UpdatePriceSetDTO
}
export const updatePriceSetsStepId = "update-price-sets"
export const updatePriceSetsStep = createStep(
  updatePriceSetsStepId,
  async (data: UpdatePriceSetsStepInput, { container }) => {
    if (!data.selector || !data.update) {
      return new StepResponse([], null)
    }

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    const { selects, relations } = getSelectsAndRelationsFromObjectArray([
      data.update,
    ])

    const dataBeforeUpdate = await pricingModule.list(data.selector, {
      select: selects,
      relations,
    })

    const updatedPriceSets = await pricingModule.update(
      data.selector,
      data.update
    )

    return new StepResponse(updatedPriceSets, {
      dataBeforeUpdate,
      selects,
      relations,
    })
  },
  async (revertInput, { container }) => {
    if (!revertInput || !revertInput.dataBeforeUpdate?.length) {
      return
    }

    const { dataBeforeUpdate, selects, relations } = revertInput

    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    await pricingModule.upsert(
      dataBeforeUpdate.map((data) =>
        convertItemResponseToUpdateRequest(data, selects, relations)
      )
    )
  }
)
