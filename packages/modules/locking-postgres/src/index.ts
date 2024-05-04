import ConnectionLoader from "./loaders/connection"
import { DistributedLockingService } from "./services/index"
import * as InventoryModels from "./models"
import * as SchemaMigration from "./migrations/schema-migrations/1675857372999-distributed_locking_postgres_setup"
import { ModuleExports } from "@medusajs/medusa"

const service = DistributedLockingService
const migrations = [SchemaMigration]
const loaders = [ConnectionLoader]
const models = Object.values(InventoryModels)

const moduleDefinition: ModuleExports = {
  service,
  migrations,
  loaders,
  models,
}

export default moduleDefinition
