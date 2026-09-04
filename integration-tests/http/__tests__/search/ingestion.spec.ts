import { medusaIntegrationTestRunner, TestEventUtils } from "@medusajs/test-utils"
import { SearchTypes } from "@medusajs/types"
import { Modules, ProductEvents } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(120000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let searchModule: SearchTypes.ISearchModuleService
    let eventBus

    const titles = async (q?: string) => {
      const result = await searchModule.search({
        entity: "product",
        fields: ["id", "title", "handle", "status"],
        filters: q ? { q } : undefined,
      })

      return result.hits.map((hit) => hit.document.title)
    }

    // Ingestion is only observable once the event has been delivered. Set up
    // before the request that emits it.
    const delivered = (event: string) =>
      TestEventUtils.waitSubscribersExecution(event, eventBus)

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      searchModule = container.resolve(Modules.SEARCH)
      eventBus = container.resolve(Modules.EVENT_BUS)

      await searchModule.executeIndexMigrationPlan(
        await searchModule.createIndexMigrationPlan()
      )
    })

    describe("built-in search ingestion subscriber", () => {
      it("indexes a product created over the API, without a reindex", async () => {
        const subscribed = delivered(ProductEvents.PRODUCT_CREATED)

        const created = (
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
        ).data.product

        await subscribed

        expect(await titles("zephyr")).toEqual(["Zephyr Shirt"])

        const result = await searchModule.search({
          entity: "product",
          fields: ["id", "title", "handle", "status"],
          filters: { q: "zephyr" },
        })

        // Built by `consume` through `query.graph` — the event only carries an id.
        expect(result.hits[0]).toEqual(
          expect.objectContaining({
            id: created.id,
            document: expect.objectContaining({
              id: created.id,
              title: "Zephyr Shirt",
              handle: "zephyr-shirt",
              status: "published",
            }),
          })
        )
      })

      it("reindexes a product updated over the API", async () => {
        const created = (
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
        ).data.product

        const subscribed = delivered(ProductEvents.PRODUCT_UPDATED)

        await api.post(
          `/admin/products/${created.id}`,
          { title: "Aurora Trail Shoe" },
          adminHeaders
        )

        await subscribed

        expect(await titles("aurora")).toEqual(["Aurora Trail Shoe"])
      })

      it("removes a product deleted over the API", async () => {
        const created = (
          await api.post(
            "/admin/products",
            {
              title: "Ephemeral Cap",
              handle: "ephemeral-cap",
              status: "published",
              options: [{ title: "Size", values: ["S"] }],
            },
            adminHeaders
          )
        ).data.product

        const subscribed = delivered(ProductEvents.PRODUCT_DELETED)

        await api.delete(`/admin/products/${created.id}`, adminHeaders)

        await subscribed

        expect(await titles("ephemeral")).toEqual([])
      })
    })
  },
})
