import { InferEntityType } from "@medusajs/framework/types"
import { toMikroORMEntity } from "@medusajs/framework/utils"
import { IndexData, IndexRelation } from "@models"
import { DataSynchronizer } from "../../src/services/data-synchronizer"
import {
  createIndexTestBed,
  IndexModuleTestBed,
  schema,
} from "../__fixtures__"

jest.setTimeout(300000)

const testProductId = "test_prod_1"
const testProductId2 = "test_prod_2"
const testVariantId = "test_var_1"
const testVariantId2 = "test_var_2"

type Acknowledgement = {
  lastCursor: string | null
  done?: boolean
  err?: Error
}

describe("DataSynchronizer", () => {
  let testBed: IndexModuleTestBed
  let dataSynchronizer: DataSynchronizer
  let acknowledgements: Acknowledgement[]

  const ack = async (acknowledgement: Acknowledgement) => {
    acknowledgements.push(acknowledgement)
  }

  beforeAll(async () => {
    testBed = await createIndexTestBed({ schema })
    dataSynchronizer = testBed.container.resolve("dataSynchronizer")
  })

  afterAll(async () => {
    await testBed.teardown()
  })

  beforeEach(async () => {
    await testBed.truncateTables()
    testBed.query.reset()
    acknowledgements = []

    testBed.query
      .seed("product", [
        { id: testProductId, title: "Test Product" },
        { id: testProductId2, title: "Test Product" },
      ])
      .seed("product_variant", [
        {
          id: testVariantId,
          sku: "test-variant-1",
          product: { id: testProductId },
        },
        {
          id: testVariantId2,
          sku: "test-variant-2",
          product: { id: testProductId2 },
        },
      ])
  })

  describe("sync", () => {
    it("should sync products data correctly, paginating with a cursor", async () => {
      const result = await dataSynchronizer.syncEntity({
        entityName: "Product",
        pagination: { batchSize: 1 },
        ack,
      })

      expect(testBed.query.calls).toEqual([
        // First loop fetching the product ids
        {
          entity: "product",
          fields: ["id"],
          filters: {},
          pagination: {
            order: {
              id: "asc",
            },
            take: 1,
          },
        },
        // Fetching the configured product fields for creation through the storage provider
        {
          entity: "product",
          filters: {
            id: [testProductId],
          },
          fields: expect.arrayContaining(["id", "created_at", "title"]),
        },
        // Second loop fetching the product ids after the cursor
        {
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
            take: 1,
          },
        },
        {
          entity: "product",
          filters: {
            id: [testProductId2],
          },
          fields: expect.arrayContaining(["id", "created_at", "title"]),
        },
        // Last loop returns no data and ends the sync
        {
          entity: "product",
          fields: ["id"],
          filters: {
            id: {
              $gt: testProductId2,
            },
          },
          pagination: {
            order: {
              id: "asc",
            },
            take: 1,
          },
        },
      ])

      expect(acknowledgements).toEqual([
        { lastCursor: testProductId },
        { lastCursor: testProductId2 },
        { lastCursor: testProductId2, done: true },
      ])

      expect(result).toEqual({
        lastCursor: testProductId2,
        done: true,
      })

      const manager = testBed.forkManager()

      const indexData: InferEntityType<typeof IndexData>[] = await manager.find(
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

    it("should sync products and product variants data correctly", async () => {
      await dataSynchronizer.syncEntity({
        entityName: "Product",
        pagination: { batchSize: 1 },
        ack,
      })

      acknowledgements = []
      testBed.query.calls = []

      const result = await dataSynchronizer.syncEntity({
        entityName: "ProductVariant",
        pagination: { batchSize: 1 },
        ack,
      })

      expect(testBed.query.calls).toEqual([
        {
          entity: "product_variant",
          fields: ["id"],
          filters: {},
          pagination: {
            order: {
              id: "asc",
            },
            take: 1,
          },
        },
        {
          entity: "product_variant",
          filters: {
            id: [testVariantId],
          },
          fields: expect.arrayContaining([
            "id",
            "product.id",
            "product_id",
            "sku",
          ]),
        },
        {
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
            take: 1,
          },
        },
        {
          entity: "product_variant",
          filters: {
            id: [testVariantId2],
          },
          fields: expect.arrayContaining([
            "id",
            "product.id",
            "product_id",
            "sku",
          ]),
        },
        {
          entity: "product_variant",
          fields: ["id"],
          filters: {
            id: {
              $gt: testVariantId2,
            },
          },
          pagination: {
            order: {
              id: "asc",
            },
            take: 1,
          },
        },
      ])

      expect(acknowledgements).toEqual([
        { lastCursor: testVariantId },
        { lastCursor: testVariantId2 },
        { lastCursor: testVariantId2, done: true },
      ])

      expect(result).toEqual({
        lastCursor: testVariantId2,
        done: true,
      })

      const manager = testBed.forkManager()

      const indexData: InferEntityType<typeof IndexData>[] = await manager.find(
        toMikroORMEntity(IndexData),
        {}
      )
      const indexRelationData: InferEntityType<typeof IndexRelation>[] =
        await manager.find(toMikroORMEntity(IndexRelation), {})

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

    it("should skip entities that do not belong to any module", async () => {
      const result = await dataSynchronizer.syncEntity({
        entityName: "InternalNested",
        ack,
      })

      expect(result).toEqual({ lastCursor: null, done: true })
      expect(acknowledgements).toEqual([result])
      expect(testBed.query.calls).toHaveLength(0)
    })
  })
})
