import ConnectionLoader from "./loaders/connection"
import InventoryService from "./services/inventory"
import * as SchemaMigration from "./migrations/schema-migrations/1665748086258-inventory_setup"

export const service = InventoryService
export const migrations = [SchemaMigration]
export const loaders = [ConnectionLoader]
