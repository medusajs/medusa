import { ModuleJoinerConfig } from "@medusajs/types"

export default {
  serviceName: "shippingProfileService",
  primaryKeys: ["id"],
  linkableKeys: { profile_id: "ShippingProfile" },
  schema: `
      scalar Date
      scalar JSON
      
      type ShippingProfile {
        id: ID!
        name: String!
        type: String!
        created_at: Date!
        updated_at: Date!  
        deleted_at: Date
        metadata: JSON
      }
    `,
  alias: [
    {
      name: "shipping_profile",
    },
    {
      name: "shipping_profiles",
    },
  ],
} as ModuleJoinerConfig
