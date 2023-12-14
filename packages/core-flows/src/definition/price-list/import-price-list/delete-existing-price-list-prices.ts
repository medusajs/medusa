import { IPricingModuleService, PriceSetMoneyAmountDTO } from "@medusajs/types"
import { StepResponse, createStep } from "@medusajs/workflows-sdk"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { PricingModuleService } from "@medusajs/pricing"

type deletePriceListPricesInput = {
  priceSetMoneyAmounts: PriceSetMoneyAmountDTO[]
}

export type preparationStepOutput = {
  priceSetMoneyAmounts: PriceSetMoneyAmountDTO[]
  variantIdToPriceSetIdMap: Record<string, string>
}

export const deletePriceListPrices = createStep(
  "delete-price-list-prices",
  async (input: deletePriceListPricesInput, context) => {
    const pricingModuleService: IPricingModuleService =
      context.container.resolve(ModuleRegistrationName.PRICING)

    const moneyAmountIds = input.priceSetMoneyAmounts
      .map((psma) => psma.money_amount?.id || null)
      .filter((id): id is string => id !== null)

    await pricingModuleService.softDeleteMoneyAmounts(moneyAmountIds)

    return new StepResponse({
      moneyAmountIds,
    })
  },
  async (input, context) => {
    const pricingModuleService: PricingModuleService =
      context.container.resolve(ModuleRegistrationName.PRICING)

    await pricingModuleService.restoreDeletedMoneyAmounts(input!.moneyAmountIds)
  }
)
