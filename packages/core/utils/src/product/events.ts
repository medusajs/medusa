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

export const ProductCategoryWorkflowEvents = {
  CREATED: "product-category.created",
  UPDATED: "product-category.updated",
  DELETED: "product-category.deleted",
}

export const ProductCollectionWorkflowEvents = {
  CREATED: "product-collection.created",
  UPDATED: "product-collection.updated",
  DELETED: "product-collection.deleted",
}

export const ProductVariantWorkflowEvents = {
  UPDATED: "product-variant.updated",
  CREATED: "product-variant.created",
  DELETED: "product-variant.deleted",
}

export const ProductWorkflowEvents = {
  UPDATED: "product.updated",
  CREATED: "product.created",
  DELETED: "product.deleted",
}
