import ProductModule from "@zjedene-medusa/medusa/product"
import { defineLink } from "@zjedene-medusa/utils"
import Translation from "../modules/translation"

export default defineLink(
  ProductModule.linkable.productVariant.id,
  Translation.linkable.translation.id
)
