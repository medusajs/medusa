import { IPricingModuleService, PricingTypes } from "@medusajs/types"
import {
  MedusaError,
  ModuleRegistrationName,
  getSelectsAndRelationsFromObjectArray,
} from "@medusajs/utils"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

type UpdatePriceSetsStepInput =
  | {
      selector?: PricingTypes.FilterablePriceSetProps
      update?: PricingTypes.UpdatePriceSetDTO
    }
  | {
      price_sets: PricingTypes.UpsertPriceSetDTO[]
    }

export const updatePriceSetsStepId = "update-price-sets"
export const updatePriceSetsStep = createStep(
  updatePriceSetsStepId,
  async (data: UpdatePriceSetsStepInput, { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    if ("price_sets" in data) {
      if (data.price_sets.some((p) => !p.id)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Price set id is required when doing a batch update"
        )
      }

      const prevData = await pricingModule.listPriceSets({
        id: data.price_sets.map((p) => p.id) as string[],
      })

      const priceSets = await pricingModule.upsertPriceSets(data.price_sets)
      return new StepResponse(priceSets, prevData)
    }

    if (!data.selector || !data.update) {
      return new StepResponse([], null)
    }

    const { selects, relations } = getSelectsAndRelationsFromObjectArray(
      [data.update],
      { objectFields: ["rules"] }
    )

    const dataBeforeUpdate = await pricingModule.listPriceSets(data.selector, {
      select: selects,
      relations,
    })

    const updatedPriceSets = await pricingModule.updatePriceSets(
      data.selector,
      data.update
    )

    return new StepResponse(updatedPriceSets, dataBeforeUpdate)
  },
  async (revertInput, { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      ModuleRegistrationName.PRICING
    )

    if (!revertInput) {
      return
    }

    await pricingModule.upsertPriceSets(
      revertInput as PricingTypes.UpsertPriceSetDTO[]
    )
  }
)
