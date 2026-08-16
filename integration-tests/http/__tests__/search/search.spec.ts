import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { SearchTypes } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

process.env.ENABLE_SEARCH_MODULE = "true"

jest.setTimeout(120000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let searchModule: SearchTypes.ISearchModuleService

    const groupFor = (data: any, entity: string) =>
      data.results.find((group) => group.entity === entity)

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      searchModule = container.resolve(Modules.SEARCH)

      await searchModule.executeIndexMigrationPlan(
        await searchModule.createIndexMigrationPlan()
      )

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

    afterAll(() => {
      delete process.env.ENABLE_SEARCH_MODULE
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
        ).toEqual(["handle", "id", "status", "title"])
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
        ).toEqual(["handle", "id", "status", "title"])
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
  },
})
