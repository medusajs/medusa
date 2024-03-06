import { LinkModuleUtils, ModuleRegistrationName } from "@medusajs/modules-sdk"
import { MedusaContainer, PriceListDTO } from "@medusajs/types"
import { remoteQueryObjectFromString } from "@medusajs/utils"

enum RuleAttributes {
  CUSTOMER_GROUP_ID = "customer_group_id",
  REGION_ID = "region_id",
}

export async function listPriceLists({
  container,
  fields,
  variables,
}: {
  container: MedusaContainer
  fields: string[]
  variables: Record<string, any>
}): Promise<[PriceListDTO[], number]> {
  const remoteQuery = container.resolve(LinkModuleUtils.REMOTE_QUERY)
  const customerModule = container.resolve(ModuleRegistrationName.CUSTOMER)
  const queryObject = remoteQueryObjectFromString({
    entryPoint: "price_list",
    fields,
    variables,
  })

  const {
    rows: priceLists,
    metadata: { count },
  } = await remoteQuery(queryObject)

  if (!count) {
    return [[], 0]
  }

  const customerGroupIds: string[] = priceLists
    .map((priceList) => priceList.price_list_rules)
    .flat(1)
    .filter(
      (rule) =>
        rule.rule_type?.rule_attribute === RuleAttributes.CUSTOMER_GROUP_ID
    )
    .map((rule) => rule.price_list_rule_values.map((plrv) => plrv.value))
    .flat(1)

  const customerGroups = await customerModule.listCustomerGroups(
    { id: customerGroupIds },
    {}
  )

  const customerGroupIdMap = new Map(customerGroups.map((cg) => [cg.id, cg]))

  for (const priceList of priceLists) {
    const priceSetMoneyAmounts = priceList.price_set_money_amounts || []
    const priceListRulesData = priceList.price_list_rules || []
    delete priceList.price_set_money_amounts
    delete priceList.price_list_rules

    priceList.prices = priceSetMoneyAmounts.map((priceSetMoneyAmount) => {
      const productVariant = priceSetMoneyAmount.price_set.variant_link.variant
      const rules = priceSetMoneyAmount.price_rules.reduce((acc, curr) => {
        acc[curr.rule_type.rule_attribute] = curr.value
        return acc
      }, {})

      return {
        ...priceSetMoneyAmount.money_amount,
        price_list_id: priceList.id,
        variant_id: productVariant?.id ?? null,
        variant: productVariant ?? null,
        region_id: rules["region_id"] ?? null,
        rules,
      }
    })

    priceList.name = priceList.title
    delete priceList.title

    const customerGroupPriceListRule = priceListRulesData.find(
      (plr) => plr.rule_type.rule_attribute === RuleAttributes.CUSTOMER_GROUP_ID
    )

    priceList.customer_groups =
      customerGroupPriceListRule?.price_list_rule_values
        .map((cgr) => customerGroupIdMap.get(cgr.value))
        .filter(Boolean) || []
  }

  return [priceLists, count]
}
