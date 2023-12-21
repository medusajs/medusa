import { FilterablePriceListProps, MedusaContainer } from "@medusajs/types"
import { FindConfig } from "../../../../../types/common"
import { CustomerGroup, MoneyAmount, PriceList } from "../../../../../models"
import { CustomerGroupService } from "../../../../../services"
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
  const remoteQuery = container.resolve("remoteQuery")
  const customerGroupService: CustomerGroupService = container.resolve(
    "customerGroupService"
  )

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

  const priceListCustomerGroups = await customerGroupService.list(
    { id: customerGroupIds },
    {}
  )

  const customerGroupIdCustomerGroupMap = new Map(
    priceListCustomerGroups.map((customerGroup) => [
      customerGroup.id,
      customerGroup,
    ])
  )

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

    const customerGroupPriceListRule = priceListRulesData.find(
      (plr) => plr.rule_type.rule_attribute === "customer_group_id"
    )

    if (
      customerGroupPriceListRule &&
      customerGroupPriceListRule?.price_list_rule_values
    ) {
      priceList.customer_groups =
        customerGroupPriceListRule?.price_list_rule_values
          .map((customerGroupRule) =>
            customerGroupIdCustomerGroupMap.get(customerGroupRule.value)
          )
          .filter(
            (
              customerGroup: CustomerGroup | undefined
            ): customerGroup is CustomerGroup => !!customerGroup
          )
    } else {
      priceList.customer_groups = []
    }
  }

  return [priceLists, count]
}
