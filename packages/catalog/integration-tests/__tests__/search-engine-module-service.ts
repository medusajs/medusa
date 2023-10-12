import { MedusaApp, Modules } from "@medusajs/modules-sdk"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { Catalog, CatalogRelation } from "@models"
import { CatalogModuleService } from "@services"
import { knex } from "knex"
import { joinerConfig } from "../../src/__tests__/__fixtures__/joiner-config"
import modulesConfig from "../../src/__tests__/__fixtures__/modules-config"
import { initialize } from "../../src/initialize"
import { EventBusService, schema } from "../__fixtures__"
import { DB_URL, TestDatabase } from "../utils"

const sharedPgConnection = knex<any, any>({
  client: "pg",
  searchPath: process.env.MEDUSA_PRODUCT_DB_SCHEMA,
  connection: {
    connectionString: DB_URL,
  },
})

const beforeEach_ = async () => {
  await TestDatabase.setupDatabase()
  jest.clearAllMocks()
  return await TestDatabase.forkManager()
}

const afterEach_ = async () => {
  await TestDatabase.clearDatabase()
}

describe("SearchEngineModuleService", function () {
  const eventBus = new EventBusService()
  const remoteQueryMock = jest.fn()

  let manager: SqlEntityManager
  let module: CatalogModuleService

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

  beforeAll(async () => {
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
  })

  beforeEach(async () => {
    manager = await beforeEach_()

    module = await initialize(searchEngineModuleOptions, {
      eventBusModuleService: eventBus,
      remoteQuery: remoteQueryMock,
    })

    // TODO
    await module.onApplicationStart?.()
  })

  afterEach(afterEach_)

  it("should be able to consume created event and create the corresponding catalog entries", async () => {
    const productId = "prod_2"

    remoteQueryMock.mockImplementation(() => {
      return {
        id: productId,
      }
    })

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

  it("should be able to consume created event of a child entity and create the corresponding catalog and catalog relation entries, and query the data", async () => {
    const productId = "prod_1"
    const variantId = "var_1"

    remoteQueryMock.mockImplementation((query) => {
      if (query.product) {
        return {
          id: productId,
        }
      } else if (query.variant || query.variants) {
        return {
          id: variantId,
          product: [
            {
              id: productId,
            },
          ],
        }
      }

      return {}
    })

    await eventBus.emit([
      {
        eventName: "product.created",
        data: {
          id: productId,
        },
      },
    ])

    await eventBus.emit([
      {
        eventName: "variant.created",
        data: {
          id: variantId,
          product: {
            id: productId,
          },
        },
      },
    ])

    const result = await module.query({
      select: {
        product: {
          variants: true,
        },
      },
    })

    expect(remoteQueryMock).toHaveBeenCalledTimes(2)

    const catalogEntries: Catalog[] = await manager.find(Catalog, {
      id: variantId,
      name: "ProductVariant",
    })

    expect(catalogEntries).toHaveLength(1)
    expect(catalogEntries[0].id).toEqual(variantId)

    const catalogRelationEntries: CatalogRelation[] = await manager.find(
      CatalogRelation,
      {
        parent_id: productId,
        parent_name: "Product",
        child_id: variantId,
        child_name: "ProductVariant",
      }
    )

    expect(catalogRelationEntries).toHaveLength(1)
    expect(catalogRelationEntries[0].parent_id).toEqual(productId)
    expect(catalogRelationEntries[0].child_id).toEqual(variantId)

    expect(result).toEqual([
      {
        id: "prod_1",
        variants: [
          {
            id: "var_1",
          },
        ],
      },
    ])
  })
})
