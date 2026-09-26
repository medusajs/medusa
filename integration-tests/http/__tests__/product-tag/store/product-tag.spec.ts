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
          "/admin/product-tags",
          {
            value: "test1",
            external_id: "ext-test-01",
          },
          adminHeaders
        )
      ).data.product_tag

      tag2 = (
        await api.post(
          "/admin/product-tags",
          {
            value: "test2",
          },
          adminHeaders
        )
      ).data.product_tag

      await dbUtils.snapshot()
    })

    describe("GET /store/product-tags", () => {
      it("returns a list of product tags", async () => {
        const res = await api.get("/store/product-tags", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_tags).toEqual(
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

      it("returns a list of product tags matching external_id search param", async () => {
        const res = await api.get(
          "/store/product-tags?external_id=ext-test-01",
          storeHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_tags.length).toEqual(1)
        expect(res.data.product_tags).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              value: "test1",
              external_id: "ext-test-01",
            }),
          ])
        )
      })

      it("returns a list of product tags matching free text search param", async () => {
        const res = await api.get("/store/product-tags?q=1", storeHeaders)

        expect(res.status).toEqual(200)
        expect(res.data.product_tags.length).toEqual(1)
        expect(res.data.product_tags).toEqual(
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
      const createTaggedProduct = async (title, status, tagId) =>
        (
          await api.post(
            "/admin/products",
            {
              title,
              status,
              tags: [{ id: tagId }],
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
        await createTaggedProduct("draft product", "draft", tag1.id)
        await createTaggedProduct("published product", "published", tag1.id)
      }

      const titlesOf = (tags, value) =>
        (tags.find((tag) => tag.value === value)?.products ?? [])
          .map((product) => product.title)
          .sort()

      it("does not expand unpublished products", async () => {
        await seed()

        const res = await api.get("/store/product-tags", storeHeaders)

        expect(res.status).toEqual(200)
        expect(titlesOf(res.data.product_tags, "test1")).toEqual([
          "published product",
        ])
      })

      it("does not expand unpublished products for explicitly requested fields", async () => {
        await seed()

        const res = await api.get(
          "/store/product-tags?fields=id,value,products.id,products.title",
          storeHeaders
        )

        expect(titlesOf(res.data.product_tags, "test1")).toEqual([
          "published product",
        ])
      })

      it("returns a tag whose products are all unpublished", async () => {
        await createTaggedProduct("draft product", "draft", tag2.id)

        const res = await api.get("/store/product-tags", storeHeaders)

        const tag = res.data.product_tags.find((t) => t.value === "test2")
        expect(tag).toBeDefined()
        expect(tag.products).toEqual([])
      })

      it("does not expose the variants of unpublished products", async () => {
        await seed()

        const res = await api.get(
          "/store/product-tags?fields=id,value,products.title,products.variants.sku",
          storeHeaders
        )

        expect(JSON.stringify(res.data)).not.toContain("draft product-sku")
        expect(JSON.stringify(res.data)).toContain("published product-sku")
      })
    })

    describe("GET /store/product-tags/:id", () => {
      it("does not expand unpublished products", async () => {
        await api.post(
          "/admin/products",
          {
            title: "draft product",
            status: "draft",
            tags: [{ id: tag1.id }],
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
          `/store/product-tags/${tag1.id}?fields=id,products.title`,
          storeHeaders
        )

        expect(res.status).toEqual(200)
        expect(res.data.product_tag.products).toEqual([])
      })
    })
  },
})
