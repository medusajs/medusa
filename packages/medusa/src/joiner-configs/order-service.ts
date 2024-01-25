import { ModuleJoinerConfig } from "@medusajs/types"

export default {
  serviceName: "orderService",
  primaryKeys: ["id"],
  linkableKeys: { order_id: "Order" },
  alias: [
    {
      name: ["order", "orders"],
      args: {
        entity: "Order",
      },
    },
  ],
} as ModuleJoinerConfig
