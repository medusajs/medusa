import { MikroOrmBaseRepository, ModulesSdkUtils } from "@medusajs/utils"
import * as ModuleModels from "@models"
import * as ModuleServices from "@services"

export default ModulesSdkUtils.moduleContainerLoaderFactory({
  moduleModels: ModuleModels,
  moduleServices: ModuleServices,
  moduleRepositories: { BaseRepository: MikroOrmBaseRepository },
})
