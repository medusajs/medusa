import { Modules } from "@medusajs/modules-sdk"
import { JoinerServiceConfig } from "@medusajs/types"
import { Product, ProductOption, ProductVariant } from "@models"

export const EntityNameToLinkableKeysMap = new Map([
  [Product.name, "product_id"],
  [ProductVariant.name, "variant_id"],
  [ProductOption.name, "product_option_id"],
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
        methodSuffix: "Variant",
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
        methodSuffix: "Option",
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
        methodSuffix: "Type",
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
        methodSuffix: "Image",
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
        methodSuffix: "Tag",
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
        methodSuffix: "Collection",
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
        methodSuffix: "Category",
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
