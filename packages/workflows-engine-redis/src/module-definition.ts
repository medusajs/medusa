import { ModuleExports } from "@medusajs/types"
import { WorkflowsModuleService } from "@services"
import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"
import redisConnection from "./loaders/redis"

const service = WorkflowsModuleService
const loaders = [loadContainer, loadConnection, redisConnection] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
