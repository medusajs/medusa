import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: ["inventoryItem", "reservationItem", "inventoryLevel"] = [
  "inventoryItem",
  "reservationItem",
  "inventoryLevel",
]

export const InventoryEvents = buildEventNamesFromEntityName(
  eventBaseNames,
  Modules.INVENTORY
)
