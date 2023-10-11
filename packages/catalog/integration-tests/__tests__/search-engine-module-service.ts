import { DB_URL, TestDatabase } from "../utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { knex } from "knex"
import { CatalogModuleService } from "@services"
import { initialize } from "../../src/initialize"
import { EventBusService, schema } from "../__fixtures__"
import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import modulesConfig from "../../src/__tests__/__fixtures__/modules-config"
import { joinerConfig } from "../../src/__tests__/__fixtures__/joiner-config"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { Catalog } from "@models"

const sharedPgConnection = knex<any, any>({
  client: "pg",
  searchPath: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
  connection: {
    connectionString: DB_URL,
  },
})

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
}

describe("SearchEngineModuleService", function () {
  const eventBus = new EventBusService()
  const remoteQueryMock = jest.fn().mockImplementation((query) => {
    if (query.product) {
      const filters = query.product.__args?.filters ?? {}
      filters.id ??= []
      const productIds = Array.isArray(filters.id) ? filters.id : [filters.id]
      return productIds.map((id) => ({ id }))
    }
  })

  let manager: SqlEntityManager
  let module: CatalogModuleService

  beforeEach(async () => {
    manager = await beforeEach_()

    const searchEngineModuleOptions = {
      defaultAdapterOptions: {
        database: {
          clientUrl: DB_URL,
          schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
        },
      },
      schema,
    }

    const injectedDependencies = {
      [ContainerRegistrationKeys.PG_CONNECTION]: sharedPgConnection,
      eventBusModuleService: eventBus,
      remoteQuery: remoteQueryMock,
    }

    await MedusaApp({
      modulesConfig: {
        ...modulesConfig,
        [Modules.CATALOG]: {
          options: searchEngineModuleOptions,
        },
      },
      servicesConfig: joinerConfig,
      injectedDependencies,
    })

    module = await initialize(searchEngineModuleOptions, {
      eventBusModuleService: eventBus,
      remoteQuery: remoteQueryMock,
    })

    // TODO
    await module.afterModulesInit()
  })

  afterEach(afterEach_)

  it("should be able to consume created event and create the corresponding catalog entries", async () => {
    const productId = "prod_1"

    await eventBus.emit([
      {
        eventName: "product.created",
        data: {
          id: productId,
        },
      },
    ])

    expect(remoteQueryMock).toHaveBeenCalledTimes(1)

    const catalogEntries: Catalog[] = await manager.find("Catalog", {
      id: productId,
      name: "Product",
    })

    expect(catalogEntries).toHaveLength(1)
    expect(catalogEntries[0].id).toEqual(productId)
  })
})
