import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/utils"
import CustomRecord from "../modules/custom-record"

export default defineLink(
  ProductModule.linkable.productVariant.id,
  {
    linkable: CustomRecord.linkable.customRecord.id,
    deleteCascade: true,
  }
)
