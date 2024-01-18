import { ModuleServiceInitializeOptions } from "@medusajs/types"

export const databaseOptions: ModuleServiceInitializeOptions["database"] = {
  schema: "public",
  clientUrl: "medusa-workflows-engine-redis-test",
}
