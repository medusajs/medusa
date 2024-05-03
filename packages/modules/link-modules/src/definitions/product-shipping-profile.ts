import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "@medusajs/utils"

export const ProductShippingProfile: ModuleJoinerConfig = {
  serviceName: LINKS.ProductShippingProfile,
  isLink: true,
  databaseConfig: {
    tableName: "product_shipping_profile",
    idPrefix: "psprof",
  },
  alias: [
    {
      name: "product_shipping_profile",
      args: {
        entity: "LinkProductShippingProfile",
      },
    },
  ],
  primaryKeys: ["id", "product_id", "profile_id"],
  relationships: [
    {
      serviceName: Modules.PRODUCT,
      primaryKey: "id",
      foreignKey: "product_id",
      alias: "product",
    },
    {
      serviceName: "shippingProfileService",
      isInternalService: true,
      primaryKey: "id",
      foreignKey: "profile_id",
      alias: "profile",
    },
  ],
  extends: [
    {
      serviceName: Modules.PRODUCT,
      fieldAlias: {
        profile: "shipping_profile.profile",
      },
      relationship: {
        serviceName: LINKS.ProductShippingProfile,
        primaryKey: "product_id",
        foreignKey: "id",
        alias: "shipping_profile",
      },
    },
    {
      serviceName: "shippingProfileService",
      relationship: {
        serviceName: LINKS.ProductShippingProfile,
        isInternalService: true,
        primaryKey: "profile_id",
        foreignKey: "id",
        alias: "product_link",
      },
    },
  ],
}
