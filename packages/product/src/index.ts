import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

// import migrations from "./migrations"
// import { revertMigration, runMigrations } from "./migrations/run-migration"
import * as ProductModels from "@models"
import ProductService from "./services/product"

const service = ProductService
const loaders = [loadContainer, loadConnection] as any
const models = Object.values(ProductModels)

const moduleDefinition = {
  service,
  // migrations,
  loaders,
  models,
  // runMigrations,
  // revertMigration,
}

export default moduleDefinition
export * from "./initialize"
// export { revertMigration, runMigrations } from "./migrations/run-migration"
export * from "./types"
