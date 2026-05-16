import { defineLink } from "@medusajs/framework/utils"
import PlatformMappingModule from "@medusajs/platform-mapping"
import ShopModule from "@medusajs/shop"

export default defineLink(
  { linkable: PlatformMappingModule.linkable.platformSku },
  { linkable: ShopModule.linkable.shop }
)
