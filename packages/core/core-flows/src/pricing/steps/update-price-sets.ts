import type {
  IPricingModuleService,
  PricingTypes,
} from "@zjedene-medusa/framework/types"
import {
  MedusaError,
  Modules,
  getSelectsAndRelationsFromObjectArray,
} from "@zjedene-medusa/framework/utils"
import { StepResponse, createStep } from "@zjedene-medusa/framework/workflows-sdk"

/**
 * The data to update price sets. You can either update price sets with a selector
 * or by providing IDs in the price set objects to update.
 */
export type UpdatePriceSetsStepInput =
  | {
      /**
       * The filters to select which price sets to update.
       */
      selector?: PricingTypes.FilterablePriceSetProps
      /**
       * The data to update the price sets with.
       */
      update?: PricingTypes.UpdatePriceSetDTO
    }
  | {
      /**
       * The price sets to update.
       */
      price_sets: PricingTypes.UpsertPriceSetDTO[]
    }

export const updatePriceSetsStepId = "update-price-sets"
/**
 * This step updates price sets.
 *
 * @example
 * const data = updatePriceSetsStep({
 *   selector: {
 *     id: ["pset_123"]
 *   },
 *   update: {
 *     prices: [
 *       {
 *         amount: 10,
 *         currency_code: "usd",
 *       }
 *     ]
 *   }
 * })
 */
export const updatePriceSetsStep = createStep(
  updatePriceSetsStepId,
  async (data: UpdatePriceSetsStepInput, { container }) => {
    const pricingModule = container.resolve<IPricingModuleService>(
      Modules.PRICING
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
      Modules.PRICING
    )

    if (!revertInput) {
      return
    }

    await pricingModule.upsertPriceSets(
      revertInput as PricingTypes.UpsertPriceSetDTO[]
    )
  }
)
