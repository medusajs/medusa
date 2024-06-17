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

const entityLinkableKeysMap: MapToConfig = {}
Object.entries(LinkableKeys).forEach(([key, value]) => {
  entityLinkableKeysMap[value] ??= []
  entityLinkableKeysMap[value].push({
    mapTo: key,
    valueFrom: key.split("_").pop()!,
  })
})
export const entityNameToLinkableKeysMap: MapToConfig = entityLinkableKeysMap

export const joinerConfig: ModuleJoinerConfig = {
  serviceName: Modules.PRODUCT,
  primaryKeys: ["id", "handle"],
  linkableKeys: LinkableKeys,
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
        methodSuffix: "Variants",
      },
    },
    {
      name: ["product_option", "product_options"],
      args: {
        entity: "ProductOption",
        methodSuffix: "Options",
      },
    },
    {
      name: ["product_type", "product_types"],
      args: {
        entity: "ProductType",
        methodSuffix: "Types",
      },
    },
    {
      name: ["product_image", "product_images"],
      args: {
        entity: "ProductImage",
        methodSuffix: "Images",
      },
    },
    {
      name: ["product_tag", "product_tags"],
      args: {
        entity: "ProductTag",
        methodSuffix: "Tags",
      },
    },
    {
      name: ["product_collection", "product_collections"],
      args: {
        entity: "ProductCollection",
        methodSuffix: "Collections",
      },
    },
    {
      name: ["product_category", "product_categories"],
      args: {
        entity: "ProductCategory",
        methodSuffix: "Categories",
      },
    },
  ],
}
