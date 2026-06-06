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
import { IndexTypes } from "@zjedene-medusa/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  toMikroORMEntity,
} from "@zjedene-medusa/framework/utils"
import { initDb, TestDatabaseUtils } from "@zjedene-medusa/test-utils"
import { IndexData, IndexMetadata, IndexRelation, IndexSync } from "@models"
import { IndexMetadataStatus } from "@utils"
import * as path from "path"
import { setTimeout } from "timers/promises"
import { EventBusServiceMock } from "../__fixtures__"
import { dbName } from "../__fixtures__/medusa-config"

const eventBusMock = new EventBusServiceMock()
const queryMock = {
  graph: jest.fn(),
}

const productId = "prod_1"
const productId2 = "prod_2"
const variantId = "var_1"
const variantId2 = "var_2"
const priceSetId = "price_set_1"
const priceId = "money_amount_1"
const linkId = "link_id_1"

const dbUtils = TestDatabaseUtils.dbTestUtilFactory()

jest.setTimeout(300000)

let medusaAppLoader!: MedusaAppLoader
let index!: IndexTypes.IIndexService

const beforeAll_ = async ({
  clearDatabase = true,
}: { clearDatabase?: boolean } = {}) => {
  try {
    const config = await configLoader(
      path.join(__dirname, "./../__fixtures__"),
      "medusa-config"
    )

    console.log(`Creating database ${dbName}`)
    await dbUtils.create(dbName)
    dbUtils.pgConnection_ = await initDb()

    container.register({
      [ContainerRegistrationKeys.LOGGER]: asValue(logger),
      [ContainerRegistrationKeys.QUERY]: asValue(null),
      [ContainerRegistrationKeys.PG_CONNECTION]: asValue(dbUtils.pgConnection_),
    })

    medusaAppLoader = new MedusaAppLoader(container as any)

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

    index = container.resolve(Modules.INDEX)

    // Mock event bus  the index module
    ;(index as any).eventBusModuleService_ = eventBusMock

    await globalApp.onApplicationStart()
    await setTimeout(3000)
    ;(index as any).storageProvider_.query_ = queryMock

    if (clearDatabase) {
      await afterEach_()
    }
    return globalApp
  } catch (error) {
    console.error("Error initializing", error?.message)
    throw error
  }
}

const beforeEach_ = async () => {
  jest.clearAllMocks()

  try {
    await medusaAppLoader.runModulesLoader()
  } catch (error) {
    console.error("Error runner modules loaders", error?.message)
    throw error
  }
}

const afterEach_ = async () => {
  try {
    await dbUtils.teardown({ schema: "public" })
  } catch (error) {
    console.error("Error tearing down database:", error?.message)
    throw error
  }
}

describe("sync management API", function () {
  describe("server mode", function () {
    let medusaApp: MedusaAppOutput
    let onApplicationPrepareShutdown!: () => Promise<void>
    let onApplicationShutdown!: () => Promise<void>

    beforeAll(async () => {
      process.env.MEDUSA_WORKER_MODE = "server"
      medusaApp = await beforeAll_()
      onApplicationPrepareShutdown = medusaApp.onApplicationPrepareShutdown
      onApplicationShutdown = medusaApp.onApplicationShutdown
    })

    afterAll(async () => {
      if (onApplicationPrepareShutdown) {
        await onApplicationPrepareShutdown()
      }
      if (onApplicationShutdown) {
        await onApplicationShutdown()
      }
      await dbUtils.shutdown(dbName)
    })

    afterEach(afterEach_)

    let manager: EntityManager

    beforeEach(async () => {
      await beforeEach_()

      manager = (medusaApp.sharedContainer!.resolve(Modules.INDEX) as any)
        .container_.manager as EntityManager
    })

    afterEach(afterEach_)

    describe("getInfo", function () {
      it("should return detailed index metadata with last synced keys", async () => {
        const indexMetadataRepo = manager.getRepository(
          toMikroORMEntity(IndexMetadata)
        )
        const indexSyncRepo = manager.getRepository(toMikroORMEntity(IndexSync))

        await indexMetadataRepo.upsertMany([
          {
            id: "metadata_1",
            entity: "product",
            status: IndexMetadataStatus.DONE,
            fields: ["id", "title"].sort().join(","),
            fields_hash: "hash_1",
          },
          {
            id: "metadata_2",
            entity: "product_variant",
            status: IndexMetadataStatus.PENDING,
            fields: ["id", "sku"].sort().join(","),
            fields_hash: "hash_2",
          },
        ])

        await indexSyncRepo.upsertMany([
          {
            id: "sync_1",
            entity: "product",
            last_key: "prod_123",
          },
          {
            id: "sync_2",
            entity: "product_variant",
            last_key: null,
          },
        ])

        const info = await index.getInfo()

        expect(info).toHaveLength(2)
        expect(info).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: "metadata_1",
              entity: "product",
              status: IndexMetadataStatus.DONE,
              fields: ["id", "title"],
              last_synced_key: "prod_123",
            }),
            expect.objectContaining({
              id: "metadata_2",
              entity: "product_variant",
              status: IndexMetadataStatus.PENDING,
              fields: ["id", "sku"],
              last_synced_key: null,
            }),
          ])
        )
      })

      it("should return empty array when no metadata exists", async () => {
        const info = await index.getInfo()
        expect(info).toBeDefined()
        expect(info).toHaveLength(0)
      })

      it("should handle entities without sync records", async () => {
        const indexMetadataRepo = manager.getRepository(
          toMikroORMEntity(IndexMetadata)
        )

        await indexMetadataRepo.upsertMany([
          {
            id: "metadata_test_1",
            entity: "test_product",
            status: IndexMetadataStatus.DONE,
            fields: "id",
            fields_hash: "hash_1",
          },
        ])

        const info = await index.getInfo()

        expect(info).toBeDefined()
        expect(info).toHaveLength(1)
        expect(info[0]).toMatchObject({
          entity: "test_product",
          last_synced_key: null,
        })
      })
    })

    describe("sync with continue strategy", function () {
      it("should emit continue-sync event in server mode", async () => {
        jest.spyOn(eventBusMock, "emit")

        await index.sync({})

        expect(eventBusMock.emit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "index.continue-sync",
            data: {},
            options: { internal: true },
          })
        )
      })
    })

    describe("sync with full strategy", function () {
      it("should reset metadata statuses and last_key, then emit event", async () => {
        const indexMetadataRepo = manager.getRepository(
          toMikroORMEntity(IndexMetadata)
        )
        const indexSyncRepo = manager.getRepository(toMikroORMEntity(IndexSync))

        await indexMetadataRepo.upsertMany([
          {
            id: "test_metadata_1",
            entity: "test_product_full",
            status: IndexMetadataStatus.DONE,
            fields: "id",
            fields_hash: "hash_1",
          },
          {
            id: "test_metadata_2",
            entity: "test_variant_full",
            status: IndexMetadataStatus.ERROR,
            fields: "id",
            fields_hash: "hash_2",
          },
          {
            id: "test_metadata_3",
            entity: "test_price_full",
            status: IndexMetadataStatus.PROCESSING,
            fields: "id",
            fields_hash: "hash_3",
          },
        ])

        await indexSyncRepo.upsertMany([
          {
            id: "test_sync_1",
            entity: "test_product_full",
            last_key: "prod_123",
          },
          {
            id: "test_sync_2",
            entity: "test_variant_full",
            last_key: "var_456",
          },
        ])

        jest.spyOn(eventBusMock, "emit")

        await index.sync({ strategy: "full" })

        const testMetadata = (await indexMetadataRepo
          .getEntityManager()
          .fork()
          .find(toMikroORMEntity(IndexMetadata), {})) as IndexMetadata[]

        expect(testMetadata).toHaveLength(3)
        testMetadata.forEach((metadata) => {
          expect(metadata.status).toBe(IndexMetadataStatus.PENDING)
        })

        const testSync = (await indexSyncRepo
          .getEntityManager()
          .fork()
          .find(toMikroORMEntity(IndexSync), {})) as IndexSync[]

        testSync.forEach((sync) => {
          expect(sync.last_key).toBeNull()
        })

        expect(eventBusMock.emit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "index.full-sync",
            data: {},
            options: { internal: true },
          })
        )
      })

      it("should not reset PENDING status metadata", async () => {
        const indexMetadataRepo = manager.getRepository(
          toMikroORMEntity(IndexMetadata)
        )

        await indexMetadataRepo.upsertMany([
          {
            id: "test_pending_metadata",
            entity: "test_product_pending",
            status: IndexMetadataStatus.PENDING,
            fields: "id",
            fields_hash: "hash_1",
          },
        ])

        await index.sync({ strategy: "full" })

        const updatedMetadata = (await indexMetadataRepo
          .getEntityManager()
          .fork()
          .find(toMikroORMEntity(IndexMetadata), {})) as IndexMetadata[]

        expect(updatedMetadata[0].status).toBe(IndexMetadataStatus.PENDING)
      })
    })

    describe("sync with reset strategy", function () {
      it("should truncate all index tables and emit event", async () => {
        const indexDataRepo = manager.getRepository(toMikroORMEntity(IndexData))
        const indexRelationRepo = manager.getRepository(
          toMikroORMEntity(IndexRelation)
        )
        const indexMetadataRepo = manager.getRepository(
          toMikroORMEntity(IndexMetadata)
        )
        const indexSyncRepo = manager.getRepository(toMikroORMEntity(IndexSync))

        await indexDataRepo.upsertMany([
          {
            id: productId,
            name: "Product",
            data: { id: productId },
          },
        ])

        await indexMetadataRepo.upsertMany([
          {
            id: "metadata_1",
            entity: "product",
            status: IndexMetadataStatus.DONE,
            fields: ["id"],
            fields_hash: "hash_1",
          },
        ])

        await indexSyncRepo.upsertMany([
          {
            id: "sync_1",
            entity: "product",
            last_key: "prod_123",
          },
        ])

        jest.spyOn(eventBusMock, "emit")

        await index.sync({ strategy: "reset" })

        const indexData = await indexDataRepo
          .getEntityManager()
          .fork()
          .find(toMikroORMEntity(IndexData), {})
        const indexRelations = await indexRelationRepo
          .getEntityManager()
          .fork()
          .find(toMikroORMEntity(IndexRelation), {})
        const indexMetadata = await indexMetadataRepo
          .getEntityManager()
          .fork()
          .find(toMikroORMEntity(IndexMetadata), {})
        const indexSync = await indexSyncRepo
          .getEntityManager()
          .fork()
          .find(toMikroORMEntity(IndexSync), {})

        expect(indexData).toHaveLength(0)
        expect(indexRelations).toHaveLength(0)
        expect(indexMetadata).toHaveLength(0)
        expect(indexSync).toHaveLength(0)

        expect(eventBusMock.emit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "index.reset-sync",
            data: {},
            options: { internal: true },
          })
        )
      })

      it("should handle empty tables gracefully", async () => {
        await expect(index.sync({ strategy: "reset" })).resolves.not.toThrow()

        const indexData = await manager.find(toMikroORMEntity(IndexData), {})
        expect(indexData).toHaveLength(0)
      })
    })

    describe("sync strategy parameter validation", function () {
      it("should default to continue sync when no strategy provided", async () => {
        jest.spyOn(eventBusMock, "emit")

        await index.sync({})

        expect(eventBusMock.emit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "index.continue-sync",
          })
        )
      })

      it("should handle undefined strategy", async () => {
        jest.spyOn(eventBusMock, "emit")

        await index.sync({ strategy: undefined })

        expect(eventBusMock.emit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "index.continue-sync",
          })
        )
      })
    })
  })
})
