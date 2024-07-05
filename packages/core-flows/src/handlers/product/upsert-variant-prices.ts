import { BigNumberInput, PricingTypes } from "@medusajs/types"
import { MedusaV2Flag } from "@medusajs/utils"
import { WorkflowArguments } from "@medusajs/workflows-sdk"

type VariantPrice = {
  id?: string
  region_id?: string
  currency_code: string
  amount: BigNumberInput
  min_quantity?: BigNumberInput
  max_quantity?: BigNumberInput
  rules: Record<string, string>
}

type RegionDTO = {
  id: string
  currency_code: string
}

type HandlerInput = {
  variantPricesMap: Map<string, VariantPrice[]>
}

export async function upsertVariantPrices({
  container,
  data,
}: WorkflowArguments<HandlerInput>) {
  const { variantPricesMap } = data
  const featureFlagRouter = container.resolve("featureFlagRouter")

  if (!featureFlagRouter.isFeatureEnabled(MedusaV2Flag.key)) {
    return {
      createdLinks: [],
      originalMoneyAmounts: [],
      createdPriceSets: [],
    }
  }

  const pricingModuleService = container.resolve("pricingModuleService")
  const regionService = container.resolve("regionService")
  const remoteLink = container.resolve("remoteLink")
  const remoteQuery = container.resolve("remoteQuery")

  const variables = {
    variant_id: [...variantPricesMap.keys()],
  }

  const query = {
    product_variant_price_set: {
      __args: variables,
      fields: ["variant_id", "price_set_id"],
    },
  }

  const variantPriceSets = await remoteQuery(query)

  const variantIdToPriceSetIdMap: Map<string, string> = new Map(
    variantPriceSets.map((variantPriceSet) => [
      variantPriceSet.variant_id,
      variantPriceSet.price_set_id,
    ])
  )

  const moneyAmountsToUpdate: PricingTypes.UpdateMoneyAmountDTO[] = []
  const createdPriceSets: PricingTypes.PriceSetDTO[] = []
  const ruleSetPricesToAdd: PricingTypes.CreatePricesDTO[] = []
  const linksToCreate: any[] = []

  for (const [variantId, prices = []] of variantPricesMap) {
    const priceSetToCreate: PricingTypes.CreatePriceSetDTO = {
      rules: [{ rule_attribute: "region_id" }],
      prices: [],
    }
    const regionIds = prices.map((price) => price.region_id)
    const regions = await regionService.list({ id: regionIds })
    const regionsMap: Map<string, RegionDTO> = new Map(
      regions.map((region: RegionDTO) => [region.id, region])
    )

    for (const price of prices) {
      const region = price.region_id && regionsMap.get(price.region_id)
      let region_currency_code: string | undefined
      let region_rules: Record<string, string> | undefined

      if (region) {
        region_currency_code = region.currency_code
        region_rules = {
          region_id: region.id,
        }
      }

      if (price.id) {
        const priceToUpdate = {
          id: price.id,
          min_quantity: price.min_quantity,
          max_quantity: price.max_quantity,
          amount: price.amount,
          currency_code: (
            region_currency_code ?? price.currency_code
          ).toLowerCase(),
        }

        moneyAmountsToUpdate.push(priceToUpdate)
      } else {
        const variantPrice: PricingTypes.CreatePricesDTO = {
          min_quantity: price.min_quantity,
          max_quantity: price.max_quantity,
          amount: price.amount,
          currency_code: (
            region_currency_code ?? price.currency_code
          ).toLowerCase(),
          rules: region_rules ?? {},
        }

        delete price.region_id

        if (variantIdToPriceSetIdMap.get(variantId)) {
          ruleSetPricesToAdd.push(variantPrice)
        } else {
          priceSetToCreate.prices?.push(variantPrice)
        }
      }
    }

    let priceSetId = variantIdToPriceSetIdMap.get(variantId)

    if (priceSetId) {
      await pricingModuleService.addPrices({
        priceSetId,
        prices: ruleSetPricesToAdd,
      })
    } else {
      const createdPriceSet = await pricingModuleService.create(
        priceSetToCreate
      )
      priceSetId = createdPriceSet?.id

      createdPriceSets.push(createdPriceSet)

      linksToCreate.push({
        productService: {
          variant_id: variantId,
        },
        pricingService: {
          price_set_id: priceSetId,
        },
      })
    }
  }

  const createdLinks = await remoteLink.create(linksToCreate)

  let originalMoneyAmounts = await pricingModuleService.listMoneyAmounts(
    {
      id: moneyAmountsToUpdate.map((matu) => matu.id),
    },
    {
      select: ["id", "currency_code", "amount", "min_quantity", "max_quantity"],
      take: null,
    }
  )

  if (moneyAmountsToUpdate.length) {
    await pricingModuleService.updateMoneyAmounts(moneyAmountsToUpdate)
  }

  return {
    createdLinks,
    originalMoneyAmounts,
    createdPriceSets,
  }
}

upsertVariantPrices.aliases = {
  productVariantsPrices: "productVariantsPrices",
}
