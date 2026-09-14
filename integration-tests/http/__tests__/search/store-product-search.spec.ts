import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { SearchTypes } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../helpers/create-admin-user"

jest.setTimeout(120000)

/**
 * Covers GET /store/products/search, which serves the product index directly
 * and only falls back to `query.graph` for fields the index doesn't hold.
 */
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let searchModule: SearchTypes.ISearchModuleService
    let storeHeaders
    let salesChannel
    let otherSalesChannel
    let shirt
    let shoe
    let draft
    let hidden

    const createProduct = async (data) => {
      const response = await api.post("/admin/products", data, adminHeaders)
      return response.data.product
    }

    const createSalesChannel = async (name, productIds) => {
      const { data } = await api.post(
        "/admin/sales-channels",
        { name },
        adminHeaders
      )

      await api.post(
        `/admin/sales-channels/${data.sales_channel.id}/products`,
        { add: productIds },
        adminHeaders
      )

      return data.sales_channel
    }

    const waitForIndexReady = async (name: string) => {
      const deadline = Date.now() + 10000
      while (Date.now() < deadline) {
        const listed = await api.get("/admin/search-indexes", adminHeaders)
        const index = listed.data.search_indexes.find((i) => i.name === name)
        if (index?.status === "ready") {
          return index
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      throw new Error(`Index "${name}" did not become ready in time`)
    }

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      searchModule = container.resolve(Modules.SEARCH)

      shirt = await createProduct({
        title: "Zephyr Shirt",
        handle: "zephyr-shirt",
        description: "A shirt for windy days",
        status: "published",
        options: [{ title: "Size", values: ["M"] }],
        variants: [
          {
            title: "Medium",
            sku: "ZEPHYR-M",
            options: { Size: "M" },
            prices: [{ amount: 20, currency_code: "usd" }],
          },
        ],
      })

      shoe = await createProduct({
        title: "Aurora Shoe",
        handle: "aurora-shoe",
        description: "A shoe for long walks",
        status: "published",
        options: [{ title: "Size", values: ["42"] }],
      })

      draft = await createProduct({
        title: "Zephyr Draft",
        handle: "zephyr-draft",
        status: "draft",
        options: [{ title: "Size", values: ["M"] }],
      })

      hidden = await createProduct({
        title: "Zephyr Elsewhere",
        handle: "zephyr-elsewhere",
        status: "published",
        options: [{ title: "Size", values: ["M"] }],
      })

      salesChannel = await createSalesChannel("Web", [
        shirt.id,
        shoe.id,
        draft.id,
      ])
      otherSalesChannel = await createSalesChannel("Retail", [hidden.id])

      const publishableKey = await generatePublishableKey(container)
      await api.post(
        `/admin/api-keys/${publishableKey.id}/sales-channels`,
        { add: [salesChannel.id] },
        adminHeaders
      )
      storeHeaders = generateStoreHeaders({ publishableKey })

      // The sales channel links landed after the products were ingested off
      // their creation events, so the index is rebuilt from the seed.
      await searchModule.reindex()
      await waitForIndexReady("product")
    })

    describe("GET /store/products/search", () => {
      it("returns the index' fields for a free-text query", async () => {
        const response = await api.get(
          "/store/products/search?q=zephyr",
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.products).toEqual([
          expect.objectContaining({
            id: shirt.id,
            title: "Zephyr Shirt",
            handle: "zephyr-shirt",
          }),
        ])
        expect(response.data.offset).toEqual(0)
        expect(response.data.limit).toEqual(20)
      })

      it("only returns published products in the key's sales channels", async () => {
        const response = await api.get("/store/products/search", storeHeaders)

        expect(response.status).toEqual(200)
        // The draft and the product that only lives in the other sales
        // channel are both filtered out by the engine.
        expect(response.data.products.map((p) => p.id).sort()).toEqual(
          [shirt.id, shoe.id].sort()
        )
      })

      it("rejects a sales channel the publishable key isn't scoped to", async () => {
        const error = await api
          .get(
            `/store/products/search?sales_channel_id=${otherSalesChannel.id}`,
            storeHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
      })

      it("hydrates fields the index doesn't hold", async () => {
        const response = await api.get(
          "/store/products/search?q=zephyr&fields=id,title,description,*variants",
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.products).toEqual([
          expect.objectContaining({
            id: shirt.id,
            title: "Zephyr Shirt",
            // Neither of these is on the index.
            description: "A shirt for windy days",
            variants: [expect.objectContaining({ sku: "ZEPHYR-M" })],
          }),
        ])
      })

      it("filters by handle", async () => {
        const response = await api.get(
          `/store/products/search?handle=aurora-shoe`,
          storeHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.products).toEqual([
          expect.objectContaining({ id: shoe.id }),
        ])
      })

      it("sorts and paginates", async () => {
        const first = await api.get(
          "/store/products/search?order=title&limit=1",
          storeHeaders
        )

        expect(first.data.products).toEqual([
          expect.objectContaining({ title: "Aurora Shoe" }),
        ])
        expect(first.data.limit).toEqual(1)

        const second = await api.get(
          "/store/products/search?order=title&limit=1&offset=1",
          storeHeaders
        )

        expect(second.data.products).toEqual([
          expect.objectContaining({ title: "Zephyr Shirt" }),
        ])
        expect(second.data.offset).toEqual(1)
      })
    })
  },
})
