import { defineJoinerConfig, Modules } from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.PRODUCT, {
  primaryKeys: ["id", "handle"],
  // This module provides more alias than the default config builder
  alias: [
    {
      name: ["product", "products"],
      args: {
        entity: "Product",
      },
    },
    {
      name: ["product_variant", "product_variants", "variant", "variants"],
      args: {
        entity: "ProductVariant",
      },
    },
    {
      name: ["product_option", "product_options"],
      args: {
        entity: "ProductOption",
      },
    },
    {
      name: ["product_type", "product_types"],
      args: {
        entity: "ProductType",
      },
    },
    {
      name: ["product_image", "product_images"],
      args: {
        entity: "ProductImage",
      },
    },
    {
      name: ["product_tag", "product_tags"],
      args: {
        entity: "ProductTag",
      },
    },
    {
      name: ["product_collection", "product_collections"],
      args: {
        entity: "ProductCollection",
      },
    },
    {
      name: ["product_category", "product_categories"],
      args: {
        entity: "ProductCategory",
      },
    },
  ],
})
