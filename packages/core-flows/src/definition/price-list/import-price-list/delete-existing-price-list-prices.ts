import { PriceSetMoneyAmountDTO } from "@medusajs/types"
import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { PricingModuleService } from "@medusajs/pricing"

type deletePriceListPricesInput = {
  prep: { priceSetMoneyAmounts: PriceSetMoneyAmountDTO[] }
  input: { priceListId: string }
}

export type preparationStepOutput = {
  priceSetMoneyAmounts: PriceSetMoneyAmountDTO[]
  variantIdToPriceSetIdMap: Record<string, string>
}

export const deletePriceListPrices = createStep(
  "delete-price-list-prices",
  async ({ prep, input }: deletePriceListPricesInput, context) => {
    const pricingModuleService = context.container.resolve(
      ModuleRegistrationName.PRICING
    )

    await pricingModuleService.deleteMoneyAmounts(
      prep.priceSetMoneyAmounts.map((psma) => psma.money_amount?.id || "")
    )

    return new StepResponse({
      priceSetMoneyAmounts: prep.priceSetMoneyAmounts,
      priceListId: input.priceListId,
    })
  },
  async (input, context) => {
    const pricingModuleService: PricingModuleService =
      context.container.resolve(ModuleRegistrationName.PRICING)

    const psmas = await pricingModuleService.addPriceListPrices([
      {
        priceListId: input!.priceListId,
        prices: input!.priceSetMoneyAmounts.map((psma) => {
          return {
            price_set_id: psma.price_set_id!,
            currency_code: psma.money_amount!.currency_code!,
            amount: psma.money_amount!.amount!,
            rules:
              psma.price_rules?.reduce((acc, curr) => {
                acc[curr.rule_type.rule_attribute] = curr.value
                return acc
              }, {}) ?? {},
          }
        }),
      },
    ])
  }
)
