import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: [
  "product",
  "productVariant",
  "productOption",
  "productType",
  "productTag",
  "productCategory"
] = [
  "product",
  "productVariant",
  "productOption",
  "productType",
  "productTag",
  "productCategory",
]

export const ProductEvents = buildEventNamesFromEntityName(
  eventBaseNames,
  Modules.PRODUCT
)
