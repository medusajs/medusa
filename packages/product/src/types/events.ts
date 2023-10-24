import { CommonEvents } from "@medusajs/utils"

export enum ProductCollectionEvents {
  COLLECTION_UPDATED = "product-collection." + CommonEvents.UPDATED,
  COLLECTION_CREATED = "product-collection." + CommonEvents.CREATED,
  COLLECTION_DELETED = "product-collection." + CommonEvents.DELETED,
}

export enum ProductCategoryEvents {
  CATEGORY_UPDATED = "product-category." + CommonEvents.UPDATED,
  CATEGORY_CREATED = "product-category." + CommonEvents.CREATED,
  CATEGORY_DELETED = "product-category." + CommonEvents.DELETED,
}

export enum ProductOptionEvents {
  PRODUCT_OPTION_UPDATED = "product-option." + CommonEvents.UPDATED,
  PRODUCT_OPTION_CREATED = "product-option." + CommonEvents.CREATED,
  PRODUCT_OPTION_DELETED = "product-option." + CommonEvents.DELETED,
}

export enum ProductTagEvents {
  PRODUCT_TAG_UPDATED = "product-tag." + CommonEvents.UPDATED,
  PRODUCT_TAG_CREATED = "product-tag." + CommonEvents.CREATED,
  PRODUCT_TAG_DELETED = "product-tag." + CommonEvents.DELETED,
}

export enum ProductTypeEvents {
  PRODUCT_TYPE_UPDATED = "product-type." + CommonEvents.UPDATED,
  PRODUCT_TYPE_CREATED = "product-type." + CommonEvents.CREATED,
  PRODUCT_TYPE_DELETED = "product-type." + CommonEvents.DELETED,
}

export enum ProductImageEvents {
  PRODUCT_IMAGE_UPDATED = "product-image." + CommonEvents.UPDATED,
  PRODUCT_IMAGE_CREATED = "product-image." + CommonEvents.CREATED,
  PRODUCT_IMAGE_DELETED = "product-image." + CommonEvents.DELETED,
}

export enum ProductEvents {
  PRODUCT_UPDATED = "product." + CommonEvents.UPDATED,
  PRODUCT_CREATED = "product." + CommonEvents.CREATED,
  PRODUCT_DELETED = "product." + CommonEvents.DELETED,
}

export enum ProductVariantEvents {
  PRODUCT_VARIANT_UPDATED = "product-variant." + CommonEvents.UPDATED,
  PRODUCT_VARIANT_CREATED = "product-variant." + CommonEvents.CREATED,
  PRODUCT_VARIANT_DELETED = "product-variant." + CommonEvents.DELETED,
}
