import path from "path"

import setupServer from "../../../../environment-helpers/setup-server"
import { useApi } from "../../../../environment-helpers/use-api"
import { initDb, useDb } from "../../../../environment-helpers/use-db"

import adminSeeder from "../../../../helpers/admin-seeder"
import productSeeder from "../../../../helpers/product-seeder"

import {
  simpleRegionFactory,
  simpleSalesChannelFactory,
} from "../../../../factories"
import priceListSeeder from "../../../../helpers/price-list-seeder"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

describe("/admin/products", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd } as any)
    medusaProcess = await setupServer({
      cwd,
      env: {
        MEDUSA_FF_PRICING_INTEGRATION: true,
        MEDUSA_FF_ISOLATE_PRODUCT_DOMAIN: true,
      },
      verbose: true,
    } as any)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("updates a variant's default prices (ignores prices associated with a Price List)", () => {
    beforeEach(async () => {
      await productSeeder(dbConnection)
      await adminSeeder(dbConnection)
      await priceListSeeder(dbConnection)
      await simpleSalesChannelFactory(dbConnection, {
        name: "Default channel",
        id: "default-channel",
        is_default: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("successfully updates a variant's default prices by changing an existing price (currency_code)", async () => {
      const api = useApi()
      const data = {
        prices: [
          {
            currency_code: "usd",
            amount: 1500,
          },
        ],
      }

      const response = await api
        .post(
          "/admin/products/test-product/variants/test-variant",
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        product: expect.objectContaining({
          id: "test-product",
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: "test-variant",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 1500,
                  currency_code: "usd",
                }),
              ]),
            }),
          ]),
        }),
      })
    })

    it.only("successfully updates a variant's price by changing an existing price (given a region_id)", async () => {
      const api = useApi()

      const data = {
        prices: [
          {
            region_id: "test-region",
            amount: 1500,
          },
        ],
      }

      const response = await api
        .post(
          "/admin/products/test-product1/variants/test-variant_3",
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data.product).toEqual(
        expect.objectContaining({
          variants: expect.arrayContaining([
            expect.objectContaining({
              id: "test-variant_3",
              prices: expect.arrayContaining([
                expect.objectContaining({
                  amount: 1500,
                  currency_code: "usd",
                  region_id: "test-region",
                }),
              ]),
            }),
          ]),
        })
      )
    })

    it("successfully updates a variant's prices by adding a new price", async () => {
      const api = useApi()
      const data = {
        title: "Test variant prices",
        prices: [
          // usd price coming from the product seeder
          {
            id: "test-price",
            amount: 100,
            currency_code: "usd",
          },
          {
            currency_code: "eur",
            amount: 4500,
          },
        ],
      }

      const response = await api
        .post(
          "/admin/products/test-product/variants/test-variant",
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      expect(response.data).toEqual(
        expect.objectContaining({
          product: expect.objectContaining({
            id: "test-product",
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: "test-variant",
                prices: expect.arrayContaining([
                  expect.objectContaining({
                    amount: 100,
                    currency_code: "usd",
                    id: "test-price",
                  }),
                  expect.objectContaining({
                    amount: 4500,
                    currency_code: "eur",
                  }),
                ]),
              }),
            ]),
          }),
        })
      )
    })

    it("successfully updates a variant's prices by replacing a price", async () => {
      const api = useApi()
      const variantId = "test-variant"
      const data = {
        prices: [
          {
            currency_code: "usd",
            amount: 4500,
          },
        ],
      }

      const response = await api
        .post(
          `/admin/products/test-product/variants/${variantId}`,
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)
      const variant = response.data.product.variants.find(
        (v) => v.id === variantId
      )
      expect(variant.prices.length).toEqual(1)
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 4500,
            currency_code: "usd",
          }),
        ])
      )
    })

    it("successfully updates a variant's prices by deleting a price and adding another price", async () => {
      const api = useApi()
      const data = {
        prices: [
          {
            currency_code: "dkk",
            amount: 8000,
          },
          {
            currency_code: "eur",
            amount: 900,
          },
        ],
      }

      const variantId = "test-variant"
      const response = await api
        .post(
          `/admin/products/test-product/variants/${variantId}`,
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      const variant = response.data.product.variants.find(
        (v) => v.id === variantId
      )
      expect(variant.prices.length).toEqual(2)

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 8000,
            currency_code: "dkk",
          }),
          expect.objectContaining({
            amount: 900,
            currency_code: "eur",
          }),
        ])
      )
    })

    it("successfully updates a variant's prices by updating an existing price (using region_id) and adding another price", async () => {
      const api = useApi()
      const data = {
        prices: [
          {
            region_id: "test-region",
            amount: 8000,
          },
          {
            currency_code: "eur",
            amount: 900,
          },
        ],
      }

      const variantId = "test-variant_3"
      const response = await api
        .post(
          `/admin/products/test-product1/variants/${variantId}`,
          data,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      expect(response.status).toEqual(200)

      const variant = response.data.product.variants.find(
        (v) => v.id === variantId
      )
      expect(variant.prices.length).toEqual(data.prices.length)

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 8000,
            currency_code: "usd",
            region_id: "test-region",
          }),
          expect.objectContaining({
            amount: 900,
            currency_code: "eur",
          }),
        ])
      )
    })

    it("successfully deletes a region price", async () => {
      const api = useApi()

      const createRegionPricePayload = {
        prices: [
          {
            currency_code: "usd",
            amount: 1000,
          },
          {
            region_id: "test-region",
            amount: 8000,
          },
          {
            currency_code: "eur",
            amount: 900,
          },
        ],
      }

      const variantId = "test-variant_3"

      const createRegionPriceResponse = await api.post(
        "/admin/products/test-product1/variants/test-variant_3",
        createRegionPricePayload,
        adminHeaders
      )

      const initialPriceArray =
        createRegionPriceResponse.data.product.variants.find(
          (v) => v.id === variantId
        ).prices

      expect(createRegionPriceResponse.status).toEqual(200)
      expect(initialPriceArray).toHaveLength(3)
      expect(initialPriceArray).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 1000,
            currency_code: "usd",
          }),
          expect.objectContaining({
            amount: 8000,
            currency_code: "usd",
            region_id: "test-region",
          }),
          expect.objectContaining({
            amount: 900,
            currency_code: "eur",
          }),
        ])
      )

      const deleteRegionPricePayload = {
        prices: [
          {
            currency_code: "usd",
            amount: 1000,
          },
          {
            currency_code: "eur",
            amount: 900,
          },
        ],
      }

      const deleteRegionPriceResponse = await api.post(
        "/admin/products/test-product1/variants/test-variant_3",
        deleteRegionPricePayload,
        adminHeaders
      )

      const finalPriceArray =
        deleteRegionPriceResponse.data.product.variants.find(
          (v) => v.id === variantId
        ).prices

      expect(deleteRegionPriceResponse.status).toEqual(200)
      expect(finalPriceArray).toHaveLength(2)
      expect(finalPriceArray).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 1000,
            currency_code: "usd",
          }),
          expect.objectContaining({
            amount: 900,
            currency_code: "eur",
          }),
        ])
      )
    })

    it("successfully updates a variants prices by deleting both a currency and region price", async () => {
      const api = useApi()

      await Promise.all(
        ["reg_1", "reg_2", "reg_3"].map(async (regionId) => {
          return await simpleRegionFactory(dbConnection, {
            id: regionId,
            currency_code: regionId === "reg_1" ? "eur" : "usd",
          })
        })
      )

      const createPrices = {
        prices: [
          {
            region_id: "reg_1",
            amount: 1,
          },
          {
            region_id: "reg_2",
            amount: 2,
          },
          {
            currency_code: "usd",
            amount: 3,
          },
          {
            region_id: "reg_3",
            amount: 4,
          },
          {
            currency_code: "eur",
            amount: 5,
          },
        ],
      }

      const variantId = "test-variant_3"

      await api
        .post(
          `/admin/products/test-product1/variants/${variantId}`,
          createPrices,
          adminHeaders
        )
        .catch((err) => {
          console.log(err)
        })

      const updatePrices = {
        prices: [
          {
            region_id: "reg_1",
            amount: 100,
          },
          {
            region_id: "reg_2",
            amount: 200,
          },
          {
            currency_code: "usd",
            amount: 300,
          },
        ],
      }

      const response = await api.post(
        `/admin/products/test-product1/variants/${variantId}`,
        updatePrices,
        adminHeaders
      )

      const finalPriceArray = response.data.product.variants.find(
        (v) => v.id === variantId
      ).prices

      expect(response.status).toEqual(200)
      expect(finalPriceArray).toHaveLength(3)
      expect(finalPriceArray).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            amount: 100,
            region_id: "reg_1",
          }),
          expect.objectContaining({
            amount: 200,
            region_id: "reg_2",
          }),
          expect.objectContaining({
            amount: 300,
            currency_code: "usd",
          }),
        ])
      )
    })
  })
})
