import { ModuleJoinerConfig } from "@medusajs/types"

export default {
  serviceName: "customerService",
  primaryKeys: ["id"],
  linkableKeys: { customer_id: "Customer" },
  alias: [
    {
      name: "customer",
    },
    {
      name: "customers",
    },
  ],
} as ModuleJoinerConfig
