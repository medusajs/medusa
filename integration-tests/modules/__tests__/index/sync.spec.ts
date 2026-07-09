import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IndexTypes } from "@medusajs/types"
import { defaultCurrencies, Modules } from "@medusajs/utils"
import { setTimeout } from "timers/promises"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(300000)

process.env.ENABLE_INDEX_MODULE = "true"

async function populateData(
  api: any,
  { productCount = 1, variantCount = 1, priceCount = 1 } = {}
) {
  const shippingProfile = (
    await api.post(
      `/admin/shipping-profiles`,
      { name: "Test", type: "default" },
      adminHeaders
    )
  ).data.shipping_profile

  for (let i = 0; i < productCount; i++) {
    const payload = {
      title: "Test Giftcard " + i,
      shipping_profile_id: shippingProfile.id,
      description: "test-giftcard-description " + i,
      options: [{ title: "Denominations", values: ["100"] }],
      variants: new Array(variantCount).fill(0).map((_, j) => ({
        title: `Test variant ${i} ${j}`,
        sku: `test-variant-${i}-${j}`,
        prices: new Array(priceCount).fill(0).map((_, k) => ({
          currency_code: Object.values(defaultCurrencies)[k].code,
          amount: 10 * k,
        })),
        options: {
          Denominations: "100",
        },
      })),
    }

    await api.post("/admin/products", payload, adminHeaders)
  }
}

medusaIntegrationTestRunner({
  testSuite: ({
    getContainer,
    dbConnection,
    api,
    dbConfig,
    dbUtils,
    utils,
  }) => {
    let indexEngine: IndexTypes.IIndexService
    let appContainer

    beforeAll(() => {
      appContainer = getContainer()
      indexEngine = appContainer.resolve(Modules.INDEX)
    })

    afterAll(() => {
      process.env.ENABLE_INDEX_MODULE = "false"
    })

    beforeAll(async () => {
      await createAdminUser(dbConnection, adminHeaders, appContainer)

      await dbUtils.snapshot()
    })

    describe("Index engine syncing", () => {
      it("should sync the data to the index based on the indexation configuration", async () => {
        await populateData(api, {
          productCount: 2,
          variantCount: 2,
          priceCount: 2,
        })

        await setTimeout(1000)
        await dbConnection.raw('TRUNCATE TABLE "index_data";')
        await dbConnection.raw('TRUNCATE TABLE "index_relation";')
        await dbConnection.raw('TRUNCATE TABLE "index_metadata";')
        await dbConnection.raw('TRUNCATE TABLE "index_sync";')

        const { data: indexedDataAfterCreation } =
          await indexEngine.query<"product">({
            fields: [
              "product.*",
              "product.variants.*",
              "product.variants.prices.*",
            ],
          })

        expect(indexedDataAfterCreation.length).toBe(0)

        // Prevent storage provider to be triggered though
        ;(indexEngine as any).storageProvider_.onApplicationStart = jest.fn()

        // Trigger a sync
        ;(indexEngine as any).schemaObjectRepresentation_ = null
        await (indexEngine as any).onApplicationStart_()

        // 28 ms - 6511 records
        const { data: results } = await indexEngine.query<"product">({
          fields: [
            "product.*",
            "product.variants.*",
            "product.variants.prices.*",
          ],
        })

        expect(results.length).toBe(2)
        for (const result of results) {
          expect(result.variants.length).toBe(2)
          for (const variant of result.variants) {
            expect(variant.prices.length).toBe(2)
          }
        }
      })
    })

    it("should sync the data to the index based on the updated indexation configuration", async () => {
      await populateData(api)

      await setTimeout(1000)
      await dbConnection.raw('TRUNCATE TABLE "index_data";')
      await dbConnection.raw('TRUNCATE TABLE "index_relation";')
      await dbConnection.raw('TRUNCATE TABLE "index_metadata";')
      await dbConnection.raw('TRUNCATE TABLE "index_sync";')

      const { data: indexedDataAfterCreation } =
        await indexEngine.query<"product">({
          fields: [
            "product.*",
            "product.variants.*",
            "product.variants.prices.*",
          ],
        })

      expect(indexedDataAfterCreation.length).toBe(0)

      // Prevent storage provider to be triggered though
      ;(indexEngine as any).storageProvider_.onApplicationStart = jest.fn()

      // Trigger a sync
      ;(indexEngine as any).schemaObjectRepresentation_ = null
      await (indexEngine as any).onApplicationStart_()

      const { data: results } = await indexEngine.query<"product">({
        fields: [
          "product.*",
          "product.variants.*",
          "product.variants.prices.*",
        ],
      })

      expect(results.length).toBe(1)
      expect(results[0].variants.length).toBe(1)
      expect(results[0].variants[0].prices.length).toBe(1)

      // Manually change the indexation configuration
      ;(indexEngine as any).schemaObjectRepresentation_ = null
      ;(indexEngine as any).moduleOptions_ = {
        ...(indexEngine as any).moduleOptions_,
        schema: `
  type Product @Listeners(values: ["product.created", "product.updated", "product.deleted"]) {
    id: ID
    title: String
    handle: String
    variants: [ProductVariant]
  }
  
  type ProductVariant @Listeners(values: ["variant.created", "variant.updated", "variant.deleted"]) {
    id: ID
    product_id: String
    sku: String
    description: String
  }
        `,
      }
      // Trigger a sync
      ;(indexEngine as any).schemaObjectRepresentation_ = null
      await (indexEngine as any).onApplicationStart_()
      await setTimeout(3000)

      const { data: updatedResults } = await indexEngine.query<"product">({
        fields: ["product.*", "product.variants.*"],
      })

      expect(updatedResults.length).toBe(1)
      expect(updatedResults[0].variants.length).toBe(1)

      let staledRaws = await dbConnection.raw(
        'SELECT * FROM "index_data" WHERE "staled_at" IS NOT NULL'
      )

      expect(staledRaws.rows.length).toBe(0)

      staledRaws = await dbConnection.raw(
        'SELECT * FROM "index_relation" WHERE "staled_at" IS NOT NULL'
      )
      expect(staledRaws.rows.length).toBe(0)
    })
  },
})
