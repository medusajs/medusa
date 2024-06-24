import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
  Modules,
} from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.INVENTORY, {
  alias: [
    {
      name: ["inventory_items", "inventory_item", "inventory"],
      args: {
        entity: "InventoryItem",
        methodSuffix: "InventoryItems",
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
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
