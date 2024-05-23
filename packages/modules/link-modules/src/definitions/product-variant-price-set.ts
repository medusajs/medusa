import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

export const ProductVariantPriceSet: ModuleJoinerConfig = {
  serviceName: LINKS.ProductVariantPriceSet,
  isLink: true,
  databaseConfig: {
    tableName: "product_variant_price_set",
    idPrefix: "pvps",
  },
  alias: [
    {
      name: ["product_variant_price_set", "product_variant_price_sets"],
      args: {
        entity: "LinkProductVariantPriceSet",
      },
    },
  ],
  primaryKeys: ["id", "variant_id", "price_set_id"],
  relationships: [
    {
      serviceName: Modules.PRODUCT,
      primaryKey: "id",
      foreignKey: "variant_id",
      alias: "variant",
      args: {
        methodSuffix: "Variants",
      },
    },
    {
      serviceName: Modules.PRICING,
      primaryKey: "id",
      foreignKey: "price_set_id",
      alias: "price_set",
      deleteCascade: true,
    },
  ],
  extends: [
    {
      serviceName: Modules.PRODUCT,
      fieldAlias: {
        price_set: "price_set_link.price_set",
        prices: "price_set_link.price_set.prices",
        calculated_price: {
          path: "price_set_link.price_set.calculated_price",
          forwardArgumentsOnPath: ["price_set_link.price_set"],
        },
      },
      relationship: {
        serviceName: LINKS.ProductVariantPriceSet,
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "price_set_link",
      },
    },
    {
      serviceName: Modules.PRICING,
      relationship: {
        serviceName: LINKS.ProductVariantPriceSet,
        primaryKey: "price_set_id",
        foreignKey: "id",
        alias: "variant_link",
      },
      fieldAlias: {
        variant: "variant_link.variant",
      },
    },
  ],
}
