import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { RemoteQueryFunction, SearchTypes } from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

process.env.ENABLE_SEARCH_MODULE = "true"

jest.setTimeout(120000)

/**
 * Covers GET /admin/products routing through `query.search` when the Search
 * Module holds a product index.
 *
 * The response body is deliberately identical on both paths, so nothing in it
 * can tell them apart. `query` is registered once with `asValue`, so the object
 * the request scope resolves is the one held below — spying on it is what
 * establishes which path ran. The data assertions then cover the consequences.
 *
 * The route does not predict what the engine can do: it attempts the search and
 * falls back to the database when that fails. So `search` being *called* is not
 * the same as it having served the response, and the cases below assert the rows
 * as well.
 *
 * The fixture index declares `id`, `title`, `handle` and `status`, with only
 * `title` searchable and only `title` sortable. Which filters and sorts the
 * engine can serve follows from that.
 */
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let searchModule: SearchTypes.ISearchModuleService
    let query: RemoteQueryFunction
    let searchSpy: jest.SpyInstance

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      searchModule = container.resolve(Modules.SEARCH)
      query = container.resolve(ContainerRegistrationKeys.QUERY)

      await searchModule.executeIndexMigrationPlan(
        await searchModule.createIndexMigrationPlan()
      )

      await api.post(
        "/admin/products",
        {
          title: "Zephyr Shirt",
          handle: "zephyr-shirt",
          status: "published",
          description: "Woven from quokkatoken fabric",
          options: [{ title: "Size", values: ["M"] }],
          variants: [
            {
              title: "M",
              sku: "ZEPHYR-M",
              options: { Size: "M" },
              prices: [{ currency_code: "usd", amount: 1000 }],
            },
          ],
        },
        adminHeaders
      )

      // Same matching title, different status — so a forwarded `status` filter
      // is observable: dropping it would return both.
      await api.post(
        "/admin/products",
        {
          title: "Zephyr Hat",
          handle: "zephyr-hat",
          status: "draft",
          options: [{ title: "Size", values: ["S"] }],
        },
        adminHeaders
      )

      await api.post(
        "/admin/products",
        {
          title: "Aurora Shoe",
          handle: "aurora-shoe",
          status: "published",
          options: [{ title: "Size", values: ["42"] }],
        },
        adminHeaders
      )

      await searchModule.reindex()
    })

    afterAll(() => {
      delete process.env.ENABLE_SEARCH_MODULE
    })

    beforeEach(() => {
      searchSpy = jest.spyOn(query, "search")
    })

    afterEach(() => {
      searchSpy.mockRestore()
    })

    const titles = (response: any) =>
      response.data.products.map((product: any) => product.title).sort()

    describe("GET /admin/products (search engine)", () => {
      it("goes through query.search, with the request's q and pagination", async () => {
        const response = await api.get("/admin/products?q=zephyr", adminHeaders)

        expect(response.status).toEqual(200)
        expect(searchSpy).toHaveBeenCalledTimes(1)
        expect(searchSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            entity: "product",
            filters: { q: "zephyr" },
            pagination: expect.objectContaining({ skip: 0, take: 50 }),
          })
        )
        expect(titles(response)).toEqual(["Zephyr Hat", "Zephyr Shirt"])
      })

      it("hydrates fields the index does not hold", async () => {
        const response = await api.get(
          "/admin/products?q=zephyr&status[]=published",
          adminHeaders
        )

        expect(response.data.products).toHaveLength(1)
        // The index holds only id, title, handle and status. Everything below
        // came from the expand through `query.graph`.
        expect(response.data.products[0]).toEqual(
          expect.objectContaining({
            title: "Zephyr Shirt",
            description: "Woven from quokkatoken fabric",
          })
        )
        expect(response.data.products[0].variants).toEqual([
          expect.objectContaining({
            sku: "ZEPHYR-M",
            prices: [expect.objectContaining({ amount: 1000 })],
          }),
        ])
      })

      it("applies a filter the index can serve, rather than dropping it", async () => {
        const response = await api.get(
          "/admin/products?q=zephyr&status[]=draft",
          adminHeaders
        )

        expect(searchSpy).toHaveBeenCalledTimes(1)
        expect(searchSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            filters: { q: "zephyr", status: ["draft"] },
          })
        )
        // Both products match "zephyr"; only one is a draft.
        expect(titles(response)).toEqual(["Zephyr Hat"])
        expect(response.data.count).toEqual(1)
      })

      it("serves a sort the index can order on", async () => {
        const response = await api.get(
          "/admin/products?q=zephyr&order=-title",
          adminHeaders
        )

        expect(searchSpy).toHaveBeenCalledTimes(1)
        expect(
          response.data.products.map((product: any) => product.title)
        ).toEqual(["Zephyr Shirt", "Zephyr Hat"])
      })

      it("only matches what the index declares searchable", async () => {
        // `description` is searchable in the database but is not on the index,
        // so the engine cannot match a token that only lives there.
        const response = await api.get(
          "/admin/products?q=quokkatoken",
          adminHeaders
        )

        expect(searchSpy).toHaveBeenCalledTimes(1)
        expect(response.data.products).toEqual([])
        expect(response.data.count).toEqual(0)
      })

      it("paginates on the engine's own count", async () => {
        const first = await api.get("/admin/products?q=zephyr&limit=1", adminHeaders)

        expect(first.status).toEqual(200)
        expect(first.data.products).toHaveLength(1)
        expect(first.data).toEqual(
          expect.objectContaining({ count: 2, offset: 0, limit: 1 })
        )

        const second = await api.get(
          "/admin/products?q=zephyr&limit=1&offset=1",
          adminHeaders
        )

        expect(second.data.products).toHaveLength(1)
        expect(second.data.offset).toEqual(1)
        expect(second.data.products[0].id).not.toEqual(
          first.data.products[0].id
        )
      })
    })

    describe("GET /admin/products (database fallback)", () => {
      it("falls back when a filter names a path the index does not hold", async () => {
        const response = await api.get(
          "/admin/products?q=zephyr&collection_id[]=pcol_does_not_exist",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        // Attempted, refused, and answered by the database — which applies the
        // filter, so nothing matches. Had the engine served it while dropping
        // the filter, both products would have come back.
        expect(searchSpy).toHaveBeenCalledTimes(1)
        expect(response.data.products).toEqual([])
      })

      it("falls back when the sort field is not sortable on the index", async () => {
        // `handle` is on the index, but filterable only.
        const response = await api.get(
          "/admin/products?q=zephyr&order=handle",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(titles(response)).toEqual(["Zephyr Hat", "Zephyr Shirt"])
      })

      it("still searches the database's own searchable fields when it falls back", async () => {
        // The index has no `description`, so only the database can match this.
        const response = await api.get(
          "/admin/products?q=quokkatoken&order=handle",
          adminHeaders
        )

        expect(titles(response)).toEqual(["Zephyr Shirt"])
      })

      it("does not go through query.search when there is no q", async () => {
        const response = await api.get("/admin/products", adminHeaders)

        expect(response.status).toEqual(200)
        expect(searchSpy).not.toHaveBeenCalled()
        expect(response.data.products).toHaveLength(3)
      })
    })
  },
})
