import { ModulesSdkUtils } from "@medusajs/utils"
import * as ModuleModels from "@models"
import * as ModuleRepositories from "@repositories"
import * as ModuleServices from "@services"

export default ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleRepositories: ModuleRepositories,
  moduleServices: ModuleServices,
})
