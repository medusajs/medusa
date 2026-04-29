// TODO: Comment temporarely and we will re enable it in the near future #14478
// import { EventOptions } from "@medusajs/types"
import { buildEventNamesFromEntityName } from "../event-bus"
import { Modules } from "../modules-sdk"

const eventBaseNames: [
  "product",
  "productVariant",
  "productOption",
  "productOptionValue",
  "productType",
  "productTag",
  "productCategory",
  "productCollection",
  "productImage"
] = [
  "product",
  "productVariant",
  "productOption",
  "productOptionValue",
  "productType",
  "productTag",
  "productCategory",
  "productCollection",
  "productImage",
]

export const ProductEvents = buildEventNamesFromEntityName(
  eventBaseNames,
  Modules.PRODUCT
)

// TODO: Comment temporarely and we will re enable it in the near future #14478
// declare module "@medusajs/types" {
//   export interface EventBusEventsOptions {
//     // Product events
//     [ProductEvents.PRODUCT_CREATED]?: EventOptions
//     [ProductEvents.PRODUCT_UPDATED]?: EventOptions
//     [ProductEvents.PRODUCT_DELETED]?: EventOptions
//     [ProductEvents.PRODUCT_RESTORED]?: EventOptions
//     [ProductEvents.PRODUCT_ATTACHED]?: EventOptions
//     [ProductEvents.PRODUCT_DETACHED]?: EventOptions

//     // Product Variant events
//     [ProductEvents.PRODUCT_VARIANT_CREATED]?: EventOptions
//     [ProductEvents.PRODUCT_VARIANT_UPDATED]?: EventOptions
//     [ProductEvents.PRODUCT_VARIANT_DELETED]?: EventOptions
//     [ProductEvents.PRODUCT_VARIANT_RESTORED]?: EventOptions
//     [ProductEvents.PRODUCT_VARIANT_ATTACHED]?: EventOptions
//     [ProductEvents.PRODUCT_VARIANT_DETACHED]?: EventOptions

//     // Product Option events
//     [ProductEvents.PRODUCT_OPTION_CREATED]?: EventOptions
//     [ProductEvents.PRODUCT_OPTION_UPDATED]?: EventOptions
//     [ProductEvents.PRODUCT_OPTION_DELETED]?: EventOptions
//     [ProductEvents.PRODUCT_OPTION_RESTORED]?: EventOptions
//     [ProductEvents.PRODUCT_OPTION_ATTACHED]?: EventOptions
//     [ProductEvents.PRODUCT_OPTION_DETACHED]?: EventOptions

//     // Product Option Value events
//     [ProductEvents.PRODUCT_OPTION_VALUE_CREATED]?: EventOptions
//     [ProductEvents.PRODUCT_OPTION_VALUE_UPDATED]?: EventOptions
//     [ProductEvents.PRODUCT_OPTION_VALUE_DELETED]?: EventOptions
//     [ProductEvents.PRODUCT_OPTION_VALUE_RESTORED]?: EventOptions
//     [ProductEvents.PRODUCT_OPTION_VALUE_ATTACHED]?: EventOptions
//     [ProductEvents.PRODUCT_OPTION_VALUE_DETACHED]?: EventOptions

//     // Product Type events
//     [ProductEvents.PRODUCT_TYPE_CREATED]?: EventOptions
//     [ProductEvents.PRODUCT_TYPE_UPDATED]?: EventOptions
//     [ProductEvents.PRODUCT_TYPE_DELETED]?: EventOptions
//     [ProductEvents.PRODUCT_TYPE_RESTORED]?: EventOptions
//     [ProductEvents.PRODUCT_TYPE_ATTACHED]?: EventOptions
//     [ProductEvents.PRODUCT_TYPE_DETACHED]?: EventOptions

//     // Product Tag events
//     [ProductEvents.PRODUCT_TAG_CREATED]?: EventOptions
//     [ProductEvents.PRODUCT_TAG_UPDATED]?: EventOptions
//     [ProductEvents.PRODUCT_TAG_DELETED]?: EventOptions
//     [ProductEvents.PRODUCT_TAG_RESTORED]?: EventOptions
//     [ProductEvents.PRODUCT_TAG_ATTACHED]?: EventOptions
//     [ProductEvents.PRODUCT_TAG_DETACHED]?: EventOptions

//     // Product Category events
//     [ProductEvents.PRODUCT_CATEGORY_CREATED]?: EventOptions
//     [ProductEvents.PRODUCT_CATEGORY_UPDATED]?: EventOptions
//     [ProductEvents.PRODUCT_CATEGORY_DELETED]?: EventOptions
//     [ProductEvents.PRODUCT_CATEGORY_RESTORED]?: EventOptions
//     [ProductEvents.PRODUCT_CATEGORY_ATTACHED]?: EventOptions
//     [ProductEvents.PRODUCT_CATEGORY_DETACHED]?: EventOptions

//     // Product Collection events
//     [ProductEvents.PRODUCT_COLLECTION_CREATED]?: EventOptions
//     [ProductEvents.PRODUCT_COLLECTION_UPDATED]?: EventOptions
//     [ProductEvents.PRODUCT_COLLECTION_DELETED]?: EventOptions
//     [ProductEvents.PRODUCT_COLLECTION_RESTORED]?: EventOptions
//     [ProductEvents.PRODUCT_COLLECTION_ATTACHED]?: EventOptions
//     [ProductEvents.PRODUCT_COLLECTION_DETACHED]?: EventOptions

//     // Product Image events
//     [ProductEvents.PRODUCT_IMAGE_CREATED]?: EventOptions
//     [ProductEvents.PRODUCT_IMAGE_UPDATED]?: EventOptions
//     [ProductEvents.PRODUCT_IMAGE_DELETED]?: EventOptions
//     [ProductEvents.PRODUCT_IMAGE_RESTORED]?: EventOptions
//     [ProductEvents.PRODUCT_IMAGE_ATTACHED]?: EventOptions
//     [ProductEvents.PRODUCT_IMAGE_DETACHED]?: EventOptions
//   }
// }
