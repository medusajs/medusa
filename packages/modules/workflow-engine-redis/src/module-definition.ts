import { ModuleExports } from "@medusajs/types"
import { WorkflowsModuleService } from "@services"
import redisConnection from "./loaders/redis"
import loadUtils from "./loaders/utils"

const service = WorkflowsModuleService
const loaders = [loadUtils, redisConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
