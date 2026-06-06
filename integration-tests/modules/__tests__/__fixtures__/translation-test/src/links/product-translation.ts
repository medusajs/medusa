import { defineLink } from "@zjedene-medusa/framework/utils"
import ProductModule from "@zjedene-medusa/medusa/product"
import Translation from "../modules/translation"

export default defineLink(
  ProductModule.linkable.product.id,
  Translation.linkable.translation.id
)
