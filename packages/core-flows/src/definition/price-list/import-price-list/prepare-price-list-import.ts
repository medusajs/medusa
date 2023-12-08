import { createStep, StepResponse } from "@medusajs/workflows-sdk"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { workflowInput } from "./workflow"
import { PriceSetMoneyAmountDTO } from "@medusajs/types"

export const prepareImportPriceListPrices = createStep(
  "prepare-import-price-list-prices",
  async (data: workflowInput, context) => {
    const { operations, priceListId } = data
    const pricingModuleService = context.container.resolve(
      ModuleRegistrationName.PRICING
    )
    const remoteQuery = context.container.resolve(
      ContainerRegistrationKeys.REMOTE_QUERY
    )

    const priceSetMoneyAmounts: PriceSetMoneyAmountDTO[] =
      await pricingModuleService.listPriceSetMoneyAmounts(
        {
          price_list_id: [priceListId],
        },
        {
          take: null,
          relations: ["money_amount", "price_rules", "price_rules.rule_type"],
        }
      )

    const variables = {
      variant_id: operations.map((op) => op.variant_id),
      take: null,
    }

    const query = {
      product_variant_price_set: {
        __args: variables,
        fields: ["variant_id", "price_set_id"],
      },
    }

    const variantPriceSets = await remoteQuery(query)

    const variantIdToPriceSetIdMap: Record<string, string> =
      variantPriceSets.reduce((acc, variantPriceSet) => {
        acc[variantPriceSet.variant_id] = variantPriceSet.price_set_id
        return acc
      }, {})

    return new StepResponse({
      priceSetMoneyAmounts,
      variantIdToPriceSetIdMap,
    })
  }
)
