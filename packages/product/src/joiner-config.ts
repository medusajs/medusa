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
import moduleSchema from "./schema"

export const LinkableKeys = {
  product_id: Product.name,
  product_handle: Product.name,
  variant_id: ProductVariant.name,
  variant_sku: ProductVariant.name,
  product_option_id: ProductOption.name,
  product_type_id: ProductType.name,
  product_category_id: ProductCategory.name,
  product_collection_id: ProductCollection.name,
  product_tag_id: ProductTag.name,
  product_image_id: ProductImage.name,
}

export const entityNameToLinkableKeysMap: MapToConfig = {
  [Product.name]: [
    { mapTo: LinkableKeys.product_id, valueFrom: "id" },
    {
      mapTo: LinkableKeys.product_handle,
      valueFrom: "handle",
    },
  ],
  [ProductVariant.name]: [
    { mapTo: LinkableKeys.variant_id, valueFrom: "id" },
    { mapTo: LinkableKeys.variant_sku, valueFrom: "sku" },
  ],
  [ProductOption.name]: [
    { mapTo: LinkableKeys.product_option_id, valueFrom: "id" },
  ],
  [ProductType.name]: [
    { mapTo: LinkableKeys.product_type_id, valueFrom: "id" },
  ],
  [ProductCategory.name]: [
    { mapTo: LinkableKeys.product_category_id, valueFrom: "id" },
  ],
  [ProductCollection.name]: [
    { mapTo: LinkableKeys.product_collection_id, valueFrom: "id" },
  ],
  [ProductTag.name]: [{ mapTo: LinkableKeys.product_tag_id, valueFrom: "id" }],
  [ProductImage.name]: [
    { mapTo: LinkableKeys.product_image_id, valueFrom: "id" },
  ],
}

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.PRODUCT,
  primaryKeys: ["id", "handle"],
  linkableKeys: Object.values(LinkableKeys),
  schema: moduleSchema,
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
