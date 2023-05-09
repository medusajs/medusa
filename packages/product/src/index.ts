// TODO: Implement migrations handling with MikroORM

import loadConnection from "./loaders/connection"
import loadContainer from "./loaders/container"

// import migrations from "./migrations"
// import { revertMigration, runMigrations } from "./migrations/run-migration"
import * as ProductModels from "@models"
import ProductService from "./services/product"

import { ModuleExports } from "@medusajs/modules-sdk"
import { MikroORM, Options } from "@mikro-orm/postgresql"
import { EntityManager } from "@mikro-orm/core"

const service = ProductService
const loaders = [loadContainer, loadConnection]
const models = Object.values(ProductModels)

const moduleDefinition: ModuleExports = {
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

//  yarn build && node dist/index.js

async function RUN_TEST() {
  const config: Options = {
    type: "postgresql",
    dbName: "medusa-product-module",
    entities: models,
    debug: true,
  }
  const orm = await MikroORM.init(config)

  const manager = orm.em.fork() as EntityManager

  const product = await manager.findOne(ProductModels.Product, {
    handle: "test",
  })

  console.log({ product })

  await orm.close()
}

RUN_TEST()
