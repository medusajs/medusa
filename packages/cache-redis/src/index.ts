import { ModuleExports } from "@medusajs/modules-sdk"

import { RedisCacheService } from "./services"
import Loader from "./loaders"

const service = RedisCacheService
const loaders = [Loader]

const moduleDefinition: ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
