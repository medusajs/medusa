import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.PRODUCT,
  primaryKeys: ["id", "handle"],
  linkableKeys: [
    "product_id",
    "variant_id",
    "product_handle",
    "product_type_id",
    "product_collection_id",
    "product_category_id",
    "product_tag_id",
    "product_option_id",
    "product_image_id",
  ],
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
