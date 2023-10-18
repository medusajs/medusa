import { ModuleJoinerConfig } from "@medusajs/types"

export default {
  serviceName: "regionService",
  primaryKeys: ["id"],
  linkableKeys: { region_id: "Region" },
  alias: [
    {
      name: ["region", "regions"],
      args: {
        entity: "Region",
      },
    },
  ],
} as ModuleJoinerConfig
