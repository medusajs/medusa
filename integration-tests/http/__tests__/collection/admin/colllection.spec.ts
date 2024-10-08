import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  createAdminUser,
  adminHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseCollection
    let baseCollection1
    let baseCollection2

    let baseProduct
    let baseProduct1

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

      baseProduct = (
        await api.post(
          "/admin/products",
          {
            title: "test-product",
          },
          adminHeaders
        )
      ).data.product

      baseProduct1 = (
        await api.post(
          "/admin/products",
          {
            title: "test-product1",
          },
          adminHeaders
        )
      ).data.product
    })

    describe("/admin/collections", () => {
      it("creates a collection", async () => {
        const response = await api.post(
          "/admin/collections",
          {
            title: "New collection",
            handle: "test-new-collection",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual(
          expect.objectContaining({
            collection: expect.objectContaining({
              id: expect.stringMatching(/^pcol_*/),
              title: "New collection",
              handle: "test-new-collection",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          })
        )
      })

      it("lists collections", async () => {
        const response = await api.get("/admin/collections", adminHeaders)

        expect(response.data).toEqual(
          expect.objectContaining({
            count: 3,
            collections: expect.arrayContaining([
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
            ]),
          })
        )
      })

      it("filters collections by title", async () => {
        const response = await api.get(
          "/admin/collections?title=test-collection",
          adminHeaders
        )

        expect(response.data).toEqual(
          expect.objectContaining({
            count: 1,
            collections: expect.arrayContaining([
              expect.objectContaining({
                id: baseCollection.id,
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ]),
          })
        )
      })

      // BREAKING: There is no longer discount condition ID filtering for collections (test case: "returns a list of collections filtered by discount condition id")
    })

    describe("/admin/collections/:id", () => {
      it("updates a collection", async () => {
        const response = await api.post(
          `/admin/collections/${baseCollection.id}`,
          {
            title: "test collection creation",
            handle: "test-handle-creation",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual(
          expect.objectContaining({
            collection: expect.objectContaining({
              id: expect.stringMatching(/^pcol_*/),
              title: "test collection creation",
              handle: "test-handle-creation",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          })
        )
      })

      it("deletes a collection", async () => {
        const response = await api.delete(
          `/admin/collections/${baseCollection.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: baseCollection.id,
          object: "collection",
          deleted: true,
        })
      })

      it("gets collection", async () => {
        const response = await api.get(
          `/admin/collections/${baseCollection.id}`,
          adminHeaders
        )

        expect(response.data).toEqual(
          expect.objectContaining({
            collection: expect.objectContaining({
              id: baseCollection.id,
              created_at: expect.any(String),
              updated_at: expect.any(String),
            }),
          })
        )
      })

      // BREAKING: URL and payload changes for adding products to a collection (there is no more "batch" suffix)
      it("adds products to collection", async () => {
        const response = await api.post(
          `/admin/collections/${baseCollection.id}/products?fields=*products`,
          {
            add: [baseProduct.id, baseProduct1.id],
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.collection).toEqual(
          expect.objectContaining({
            id: baseCollection.id,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            products: expect.arrayContaining([
              expect.objectContaining({
                collection_id: baseCollection.id,
                title: "test-product",
              }),
              expect.objectContaining({
                collection_id: baseCollection.id,
                title: "test-product1",
              }),
            ]),
          })
        )
      })

      it("removes products from collection", async () => {
        await api.post(
          `/admin/collections/${baseCollection.id}/products`,
          {
            add: [baseProduct.id, baseProduct1.id],
          },
          adminHeaders
        )

        const response = await api.post(
          `/admin/collections/${baseCollection.id}/products?fields=*products`,
          {
            remove: [baseProduct1.id],
          },
          adminHeaders
        )

        expect(response.data.collection).toEqual(
          expect.objectContaining({
            id: baseCollection.id,
            products: [
              expect.objectContaining({
                collection_id: baseCollection.id,
                title: "test-product",
              }),
            ],
          })
        )

        expect(response.status).toEqual(200)
      })
    })
  },
})
