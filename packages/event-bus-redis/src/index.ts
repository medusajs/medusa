import { ModulesSdkTypes } from "@medusajs/modules-sdk"
import Loader from "./loaders"
import RedisEventBusService from "./services/event-bus-redis"

const service = RedisEventBusService
const loaders = [Loader]

const moduleDefinition: ModulesSdkTypes.ModuleExports = {
  service,
  loaders,
}

export default moduleDefinition
