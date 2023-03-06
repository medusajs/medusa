import { ModuleExports } from "@medusajs/modules-sdk"

import InMemoryCacheService from "./services/inmemory-cache"

const loaders = []
const service = InMemoryCacheService

const moduleDefinition: ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
