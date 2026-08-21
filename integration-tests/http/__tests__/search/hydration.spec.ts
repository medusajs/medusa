import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { RemoteQueryFunction, SearchTypes } from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(120000)

/**
 * The product index holds `id`, `title`, `handle` and `status` and nothing
 * else, so anything else a caller asks for has to come from `query.graph` and
 * be merged onto the engine's documents.
 */
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let query: Omit<RemoteQueryFunction, symbol>
    let searchModule: SearchTypes.ISearchModuleService

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      query = container.resolve(ContainerRegistrationKeys.QUERY)
      searchModule = container.resolve(Modules.SEARCH)

      await searchModule.executeIndexMigrationPlan(
        await searchModule.createIndexMigrationPlan()
      )

      await api.post(
        "/admin/products",
        {
          title: "Zephyr Shirt",
          handle: "zephyr-shirt",
          description: "A shirt for windy days",
          status: "published",
          options: [{ title: "Size", values: ["S", "M"] }],
          variants: [
            {
              title: "Small",
              sku: "ZEPHYR-S",
              options: { Size: "S" },
              prices: [{ amount: 10, currency_code: "usd" }],
            },
            {
              title: "Medium",
              sku: "ZEPHYR-M",
              options: { Size: "M" },
              prices: [{ amount: 20, currency_code: "usd" }],
            },
          ],
        },
        adminHeaders
      )

      await api.post(
        "/admin/products",
        {
          title: "Aurora Shoe",
          handle: "aurora-shoe",
          description: "A shoe for long walks",
          status: "published",
          options: [{ title: "Size", values: ["42"] }],
          variants: [
            {
              title: "42",
              sku: "AURORA-42",
              options: { Size: "42" },
              prices: [{ amount: 30, currency_code: "usd" }],
            },
          ],
        },
        adminHeaders
      )

      await searchModule.reindex()
    })

    describe("query.search", () => {
      it("returns fields and relations the index does not hold", async () => {
        const { data } = await query.search({
          entity: "product",
          fields: ["id", "title", "handle", "description", "variants.*"],
          filters: { q: "zephyr", status: "published" },
        })

        expect(data).toHaveLength(1)
        expect(data[0]).toEqual(
          expect.objectContaining({
            title: "Zephyr Shirt",
            handle: "zephyr-shirt",
            // Neither of these is on the index.
            description: "A shirt for windy days",
            variants: expect.arrayContaining([
              expect.objectContaining({ sku: "ZEPHYR-S" }),
              expect.objectContaining({ sku: "ZEPHYR-M" }),
            ]),
          })
        )
      })

      it("keeps the engine's ordering while hydrating", async () => {
        const { data } = await query.search({
          entity: "product",
          fields: ["id", "title", "description"],
          filters: { status: "published" },
          pagination: { order: { title: "DESC" } },
        })

        expect(data.map((product) => product.title)).toEqual([
          "Zephyr Shirt",
          "Aurora Shoe",
        ])
        expect(data.map((product) => product.description)).toEqual([
          "A shirt for windy days",
          "A shoe for long walks",
        ])
      })

      it("returns the engine's documents untouched when nothing needs hydrating", async () => {
        const { data } = await query.search({
          entity: "product",
          fields: ["id", "title", "handle"],
          filters: { q: "aurora" },
        })

        expect(data).toEqual([
          expect.objectContaining({
            title: "Aurora Shoe",
            handle: "aurora-shoe",
          }),
        ])
        expect(data[0]).not.toHaveProperty("description")
      })
    })
  },
})
