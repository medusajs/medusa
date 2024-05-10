import { ModuleExports } from "@medusajs/types"
import * as ModuleServices from "@services"
import { SalesChannelModuleService } from "@services"
import { ModulesSdkUtils } from "@medusajs/utils"
import { Modules } from "@medusajs/modules-sdk"
import * as ModuleModels from "@models"
import * as ModuleRepositories from "@repositories"

const connectionLoader = ModulesSdkUtils.mikroOrmConnectionLoaderFactory({
  moduleName: Modules.SALES_CHANNEL,
  moduleModels: Object.values(ModuleModels),
  migrationsPath: __dirname + "/migrations",
})

const containerLoader = ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleRepositories: ModuleRepositories,
  moduleServices: ModuleServices,
})

const service = SalesChannelModuleService
const loaders = [connectionLoader, containerLoader] as any

export const moduleDefinition: ModuleExports = {
  service,
  loaders,
}
