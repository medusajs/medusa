import { ModuleExports } from "@medusajs/modules-sdk"
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
