import { Modules } from "@medusajs/modules-sdk"
import { JoinerServiceConfig } from "@medusajs/types"

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
