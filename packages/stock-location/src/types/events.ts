import { CommonEvents } from "@medusajs/utils"

export enum StockLocationEvents {
  CREATED = "stock-location." + CommonEvents.CREATED,
  UPDATED = "stock-location." + CommonEvents.UPDATED,
  DELETED = "stock-location." + CommonEvents.DELETED,
}
