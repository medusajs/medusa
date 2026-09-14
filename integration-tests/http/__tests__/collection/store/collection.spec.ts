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
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let baseCollection
    let baseCollection1
    let baseCollection2
    let storeHeaders

    beforeAll(async () => {
      const container = getContainer()
      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })
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

      await dbUtils.snapshot()
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
              external_id: "ext-collection-01",
              created_at: expect.any(String),
              updated_at: expect.any(String),
            })
          )
        })
      })

      describe("/store/collections", () => {
        it("lists collections matching external_id search param", async () => {
          const response = await api.get(
            "/store/collections?external_id=ext-collection-01",
            storeHeaders
          )

          expect(response.data).toEqual({
            collections: [
              expect.objectContaining({
                id: baseCollection.id,
                external_id: "ext-collection-01",
                created_at: expect.any(String),
                updated_at: expect.any(String),
              }),
            ],
            count: 1,
            limit: 10,
            offset: 0,
          })
        })

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
                external_id: "ext-collection-01",
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

    describe("published products", () => {
      const seed = async (collectionId) => {
        const create = async (title, status) =>
          (
            await api.post(
              "/admin/products",
              {
                title,
                status,
                options: [{ title: "size", values: ["one"] }],
                variants: [
                  {
                    title: "one",
                    options: { size: "one" },
                    prices: [{ currency_code: "usd", amount: 10 }],
                  },
                ],
              },
              adminHeaders
            )
          ).data.product

        const draft = await create("draft product", "draft")
        const published = await create("published product", "published")

        await api.post(
          `/admin/collections/${collectionId}/products`,
          { add: [draft.id, published.id] },
          adminHeaders
        )
      }

      const titlesOf = (collection) =>
        (collection?.products ?? []).map((product) => product.title).sort()

      it("does not expand unpublished products on a collection", async () => {
        await seed(baseCollection.id)

        const response = await api.get(
          `/store/collections/${baseCollection.id}?fields=id,products.title`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(titlesOf(response.data.collection)).toEqual([
          "published product",
        ])
      })

      it("does not expand unpublished products when listing collections", async () => {
        await seed(baseCollection.id)

        const response = await api.get(
          "/store/collections?fields=id,title,products.title",
          storeHeaders
        )

        const collection = response.data.collections.find(
          (c) => c.id === baseCollection.id
        )
        expect(titlesOf(collection)).toEqual(["published product"])
      })
    })
  },
})
