import ConnectionLoader from "./loaders/connection"
import StockLocationService from "./services/stock-location"
import * as Migration1 from "./migrations/schema-migrations/1665749860179-setup"

export const service = StockLocationService
export const migrations = [Migration1]
export const loaders = [ConnectionLoader]
