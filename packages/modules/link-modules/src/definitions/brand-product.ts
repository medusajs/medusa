import { defineLink } from "@medusajs/framework/utils"
import BrandModule from "@medusajs/brand"
import ProductModule from "@medusajs/medusa/product"

export default defineLink(
  { linkable: BrandModule.linkable.brand },
  { linkable: ProductModule.linkable.product }
)
