import { ModuleJoinerConfig } from "@zjedene-medusa/framework/types"
import { LINKS, Modules } from "@zjedene-medusa/framework/utils"

export const ProductShippingProfile: ModuleJoinerConfig = {
  serviceName: LINKS.ProductShippingProfile,
  isLink: true,
  databaseConfig: {
    tableName: "product_shipping_profile",
    idPrefix: "prodsp",
  },
  alias: [
    {
      name: "product_shipping_profile",
    },
    {
      name: "product_shipping_profiles",
    },
  ],
  primaryKeys: ["id", "product_id", "shipping_profile_id"],
  relationships: [
    {
      serviceName: Modules.PRODUCT,
      entity: "Product",
      primaryKey: "id",
      foreignKey: "product_id",
      alias: "product",
      args: {
        methodSuffix: "Products",
      },
      hasMany: true,
    },
    {
      serviceName: Modules.FULFILLMENT,
      entity: "ShippingProfile",
      primaryKey: "id",
      foreignKey: "shipping_profile_id",
      alias: "shipping_profile",
      args: {
        methodSuffix: "ShippingProfiles",
      },
    },
  ],
  extends: [
    {
      serviceName: Modules.PRODUCT,
      entity: "Product",
      fieldAlias: {
        shipping_profile: {
          path: "shipping_profiles_link.shipping_profile",
          isList: false,
        },
      },
      relationship: {
        serviceName: LINKS.ProductShippingProfile,
        primaryKey: "product_id",
        foreignKey: "id",
        alias: "shipping_profiles_link",
        isList: false,
      },
    },
    {
      serviceName: Modules.FULFILLMENT,
      entity: "ShippingProfile",
      relationship: {
        serviceName: LINKS.ProductShippingProfile,
        primaryKey: "shipping_profile_id",
        foreignKey: "id",
        alias: "products_link",
        isList: true,
      },
    },
  ],
}
