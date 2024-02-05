import { ModuleJoinerConfig } from "@medusajs/types"

export default {
  serviceName: "publishableApiKeyService",
  primaryKeys: ["id"],
  linkableKeys: { publishable_key_id: "PublishableApiKey" },
  schema: `
      scalar Date
      scalar JSON
      
      type PublishableApiKey {
        id: ID!
        sales_channel_id: String!
        publishable_key_id: String!
        created_at: Date!
        updated_at: Date!  
        deleted_at: Date
      }
    `,
  alias: [
    {
      name: ["publishable_api_key", "publishable_api_keys"],
      args: {
        entity: "PublishableApiKey",
      },
    },
  ],
} as ModuleJoinerConfig
