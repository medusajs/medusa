import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { SearchTypes } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(120000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let searchModule: SearchTypes.ISearchModuleService

    const groupFor = (data: any, entity: string) =>
      data.results.find((group) => group.entity === entity)

    // Reindexing runs in the background, so tests that trigger it have to
    // poll for completion rather than assume it's done when the request
    // returns.
    const waitForIndexReady = async (name: string) => {
      const deadline = Date.now() + 10000
      while (Date.now() < deadline) {
        const listed = await api.get("/admin/search-indexes", adminHeaders)
        const index = listed.data.search_indexes.find(
          (i: any) => i.name === name
        )
        if (index?.status === "ready") {
          return index
        }
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      throw new Error(`Index "${name}" did not become ready in time`)
    }

    const indexNamed = async (name: string) => {
      const listed = await api.get("/admin/search-indexes", adminHeaders)
      return listed.data.search_indexes.find((i: any) => i.name === name)
    }

    const planFor = async (name: string) => {
      const plan = await searchModule.createIndexMigrationPlan()
      return plan.find((action) => action.index === name)
    }

    // Soft deleted rows included — what a delete must leave behind is nothing.
    const rowCounts = async (name: string) => {
      const { rows } = await dbConnection.raw(
        `select
           (select count(*) from search_index where name = ?) as indexes,
           (select count(*) from search_index_version v
              join search_index i on i.id = v.search_index_id
             where i.name = ?) as versions,
           (select count(*) from search_index_sync s
              join search_index_version v on v.id = s.search_index_version_id
              join search_index i on i.id = v.search_index_id
             where i.name = ?) as syncs`,
        [name, name, name]
      )

      return {
        indexes: Number(rows[0].indexes),
        versions: Number(rows[0].versions),
        syncs: Number(rows[0].syncs),
      }
    }

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      searchModule = container.resolve(Modules.SEARCH)

      await api.post(
        "/admin/products",
        {
          title: "Zephyr Shirt",
          handle: "zephyr-shirt",
          status: "published",
          options: [{ title: "Size", values: ["M"] }],
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

      await api.post(
        "/admin/customers",
        {
          email: "zephyr.tester@example.com",
          first_name: "Zephyr",
          last_name: "Tester",
        },
        adminHeaders
      )

      await api.post(
        "/admin/customers",
        {
          email: "aurora.buyer@example.com",
          first_name: "Aurora",
          last_name: "Buyer",
        },
        adminHeaders
      )

      // Fills both indexes from their seeds. Ingestion has already indexed the
      // products off their events; rebuilding is idempotent and covers the
      // customer index, which declares no events.
      await searchModule.reindex()
    })

    describe("GET /admin/search", () => {
      it("searches every indexed entity and groups the results", async () => {
        const response = await api.get("/admin/search?q=zephyr", adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.results.map((g) => g.entity).sort()).toEqual([
          "customer",
          "product",
        ])

        expect(groupFor(response.data, "product").data).toEqual([
          expect.objectContaining({
            title: "Zephyr Shirt",
            handle: "zephyr-shirt",
            status: "published",
          }),
        ])

        expect(groupFor(response.data, "customer").data).toEqual([
          expect.objectContaining({
            email: "zephyr.tester@example.com",
            first_name: "Zephyr",
          }),
        ])
      })

      it("returns a group with no hits rather than dropping the entity", async () => {
        const response = await api.get("/admin/search?q=shoe", adminHeaders)

        expect(response.status).toEqual(200)
        expect(groupFor(response.data, "product").data).toEqual([
          expect.objectContaining({ title: "Aurora Shoe" }),
        ])
        expect(groupFor(response.data, "customer")).toEqual(
          expect.objectContaining({ entity: "customer", data: [], count: 0 })
        )
      })

      it("matches a prefix of the last query term", async () => {
        const prefix = await api.get("/admin/search?q=zep", adminHeaders)

        expect(groupFor(prefix.data, "product").data).toEqual([
          expect.objectContaining({ title: "Zephyr Shirt" }),
        ])

        const twoTerms = await api.get(
          "/admin/search?q=zephyr sh",
          adminHeaders
        )

        expect(groupFor(twoTerms.data, "product").data).toEqual([
          expect.objectContaining({ title: "Zephyr Shirt" }),
        ])
      })

      it("restricts the search to the requested entities", async () => {
        const response = await api.get(
          "/admin/search?q=zephyr&entity=product",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.results.length).toEqual(1)
        expect(response.data.results[0]).toEqual(
          expect.objectContaining({ entity: "product", offset: 0, limit: 20 })
        )
      })

      it("accepts a comma-separated list of entities, in the order given", async () => {
        const response = await api.get(
          "/admin/search?entity=customer,product",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.results.map((g) => g.entity)).toEqual([
          "customer",
          "product",
        ])
      })

      it("returns every document of an entity when no query is given", async () => {
        const response = await api.get(
          "/admin/search?entity=product",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(groupFor(response.data, "product").data).toHaveLength(2)
        expect(groupFor(response.data, "product").count).toEqual(2)
      })

      it("paginates each group on its own", async () => {
        const first = await api.get(
          "/admin/search?entity=product,customer&limit=1",
          adminHeaders
        )

        expect(first.data.results.map((g) => g.entity)).toEqual([
          "product",
          "customer",
        ])

        for (const entity of ["product", "customer"]) {
          expect(groupFor(first.data, entity).data).toHaveLength(1)
          expect(groupFor(first.data, entity)).toEqual(
            expect.objectContaining({ limit: 1, offset: 0, count: 2 })
          )
        }

        const second = await api.get(
          "/admin/search?entity=product,customer&limit=1&offset=1",
          adminHeaders
        )

        for (const entity of ["product", "customer"]) {
          expect(groupFor(second.data, entity).data).toHaveLength(1)
          expect(groupFor(second.data, entity).offset).toEqual(1)
          expect(groupFor(second.data, entity).data[0].id).not.toEqual(
            groupFor(first.data, entity).data[0].id
          )
        }
      })

      it("returns only the fields the index holds", async () => {
        const response = await api.get(
          "/admin/search?entity=product&q=zephyr",
          adminHeaders
        )

        expect(
          Object.keys(groupFor(response.data, "product").data[0]).sort()
        ).toEqual(["handle", "id", "sales_channel_ids", "status", "title"])
      })

      it("queries the database for an entity that has no index", async () => {
        const response = await api.get(
          "/admin/search?entity=region",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.results).toEqual([
          expect.objectContaining({ entity: "region", data: [], count: 0 }),
        ])
      })

      it("uses the search engine for indexed entities and the database for the rest", async () => {
        const response = await api.get(
          "/admin/search?q=zephyr&entity=product,region",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.results.map((g) => g.entity)).toEqual([
          "product",
          "region",
        ])

        // Index fields for product; graph fields would be id/thumbnail/title.
        expect(
          Object.keys(groupFor(response.data, "product").data[0]).sort()
        ).toEqual(["handle", "id", "sales_channel_ids", "status", "title"])
        expect(groupFor(response.data, "product").data).toEqual([
          expect.objectContaining({
            title: "Zephyr Shirt",
          }),
        ])
        expect(groupFor(response.data, "region")).toEqual(
          expect.objectContaining({ entity: "region", data: [], count: 0 })
        )
      })

      it("fails on an entity that is neither indexed nor searchable in the database", async () => {
        const error = await api
          .get("/admin/search?entity=nope", adminHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toContain("nope")
      })

      it("rejects an unknown query parameter", async () => {
        const error = await api
          .get("/admin/search?q=zephyr&fields=id", adminHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
      })

      it("requires authentication", async () => {
        const error = await api.get("/admin/search?q=zephyr").catch((e) => e)

        expect(error.response.status).toEqual(401)
      })
    })

    describe("GET /admin/search-indexes", () => {
      it("lists registered indexes with their fields and status", async () => {
        const response = await api.get("/admin/search-indexes", adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.enabled).toEqual(true)
        expect(response.data.search_indexes.map((index) => index.name)).toEqual(
          ["customer", "product"]
        )

        const product = response.data.search_indexes.find(
          (index) => index.name === "product"
        )
        const customer = response.data.search_indexes.find(
          (index) => index.name === "customer"
        )

        expect(product).toMatchObject({
          name: "product",
          entity: "product",
          status: "ready",
        })
        expect(product.fields.map((field) => field.name).sort()).toEqual(
          ["handle", "id", "sales_channel_ids", "status", "title"].sort()
        )
        expect(
          product.fields.find((field) => field.name === "title")
        ).toMatchObject({
          type: "text",
          searchable: true,
          sortable: true,
        })

        expect(customer).toMatchObject({
          name: "customer",
          entity: "customer",
          status: "ready",
        })
        expect(customer.fields.map((field) => field.name).sort()).toEqual(
          ["email", "first_name", "id", "last_name"].sort()
        )
      })

      it("requires authentication", async () => {
        const error = await api.get("/admin/search-indexes").catch((e) => e)

        expect(error.response.status).toEqual(401)
      })
    })

    describe("POST /admin/search-indexes/:id/reindex", () => {
      it("rebuilds a specific index from its seed", async () => {
        const response = await api.post(
          "/admin/search-indexes/product/reindex",
          {},
          adminHeaders
        )

        // The reindex runs in the background, so the route responds as soon
        // as it's triggered rather than waiting for the rebuild to finish.
        expect(response.status).toEqual(202)
        expect(response.data).toEqual({
          job_id: expect.any(String),
          indexes: ["product"],
        })

        const product = await waitForIndexReady("product")
        expect(product.status).toBe("ready")

        const search = await api.get(
          "/admin/search?q=zephyr&entity=product",
          adminHeaders
        )
        expect(groupFor(search.data, "product").data).toEqual([
          expect.objectContaining({ title: "Zephyr Shirt" }),
        ])
      })

      it("rejects a since value that is not a date", async () => {
        const error = await api
          .post(
            "/admin/search-indexes/product/reindex",
            { since: "yesterday" },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
      })

      it("rejects an unknown field in the body", async () => {
        const error = await api
          .post(
            "/admin/search-indexes/product/reindex",
            { nope: true },
            adminHeaders
          )
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
      })

      it("fails when the index is not registered", async () => {
        const error = await api
          .post("/admin/search-indexes/nope/reindex", {}, adminHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toContain("nope")
      })
    })

    // Destructive, but each test restores the snapshot taken after `beforeAll`,
    // so every one does its own deleting.
    describe("DELETE /admin/search-indexes/:id", () => {
      it("fails when the index is not registered", async () => {
        const error = await api
          .delete("/admin/search-indexes/nope", adminHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toContain("nope")
      })

      it("requires authentication", async () => {
        const error = await api
          .delete("/admin/search-indexes/customer")
          .catch((e) => e)

        expect(error.response.status).toEqual(401)
      })

      it("drops every version and the rows behind them", async () => {
        const before = await rowCounts("customer")

        // The boot seed built one version and `beforeAll`'s reindex another, so
        // this covers more than the one serving reads.
        expect(before.versions).toBeGreaterThan(1)

        const response = await api.delete(
          "/admin/search-indexes/customer",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: "customer",
          object: "search_index",
          deleted: true,
          deleted_versions: before.versions,
        })

        expect(await rowCounts("customer")).toEqual({
          indexes: 0,
          versions: 0,
          syncs: 0,
        })

        // Still listed, since the definition comes from code.
        expect(await indexNamed("customer")).toMatchObject({
          name: "customer",
          status: "pending",
        })

        // The point of deleting: numbering restarts rather than carrying on.
        expect(await planFor("customer")).toMatchObject({
          action: "create",
          version: 1,
        })

        expect(await planFor("product")).toMatchObject({ action: "noop" })
        expect((await rowCounts("product")).versions).toBeGreaterThan(0)
      })

      it("is a no-op when the index has nothing built", async () => {
        await api.delete("/admin/search-indexes/customer", adminHeaders)

        const response = await api.delete(
          "/admin/search-indexes/customer",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: "customer",
          object: "search_index",
          deleted: true,
          deleted_versions: 0,
        })
      })

      it("rebuilds into a working index after a migration", async () => {
        await api.delete("/admin/search-indexes/customer", adminHeaders)

        const plan = await searchModule.createIndexMigrationPlan()
        await searchModule.executeIndexMigrationPlan(plan)

        await searchModule.reindex({ index: "customer" })
        await waitForIndexReady("customer")

        const search = await api.get(
          "/admin/search?q=zephyr&entity=customer",
          adminHeaders
        )

        expect(groupFor(search.data, "customer").data).toEqual([
          expect.objectContaining({ email: "zephyr.tester@example.com" }),
        ])
      })
    })
  },
})
