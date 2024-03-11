import {
  MedusaContainer,
  PriceListRuleDTO,
  PriceSetMoneyAmountDTO,
  ProductVariantDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { AdminPriceListRemoteQueryDTO } from "../types"

export async function listPriceLists({
  container,
  remoteQueryFields,
  apiFields,
  variables,
}: {
  container: MedusaContainer
  remoteQueryFields: string[]
  apiFields: string[]
  variables: Record<string, any>
}): Promise<[AdminPriceListRemoteQueryDTO[], number]> {
  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "price_list",
    fields: remoteQueryFields,
    variables,
  })

  const { rows: priceLists, metadata } = await remoteQuery(queryObject)
  console.log("priceLists -- ", priceLists)
  if (!metadata.count) {
    return [[], 0]
  }

  for (const priceList of priceLists) {
    priceList.rules = buildPriceListRules(priceList.price_list_rules || [])
    priceList.prices = buildPriceSetPrices(
      priceList.price_set_money_amounts || []
    )
  }

  const sanitizedPriceLists: AdminPriceListRemoteQueryDTO[] = priceLists.map(
    (priceList) => cleanResponseData(priceList, apiFields)
  )

  return [sanitizedPriceLists, metadata.count]
}

function buildPriceListRules(
  priceListRules: PriceListRuleDTO[]
): Record<string, string[]> {
  return priceListRules.reduce((acc, curr) => {
    const ruleAttribute = curr.rule_type.rule_attribute
    const ruleValues = curr.price_list_rule_values || []

    if (ruleAttribute) {
      acc[ruleAttribute] = ruleValues.map((ruleValue) => ruleValue.value)
    }

    return acc
  }, {})
}

function buildPriceSetPrices(
  priceSetMoneyAmounts: (PriceSetMoneyAmountDTO & {
    price_set: PriceSetMoneyAmountDTO["price_set"] & {
      variant?: ProductVariantDTO
    }
  })[]
): Record<string, any>[] {
  return priceSetMoneyAmounts.map((priceSetMoneyAmount) => {
    const productVariant = priceSetMoneyAmount.price_set?.variant
    const rules = priceSetMoneyAmount.price_rules?.reduce((acc, curr) => {
      if (curr.rule_type.rule_attribute) {
        acc[curr.rule_type.rule_attribute] = curr.value
      }

      return acc
    }, {})

    return {
      ...priceSetMoneyAmount.money_amount,
      variant_id: productVariant?.id ?? null,
      rules,
    }
  })
}
