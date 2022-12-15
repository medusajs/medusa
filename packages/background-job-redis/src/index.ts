import { ModuleExports } from "@medusajs/medusa"
import Loader from "./loaders"
import RedisBackgroundJobService from "./services/background-job-redis"

const services = [RedisBackgroundJobService]
const loaders = [Loader]

export default {
  services,
  loaders,
} as ModuleExports