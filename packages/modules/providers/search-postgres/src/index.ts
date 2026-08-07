import { ModuleProvider, Modules } from "@medusajs/framework/utils"
import { PostgresSearchService } from "./services/postgres-search"

const services = [PostgresSearchService]

export default ModuleProvider(Modules.SEARCH, {
  services,
})
