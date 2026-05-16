import { defineLink } from "@medusajs/framework/utils"
import OrganizationModule from "@medusajs/organization"
import ShopModule from "@medusajs/shop"

export default defineLink(
  { linkable: OrganizationModule.linkable.organization },
  { linkable: ShopModule.linkable.shop }
)
