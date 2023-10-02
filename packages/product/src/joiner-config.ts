import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { MapToConfig } from "@medusajs/utils"
import {
  Product,
  ProductCategory,
  ProductCollection,
  ProductOption,
  ProductTag,
  ProductType,
  ProductVariant,
} from "@models"
import ProductImage from "./models/product-image"

export enum LinkableKeys {
  PRODUCT_ID = "product_id", // Main service ID must the first
  PRODUCT_HANDLE = "product_handle",
  VARIANT_ID = "variant_id",
  VARIANT_SKU = "variant_sku",
  PRODUCT_OPTION_ID = "product_option_id",
  PRODUCT_TYPE_ID = "product_type_id",
  PRODUCT_CATEGORY_ID = "product_category_id",
  PRODUCT_COLLECTION_ID = "product_collection_id",
  PRODUCT_TAG_ID = "product_tag_id",
  PRODUCT_IMAGE_ID = "product_image_id",
}

export const entityNameToLinkableKeysMap: MapToConfig = {
  [Product.name]: [
    { mapTo: LinkableKeys.PRODUCT_ID, valueFrom: "id" },
    {
      mapTo: LinkableKeys.PRODUCT_HANDLE,
      valueFrom: "handle",
    },
  ],
  [ProductVariant.name]: [
    { mapTo: LinkableKeys.VARIANT_ID, valueFrom: "id" },
    { mapTo: LinkableKeys.VARIANT_SKU, valueFrom: "sku" },
  ],
  [ProductOption.name]: [
    { mapTo: LinkableKeys.PRODUCT_OPTION_ID, valueFrom: "id" },
  ],
  [ProductType.name]: [
    { mapTo: LinkableKeys.PRODUCT_TYPE_ID, valueFrom: "id" },
  ],
  [ProductCategory.name]: [
    { mapTo: LinkableKeys.PRODUCT_CATEGORY_ID, valueFrom: "id" },
  ],
  [ProductCollection.name]: [
    { mapTo: LinkableKeys.PRODUCT_COLLECTION_ID, valueFrom: "id" },
  ],
  [ProductTag.name]: [{ mapTo: LinkableKeys.PRODUCT_TAG_ID, valueFrom: "id" }],
  [ProductImage.name]: [
    { mapTo: LinkableKeys.PRODUCT_IMAGE_ID, valueFrom: "id" },
  ],
}

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.PRODUCT,
  primaryKeys: ["id", "handle"],
  linkableKeys: Object.values(LinkableKeys),
  alias: [
    {
      name: "product",
    },
    {
      name: "products",
    },
    {
      name: "variant",
      args: {
        methodSuffix: "Variants",
      },
    },
    {
      name: "variants",
      args: {
        methodSuffix: "Variants",
      },
    },
    {
      name: "product_option",
      args: {
        methodSuffix: "Options",
      },
    },
    {
      name: "product_options",
      args: {
        methodSuffix: "Options",
      },
    },
    {
      name: "product_type",
      args: {
        methodSuffix: "Types",
      },
    },
    {
      name: "product_types",
      args: {
        methodSuffix: "Types",
      },
    },
    {
      name: "product_image",
      args: {
        methodSuffix: "Images",
      },
    },
    {
      name: "product_images",
      args: {
        methodSuffix: "Images",
      },
    },
    {
      name: "product_tag",
      args: {
        methodSuffix: "Tags",
      },
    },
    {
      name: "product_tags",
      args: {
        methodSuffix: "Tags",
      },
    },
    {
      name: "product_collection",
      args: {
        methodSuffix: "Collections",
      },
    },
    {
      name: "product_collections",
      args: {
        methodSuffix: "Collections",
      },
    },
    {
      name: "product_category",
      args: {
        methodSuffix: "Categories",
      },
    },
    {
      name: "product_categories",
      args: {
        methodSuffix: "Categories",
      },
    },
  ],
}
