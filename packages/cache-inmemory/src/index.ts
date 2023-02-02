import { ModuleExports } from "@medusajs/medusa"

import InMemoryCacheService from "./services/inmemory-cache"

const loaders = []
const service = InMemoryCacheService

const moduleDefinition: ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
