import ConnectionLoader from "./loaders/connection"
import StockLocationService from "./services/stock-location"
import * as SchemaMigration from "./migrations/schema-migrations/1665749860179-setup"

export const service = StockLocationService
export const migrations = [SchemaMigration]
export const loaders = [ConnectionLoader]
