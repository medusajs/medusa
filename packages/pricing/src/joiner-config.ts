import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import { PriceList, PriceSet, PriceSetMoneyAmount } from "@models"
import schema from "./schema"

export const LinkableKeys = {
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
  schema,
  alias: [
    {
      name: ["price_set", "price_sets"],
      args: {
        entity: "PriceSet",
      },
    },
    {
      name: ["price_list", "price_lists"],
      args: {
        methodSuffix: "PriceLists",
      },
    },
  ],
}
