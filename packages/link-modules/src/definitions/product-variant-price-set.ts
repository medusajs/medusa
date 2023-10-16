import { LINKS } from "../links"
import { ModuleJoinerConfig } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

export const ProductVariantPriceSet: ModuleJoinerConfig = {
  serviceName: LINKS.ProductVariantPriceSet,
  isLink: true,
  databaseConfig: {
    tableName: "product_variant_price_set",
    idPrefix: "pvps",
  },
  alias: [
    {
      name: "product_variant_price_set",
    },
    {
      name: "product_variant_price_sets",
    },
  ],
  primaryKeys: ["id", "variant_id", "price_set_id"],
  relationships: [
    {
      serviceName: Modules.PRODUCT,
      // TODO: Remove this when product module is the default product service
      isInternalService: true,
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
      relationship: {
        serviceName: LINKS.ProductVariantPriceSet,
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "price",
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
    },
  ],
}
