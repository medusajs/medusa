import { Modules } from "@medusajs/modules-sdk"
import { JoinerServiceConfig } from "@medusajs/types"
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
import { RemapKeyAndPickMap } from "@medusajs/utils"

export enum LinkableKeys {
  PRODUCT_ID = "product_id",
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

export const EntityNameToLinkableKeysReMapperMap: RemapKeyAndPickMap = new Map([
  [
    Product.name,
    [
      { newKey: LinkableKeys.PRODUCT_ID, getter: (object) => object.id },
      {
        newKey: LinkableKeys.PRODUCT_HANDLE,
        getter: (object) => object.handle,
      },
    ],
  ],
  [
    ProductVariant.name,
    [
      { newKey: LinkableKeys.VARIANT_ID, getter: (object) => object.id },
      { newKey: LinkableKeys.VARIANT_SKU, getter: (object) => object.sku },
    ],
  ],
  [
    ProductOption.name,
    [{ newKey: LinkableKeys.PRODUCT_OPTION_ID, getter: (object) => object.id }],
  ],
  [
    ProductType.name,
    [{ newKey: LinkableKeys.PRODUCT_TYPE_ID, getter: (object) => object.id }],
  ],
  [
    ProductCategory.name,
    [
      {
        newKey: LinkableKeys.PRODUCT_CATEGORY_ID,
        getter: (object) => object.id,
      },
    ],
  ],
  [
    ProductCollection.name,
    [
      {
        newKey: LinkableKeys.PRODUCT_COLLECTION_ID,
        getter: (object) => object.id,
      },
    ],
  ],
  [
    ProductTag.name,
    [{ newKey: LinkableKeys.PRODUCT_TAG_ID, getter: (object) => object.id }],
  ],
  [
    ProductImage.name,
    [{ newKey: LinkableKeys.PRODUCT_IMAGE_ID, getter: (object) => object.id }],
  ],
])

export const joinerConfig: JoinerServiceConfig = {
  serviceName: Modules.PRODUCT,
  primaryKeys: ["id", "handle"],
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
