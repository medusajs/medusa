import {
  MedusaContainer,
  PriceListRuleDTO,
  PriceSetMoneyAmountDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { cleanResponseData } from "../../../../utils/clean-response-data"
import { adminPriceListRemoteQueryFields } from "../query-config"
import { AdminPriceListEndpointDTO } from "../types"

export async function listPriceLists({
  container,
  fields,
  variables,
}: {
  container: MedusaContainer
  fields: string[]
  variables: Record<string, any>
}): Promise<[AdminPriceListEndpointDTO[], number]> {
  const remoteQuery = container.resolve(ContainerRegistrationKeys.REMOTE_QUERY)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "price_list",
    fields: adminPriceListRemoteQueryFields,
    variables,
  })

  const { rows: priceLists, metadata } = await remoteQuery(queryObject)

  if (!metadata.count) {
    return [[], 0]
  }

  for (const priceList of priceLists) {
    priceList.rules = buildPriceListRules(
      priceList.price_set_money_amounts || []
    )
    priceList.prices = buildPriceSetPrices(priceList.price_list_rules || [])
  }

  const sanitizedPriceLists: AdminPriceListEndpointDTO[] = priceLists.map(
    (priceList) => cleanResponseData(priceList, fields)
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
  priceSetMoneyAmounts: PriceSetMoneyAmountDTO[]
): Record<string, any>[] {
  return priceSetMoneyAmounts.map((priceSetMoneyAmount) => {
    const productVariant = (priceSetMoneyAmount.price_set as any).variant
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
