import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  createAdminUser,
  adminHeaders,
} from "../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: { MEDUSA_FF_PRODUCT_CATEGORIES: true },
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseCollection
    let baseCollection1
    let baseCollection2

    beforeEach(async () => {
      const container = getContainer()
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
            `/store/collections/${baseCollection.id}`
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
          const response = await api.get("/store/collections")

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
