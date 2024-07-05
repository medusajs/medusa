import { ModuleExports } from "@medusajs/types"
import { WorkflowsModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import redisConnection from "./loaders/redis"
import loadUtils from "./loaders/utils"

const service = WorkflowsModuleService
const loaders = [
  loadContainer,
  loadConnection,
  loadUtils,
  redisConnection,
] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
