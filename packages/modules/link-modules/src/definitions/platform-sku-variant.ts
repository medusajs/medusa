import { defineLink } from "@medusajs/framework/utils"
import PlatformMappingModule from "@medusajs/platform-mapping"
import ProductModule from "@medusajs/medusa/product"

export default defineLink(
  { linkable: PlatformMappingModule.linkable.platformSku },
  { linkable: ProductModule.linkable.variant }
)
