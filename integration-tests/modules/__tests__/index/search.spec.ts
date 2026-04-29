import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IndexTypes } from "@medusajs/types"
import { defaultCurrencies, Modules } from "@medusajs/utils"
import { setTimeout } from "timers/promises"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import { fetchAndRetry } from "../../../helpers/retry"

jest.setTimeout(100000)

process.env.ENABLE_INDEX_MODULE = "true"

async function populateData(
  api: any,
  {
    productCount = 50,
    variantCount = 10,
    priceCount = 10,
  }: {
    productCount?: number
    variantCount?: number
    priceCount?: number
  } = {}
) {
  const shippingProfile = (
    await api.post(
      `/admin/shipping-profiles`,
      { name: "Test", type: "default" },
      adminHeaders
    )
  ).data.shipping_profile

  const payloads = new Array(productCount).fill(0).map((_, a) => ({
    title: "Test Giftcard-" + a,
    is_giftcard: true,
    shipping_profile_id: shippingProfile.id,
    description: "test-giftcard-description" + a,
    options: [{ title: "Denominations", values: ["100"] }],
    variants: new Array(variantCount).fill(0).map((_, i) => ({
      title: `Test variant ${i}`,
      sku: `test-variant-${i}${a}`,
      prices: new Array(priceCount).fill(0).map((_, j) => ({
        currency_code: Object.values(defaultCurrencies)[j].code,
        amount: 10 * j,
      })),
      options: {
        Denominations: "100",
      },
    })),
  }))

  for (const payload of payloads) {
    await api.post("/admin/products", payload, adminHeaders)
  }

  await setTimeout(4000 * (productCount / 10))
}

medusaIntegrationTestRunner({
  testSuite: ({ getContainer, dbConnection, api }) => {
    let indexEngine: IndexTypes.IIndexService
    let appContainer

    beforeAll(async () => {
      appContainer = getContainer()
      indexEngine = appContainer.resolve(Modules.INDEX)
    })

    afterAll(() => {
      process.env.ENABLE_INDEX_MODULE = "false"
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("Index engine", () => {
      it("should search through the indexed data and return the correct results ordered and filtered [1]", async () => {
        await populateData(api, {
          productCount: 1,
          variantCount: 10,
          priceCount: 10,
        })

        const { data: results } = await fetchAndRetry(
          async () =>
            indexEngine.query<"product">({
              fields: [
                "product.*",
                "product.variants.*",
                "product.variants.prices.*",
              ],
              filters: {
                product: {
                  variants: {
                    prices: {
                      amount: { $gt: 50 },
                    },
                  },
                },
              },
              pagination: {
                order: {
                  product: {
                    variants: {
                      prices: {
                        amount: "DESC",
                      },
                    },
                  },
                },
              },
            }),
          ({ data }) => data.length > 0
        )

        expect(results.length).toBe(1)

        const variants = results[0].variants

        expect(variants.length).toBe(10)

        for (const variant of variants) {
          expect(variant.prices.length).toBe(4)
          for (const price of variant.prices) {
            expect(price.amount).toBeGreaterThan(50)
          }
        }
      })

      it("should search through the indexed data and return the correct results ordered and filtered [2]", async () => {
        await populateData(api, {
          productCount: 1,
          variantCount: 10,
          priceCount: 10,
        })

        const { data: results } = await fetchAndRetry(
          async () =>
            indexEngine.query<"product">({
              fields: [
                "product.*",
                "product.variants.*",
                "product.variants.prices.*",
              ],
              filters: {
                product: {
                  variants: {
                    prices: {
                      amount: { $gt: 50 },
                      currency_code: { $eq: "aud" },
                    },
                  },
                },
              },
              pagination: {
                order: {
                  product: {
                    variants: {
                      prices: {
                        amount: "DESC",
                      },
                    },
                  },
                },
              },
            }),
          ({ data }) => data.length > 0
        )

        expect(results.length).toBe(1)

        const variants = results[0].variants

        expect(variants.length).toBe(10)

        for (const variant of variants) {
          expect(variant.prices.length).toBe(1)
          expect(variant.prices[0].amount).toBeGreaterThan(50)
          expect(variant.prices[0].currency_code).toBe("aud")
        }
      })

      it("should search through the indexed data and return the correct results ordered and filtered [3]", async () => {
        await populateData(api)

        const queryArgs = {
          fields: [
            "product.*",
            "product.variants.*",
            "product.variants.prices.*",
          ],
          filters: {
            product: {
              variants: {
                prices: {
                  amount: { $gt: 50 },
                  currency_code: { $eq: "AUD" },
                },
              },
            },
          },
          pagination: {
            order: {
              product: {
                variants: {
                  prices: {
                    amount: "DESC",
                  },
                },
              },
            },
          },
        }

        await indexEngine.query<"product">(queryArgs)

        const { data: results, metadata } = await indexEngine.query<"product">(
          queryArgs
        )
      })
    })
  },
})
