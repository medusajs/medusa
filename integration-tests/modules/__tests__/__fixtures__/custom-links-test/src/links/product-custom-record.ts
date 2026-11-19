import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import CustomRecord from "../modules/custom-record"

export default defineLink(
  ProductModule.linkable.product.id,
  CustomRecord.linkable.customRecord.id
)
