import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "../links"

export const ProductVariantMoneyAmount: ModuleJoinerConfig = {
  serviceName: LINKS.ProductVariantMoneyAmount,
  isLink: true,
  databaseConfig: {
    tableName: "product_variant_money_amount",
    idPrefix: "pvma",
  },
  alias: [
    {
      name: "product_variant_money_amount",
    },
    {
      name: "product_variant_money_amounts",
    },
  ],
  primaryKeys: ["id", "variant_id", "money_amount_id"],
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
      foreignKey: "money_amount_id",
      alias: "money_amount",
      deleteCascade: true,
    },
  ],
  extends: [
    {
      serviceName: Modules.PRODUCT,
      relationship: {
        serviceName: LINKS.ProductVariantMoneyAmount,
        primaryKey: "variant_id",
        foreignKey: "id",
        alias: "prices",
        isList: true,
      },
    },
    {
      serviceName: Modules.PRICING,
      relationship: {
        serviceName: LINKS.ProductVariantMoneyAmount,
        primaryKey: "money_amount_id",
        foreignKey: "id",
        alias: "variant_link",
      },
    },
  ],
}
