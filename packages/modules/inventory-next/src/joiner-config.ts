import { InventoryItem, InventoryLevel, ReservationItem } from "./models"

import { MapToConfig } from "@medusajs/utils"
import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"
import moduleSchema from "./schema"

export const LinkableKeys = {
  inventory_item_id: InventoryItem.name,
  inventory_level_id: InventoryLevel.name,
  reservation_item_id: ReservationItem.name,
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
  serviceName: Modules.INVENTORY,
  primaryKeys: ["id"],
  linkableKeys: {
    inventory_item_id: InventoryItem.name,
    inventory_level_id: InventoryLevel.name,
    reservation_item_id: ReservationItem.name,
  },
  schema: moduleSchema,
  alias: [
    {
      name: ["inventory_items", "inventory_item", "inventory"],
      args: {
        entity: "InventoryItem",
      },
    },
    {
      name: ["inventory_level", "inventory_levels"],
      args: {
        entity: "InventoryLevel",
        methodSuffix: "InventoryLevels",
      },
    },
    {
      name: [
        "reservation",
        "reservations",
        "reservation_item",
        "reservation_items",
      ],
      args: {
        entity: "ReservationItem",
        methodSuffix: "ReservationItems",
      },
    },
  ],
}
