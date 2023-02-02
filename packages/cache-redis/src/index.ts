import { ModuleExports } from "@medusajs/medusa"

import { RedisCacheService } from "./services"
import RedisLoader from "./loaders"

const service = RedisCacheService
const loaders = [RedisLoader]

const moduleDefinition: ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
