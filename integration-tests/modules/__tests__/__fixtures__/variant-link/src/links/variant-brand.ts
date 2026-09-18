import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"
import BrandModule from "../../../../../src/modules/brand"

export default defineLink(ProductModule.linkable.productVariant, {
  linkable: BrandModule.linkable.brand,
  deleteCascade: true,
})
