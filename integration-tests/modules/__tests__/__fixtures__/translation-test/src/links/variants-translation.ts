import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/utils"
import Translation from "../modules/translation"

export default defineLink(
  ProductModule.linkable.productVariant.id,
  {
    linkable: Translation.linkable.translation.id,
    deleteCascade: true,
  }
)
