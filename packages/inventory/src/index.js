import ConnectionLoader from "./loaders/connection"
import InventoryService from "./services/inventory"
import * as Migration1 from "./migrations/schema-migrations/1665748086258-inventory_setup"

export const service = InventoryService
export const migrations = [Migration1]
export const loaders = [ConnectionLoader]
