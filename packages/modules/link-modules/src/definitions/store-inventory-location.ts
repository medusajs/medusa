import { defineLink } from "@medusajs/framework/utils"
import StoreInventoryModule from "@medusajs/store-inventory"
import StockLocationModule from "@medusajs/medusa/stock-location"

export default defineLink(
  { linkable: StoreInventoryModule.linkable.storeInventory },
  { linkable: StockLocationModule.linkable.stockLocation }
)
