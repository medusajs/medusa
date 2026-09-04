import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createAdminUser,
  adminHeaders,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let tag1
    let tag2
    let publishableKey
    let storeHeaders

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })

      tag1 = (
        await api.post(
          "/admin/product-types",
          {
            value: "test1",
            external_id: "ext-test-01",
          },
          adminHeaders
        )
      ).data.product_type

      tag2 = (
        await api.post(
          "/admin/product-types",
          {
            value: "test2",
          },
          adminHeaders
        )
      ).data.product_type

      await dbUtils.snapshot()
    })

    describe("GET /store/product-types", () => {
      it("returns a list of product types", async () => {
        const res = await api.get("/store/product-types", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_types).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              value: "test1",
              external_id: "ext-test-01",
            }),
            expect.objectContaining({
              value: "test2",
            }),
          ])
        )
      })

      it("returns a list of product types matching external_id search param", async () => {
        const res = await api.get(
          "/store/product-types?external_id=ext-test-01",
          storeHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_types.length).toEqual(1)
        expect(res.data.product_types).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              value: "test1",
              external_id: "ext-test-01",
            }),
          ])
        )
      })

      it("returns a list of product types matching free text search param", async () => {
        const res = await api.get("/store/product-types?q=1", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_types.length).toEqual(1)
        expect(res.data.product_types).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              value: "test1",
              external_id: "ext-test-01",
            }),
          ])
        )
      })
    })

    describe("published products", () => {
      const createTypedProduct = async (title, status, typeId) =>
        (
          await api.post(
            "/admin/products",
            {
              title,
              status,
              type_id: typeId,
              options: [{ title: "size", values: ["one"] }],
              variants: [
                {
                  title: "one",
                  options: { size: "one" },
                  sku: `${title}-sku`,
                  prices: [{ currency_code: "usd", amount: 10 }],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

      const seed = async () => {
        await createTypedProduct("draft product", "draft", tag1.id)
        await createTypedProduct("published product", "published", tag1.id)
      }

      const titlesOf = (types, value) =>
        (types.find((type) => type.value === value)?.products ?? [])
          .map((product) => product.title)
          .sort()

      it("does not expand unpublished products", async () => {
        await seed()

        const res = await api.get("/store/product-types", storeHeaders)

        expect(res.status).toEqual(200)
        expect(titlesOf(res.data.product_types, "test1")).toEqual([
          "published product",
        ])
      })

      it("does not expand unpublished products for explicitly requested fields", async () => {
        await seed()

        const res = await api.get(
          "/store/product-types?fields=id,value,products.id,products.title",
          storeHeaders
        )

        expect(titlesOf(res.data.product_types, "test1")).toEqual([
          "published product",
        ])
      })

      it("returns a type whose products are all unpublished", async () => {
        await createTypedProduct("draft product", "draft", tag2.id)

        const res = await api.get("/store/product-types", storeHeaders)

        const type = res.data.product_types.find((t) => t.value === "test2")
        expect(type).toBeDefined()
        expect(type.products).toEqual([])
      })
    })

    describe("GET /store/product-types/:id", () => {
      it("does not expand unpublished products", async () => {
        await api.post(
          "/admin/products",
          {
            title: "draft product",
            status: "draft",
            type_id: tag1.id,
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

        const res = await api.get(
          `/store/product-types/${tag1.id}?fields=id,products.title`,
          storeHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_type.products).toEqual([])
      })
    })
  },
})
