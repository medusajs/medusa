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
 * Covers POST /store/search, which runs the `SearchQuery` batch InstantSearch's
 * adapter posts against the indexes a middleware opted in, and only falls back
 * to `query.graph` for fields an index doesn't hold.
 *
 * The app under test opts in `product` only — see its `src/api/middlewares.ts`.
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
    let customer

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

      customer = (
        await api.post(
          "/admin/customers",
          {
            email: "wilhelmina@zephyr.test",
            first_name: "Wilhelmina",
            last_name: "Zephyr",
          },
          adminHeaders
        )
      ).data.customer

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
      await waitForIndexReady("customer")
    })

    const search = (body) => api.post("/store/search", body, storeHeaders)

    describe("POST /store/search", () => {
      it("returns one result per posted query, in order", async () => {
        const response = await search({
          queries: [
            { entity: "product", filters: { handle: "zephyr-shirt" } },
            { entity: "product", filters: { handle: "aurora-shoe" } },
          ],
        })

        expect(response.status).toEqual(200)
        expect(response.data.results).toHaveLength(2)
        expect(response.data.results[0].hits).toEqual([
          expect.objectContaining({
            id: shirt.id,
            document: expect.objectContaining({
              id: shirt.id,
              title: "Zephyr Shirt",
              handle: "zephyr-shirt",
            }),
          }),
        ])
        expect(response.data.results[1].hits).toEqual([
          expect.objectContaining({ id: shoe.id }),
        ])
        expect(response.data.results[0].metadata).toEqual(
          expect.objectContaining({ skip: 0, take: 20 })
        )
      })

      it("accepts a single query outside of a batch", async () => {
        const response = await search({
          entity: "product",
          filters: { handle: "zephyr-shirt" },
        })

        expect(response.status).toEqual(200)
        expect(response.data.results).toHaveLength(1)
        expect(response.data.results[0].hits).toEqual([
          expect.objectContaining({ id: shirt.id }),
        ])
      })

      it("404s on a registered index the store hasn't opted in", async () => {
        // The index is real and holds the customer, as the admin search shows.
        const listed = await api.get(
          "/admin/search?q=wilhelmina&entity=customer",
          adminHeaders
        )
        expect(listed.data.results[0].data).toEqual([
          expect.objectContaining({ id: customer.id }),
        ])

        // Only `product` is passed to `allowSearchIndexes`, and an index the
        // store hasn't exposed is answered like one that doesn't exist.
        const error = await search({
          queries: [{ entity: "customer" }],
        }).catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toEqual(
          'No search index named "customer"'
        )
      })

      it("404s on an index that isn't registered", async () => {
        const error = await search({
          queries: [{ entity: "nope" }],
        }).catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toEqual(
          'No search index named "nope"'
        )
      })

      it("applies no filters of its own", async () => {
        const response = await search({
          queries: [{ entity: "product", filters: { q: "zephyr" } }],
        })

        expect(response.status).toEqual(200)
        // The draft and the product living in another sales channel both come
        // back: narrowing what a storefront may reach is the store's to add,
        // through a middleware on the route.
        expect(
          response.data.results[0].hits.map((hit) => hit.id).sort()
        ).toEqual([shirt.id, draft.id, hidden.id].sort())
      })

      it("hydrates fields the index doesn't hold", async () => {
        const response = await search({
          queries: [
            {
              entity: "product",
              filters: { handle: "zephyr-shirt" },
              // Dotted `query.graph` paths, not the `*relation` shorthand the
              // `fields` query param takes.
              fields: ["id", "title", "description", "variants.*"],
            },
          ],
        })

        expect(response.status).toEqual(200)
        expect(response.data.results[0].hits).toEqual([
          expect.objectContaining({
            id: shirt.id,
            document: expect.objectContaining({
              id: shirt.id,
              title: "Zephyr Shirt",
              // Neither of these is on the index.
              description: "A shirt for windy days",
              variants: [expect.objectContaining({ sku: "ZEPHYR-M" })],
            }),
          }),
        ])
      })

      it("filters on the index' own fields", async () => {
        const response = await search({
          queries: [{ entity: "product", filters: { handle: "aurora-shoe" } }],
        })

        expect(response.status).toEqual(200)
        expect(response.data.results[0].hits).toEqual([
          expect.objectContaining({ id: shoe.id }),
        ])
      })

      it("sorts and paginates", async () => {
        const first = await search({
          queries: [
            {
              entity: "product",
              pagination: { take: 1, order: { title: "ASC" } },
            },
          ],
        })

        expect(first.data.results[0].hits).toEqual([
          expect.objectContaining({
            document: expect.objectContaining({ title: "Aurora Shoe" }),
          }),
        ])
        expect(first.data.results[0].metadata.take).toEqual(1)

        const second = await search({
          queries: [
            {
              entity: "product",
              pagination: { skip: 1, take: 1, order: { title: "ASC" } },
            },
          ],
        })

        expect(second.data.results[0].hits).toEqual([
          expect.objectContaining({
            document: expect.objectContaining({ title: "Zephyr Draft" }),
          }),
        ])
        expect(second.data.results[0].metadata.skip).toEqual(1)
      })

      it("returns the facets a query asks for", async () => {
        const response = await search({
          queries: [
            {
              entity: "product",
              search_options: { facets: [{ field: "status", type: "value" }] },
            },
          ],
        })

        expect(response.status).toEqual(200)
        expect(response.data.results[0].facets.status).toEqual({
          type: "value",
          values: expect.arrayContaining([
            { value: "published", count: 3 },
            { value: "draft", count: 1 },
          ]),
        })
      })

      it("rejects an unknown search option", async () => {
        const error = await search({
          queries: [
            {
              entity: "product",
              search_options: { provider_options: { "search-medusa": {} } },
            },
          ],
        }).catch((e) => e)

        expect(error.response.status).toEqual(400)
      })
    })
  },
})
