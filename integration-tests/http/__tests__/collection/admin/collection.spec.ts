import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
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

    let shippingProfile

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      baseCollection = (
        await api.post(
          "/admin/collections",
          { title: "test-collection", external_id: "ext-collection-01" },
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

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "Test", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      baseProduct = (
        await api.post(
          "/admin/products",
          {
            title: "test-product",
            options: [{ title: "size", values: ["x", "l"] }],
            shipping_profile_id: shippingProfile.id,
          },
          adminHeaders
        )
      ).data.product

      baseProduct1 = (
        await api.post(
          "/admin/products",
          {
            title: "test-product1",
            options: [{ title: "size", values: ["x", "l"] }],
            shipping_profile_id: shippingProfile.id,
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
            external_id: "ext-collection-new",
          },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          collection: {
            id: expect.stringMatching(/^pcol_*/),
            title: "New collection",
            handle: "test-new-collection",
            external_id: "ext-collection-new",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            metadata: null,
          },
        })
      })

      it("lists collections", async () => {
        const response = await api.get("/admin/collections", adminHeaders)

        expect(response.data).toEqual(
          expect.objectContaining({
            count: 3,
            limit: 10,
            offset: 0,
            collections: expect.arrayContaining([
              {
                id: baseCollection.id,
                created_at: expect.any(String),
                external_id: "ext-collection-01",
                updated_at: expect.any(String),
                handle: "test-collection",
                metadata: null,
                title: "test-collection",
              },
              {
                id: baseCollection1.id,
                created_at: expect.any(String),
                external_id: null,
                updated_at: expect.any(String),
                handle: "test-collection1",
                metadata: null,
                title: "test-collection1",
              },
              {
                id: baseCollection2.id,
                created_at: expect.any(String),
                external_id: null,
                updated_at: expect.any(String),
                handle: "test-collection2",
                metadata: null,
                title: "test-collection2",
              },
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
              {
                id: baseCollection.id,
                created_at: expect.any(String),
                external_id: "ext-collection-01",
                updated_at: expect.any(String),
                handle: "test-collection",
                metadata: null,
                title: "test-collection",
              },
            ]),
          })
        )
      })

      it('filters collection by external_id', async () => {
        const response = await api.get(
          "/admin/collections?external_id=ext-collection-01",
          adminHeaders
        )

        expect(response.data).toEqual(
          expect.objectContaining({
            count: 1,
            collections: expect.arrayContaining([
              {
                id: baseCollection.id,
                created_at: expect.any(String),
                external_id: "ext-collection-01",
                updated_at: expect.any(String),
                handle: "test-collection",
                metadata: null,
                title: "test-collection",
              },
            ]),
          })
        )
      });
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
            collection: {
              id: expect.stringMatching(/^pcol_*/),
              title: "test collection creation",
              handle: "test-handle-creation",
              external_id: "ext-collection-01",
              created_at: expect.any(String),
              updated_at: expect.any(String),
              metadata: null,
            },
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
          { add: [baseProduct.id, baseProduct1.id] },
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

      it("should not remove products from collection when updating collection", async () => {
        const addProductsResponse = await api.post(
          `/admin/collections/${baseCollection.id}/products?fields=*products`,
          { add: [baseProduct.id, baseProduct1.id] },
          adminHeaders
        )

        expect(addProductsResponse.status).toEqual(200)
        expect(addProductsResponse.data.collection).toEqual(
          expect.objectContaining({
            id: baseCollection.id,
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

        const updateCollectionResponse = await api.post(
          `/admin/collections/${baseCollection.id}?fields=*products`,
          { title: "test collection update" },
          adminHeaders
        )

        expect(updateCollectionResponse.status).toEqual(200)
        expect(updateCollectionResponse.data.collection).toEqual(
          expect.objectContaining({
            title: "test collection update",
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
