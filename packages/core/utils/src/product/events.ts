import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: [
  "product",
  "productVariant",
  "productOption",
  "productType",
  "productTag"
] = ["product", "productVariant", "productOption", "productType", "productTag"]

export const ProductEvents = buildEventNamesFromEntityName(
  eventBaseNames,
  Modules.PRODUCT
)
