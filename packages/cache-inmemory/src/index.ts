import { ModulesSdkTypes } from "@medusajs/modules-sdk"

import InMemoryCacheService from "./services/inmemory-cache"

const service = InMemoryCacheService

const moduleDefinition: ModulesSdkTypes.ModuleExports = {
  service,
}

export default moduleDefinition
