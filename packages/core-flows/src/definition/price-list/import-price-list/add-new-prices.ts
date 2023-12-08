import { createStep } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { PriceListPriceDTO } from "@medusajs/types"
import { workflowInput } from "./workflow"
import { preparationStepOutput } from "./delete-existing-price-list-prices"

type createPriceListPricesInput = {
  input: workflowInput
  prep: preparationStepOutput
}
export const createPriceListPrices = createStep(
  "create-price-list-prices",
  async (data: createPriceListPricesInput, context) => {
    const { input, prep } = data

    const pricingModuleService = context.container.resolve(
      ModuleRegistrationName.PRICING
    )

    const priceInput = {
      priceListId: input.priceListId,
      prices: input.operations
        .map((op) =>
          (
            op.prices as {
              region_id?: string
              currency_code?: string
              variant_id: string
              amount: number
              min_quantity?: number
              max_quantity?: number
            }[]
          ).map((p) => {
            const rules: Record<string, string> = {}
            if (p.region_id) {
              rules.region_id = p.region_id
            }
            return {
              ...p,
              rules,
              price_set_id:
                prep.variantIdToPriceSetIdMap[op.variant_id as string],
            } as PriceListPriceDTO
          })
        )
        .flat(),
    }

    await pricingModuleService.addPriceListPrices([priceInput])
  }
)
