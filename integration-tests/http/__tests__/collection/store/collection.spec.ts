import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseCollection
    let baseCollection1
    let baseCollection2
    let storeHeaders

    beforeEach(async () => {
      const container = getContainer()
      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })
      await createAdminUser(dbConnection, adminHeaders, container)

      baseCollection = (
        await api.post(
          "/admin/collections",
          { title: "test-collection" },
          adminHeaders
        )
      ).data.collection

      baseCollection1 = (
        await api.post(
          "/admin/collections",
          { title: "test-collection1" },
          adminHeaders
        )
      ).data.collection

      baseCollection2 = (
        await api.post(
          "/admin/collections",
          { title: "test-collection2" },
          adminHeaders
        )
      ).data.collection
    })

    describe("/store/collections", () => {
      describe("/store/collections/:id", () => {
        it("gets collection", async () => {
          const response = await api.get(
            `/store/collections/${baseCollection.id}`,
            storeHeaders
          )

          expect(response.data.collection).toEqual(
            expect.objectContaining({
              id: baseCollection.id,
              created_at: expect.any(String),
              updated_at: expect.any(String),
            })
          )
        })
      })

      describe("/store/collections", () => {
        it("lists collections", async () => {
          const response = await api.get("/store/collections", storeHeaders)

          expect(response.data).toEqual({
            collections: [
              expect.objectContaining({
                id: baseCollection2.id,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
              expect.objectContaining({
                id: baseCollection1.id,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
              expect.objectContaining({
                id: baseCollection.id,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ],
            count: 3,
            limit: 10,
            offset: 0,
          })
        })
      })
    })
  },
})
