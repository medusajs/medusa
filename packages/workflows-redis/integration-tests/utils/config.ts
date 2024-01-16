import { ModuleServiceInitializeOptions } from "@medusajs/types"

export const databaseOptions: ModuleServiceInitializeOptions["database"] = {
  schema: "public",
  clientUrl: "medusa-workflow-orchestrator-test",
}
