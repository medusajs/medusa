import { ModuleJoinerConfig } from "@medusajs/types"

export default {
  serviceName: "salesChannelService",
  primaryKeys: ["id"],
  linkableKeys: { sales_channel: "SalesChannel" },
  schema: `
      scalar Date
      scalar JSON
      
      type SalesChannel {
        id: ID!
        name: String!
        description: String!
        is_disabled: Boolean!
        created_at: Date!
        updated_at: Date!  
        deleted_at: Date
        metadata: JSON
      }
    `,
  alias: [
    {
      name: "sales_channel",
    },
    {
      name: "sales_channels",
    },
  ],
} as ModuleJoinerConfig
