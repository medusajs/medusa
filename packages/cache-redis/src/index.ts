import { ModuleExports } from "@medusajs/modules-sdk"

import Loader from "./loaders"
import { RedisCacheService } from "./services"

const services = [RedisCacheService]
const loaders = [Loader]

const moduleDefinition: ModuleExports = {
  services,
  loaders,
}

export default moduleDefinition
