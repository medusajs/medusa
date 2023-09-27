import { Modules } from "@medusajs/modules-sdk"
import { ModuleJoinerConfig } from "@medusajs/types"
import { LINKS } from "../links"

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
    },
  ],
  primaryKeys: ["id", "product_id", "profile_id"],
  schema: `
    scalar Date
    scalar JSON
    
    type ShippingProfile {
      id: ID!
      name: String!
      type: String!
      created_at: String!
      updated_at: String!  
      deleted_at: String
      metadata: JSON   
    }
  `,
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
