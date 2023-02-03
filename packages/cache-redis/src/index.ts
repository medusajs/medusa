import { ModuleExports } from "@medusajs/medusa"

import { RedisCacheService } from "./services"

const service = RedisCacheService
const loaders = []

const moduleDefinition: ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
