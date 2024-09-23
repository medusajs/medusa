import faker from "@faker-js/faker"
import { IndexTypes } from "@medusajs/types"
import { defaultCurrencies, Modules, promiseAll } from "@medusajs/utils"
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

      it.skip("should populate the database with fake products", async () => {
        const defaultCurrencies = {
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

        const QUANTITY = 10000
        const payloads = new Array(QUANTITY).fill(0).map((_, a) => ({
          title: faker.commerce.productName() + faker.datatype.uuid(), // Using faker to generate a random product name
          description:
            faker.commerce.productDescription() + faker.datatype.uuid(), // Random product description
          options: [
            {
              title: "Denominations",
              values: ["000"],
            },
          ], // Random denomination
          variants: new Array(10).fill(0).map((_, i) => ({
            title: `Variant ${faker.commerce.productAdjective()} ${i}`, // Random variant title
            sku: faker.datatype.uuid(), // Random SKU using UUID
            length: faker.datatype.float({ min: 1, max: 100 }), // Random length between 1 and 100
            width: faker.datatype.float({ min: 1, max: 100 }), // Random width between 1 and 100
            height: faker.datatype.float({ min: 1, max: 100 }), // Random height between 1 and 100
            weight: faker.datatype.float({ min: 1, max: 100 }), // Random weight between 1 and 100
            material: faker.commerce.productMaterial(), // Random material
            prices: new Array(10).fill(0).map((_, j) => ({
              currency_code: Object.values(defaultCurrencies)[j].code,
              amount: faker.datatype.float({ min: 1.99, max: 1999.99 }),
            })),
            options: {
              Denominations: "000",
            },
          })),
        }))

        const batchSize = 5

        for (let i = 0; i < payloads.length / batchSize; i++) {
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
                  console.log(err.message)
                })
            })
          )
        }

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
                  amount: { $gt: 2000 },
                  currency_code: { $eq: "EUR" },
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

      it.only("should query the database using the index engine", async () => {
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
                  amount: { $gt: 500 },
                  currency_code: { $eq: "EUR" },
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

        console.log(metadata)
      })
    })
  },
})
