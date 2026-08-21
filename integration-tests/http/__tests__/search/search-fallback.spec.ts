import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(120000)

/**
 * Covers GET /admin/search for entities that have no search index — the
 * graph-query fan-out the Search Module cannot serve.
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
          "/admin/regions",
          {
            name: "Zephyr North",
            currency_code: "usd",
            countries: ["nz"],
          },
          adminHeaders
        )

        await api.post(
          "/admin/regions",
          {
            name: "Zephyr South",
            currency_code: "eur",
            countries: ["is"],
          },
          adminHeaders
        )

        await api.post(
          "/admin/regions",
          {
            name: "Aurora",
            currency_code: "gbp",
            countries: ["gb"],
          },
          adminHeaders
        )
      })

      it("searches unindexed entities and groups the results", async () => {
        const response = await api.get(
          "/admin/search?q=zephyr&entity=region,returnReason",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.results.map((g: any) => g.entity)).toEqual([
          "region",
          "returnReason",
        ])

        expect(groupFor(response.data, "region").data).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: "Zephyr North" }),
            expect.objectContaining({ name: "Zephyr South" }),
          ])
        )
        expect(groupFor(response.data, "region").data).toHaveLength(2)
        expect(groupFor(response.data, "returnReason")).toEqual(
          expect.objectContaining({
            entity: "returnReason",
            data: [],
            count: 0,
          })
        )
      })

      it("returns a group with no hits rather than dropping the entity", async () => {
        const response = await api.get(
          "/admin/search?q=aurora&entity=region,returnReason",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(groupFor(response.data, "region").data).toEqual([
          expect.objectContaining({ name: "Aurora" }),
        ])
        expect(groupFor(response.data, "returnReason")).toEqual(
          expect.objectContaining({
            entity: "returnReason",
            data: [],
            count: 0,
          })
        )
      })

      it("restricts the search to the requested entities", async () => {
        const response = await api.get(
          "/admin/search?q=zephyr&entity=region",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.results.length).toEqual(1)
        expect(response.data.results[0]).toEqual(
          expect.objectContaining({ entity: "region", offset: 0, limit: 20 })
        )
      })

      it("paginates each group on its own", async () => {
        const first = await api.get(
          "/admin/search?q=zephyr&entity=region&limit=1",
          adminHeaders
        )

        expect(groupFor(first.data, "region").data).toHaveLength(1)
        expect(groupFor(first.data, "region")).toEqual(
          expect.objectContaining({ limit: 1, offset: 0, count: 2 })
        )

        const second = await api.get(
          "/admin/search?q=zephyr&entity=region&limit=1&offset=1",
          adminHeaders
        )

        expect(groupFor(second.data, "region").data).toHaveLength(1)
        expect(groupFor(second.data, "region").offset).toEqual(1)
        expect(groupFor(second.data, "region").data[0].id).not.toEqual(
          groupFor(first.data, "region").data[0].id
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
  },
})
