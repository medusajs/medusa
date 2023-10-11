import { DB_URL, TestDatabase } from "../utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { knex } from "knex"
import { CatalogModuleService } from "@services"
import { initialize } from "../../src/initialize"
import { EventBusService, schema } from "../__fixtures__"

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
}

const sharedPgConnection = knex<any, any>({
  client: "pg",
  searchPath: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
  connection: {
    connectionString: DB_URL,
  },
})

describe("SearchEngineModuleService", function () {
  const eventBus = new EventBusService()
  const remoteQueryMock = jest.fn()

  let manager: SqlEntityManager
  let module: CatalogModuleService

  beforeEach(async () => {
    manager = await beforeEach_()
    module = await initialize(
      {
        defaultAdapterOptions: {
          database: {
            clientUrl: DB_URL,
            schema: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
          },
        },
        schema,
      },
      {
        eventBusModuleService: eventBus,
        remoteQuery: remoteQueryMock,
      }
    )
  })

  afterEach(afterEach_)

  it("should be able to consume created event and create the catalog and catalog relation entries", async () => {
    await eventBus.emit([
      {
        eventName: "product.created",
        data: {
          id: "prod_1",
        },
      },
    ])

    expect(remoteQueryMock).toHaveBeenCalledTimes(1)
  })
})
