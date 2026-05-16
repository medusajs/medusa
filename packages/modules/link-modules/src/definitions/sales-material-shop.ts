import { defineLink } from "@medusajs/framework/utils"
import MaterialModule from "@medusajs/material"
import ShopModule from "@medusajs/shop"

export default defineLink(
  { linkable: MaterialModule.linkable.salesMaterial },
  { linkable: ShopModule.linkable.shop }
)
