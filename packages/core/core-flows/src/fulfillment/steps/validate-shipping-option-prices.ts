import type { FulfillmentWorkflow } from "@zjedene-medusa/framework/types"
import {
  MedusaError,
  Modules,
  ShippingOptionPriceType,
} from "@zjedene-medusa/framework/utils"
import { createStep, StepResponse } from "@zjedene-medusa/framework/workflows-sdk"
import type { CreateShippingOptionDTO } from "@zjedene-medusa/framework/types"

/**
 * The data to validate shipping option prices.
 */
export type ValidateShippingOptionPricesStepInput = (
  | FulfillmentWorkflow.CreateShippingOptionsWorkflowInput
  | FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput
)[]

export const validateShippingOptionPricesStepId =
  "validate-shipping-option-prices"

/**
 * This step validates that shipping options can be created based on provided price configuration.
 *
 * For flat rate prices, it validates that regions exist for the shipping option prices.
 * For calculated prices, it validates with the fulfillment provider if the price can be calculated.
 *
 * If not valid, the step throws an error.
 *
 * @example
 * const data = validateShippingOptionPricesStep([
 *   {
 *     name: "Standard Shipping",
 *     service_zone_id: "serzo_123",
 *     shipping_profile_id: "sp_123",
 *     provider_id: "prov_123",
 *     type: {
 *       label: "Standard",
 *       description: "Standard shipping",
 *       code: "standard"
 *     },
 *     price_type: "calculated",
 *   }
 * ])
 */
export const validateShippingOptionPricesStep = createStep(
  validateShippingOptionPricesStepId,
  async (options: ValidateShippingOptionPricesStepInput, { container }) => {
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

    const optionIds = options.map(
      (option) =>
        (option as FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput).id
    )

    if (optionIds.length) {
      /**
       * This means we are validating an update of shipping options.
       * We need to ensure that all shipping options have price_type set
       * to correctly determine price updates.
       *
       * (On create, price_type must be defined already.)
       */
      const shippingOptions =
        await fulfillmentModuleService.listShippingOptions(
          {
            id: optionIds,
          },
          { select: ["id", "price_type", "provider_id"] }
        )

      const optionsMap = new Map(
        shippingOptions.map((option) => [option.id, option])
      )

      ;(
        options as FulfillmentWorkflow.UpdateShippingOptionsWorkflowInput[]
      ).forEach((option) => {
        option.price_type =
          option.price_type ?? optionsMap.get(option.id)?.price_type
        option.provider_id =
          option.provider_id ?? optionsMap.get(option.id)?.provider_id
      })
    }

    const flatRatePrices: FulfillmentWorkflow.UpdateShippingOptionPriceRecord[] =
      []
    const calculatedOptions: ValidateShippingOptionPricesStepInput = []

    options.forEach((option) => {
      if (option.price_type === ShippingOptionPriceType.FLAT) {
        flatRatePrices.push(...(option.prices ?? []))
      }
      if (option.price_type === ShippingOptionPriceType.CALCULATED) {
        calculatedOptions.push(option)
      }
    })

    const validation =
      await fulfillmentModuleService.validateShippingOptionsForPriceCalculation(
        calculatedOptions as CreateShippingOptionDTO[]
      )

    if (validation.some((v) => !v)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot calcuate pricing for: [${calculatedOptions
          .filter((o, i) => !validation[i])
          .map((o) => o.name)
          .join(", ")}] shipping option(s).`
      )
    }

    const regionIdSet = new Set<string>()

    flatRatePrices.forEach((price) => {
      if ("region_id" in price && price.region_id) {
        regionIdSet.add(price.region_id)
      }
    })

    if (regionIdSet.size === 0) {
      return new StepResponse(void 0)
    }

    const regionService = container.resolve(Modules.REGION)
    const regionList = await regionService.listRegions({
      id: Array.from(regionIdSet),
    })

    if (regionList.length !== regionIdSet.size) {
      const missingRegions = Array.from(regionIdSet).filter(
        (id) => !regionList.some((region) => region.id === id)
      )
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Cannot create prices for non-existent regions. Region with ids [${missingRegions.join(
          ", "
        )}] were not found.`
      )
    }

    return new StepResponse(void 0)
  }
)
