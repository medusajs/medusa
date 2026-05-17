import { defineLink } from "@medusajs/framework/utils"
import StoreInventoryModule from "@medusajs/store-inventory"
import MaterialModule from "@medusajs/material"

export default defineLink(
  { linkable: StoreInventoryModule.linkable.storeInventory },
  { linkable: MaterialModule.linkable.basicMaterial }
)
