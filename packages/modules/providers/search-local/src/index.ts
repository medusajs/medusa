import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { LocalSearchService } from "./services/local-search"

const services = [LocalSearchService]

export default ModuleProvider(Modules.SEARCH, {
  services,
})
