import { LinkModuleUtils, ModuleRegistrationName } from "@medusajs/modules-sdk"
import { FilterablePriceListProps, MedusaContainer } from "@medusajs/types"
import { CustomerGroup, MoneyAmount, PriceList } from "../../../../../models"
import { FindConfig } from "../../../../../types/common"
import { defaultAdminPriceListRemoteQueryObject } from "../index"

export async function listAndCountPriceListPricingModule({
  filters,
  listConfig = { skip: 0 },
  container,
}: {
  container: MedusaContainer
  filters?: FilterablePriceListProps
  listConfig?: FindConfig<PriceList>
}): Promise<[PriceList[], number]> {
  const remoteQuery = container.resolve(LinkModuleUtils.REMOTE_QUERY)
  const customerModule = container.resolve(ModuleRegistrationName.CUSTOMER)

  const query = {
    price_list: {
      __args: { filters, ...listConfig },
      ...defaultAdminPriceListRemoteQueryObject,
    },
  }

  const {
    rows: priceLists,
    metadata: { count },
  } = await remoteQuery(query)

  if (!count) {
    return [[], 0]
  }

  const customerGroupIds: string[] = priceLists
    .map((priceList) =>
      priceList.price_list_rules
        .filter((rule) => rule.rule_type.rule_attribute === "customer_group_id")
        .map((rule) =>
          rule.price_list_rule_values.map((rule_value) => rule_value.value)
        )
    )
    .flat(2)

  const customerGroups = await customerModule.list({ id: customerGroupIds }, {})
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
        ...(priceSetMoneyAmount.money_amount as MoneyAmount),
        price_list_id: priceList.id,
        variant_id: productVariant?.id ?? null,
        variant: productVariant ?? null,
        region_id: rules["region_id"] ?? null,
        rules,
      }
    })

    priceList.name = priceList.title
    delete priceList.title

    const customerGroupRule = priceListRulesData.find(
      (plr) => plr.rule_type.rule_attribute === "customer_group_id"
    )

    priceList.customer_groups =
      customerGroupRule?.price_list_rule_values
        .map((cgr) => customerGroupIdMap.get(cgr.value))
        .filter((cg): cg is CustomerGroup => !!cg) || []
  }

  return [priceLists, count]
}
