import { ModulesSdkTypes } from "@medusajs/modules-sdk"

import Loader from "./loaders"
import { RedisCacheService } from "./services"

const service = RedisCacheService
const loaders = [Loader]

const moduleDefinition: ModulesSdkTypes.ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
