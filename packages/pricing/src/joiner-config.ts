import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import {
  Currency,
  MoneyAmount,
  PriceList,
  PriceSet,
  PriceSetMoneyAmount,
} from "@models"

export const LinkableKeys = {
  money_amount_id: MoneyAmount.name,
  currency_code: Currency.name,
  price_set_id: PriceSet.name,
  price_list_id: PriceList.name,
  price_set_money_amount_id: PriceSetMoneyAmount.name,
}
const entityLinkableKeysMap: MapToConfig = {}
Object.entries(LinkableKeys).forEach(([key, value]) => {
  entityLinkableKeysMap[value] ??= []
  entityLinkableKeysMap[value].push({
    mapTo: key,
    valueFrom: key.split("_").pop()!,
  })
})

export const entityNameToLinkableKeysMap: MapToConfig = entityLinkableKeysMap

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.PRICING,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: "price_set",
    },
    {
      name: "price_sets",
    },
    {
      name: "money_amount",
      args: {
        methodSuffix: "MoneyAmounts",
      },
    },
    {
      name: "money_amounts",
      args: {
        methodSuffix: "MoneyAmounts",
      },
    },
    {
      name: "currency",
      args: {
        methodSuffix: "Currencies",
      },
    },
    {
      name: "currencies",
      args: {
        methodSuffix: "Currencies",
      },
    },
    {
      name: "price_list",
      args: {
        methodSuffix: "PriceLists",
      },
    },
    {
      name: "price_lists",
      args: {
        methodSuffix: "PriceLists",
      },
    },
  ],
}
