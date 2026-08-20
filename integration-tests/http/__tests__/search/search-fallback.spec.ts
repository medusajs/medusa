import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(120000)

/**
 * Covers GET /admin/search when the Search Module is not enabled — the
 * graph-query fan-out that replaces the admin client's previous N list calls.
 */
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    const groupFor = (data: any, entity: string) =>
      data.results.find((group: any) => group.entity === entity)

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
    })

    describe("GET /admin/search (graph fallback)", () => {
      beforeEach(async () => {
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
      })

      it("searches registered entities and groups the results", async () => {
        const response = await api.get(
          "/admin/search?q=zephyr&entity=product,customer",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.results.map((g: any) => g.entity)).toEqual([
          "product",
          "customer",
        ])

        expect(groupFor(response.data, "product").data).toEqual([
          expect.objectContaining({
            title: "Zephyr Shirt",
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
        const response = await api.get(
          "/admin/search?q=aurora&entity=product,customer",
          adminHeaders
        )

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

      it("paginates each group on its own", async () => {
        const first = await api.get(
          "/admin/search?entity=product&limit=1",
          adminHeaders
        )

        expect(groupFor(first.data, "product").data).toHaveLength(1)
        expect(groupFor(first.data, "product")).toEqual(
          expect.objectContaining({ limit: 1, offset: 0, count: 2 })
        )

        const second = await api.get(
          "/admin/search?entity=product&limit=1&offset=1",
          adminHeaders
        )

        expect(groupFor(second.data, "product").data).toHaveLength(1)
        expect(groupFor(second.data, "product").offset).toEqual(1)
        expect(groupFor(second.data, "product").data[0].id).not.toEqual(
          groupFor(first.data, "product").data[0].id
        )
      })

      it("fails on an unknown entity", async () => {
        const error = await api
          .get("/admin/search?entity=nope", adminHeaders)
          .catch((e: any) => e)

        expect(error.response.status).toEqual(404)
        expect(error.response.data.message).toContain("nope")
      })

      it("requires authentication", async () => {
        const error = await api.get("/admin/search?q=zephyr").catch((e: any) => e)

        expect(error.response.status).toEqual(401)
      })
    })

    describe("GET /admin/search-indexes", () => {
      it("reports that the Search Module is not enabled", async () => {
        const response = await api.get("/admin/search-indexes", adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          search_indexes: [],
          enabled: false,
        })
      })
    })
  },
})
