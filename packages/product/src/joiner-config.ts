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

export const EntityNameToLinkableKeysMap: RemapKeyAndPickMap = new Map([
  [
    Product.name,
    [
      { newKey: "product_id", getter: (object) => object.id },
      { newKey: "product_handle", getter: (object) => object.handle },
    ],
  ],
  [
    ProductVariant.name,
    [
      { newKey: "variant_id", getter: (object) => object.id },
      { newKey: "variant_sku", getter: (object) => object.sku },
    ],
  ],
  [
    ProductOption.name,
    [{ newKey: "product_option_id", getter: (object) => object.id }],
  ],
  [
    ProductType.name,
    [{ newKey: "product_type_id", getter: (object) => object.id }],
  ],
  [
    ProductCategory.name,
    [{ newKey: "product_category_id", getter: (object) => object.id }],
  ],
  [
    ProductCollection.name,
    [{ newKey: "product_collection_id", getter: (object) => object.id }],
  ],
  [
    ProductTag.name,
    [{ newKey: "product_tag_id", getter: (object) => object.id }],
  ],
  [
    ProductImage.name,
    [{ newKey: "product_image_id", getter: (object) => object.id }],
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
