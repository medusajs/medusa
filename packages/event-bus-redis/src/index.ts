import { ModuleExports } from "@medusajs/medusa"
import Loader from "./loaders"
import RedisEventBusService from "./services/event-bus-redis"

const services = [RedisEventBusService]
const loaders = [Loader]

export default {
  services,
  loaders,
} as ModuleExports