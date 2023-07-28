import { Modules } from "@medusajs/modules-sdk"
import { composeLinkName } from "./utils"

export const LINKS = {
  ProductVariantInventoryItem: composeLinkName(
    Modules.PRODUCT,
    "variant_id",
    Modules.INVENTORY,
    "inventory_item_id"
  ),

  InventoryLevelStockLocation: composeLinkName(
    Modules.INVENTORY,
    "location_id",
    Modules.STOCK_LOCATION,
    "stock_location_id"
  ),
}
