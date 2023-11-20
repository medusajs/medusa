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

    const priceListPrices: MoneyAmount[] = []

    for (const priceSetMoneyAmount of priceSetMoneyAmounts) {
      const productVariant = priceSetMoneyAmount.price_set.variant_link.variant

      const price = {
        ...(priceSetMoneyAmount.money_amount as MoneyAmount),
        price_list_id: priceList.id,
      }

      price.variant_id = productVariant?.id ?? null
      price.variant = productVariant ?? null
      price.region_id = null

      priceListPrices.push(price as MoneyAmount)
    }

    priceList.prices = priceListPrices
    priceList.name = priceList.title
    delete priceList.title

    priceList.customer_groups = []

    const customerGroupPriceListRule = priceListRulesData.find(
      (plr) => plr.rule_type.rule_attribute === "customer_group_id"
    )

    if (customerGroupPriceListRule) {
      const customerGroupIds: string[] =
        customerGroupPriceListRule?.price_list_rule_values?.map(
          (plrv) => plrv.value
        ) || []

      priceList.customer_groups = customerGroupIds
        .map((customerGroupId: string) =>
          customerGroupIdCustomerGroupMap.get(customerGroupId)
        )
        .filter(
          (
            customerGroup: CustomerGroup | undefined
          ): customerGroup is CustomerGroup => !!customerGroup
        )
    }
  }

  return [priceLists, count]
}
