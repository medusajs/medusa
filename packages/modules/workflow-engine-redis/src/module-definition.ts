import { ModuleExports } from "@medusajs/types"
import * as ModuleServices from "@services"
import { WorkflowsModuleService } from "@services"
import redisConnection from "./loaders/redis"
import loadUtils from "./loaders/utils"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Modules } from "@medusajs/modules-sdk"
import * as ModuleModels from "@models"
import * as ModuleRepositories from "@repositories"

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.WORKFLOW_ENGINE,
  moduleModels: Object.values(ModuleModels),
  migrationsPath: __dirname + "/migrations",
})

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleRepositories: ModuleRepositories,
  moduleServices: ModuleServices,
})

const service = WorkflowsModuleService
const loaders = [
  connectionLoader,
  containerLoader,
  loadUtils,
  redisConnection,
] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
