import { IndexTypes } from "@medusajs/types"
import { defaultCurrencies, Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { setTimeout } from "timers/promises"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(999999999)

process.env.ENABLE_INDEX_MODULE = "true"

medusaIntegrationTestRunner({
  dbName: "search_test",
  keepDbState: true,
  testSuite: ({ getContainer, dbConnection, api, dbConfig }) => {
    let indexEngine: IndexTypes.IIndexService
    let appContainer

    beforeAll(() => {
      appContainer = getContainer()
      indexEngine = appContainer.resolve(Modules.INDEX)
    })

    afterAll(() => {
      process.env.ENABLE_INDEX_MODULE = "false"
    })

    beforeEach(async () => {
      await createAdminUser(dbConnection, adminHeaders, appContainer).catch(
        (err) => {
          // noop
        }
      )
    })

    describe("Index engine", () => {
      it("should search through the indexed data and return the correct results ordered and filtered [1]", async () => {
        const payload = {
          title: "Test Giftcard",
          is_giftcard: true,
          description: "test-giftcard-description",
          options: [{ title: "Denominations", values: ["100"] }],
          variants: new Array(10).fill(0).map((_, i) => ({
            title: `Test variant ${i}`,
            sku: `test-variant-${i}`,
            prices: new Array(10).fill(0).map((_, j) => ({
              currency_code: Object.values(defaultCurrencies)[j].code,
              amount: 10 * j,
            })),
            options: {
              Denominations: "100",
            },
          })),
        }

        await api
          .post("/admin/products", payload, adminHeaders)
          .catch((err) => {
            console.log(err)
          })

        // Timeout to allow indexing to finish
        await setTimeout(2000)

        const { data: results } = await indexEngine.query<"product">({
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
        })

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
        const payload = {
          title: "Test Giftcard",
          is_giftcard: true,
          description: "test-giftcard-description",
          options: [{ title: "Denominations", values: ["100"] }],
          variants: new Array(10).fill(0).map((_, i) => ({
            title: `Test variant ${i}`,
            sku: `test-variant-${i}`,
            prices: new Array(10).fill(0).map((_, j) => ({
              currency_code: Object.values(defaultCurrencies)[j].code,
              amount: 10 * j,
            })),
            options: {
              Denominations: "100",
            },
          })),
        }

        await api
          .post("/admin/products", payload, adminHeaders)
          .catch((err) => {
            console.log(err)
          })

        // Timeout to allow indexing to finish
        await setTimeout(2000)

        const { data: results } = await indexEngine.query<"product">({
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
        })

        expect(results.length).toBe(1)

        const variants = results[0].variants

        expect(variants.length).toBe(10)

        for (const variant of variants) {
          expect(variant.prices.length).toBe(1)
          expect(variant.prices[0].amount).toBeGreaterThan(50)
          expect(variant.prices[0].currency_code).toBe("AUD")
        }
      })

      it.only("should search through the indexed data and return the correct results ordered and filtered [3]", async () => {
        /*const defaultCurrencies = {
          USD: { code: "USD" },
          EUR: { code: "EUR" },
          GBP: { code: "GBP" },
          AUD: { code: "AUD" },
          CAD: { code: "CAD" },
          JPY: { code: "JPY" },
          CHF: { code: "CHF" },
          CNY: { code: "CNY" },
          SEK: { code: "SEK" },
          NZD: { code: "NZD" },
        }

        const payloads = new Array(10000).fill(0).map((_, a) => ({
          title: faker.commerce.productName() + faker.string.uuid(), // Using faker to generate a random product name
          description:
            faker.commerce.productDescription() + faker.string.uuid(), // Random product description
          options: [
            {
              title: "Denominations",
              values: ["000"],
            },
          ], // Random denomination
          variants: new Array(10).fill(0).map((_, i) => ({
            title: `Variant ${faker.commerce.productAdjective()} ${i}`, // Random variant title
            sku: faker.string.uuid(), // Random SKU using UUID
            length: faker.number.float({ min: 1, max: 100 }), // Random length between 1 and 100
            width: faker.number.float({ min: 1, max: 100 }), // Random width between 1 and 100
            height: faker.number.float({ min: 1, max: 100 }), // Random height between 1 and 100
            weight: faker.number.float({ min: 1, max: 100 }), // Random weight between 1 and 100
            prices: new Array(10).fill(0).map((_, j) => ({
              currency_code: Object.values(defaultCurrencies)[j].code,
              amount: Number(
                faker.commerce.price({ min: 1, max: 1000, dec: 2 })
              ), // Random price between 1 and 1000 with 2 decimals
            })),
            options: {
              Denominations: "000",
            },
          })),
        }))

        const batchSize = 10

        for (let i = 0; i < payloads.length / batchSize - 1; i++) {
          await promiseAll(
            new Array(batchSize).fill(0).map((_, j) => {
              console.log(
                `Creating product ${i * batchSize + j} in ${
                  payloads.length
                } payloads`
              )
              return api
                .post(
                  "/admin/products",
                  payloads[i * batchSize + j],
                  adminHeaders
                )
                .catch((err) => {
                  console.log(err)
                })
            })
          )
        }*/

        await (indexEngine as any).refresh()

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

        /*console.log({
          count,
          refreshTime,
          perf,
        })*/
      })
    })
  },
})
