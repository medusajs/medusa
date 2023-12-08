import { ModuleJoinerConfig } from "@medusajs/types"

export default {
  serviceName: "regionService",
  primaryKeys: ["id"],
  linkableKeys: { region_id: "Region" },
  alias: [
    {
      name: "region",
    },
    {
      name: "regions",
    },
  ],
} as ModuleJoinerConfig
