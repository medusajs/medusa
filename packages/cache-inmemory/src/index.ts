import InMemoryCacheService from "./services/inmemory-cache"
import ConnectionLoader from "./loaders/connection"

import { ModuleExports } from "@medusajs/medusa"

const service = InMemoryCacheService
const loaders = [ConnectionLoader]

const moduleDefinition: ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
