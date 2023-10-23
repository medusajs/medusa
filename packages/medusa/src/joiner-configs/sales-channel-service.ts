import { ModuleJoinerConfig } from "@medusajs/types"

export default {
  serviceName: "salesChannelService",
  primaryKeys: ["id"],
  linkableKeys: { sales_channel_id: "SalesChannel" },
  schema: `
      scalar Date
      scalar JSON
      
      type SalesChannel {
        id: ID!
        name: String!
        description: String!
        is_disabled: Boolean
        created_at: Date!
        updated_at: Date!  
        deleted_at: Date
        metadata: JSON
      }
    `,
  alias: [
    {
      name: "sales_channel",
      args: { entity: "SalesChannel" },
    },
    {
      name: "sales_channels",
      args: { entity: "SalesChannel" },
    },
  ],
} as ModuleJoinerConfig
