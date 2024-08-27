import { ModuleExports } from "@medusajs/types"
import Loader from "./loaders"
import { RedisCacheService } from "./services"

const service = RedisCacheService
const loaders = [Loader]

const moduleDefinition: ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
export * from "./initialize"
export * from "./types"
