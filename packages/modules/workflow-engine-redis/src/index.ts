import { Module, Modules } from "@medusajs/framework/utils"
import { WorkflowsModuleService } from "@services"
import { loadUtils, redisConnection } from "./loaders"

export default Module(Modules.WORKFLOW_ENGINE, {
  service: WorkflowsModuleService,
  loaders: [loadUtils, redisConnection] as any[],
})
