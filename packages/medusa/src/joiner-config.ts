import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"

export const joinerConfig: ModuleJoinerConfig[] = [
  {
    serviceName: "cartService",
    primaryKeys: ["id"],
    linkableKeys: ["cart_id"],
    alias: [
      {
        name: "cart",
      },
    ],
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
        serviceName: "regionService",
        primaryKey: "id",
        foreignKey: "region_id",
        alias: "region",
      },
      {
        serviceName: "customerService",
        primaryKey: "id",
        foreignKey: "customer_id",
        alias: "customer",
      },
    ],
  },
  {
    serviceName: "shippingProfileService",
    primaryKeys: ["id"],
    linkableKeys: ["profile_id"],
    alias: [
      {
        name: "shipping_profile",
      },
      {
        name: "shipping_profiles",
      },
    ],
  },
  {
    serviceName: "regionService",
    primaryKeys: ["id"],
    linkableKeys: ["region_id"],
    alias: [
      {
        name: "region",
      },
      {
        name: "regions",
      },
    ],
  },
  {
    serviceName: "customerService",
    primaryKeys: ["id"],
    linkableKeys: ["customer_id"],
    alias: [
      {
        name: "customer",
      },
      {
        name: "customers",
      },
    ],
  },
]
