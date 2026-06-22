import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import { setTimeout } from "timers/promises"

process.env.ENABLE_INDEX_MODULE = "true"

jest.setTimeout(300000)

const truncateIndexTables = async (dbConnection: {
  raw: (sql: string) => Promise<unknown>
}) => {
  await dbConnection.raw(
    `TRUNCATE TABLE "index_data", "index_relation", "index_metadata", "index_sync" RESTART IDENTITY CASCADE`
  )
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let container

    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      await dbUtils.snapshot()
    })

    afterAll(() => {
      delete process.env.ENABLE_INDEX_MODULE
    })

    describe("Admin Index API", () => {
      describe("GET /admin/index/details", () => {
        it("should return index information with metadata", async () => {
          await setTimeout(3000)

          const response = await api.get(`/admin/index/details`, adminHeaders)

          expect(response.status).toEqual(200)
          expect(response.data).toHaveProperty("metadata")
          expect(response.data.metadata.length).toBe(7)

          // Verify all expected entities are present with correct structure
          const entities = [
            "Product",
            "ProductVariant",
            "LinkProductVariantPriceSet",
            "Price",
            "SalesChannel",
            "LinkProductSalesChannel",
            "PriceSet",
          ]

          entities.forEach((entityName) => {
            const entityMetadata = response.data.metadata.find(
              (m) => m.entity === entityName
            )
            expect(entityMetadata).toBeDefined()
            expect(entityMetadata).toMatchObject({
              id: expect.any(String),
              entity: entityName,
              status: expect.stringMatching(/^(pending|processing|done)$/),
              fields: expect.any(Array),
              updated_at: expect.any(String),
            })
            expect(entityMetadata).toHaveProperty("last_synced_key")
          })

          // Verify specific field structures for key entities
          const productMetadata = response.data.metadata.find(
            (m) => m.entity === "Product"
          )
          expect(productMetadata.fields).toEqual(
            expect.arrayContaining(["id", "title", "handle", "status"])
          )

          const variantMetadata = response.data.metadata.find(
            (m) => m.entity === "ProductVariant"
          )
          expect(variantMetadata.fields).toEqual(
            expect.arrayContaining(["id", "product_id", "sku"])
          )
        })

        describe("POST /admin/index/sync", () => {
          it("should trigger sync with default strategy (continue)", async () => {
            const response = await api.post(
              `/admin/index/sync`,
              {},
              adminHeaders
            )

            expect(response.status).toEqual(200)
          })

          it("should trigger sync with full strategy", async () => {
            const response = await api.post(
              `/admin/index/sync`,
              { strategy: "full" },
              adminHeaders
            )

            expect(response.status).toEqual(200)
          })

          it("should trigger sync with reset strategy", async () => {
            const response = await api.post(
              `/admin/index/sync`,
              { strategy: "reset" },
              adminHeaders
            )

            expect(response.status).toEqual(200)
          })

          it("should reject invalid strategy", async () => {
            const response = await api
              .post(`/admin/index/sync`, { strategy: "invalid" }, adminHeaders)
              .catch((e) => e)

            expect(response.response.status).toEqual(400)
          })

          it("should sync and reflect in metadata status", async () => {
            await truncateIndexTables(dbConnection)

            const syncResponsePromise = api.post(
              `/admin/index/sync`,
              { strategy: "full" },
              adminHeaders
            )
            const updatedResponse = await api.get(
              `/admin/index/details`,
              adminHeaders
            )

            const syncResponse = await syncResponsePromise
            expect(syncResponse.status).toEqual(200)
            expect(updatedResponse.status).toEqual(200)

            if (updatedResponse.data.metadata.length > 0) {
              const hashedMetadataWithStatusPending =
                updatedResponse.data.metadata.some(
                  (m) => m.status === "pending"
                )
              expect(hashedMetadataWithStatusPending).toBe(true)
            }
          })

          it("should reset index and clear all data", async () => {
            await truncateIndexTables(dbConnection)

            const syncResponsePromise = api.post(
              `/admin/index/sync`,
              { strategy: "reset" },
              adminHeaders
            )
            const response = await api.get(`/admin/index/details`, adminHeaders)

            const syncResponse = await syncResponsePromise
            expect(syncResponse.status).toEqual(200)
            expect(response.status).toEqual(200)

            const metadata = response.data.metadata
            metadata.forEach((m) => {
              expect(["pending", "processing"]).toContain(m.status)
            })
          })
        })
      })
    })
  },
})
