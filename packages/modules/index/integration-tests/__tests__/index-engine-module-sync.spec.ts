import { InferEntityType } from "@medusajs/framework/types"
import { toMikroORMEntity } from "@medusajs/framework/utils"
import { IndexData, IndexMetadata, IndexRelation, IndexSync } from "@models"
import { IndexMetadataStatus } from "@utils"
import {
  createIndexTestBed,
  IndexModuleTestBed,
  schema,
} from "../__fixtures__"

jest.setTimeout(300000)

const productId = "prod_1"

describe("sync management API", function () {
  describe("server mode", function () {
    let testBed: IndexModuleTestBed

    beforeAll(async () => {
      testBed = await createIndexTestBed({ schema, workerMode: "server" })
    })

    afterAll(async () => {
      await testBed.teardown()
    })

    beforeEach(async () => {
      await testBed.truncateTables()
      testBed.eventBus.reset()
    })

    describe("getInfo", function () {
      it("should return detailed index metadata with last synced keys", async () => {
        const manager = testBed.forkManager()
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

        const info = await testBed.module.getInfo()

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
        const info = await testBed.module.getInfo()
        expect(info).toBeDefined()
        expect(info).toHaveLength(0)
      })

      it("should handle entities without sync records", async () => {
        const indexMetadataRepo = testBed
          .forkManager()
          .getRepository(toMikroORMEntity(IndexMetadata))

        await indexMetadataRepo.upsertMany([
          {
            id: "metadata_test_1",
            entity: "test_product",
            status: IndexMetadataStatus.DONE,
            fields: "id",
            fields_hash: "hash_1",
          },
        ])

        const info = await testBed.module.getInfo()

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
        await testBed.module.sync({})

        expect(testBed.eventBus.emitted).toEqual([
          expect.objectContaining({
            name: "index.continue-sync",
            data: {},
            options: { internal: true },
          }),
        ])
      })
    })

    describe("sync with full strategy", function () {
      it("should reset metadata statuses and last_key, then emit event", async () => {
        const manager = testBed.forkManager()
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

        await testBed.module.sync({ strategy: "full" })

        const testMetadata: InferEntityType<typeof IndexMetadata>[] =
          await testBed.forkManager().find(toMikroORMEntity(IndexMetadata), {})

        expect(testMetadata).toHaveLength(3)
        testMetadata.forEach((metadata) => {
          expect(metadata.status).toBe(IndexMetadataStatus.PENDING)
        })

        const testSync: InferEntityType<typeof IndexSync>[] = await testBed
          .forkManager()
          .find(toMikroORMEntity(IndexSync), {})

        testSync.forEach((sync) => {
          expect(sync.last_key).toBeNull()
        })

        expect(testBed.eventBus.emitted).toEqual([
          expect.objectContaining({
            name: "index.full-sync",
            data: {},
            options: { internal: true },
          }),
        ])
      })

      it("should not reset PENDING status metadata", async () => {
        const indexMetadataRepo = testBed
          .forkManager()
          .getRepository(toMikroORMEntity(IndexMetadata))

        await indexMetadataRepo.upsertMany([
          {
            id: "test_pending_metadata",
            entity: "test_product_pending",
            status: IndexMetadataStatus.PENDING,
            fields: "id",
            fields_hash: "hash_1",
          },
        ])

        await testBed.module.sync({ strategy: "full" })

        const updatedMetadata: InferEntityType<typeof IndexMetadata>[] =
          await testBed.forkManager().find(toMikroORMEntity(IndexMetadata), {})

        expect(updatedMetadata[0].status).toBe(IndexMetadataStatus.PENDING)
      })
    })

    describe("sync with reset strategy", function () {
      it("should truncate all index tables and emit event", async () => {
        const manager = testBed.forkManager()
        const indexDataRepo = manager.getRepository(toMikroORMEntity(IndexData))
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
            fields: "id",
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

        await testBed.module.sync({ strategy: "reset" })

        const freshManager = testBed.forkManager()
        const indexData = await freshManager.find(
          toMikroORMEntity(IndexData),
          {}
        )
        const indexRelations = await freshManager.find(
          toMikroORMEntity(IndexRelation),
          {}
        )
        const indexMetadata = await freshManager.find(
          toMikroORMEntity(IndexMetadata),
          {}
        )
        const indexSync = await freshManager.find(
          toMikroORMEntity(IndexSync),
          {}
        )

        expect(indexData).toHaveLength(0)
        expect(indexRelations).toHaveLength(0)
        expect(indexMetadata).toHaveLength(0)
        expect(indexSync).toHaveLength(0)

        expect(testBed.eventBus.emitted).toEqual([
          expect.objectContaining({
            name: "index.reset-sync",
            data: {},
            options: { internal: true },
          }),
        ])
      })

      it("should handle empty tables gracefully", async () => {
        await expect(
          testBed.module.sync({ strategy: "reset" })
        ).resolves.not.toThrow()

        const indexData = await testBed
          .forkManager()
          .find(toMikroORMEntity(IndexData), {})
        expect(indexData).toHaveLength(0)
      })
    })

    describe("sync strategy parameter validation", function () {
      it("should default to continue sync when no strategy provided", async () => {
        await testBed.module.sync({})

        expect(testBed.eventBus.emitted).toEqual([
          expect.objectContaining({
            name: "index.continue-sync",
          }),
        ])
      })

      it("should handle undefined strategy", async () => {
        await testBed.module.sync({ strategy: undefined })

        expect(testBed.eventBus.emitted).toEqual([
          expect.objectContaining({
            name: "index.continue-sync",
          }),
        ])
      })

      it("should reject an invalid strategy", async () => {
        await expect(
          testBed.module.sync({ strategy: "invalid" as any })
        ).rejects.toThrow(`Invalid sync strategy: invalid`)

        expect(testBed.eventBus.emitted).toHaveLength(0)
      })
    })
  })
})
