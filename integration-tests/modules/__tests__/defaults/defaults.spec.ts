import { createDefaultsWorkflow } from "@medusajs/core-flows"
import { Query } from "@medusajs/modules-sdk"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    describe("Defaults", () => {
      let appContainer
      let query: Query

      beforeAll(async () => {
        appContainer = getContainer()
        query = appContainer.resolve("query")
      })

      it("should successfully create default data on first run", async () => {
        const {
          data: [store],
        } = await query.graph({
          entity: "store",
          fields: ["id", "name", "default_sales_channel_id"],
        })
        const {
          data: [salesChannel],
        } = await query.graph({
          entity: "sales_channel",
          fields: ["id", "name"],
        })
        const {
          data: [publishableApiKey],
        } = await query.graph({
          entity: "api_key",
          fields: ["id", "type", "title"],
          filters: {
            type: "publishable",
          },
        })

        expect(store).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "Medusa Store",
            default_sales_channel_id: salesChannel.id,
          })
        )
        expect(salesChannel).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "Default Sales Channel",
          })
        )
        expect(publishableApiKey).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            title: "Default Publishable API Key",
            type: "publishable",
          })
        )
      })

      it("should skip creating default data on n+1 runs", async () => {
        await createDefaultsWorkflow(appContainer).run()

        const { data: stores } = await query.graph({
          entity: "store",
          fields: ["id"],
        })
        const { data: salesChannels } = await query.graph({
          entity: "sales_channel",
          fields: ["id"],
        })
        const { data: publishableApiKeys } = await query.graph({
          entity: "api_key",
          fields: ["id", "type"],
          filters: {
            type: "publishable",
          },
        })

        expect(stores.length).toEqual(1)
        expect(salesChannels.length).toEqual(1)
        expect(publishableApiKeys.length).toEqual(1)
      })
    })
  },
})
