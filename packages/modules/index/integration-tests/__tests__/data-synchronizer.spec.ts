import {
  configLoader,
  container,
  logger,
  MedusaAppLoader,
  Migrator,
} from "@zjedene-medusa/framework"
import { asValue } from "@zjedene-medusa/framework/awilix"
import { EntityManager } from "@zjedene-medusa/framework/mikro-orm/postgresql"
import { MedusaAppOutput, MedusaModule } from "@zjedene-medusa/framework/modules-sdk"
import { IndexTypes, InferEntityType } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  toMikroORMEntity,
} from "@zjedene-medusa/framework/utils"
import { initDb, TestDatabaseUtils } from "@zjedene-medusa/test-utils"
import { IndexData, IndexRelation } from "@models"
import { DataSynchronizer } from "@services"
import * as path from "path"
import { setTimeout } from "timers/promises"
import { EventBusServiceMock } from "../__fixtures__"
import { dbName } from "../__fixtures__/medusa-config"

const eventBusMock = new EventBusServiceMock()
const queryMock = {
  graph: jest.fn(),
}

const dbUtils = TestDatabaseUtils.dbTestUtilFactory()

jest.setTimeout(300000)

const testProductId = "test_prod_1"
const testProductId2 = "test_prod_2"
const testVariantId = "test_var_1"
const testVariantId2 = "test_var_2"

const mockData = [
  {
    id: testProductId,
    title: "Test Product",
    updated_at: new Date(),
  },
  {
    id: testProductId2,
    title: "Test Product",
    updated_at: new Date(),
  },
  {
    id: testVariantId,
    title: "Test Variant",
    product: {
      id: testProductId,
    },
    updated_at: new Date(),
  },
  {
    id: testVariantId2,
    title: "Test Variant 2",
    product: {
      id: testProductId2,
    },
    updated_at: new Date(),
  },
]

let medusaAppLoader!: MedusaAppLoader
let index!: IndexTypes.IIndexService

const beforeAll_ = async () => {
  try {
    await configLoader(
      path.join(__dirname, "./../__fixtures__"),
      "medusa-config"
    )

    console.log(`Creating database ${dbName}`)
    await dbUtils.create(dbName)
    dbUtils.pgConnection_ = await initDb()

    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger),
      [ContainerRegistrationKeys.PG_CONNECTION]: asValue(dbUtils.pgConnection_),
    })

    medusaAppLoader = new MedusaAppLoader()

    // Migrations
    const migrator = new Migrator({ container })
    await migrator.ensureMigrationsTable()

    await medusaAppLoader.runModulesMigrations()
    const linkPlanner = await medusaAppLoader.getLinksExecutionPlanner()
    const plan = await linkPlanner.createPlan()
    await linkPlanner.executePlan(plan)

    // Clear partially loaded instances
    MedusaModule.clearInstances()

    // Bootstrap modules
    const globalApp = await medusaAppLoader.load()
    container.register({
      [ContainerRegistrationKeys.QUERY]: asValue(queryMock),
      [ContainerRegistrationKeys.REMOTE_QUERY]: asValue(queryMock),
      [Modules.EVENT_BUS]: asValue(eventBusMock),
    })

    index = container.resolve(Modules.INDEX)

    await globalApp.onApplicationStart()
    await setTimeout(1000)

    return globalApp
  } catch (error) {
    console.error("Error initializing", error?.message)
    throw error
  }
}

describe("DataSynchronizer", () => {
  let index: IndexTypes.IIndexService
  let dataSynchronizer: DataSynchronizer
  let medusaApp: MedusaAppOutput
  let onApplicationPrepareShutdown!: () => Promise<void>
  let onApplicationShutdown!: () => Promise<void>
  let manager: EntityManager

  beforeAll(async () => {
    medusaApp = await beforeAll_()
    onApplicationPrepareShutdown = medusaApp.onApplicationPrepareShutdown
    onApplicationShutdown = medusaApp.onApplicationShutdown
  })

  afterAll(async () => {
    await onApplicationPrepareShutdown()
    await onApplicationShutdown()
    await dbUtils.shutdown(dbName)
  })

  beforeEach(async () => {
    jest.clearAllMocks()
    index = container.resolve(Modules.INDEX)
    manager = (index as any).container_.manager as EntityManager

    dataSynchronizer = (index as any).dataSynchronizer_
  })

  describe("sync", () => {
    it("should sync products data correctly", async () => {
      // Mock query response for products
      queryMock.graph.mockImplementation(async (config) => {
        if (Array.isArray(config.filters.id)) {
          let data: any[] = []
          if (config.filters.id.includes(testProductId)) {
            data.push(mockData[0])
          } else if (config.filters.id.includes(testProductId2)) {
            data.push(mockData[1])
          }

          return {
            data,
          }
        }

        if (Object.keys(config.filters).length === 0) {
          return {
            data: [mockData[0]],
          }
        } else if (config.filters.id["$gt"] === mockData[0].id) {
          return {
            data: [mockData[1]],
          }
        }

        return {
          data: [],
        }
      })

      const ackMock = jest.fn()

      const result = await dataSynchronizer.syncEntity({
        entityName: "Product",
        ack: ackMock,
      })

      // First loop fetching products
      expect(queryMock.graph).toHaveBeenNthCalledWith(1, {
        entity: "product",
        fields: ["id"],
        filters: {},
        pagination: {
          order: {
            id: "asc",
          },
          take: 100,
        },
      })

      // First time fetching product data for creation from the storage provider
      expect(queryMock.graph).toHaveBeenNthCalledWith(2, {
        entity: "product",
        filters: {
          id: [testProductId],
        },
        fields: ["id", "created_at", "title"],
      })

      // Second loop fetching products
      expect(queryMock.graph).toHaveBeenNthCalledWith(3, {
        entity: "product",
        fields: ["id"],
        filters: {
          id: {
            $gt: testProductId,
          },
        },
        pagination: {
          order: {
            id: "asc",
          },
          take: 100,
        },
      })

      // Second time fetching product data for creation from the storage provider
      expect(queryMock.graph).toHaveBeenNthCalledWith(4, {
        entity: "product",
        filters: {
          id: [testProductId2],
        },
        fields: ["id", "created_at", "title"],
      })

      expect(ackMock).toHaveBeenNthCalledWith(1, {
        lastCursor: testProductId,
      })

      expect(ackMock).toHaveBeenNthCalledWith(2, {
        lastCursor: testProductId2,
      })

      expect(ackMock).toHaveBeenNthCalledWith(3, {
        lastCursor: testProductId2,
        done: true,
      })

      expect(result).toEqual({
        lastCursor: testProductId2,
        done: true,
      })

      const indexData = await manager.find<InferEntityType<IndexData>>(
        toMikroORMEntity(IndexData),
        {}
      )
      const indexRelationData = await manager.find(
        toMikroORMEntity(IndexRelation),
        {}
      )

      expect(indexData).toHaveLength(2)
      expect(indexData).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: testProductId,
          }),
          expect.objectContaining({
            id: testProductId2,
          }),
        ])
      )

      expect(indexRelationData).toHaveLength(0)
    })
  })

  it("should sync products and product variants data correctly", async () => {
    // Mock query response for products
    queryMock.graph.mockImplementation(async (config) => {
      if (config.entity === "product") {
        if (Array.isArray(config.filters.id)) {
          if (config.filters.id.includes(testProductId)) {
            return {
              data: [mockData[0]],
            }
          } else if (config.filters.id.includes(testProductId2)) {
            return {
              data: [mockData[1]],
            }
          }
        }

        if (Object.keys(config.filters).length === 0) {
          return {
            data: [mockData[0]],
          }
        } else if (config.filters.id["$gt"] === mockData[0].id) {
          return {
            data: [mockData[1]],
          }
        }
      }

      if (config.entity === "product_variant") {
        if (Array.isArray(config.filters.id)) {
          if (config.filters.id.includes(testVariantId)) {
            return {
              data: [mockData[2]],
            }
          } else if (config.filters.id.includes(testVariantId2)) {
            return {
              data: [mockData[3]],
            }
          }
        }

        if (Object.keys(config.filters).length === 0) {
          return {
            data: [mockData[2]],
          }
        } else if (config.filters.id["$gt"] === mockData[2].id) {
          return {
            data: [mockData[3]],
          }
        }
      }

      return {
        data: [],
      }
    })

    const ackMock = jest.fn()

    await dataSynchronizer.syncEntity({
      entityName: "Product",
      ack: ackMock,
    })

    jest.clearAllMocks()

    const result = await dataSynchronizer.syncEntity({
      entityName: "ProductVariant",
      ack: ackMock,
    })

    // First loop fetching product variants
    expect(queryMock.graph).toHaveBeenNthCalledWith(1, {
      entity: "product_variant",
      fields: ["id"],
      filters: {},
      pagination: {
        order: {
          id: "asc",
        },
        take: 100,
      },
    })

    // First time fetching product variant data for creation from the storage provider
    expect(queryMock.graph).toHaveBeenNthCalledWith(2, {
      entity: "product_variant",
      filters: {
        id: [testVariantId],
      },
      fields: ["id", "product.id", "product_id", "sku"],
    })

    // Second loop fetching product variants
    expect(queryMock.graph).toHaveBeenNthCalledWith(3, {
      entity: "product_variant",
      fields: ["id"],
      filters: {
        id: {
          $gt: testVariantId,
        },
      },
      pagination: {
        order: {
          id: "asc",
        },
        take: 100,
      },
    })

    // Second time fetching product variant data for creation from the storage provider
    expect(queryMock.graph).toHaveBeenNthCalledWith(4, {
      entity: "product_variant",
      filters: {
        id: [testVariantId2],
      },
      fields: ["id", "product.id", "product_id", "sku"],
    })

    expect(ackMock).toHaveBeenNthCalledWith(1, {
      lastCursor: testVariantId,
    })

    expect(ackMock).toHaveBeenNthCalledWith(2, {
      lastCursor: testVariantId2,
    })

    expect(ackMock).toHaveBeenNthCalledWith(3, {
      lastCursor: testVariantId2,
      done: true,
    })

    expect(result).toEqual({
      lastCursor: testVariantId2,
      done: true,
    })

    const indexData = await manager.find<InferEntityType<IndexData>>(
      toMikroORMEntity(IndexData),
      {}
    )
    const indexRelationData = await manager.find<
      InferEntityType<IndexRelation>
    >(toMikroORMEntity(IndexRelation), {})

    expect(indexData).toHaveLength(4)
    expect(indexData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: testProductId }),
        expect.objectContaining({ id: testProductId2 }),
        expect.objectContaining({ id: testVariantId }),
        expect.objectContaining({ id: testVariantId2 }),
      ])
    )

    expect(indexRelationData).toHaveLength(2)
    expect(indexRelationData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          parent_id: testProductId,
          child_id: testVariantId,
          parent_name: "Product",
          child_name: "ProductVariant",
          pivot: "Product-ProductVariant",
        }),
        expect.objectContaining({
          parent_id: testProductId2,
          child_id: testVariantId2,
          parent_name: "Product",
          child_name: "ProductVariant",
          pivot: "Product-ProductVariant",
        }),
      ])
    )
  })

  // TODO: Add tests for errors handling and failure handling
})
