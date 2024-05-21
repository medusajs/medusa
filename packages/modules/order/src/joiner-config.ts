import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig, pluralize } from "@medusajs/utils"
import { LineItem, ReturnReason } from "@models"
import Order from "./models/order"

export const LinkableKeys: Record<string, string> = {
  order_id: Order.name,
  order_item_id: LineItem.name,
  return_reason_id: ReturnReason.name,
  return_reason_value: ReturnReason.name,
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
  serviceName: Modules.ORDER,
  primaryKeys: ["id"],
  linkableKeys: LinkableKeys,
  alias: [
    {
      name: ["order", "orders"],
      args: {
        entity: Order.name,
      },
    },
    {
      name: ["return_reason", "return_reasons"],
      args: {
        entity: ReturnReason.name,
        methodSuffix: pluralize(ReturnReason.name),
      },
    },
  ],
} as ModuleJoinerConfig
