import { ModuleExports } from "@medusajs/modules-sdk"

import InMemoryCacheService from "./services/inmemory-cache"

const loaders = []
const services = [InMemoryCacheService]

const moduleDefinition: ModuleExports = {
  services,
  loaders,
}

export default moduleDefinition
