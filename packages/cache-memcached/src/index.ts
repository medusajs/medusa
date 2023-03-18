import { ModuleExports } from "@medusajs/modules-sdk"
import Loader from "./loaders"

import { MemcachedCacheService } from "./services"

const service = MemcachedCacheService
const loaders = [Loader]

const moduleDefinition: ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
