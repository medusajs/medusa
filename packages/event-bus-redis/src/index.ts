import { ModuleExports } from "@medusajs/modules-sdk"
import Loader from "./loaders"
import RedisEventBusService from "./services/event-bus-redis"

const service = RedisEventBusService
const loaders = [Loader]

const moduleDefinition: ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
export * from "./initialize"
export * from "./types"
