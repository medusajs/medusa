import ConnectionLoader from "./loaders/connection"
import InventoryService from "./services/inventory"
import * as SchemaMigration from "./migrations/schema-migrations/1673047120320-lock_postgres_setup"

export const service = InventoryService
export const migrations = [SchemaMigration]
export const loaders = [ConnectionLoader]
