import { Modules } from "@medusajs/modules-sdk"
import {
  buildEntitiesNameToLinkableKeysMap,
  defineJoinerConfig,
  MapToConfig,
} from "@medusajs/utils"

export const joinerConfig = defineJoinerConfig(Modules.PRODUCT, {
  // This module provides more alias than the default config builder
  alias: [
    {
      name: ["product", "products"],
      args: {
        entity: "Product",
        methodSuffix: "Products",
      },
    },
    {
      name: ["product_variant", "product_variants", "variant", "variants"],
      args: {
        entity: "ProductVariant",
        methodSuffix: "ProductVariants",
      },
    },
    {
      name: ["product_option", "product_options"],
      args: {
        entity: "ProductOption",
        methodSuffix: "ProductOptions",
      },
    },
    {
      name: ["product_type", "product_types"],
      args: {
        entity: "ProductType",
        methodSuffix: "ProductTypes",
      },
    },
    {
      name: ["product_image", "product_images"],
      args: {
        entity: "ProductImage",
        methodSuffix: "ProductImages",
      },
    },
    {
      name: ["product_tag", "product_tags"],
      args: {
        entity: "ProductTag",
        methodSuffix: "ProductTags",
      },
    },
    {
      name: ["product_collection", "product_collections"],
      args: {
        entity: "ProductCollection",
        methodSuffix: "ProductCollections",
      },
    },
    {
      name: ["product_category", "product_categories"],
      args: {
        entity: "ProductCategory",
        methodSuffix: "ProductCategories",
      },
    },
  ],
})

export const entityNameToLinkableKeysMap: MapToConfig =
  buildEntitiesNameToLinkableKeysMap(joinerConfig.linkableKeys)
