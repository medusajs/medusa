import ConnectionLoader from "./loaders/connection"
import InventoryService from "./services/inventory"
import * as InventoryModels from "./models"
import * as SchemaMigration from "./migrations/schema-migrations/1665748086258-inventory_setup"
import * as TypeMigration from "./migrations/schema-migrations/1675761451145-add_reservation_type"
import { ModuleExports } from "@medusajs/medusa"

const service = InventoryService
const migrations = [SchemaMigration, TypeMigration]
const loaders = [ConnectionLoader]
const models = Object.values(InventoryModels)

const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  models,
}

export default moduleDefinition
