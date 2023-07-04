const { Currency, Region } = require("@medusajs/medusa")
const path = require("path")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const {
  simpleProductFactory,
  simpleRegionFactory,
  simplePriceListFactory,
  simpleProductTaxRateFactory,
  simpleShippingOptionFactory,
  simpleShippingTaxRateFactory,
} = require("../../factories")

const adminSeeder = require("../../helpers/admin-seeder")
const promotionsSeeder = require("../../helpers/price-selection-seeder")

jest.setTimeout(30000)

describe("tax inclusive prices", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, conn] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
    })
    dbConnection = conn // await initDb({ cwd })
    medusaProcess = process // await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("Create line item with tax inclusive pricing", () => {
    let region
    let productId

    beforeEach(async () => {
      region = await simpleRegionFactory(dbConnection, {
        includes_tax: true,
      })

      const product = await simpleProductFactory(dbConnection, {
        variants: [{ id: "var_1", prices: [{ currency: "usd", amount: 100 }] }],
      })
      productId = product.id

      await simpleProductTaxRateFactory(dbConnection, {
        product_id: product.id,
        rate: {
          region_id: region.id,
          rate: 25,
        },
      })

      await simplePriceListFactory(dbConnection, {
        status: "active",
        type: "sale",
        prices: [
          {
            variant_id: "var_1",
            amount: 110,
            currency_code: "usd",
            region_id: region.id,
          },
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a line item with tax inclusive pricing when variant is tax inclusive", async () => {
      const api = useApi()
      const res = await api
        .get(`/store/products/${productId}?region_id=${region.id}`)
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const response = await api.post("/store/carts", {
        region_id: region.id,
      })

      const lineItemResp = await api.post(
        `/store/carts/${response.data.cart.id}/line-items`,
        {
          variant_id: variant.id,
          quantity: 2,
        }
      )

      expect(lineItemResp.data.cart.items).toEqual([
        expect.objectContaining({ includes_tax: true }),
      ])
    })

    it("creates a line item without tax inclusive pricing when variant is not tax inclusive", async () => {
      await dbConnection.manager.save(Region, {
        ...region,
        includes_tax: false,
      })

      const api = useApi()
      const res = await api
        .get(`/store/products/${productId}?region_id=${region.id}`)
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const response = await api.post("/store/carts", {
        region_id: region.id,
      })

      const lineItemResp = await api.post(
        `/store/carts/${response.data.cart.id}/line-items`,
        {
          variant_id: variant.id,
          quantity: 2,
        }
      )

      expect(lineItemResp.data.cart.items).toEqual([
        expect.objectContaining({ includes_tax: false }),
      ])
    })

    it("creates a line item without tax inclusive pricing with mixed variant pricing", async () => {
      await dbConnection.manager.save(Region, {
        ...region,
        includes_tax: false,
      })

      await simplePriceListFactory(dbConnection, {
        status: "active",
        type: "sale",
        includes_tax: true,
        prices: [
          {
            variant_id: "var_1",
            amount: 130,
            currency_code: "usd",
            region_id: region.id,
          },
        ],
      })

      const api = useApi()
      const res = await api
        .get(`/store/products/${productId}?region_id=${region.id}`)
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const response = await api.post("/store/carts", {
        region_id: region.id,
      })

      const lineItemResp = await api.post(
        `/store/carts/${response.data.cart.id}/line-items`,
        {
          variant_id: variant.id,
          quantity: 2,
        }
      )

      expect(lineItemResp.data.cart.items).toEqual([
        expect.objectContaining({ includes_tax: false }),
      ])
    })

    it("creates a line item with tax inclusive pricing with mixed variant pricing", async () => {
      await dbConnection.manager.save(Region, {
        ...region,
        includes_tax: false,
      })

      await simplePriceListFactory(dbConnection, {
        status: "active",
        type: "sale",
        includes_tax: true,
        prices: [
          {
            variant_id: "var_1",
            amount: 110,
            currency_code: "usd",
            region_id: region.id,
          },
        ],
      })

      const api = useApi()
      const res = await api
        .get(`/store/products/${productId}?region_id=${region.id}`)
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const response = await api.post("/store/carts", {
        region_id: region.id,
      })

      const lineItemResp = await api.post(
        `/store/carts/${response.data.cart.id}/line-items`,
        {
          variant_id: variant.id,
          quantity: 2,
        }
      )

      expect(lineItemResp.data.cart.items).toEqual([
        expect.objectContaining({ includes_tax: true }),
      ])
    })
  })

  describe("region tax inclusive", () => {
    describe("getting product with mixed prices preferring tax inclusive prices", () => {
      let regionId
      let productId

      beforeEach(async () => {
        const region = await simpleRegionFactory(dbConnection, {
          includes_tax: true,
        })

        const product = await simpleProductFactory(dbConnection, {
          variants: [
            { id: "var_1", prices: [{ currency: "usd", amount: 100 }] },
          ],
        })

        regionId = region.id
        productId = product.id

        await simpleProductTaxRateFactory(dbConnection, {
          product_id: product.id,
          rate: {
            region_id: region.id,
            rate: 25,
          },
        })

        await simplePriceListFactory(dbConnection, {
          status: "active",
          type: "sale",
          prices: [
            {
              variant_id: "var_1",
              amount: 110,
              currency_code: "usd",
              region_id: region.id,
            },
          ],
        })
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("test", async () => {
        const api = useApi()
        const res = await api
          .get(`/store/products/${productId}?region_id=${regionId}`)
          .catch((error) => console.log(error))

        const variant = res.data.product.variants[0]

        expect(variant).toEqual(
          expect.objectContaining({
            original_price: 100,
            calculated_price: 110,
            calculated_price_type: "sale",
            original_price_includes_tax: false,
            calculated_price_includes_tax: true,
            calculated_price_incl_tax: 110,
            calculated_tax: 22,
            original_price_incl_tax: 125,
            original_tax: 25,
          })
        )

        expect(variant.prices).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              amount: 100,
              currency_code: "usd",
              price_list_id: null,
            }),
            expect.objectContaining({
              amount: 110,
              currency_code: "usd",
              price_list_id: expect.any(String),
            }),
          ])
        )
      })
    })

    describe("getting product with mixed prices preferring tax exclusive prices", () => {
      let regionId
      let productId

      beforeEach(async () => {
        const region = await simpleRegionFactory(dbConnection, {
          includes_tax: true,
        })

        const product = await simpleProductFactory(dbConnection, {
          variants: [
            { id: "var_1", prices: [{ currency: "usd", amount: 100 }] },
          ],
        })

        regionId = region.id
        productId = product.id

        await simpleProductTaxRateFactory(dbConnection, {
          product_id: product.id,
          rate: {
            region_id: region.id,
            rate: 25,
          },
        })

        await simplePriceListFactory(dbConnection, {
          status: "active",
          prices: [
            {
              variant_id: "var_1",
              amount: 130,
              currency_code: "usd",
              region_id: region.id,
            },
          ],
        })
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("test", async () => {
        const api = useApi()
        const res = await api
          .get(`/store/products/${productId}?region_id=${regionId}`)
          .catch((error) => console.log(error))

        const variant = res.data.product.variants[0]

        expect(variant).toEqual(
          expect.objectContaining({
            original_price: 100,
            calculated_price: 100,
            calculated_price_type: "default",
            original_price_includes_tax: false,
            calculated_price_includes_tax: false,
            original_tax: 25,
            calculated_tax: 25,
            original_price_incl_tax: 125,
            calculated_price_incl_tax: 125,
          })
        )

        expect(variant.prices).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              amount: 100,
              currency_code: "usd",
              price_list_id: null,
            }),
            expect.objectContaining({
              amount: 130,
              currency_code: "usd",
              price_list_id: expect.any(String),
            }),
          ])
        )
      })
    })
  })

  describe("currency tax inclusive", () => {
    describe("getting product with mixed prices preferring tax inclusive prices", () => {
      let regionId
      let productId

      beforeEach(async () => {
        const manager = dbConnection.manager

        const currency = await manager.findOne(Currency, {
          where: { code: "usd" },
        })

        currency.includes_tax = true

        await manager.save(currency)

        const region = await simpleRegionFactory(dbConnection, {})

        const product = await simpleProductFactory(dbConnection, {
          variants: [
            { id: "var_1", prices: [{ currency: "usd", amount: 110 }] },
          ],
        })

        regionId = region.id
        productId = product.id

        await simpleProductTaxRateFactory(dbConnection, {
          product_id: product.id,
          rate: {
            region_id: region.id,
            rate: 25,
          },
        })

        await simplePriceListFactory(dbConnection, {
          status: "active",
          type: "sale",
          prices: [
            {
              variant_id: "var_1",
              amount: 100,
              currency_code: "usd",
              region_id: region.id,
            },
          ],
        })
      })

      afterEach(async () => {
        const db = useDb()

        const currency = await dbConnection.manager.findOne(Currency, {
          where: { code: "usd" },
        })

        currency.includes_tax = false

        await dbConnection.manager.save(currency)

        await db.teardown()
      })

      it("test", async () => {
        const api = useApi()
        const res = await api
          .get(`/store/products/${productId}?region_id=${regionId}`)
          .catch((error) => console.log(error))

        const variant = res.data.product.variants[0]

        expect(variant).toEqual(
          expect.objectContaining({
            original_price: 110,
            calculated_price: 100,
            calculated_price_type: "sale",
            original_price_includes_tax: true,
            calculated_price_includes_tax: true,
            calculated_price_incl_tax: 100,
            calculated_tax: 20,
            original_price_incl_tax: 110,
            original_tax: 22,
          })
        )

        expect(variant.prices).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              amount: 110,
              currency_code: "usd",
              price_list_id: null,
            }),
            expect.objectContaining({
              amount: 100,
              currency_code: "usd",
              price_list_id: expect.any(String),
            }),
          ])
        )
      })
    })
  })

  describe("pricelist tax inclusive", () => {
    describe("getting product with mixed prices preferring tax inclusive prices", () => {
      let regionId
      let productId

      beforeEach(async () => {
        const region = await simpleRegionFactory(dbConnection, {})

        const product = await simpleProductFactory(dbConnection, {
          variants: [
            { id: "var_1", prices: [{ currency: "usd", amount: 100 }] },
          ],
        })

        regionId = region.id
        productId = product.id

        await simpleProductTaxRateFactory(dbConnection, {
          product_id: product.id,
          rate: {
            region_id: region.id,
            rate: 25,
          },
        })

        await simplePriceListFactory(dbConnection, {
          status: "active",
          type: "sale",
          includes_tax: true,
          prices: [
            {
              variant_id: "var_1",
              amount: 110,
              currency_code: "usd",
              region_id: region.id,
            },
          ],
        })
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("test", async () => {
        const api = useApi()
        const res = await api
          .get(`/store/products/${productId}?region_id=${regionId}`)
          .catch((error) => console.log(error))

        const variant = res.data.product.variants[0]

        expect(variant).toEqual(
          expect.objectContaining({
            original_price: 100,
            calculated_price: 110,
            calculated_price_type: "sale",
            original_price_includes_tax: false,
            calculated_price_includes_tax: true,
            calculated_price_incl_tax: 110,
            calculated_tax: 22,
            original_price_incl_tax: 125,
            original_tax: 25,
          })
        )
        expect(variant.prices).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              amount: 100,
              currency_code: "usd",
              price_list_id: null,
            }),
            expect.objectContaining({
              amount: 110,
              currency_code: "usd",
              price_list_id: expect.any(String),
            }),
          ])
        )
      })
    })

    describe("getting product with mixed prices preferring tax exclusive prices", () => {
      let regionId
      let productId

      beforeEach(async () => {
        const region = await simpleRegionFactory(dbConnection, {})

        const product = await simpleProductFactory(dbConnection, {
          variants: [
            { id: "var_1", prices: [{ currency: "usd", amount: 100 }] },
          ],
        })

        regionId = region.id
        productId = product.id

        await simpleProductTaxRateFactory(dbConnection, {
          product_id: product.id,
          rate: {
            region_id: region.id,
            rate: 25,
          },
        })

        await simplePriceListFactory(dbConnection, {
          status: "active",
          includes_tax: true,
          prices: [
            {
              variant_id: "var_1",
              amount: 130,
              currency_code: "usd",
              region_id: region.id,
            },
          ],
        })
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("test", async () => {
        const api = useApi()
        const res = await api
          .get(`/store/products/${productId}?region_id=${regionId}`)
          .catch((error) => console.log(error))

        const variant = res.data.product.variants[0]

        expect(variant).toEqual(
          expect.objectContaining({
            original_price: 100,
            calculated_price: 100,
            calculated_price_type: "default",
            original_price_includes_tax: false,
            calculated_price_includes_tax: false,
            original_tax: 25,
            calculated_tax: 25,
            original_price_incl_tax: 125,
            calculated_price_incl_tax: 125,
          })
        )
        expect(variant.prices).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              amount: 100,
              currency_code: "usd",
              price_list_id: null,
            }),
            expect.objectContaining({
              amount: 130,
              currency_code: "usd",
              price_list_id: expect.any(String),
            }),
          ])
        )
      })
    })
  })

  describe("tax inclusive shipping options", () => {
    beforeAll(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("admin gets correct shipping prices", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection, {
        tax_rate: 25,
      })
      const so = await simpleShippingOptionFactory(dbConnection, {
        region_id: region.id,
        price: 100,
        includes_tax: true,
      })
      await simpleShippingTaxRateFactory(dbConnection, {
        shipping_option_id: so.id,
        rate: {
          region_id: region.id,
          rate: 10,
        },
      })

      const res = await api.get(`/admin/shipping-options`, {
        headers: {
          Authorization: `Bearer test_token`,
        },
      })

      expect(res.data.shipping_options).toHaveLength(1)
      expect(res.data.shipping_options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: so.id,
            amount: 100,
            price_incl_tax: 100,
            includes_tax: true,
            tax_amount: 9,
          }),
        ])
      )
    })

    it("gets correct shipping prices", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection, {
        tax_rate: 25,
      })
      const so = await simpleShippingOptionFactory(dbConnection, {
        region_id: region.id,
        includes_tax: true,
        price: 100,
      })
      await simpleShippingTaxRateFactory(dbConnection, {
        shipping_option_id: so.id,
        rate: {
          region_id: region.id,
          rate: 10,
        },
      })

      const res = await api.get(
        `/store/shipping-options?region_id=${region.id}`
      )

      expect(res.data.shipping_options).toHaveLength(1)
      expect(res.data.shipping_options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: so.id,
            amount: 100,
            price_incl_tax: 100,
            includes_tax: true,
            tax_amount: 9,
          }),
        ])
      )
    })
  })

  describe("Money amount", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await promotionsSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("calculated_price contains lowest price", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product?region_id=test-region")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const lowestPrice = variant.prices.reduce(
        (prev, curr) => (curr.amount < prev ? curr.amount : prev),
        Infinity
      )

      expect(variant.calculated_price).toEqual(lowestPrice)

      expect(variant).toEqual(
        expect.objectContaining({ original_price: 120, calculated_price: 110 })
      )
    })

    it("returns no money amounts belonging to customer groups without login", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.prices.length).toEqual(2)
      variant.prices.forEach((price) => {
        if (price.price_list) {
          expect(price.price_list.customer_groups).toEqual(undefined)
        } else {
          expect(price.price_list).toEqual(null)
        }
      })
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1",
            region_id: "test-region",
            currency_code: "usd",
            amount: 120,
          }),
          expect.objectContaining({
            id: "test-price3",
            region_id: "test-region",
            currency_code: "usd",
            price_list_id: "pl",
            amount: 110,
          }),
        ])
      )
    })

    it("sets default price as original price", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.original_price).toEqual(
        variant.prices.find((p) => p.price_list_id === null).amount
      )
    })

    it("gets prices for currency if no region prices exist", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product?cart_id=test-cart-2")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.original_price).toEqual(
        variant.prices.find((p) => p.price_list_id === null).amount
      )
      expect(variant.prices.length).toEqual(2)
      variant.prices.forEach((price) => {
        if (price.price_list) {
          expect(price.price_list.customer_groups).toEqual(undefined)
        } else {
          expect(price.price_list).toEqual(null)
        }
      })
      variant.prices.forEach((price) => {
        expect(price.region_id).toEqual("test-region")
        expect(price.currency_code).toEqual("usd")
      })
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1",
            region_id: "test-region",
            currency_code: "usd",
            amount: 120,
          }),
          expect.objectContaining({
            id: "test-price3",
            region_id: "test-region",
            currency_code: "usd",
            price_list_id: "pl",
            amount: 110,
          }),
        ])
      )
    })

    it("gets prices for cart region for multi region product", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product-multi-region?cart_id=test-cart-1")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant).toEqual(
        expect.objectContaining({ original_price: 130, calculated_price: 110 })
      )
      expect(variant.original_price).toEqual(
        variant.prices.find((p) => p.price_list_id === null).amount
      )

      expect(variant.prices.length).toEqual(2)

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1-region-2",
            region_id: "test-region-2",
            currency_code: "dkk",
            amount: 130,
          }),
          expect.objectContaining({
            id: "test-price3-region-2",
            region_id: "test-region-2",
            currency_code: "dkk",
            price_list_id: "pl",
            amount: 110,
          }),
        ])
      )
    })

    it("gets prices for multi region product", async () => {
      const api = useApi()
      const res = await api
        .get(
          "/store/products/test-product-multi-region?region_id=test-region-2"
        )
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant).toEqual(
        expect.objectContaining({ original_price: 130, calculated_price: 110 })
      )
      expect(variant.original_price).toEqual(
        variant.prices.find((p) => p.price_list_id === null).amount
      )

      expect(variant.prices.length).toEqual(2)

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1-region-2",
            region_id: "test-region-2",
            currency_code: "dkk",
            amount: 130,
          }),
          expect.objectContaining({
            id: "test-price3-region-2",
            region_id: "test-region-2",
            currency_code: "dkk",
            price_list_id: "pl",
            amount: 110,
          }),
        ])
      )
    })

    it("gets prices for multi currency product", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product-multi-region?currency_code=dkk")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant).toEqual(
        expect.objectContaining({ original_price: 130, calculated_price: 110 })
      )
      expect(variant.original_price).toEqual(
        variant.prices.find((p) => p.price_list_id === null).amount
      )

      expect(variant.prices.length).toEqual(2)

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1-region-2",
            region_id: "test-region-2",
            currency_code: "dkk",
            amount: 130,
          }),
          expect.objectContaining({
            id: "test-price3-region-2",
            region_id: "test-region-2",
            currency_code: "dkk",
            price_list_id: "pl",
            amount: 110,
          }),
        ])
      )
    })

    it("gets moneyamounts only with valid date interval", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product-sale?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const date = new Date()

      expect(variant.prices.length).toEqual(2)
      variant.prices.forEach((price) => {
        if (price.starts_at) {
          expect(new Date(price.starts_at).getTime()).toBeLessThan(
            date.getTime()
          )
        }
        if (price.ends_at) {
          expect(new Date(price.ends_at).getTime()).toBeGreaterThan(
            date.getTime()
          )
        }
      })
    })

    it("gets moneyamounts with valid date intervals and finds lowest price with overlapping intervals", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product-sale-overlap?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const date = new Date()

      expect(variant).toEqual(
        expect.objectContaining({
          original_price: 150,
          calculated_price: 120,
        })
      )
      expect(variant.prices.length).toEqual(3)
      variant.prices.forEach((price) => {
        if (price.starts_at) {
          expect(new Date(price.starts_at).getTime()).toBeLessThan(
            date.getTime()
          )
        }
        if (price.ends_at) {
          expect(new Date(price.ends_at).getTime()).toBeGreaterThan(
            date.getTime()
          )
        }
      })

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price-sale-overlap-1",
            region_id: "test-region",
            currency_code: "usd",
            amount: 140,
            price_list_id: "pl_current_1",
          }),
          expect.objectContaining({
            id: "test-price1-sale-overlap",
            region_id: "test-region",
            currency_code: "usd",
            amount: 120,
            price_list_id: "pl_current",
          }),
          expect.objectContaining({
            id: "test-price2-sale-overlap-default",
            region_id: "test-region",
            currency_code: "usd",
            amount: 150,
          }),
        ])
      )
    })

    it("gets all prices with varying quantity limits with no quantity", async () => {
      const api = useApi()
      const res = await api
        .get("/store/products/test-product-quantity?cart_id=test-cart")
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.prices.length).toEqual(5)
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price-quantity",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            price_list_id: "pl",
            min_quantity: 10,
            max_quantity: 100,
          }),
          expect.objectContaining({
            id: "test-price1-quantity",
            region_id: "test-region",
            currency_code: "usd",
            amount: 120,
            price_list_id: "pl",
            min_quantity: 101,
            max_quantity: 1000,
          }),
          expect.objectContaining({
            id: "test-price2-quantity",
            region_id: "test-region",
            currency_code: "usd",
            amount: 130,
            price_list_id: "pl",
            max_quantity: 9,
          }),
          expect.objectContaining({
            id: "test-price3-quantity-now",
            region_id: "test-region",
            currency_code: "usd",
            amount: 140,
            price_list_id: "pl_current",
            min_quantity: 101,
            max_quantity: 1000,
          }),
          expect.objectContaining({
            id: "test-price3-quantity-default",
            region_id: "test-region",
            currency_code: "usd",
            amount: 150,
          }),
        ])
      )

      expect(variant.calculated_price).toEqual(130)
      expect(variant.original_price).toEqual(150)
      expect(variant.original_price).toEqual(
        variant.prices.find((p) => p.price_list_id === null).amount
      )
    })

    it("fetches product with groups in money amounts with login", async () => {
      const api = useApi()

      // customer with customer-group 5
      const authResponse = await api.post("/store/auth", {
        email: "test5@email.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const res = await api
        .get("/store/products/test-product?cart_id=test-cart", {
          headers: {
            Cookie: authCookie,
          },
        })
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.prices.length).toEqual(3)

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1",
            region_id: "test-region",
            currency_code: "usd",
            amount: 120,
          }),
          expect.objectContaining({
            id: "test-price3",
            region_id: "test-region",
            currency_code: "usd",
            price_list_id: "pl",
            amount: 110,
          }),
          expect.objectContaining({
            id: "test-price",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            price_list: expect.objectContaining({}),
          }),
        ])
      )
    })

    it("fetches product with groups and quantities in money amounts with login", async () => {
      const api = useApi()

      // customer with customer-group 5
      const authResponse = await api.post("/store/auth", {
        email: "test5@email.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const res = await api
        .get(
          "/store/products/test-product-quantity-customer?cart_id=test-cart",
          {
            headers: {
              Cookie: authCookie,
            },
          }
        )
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      expect(variant.prices.length).toEqual(6)
      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price-quantity-customer",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            min_quantity: 10,
            max_quantity: 100,
          }),
          expect.objectContaining({
            id: "test-price1-quantity-customer",
            region_id: "test-region",
            currency_code: "usd",
            amount: 120,
            min_quantity: 101,
            max_quantity: 1000,
          }),
          expect.objectContaining({
            id: "test-price2-quantity-customer",
            region_id: "test-region",
            currency_code: "usd",
            amount: 130,
            max_quantity: 9,
          }),
          expect.objectContaining({
            id: "test-price2-quantity-customer-group",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            max_quantity: 9,
            price_list: expect.objectContaining({}),
          }),
          expect.objectContaining({
            id: "test-price3-quantity-customer-now",
            region_id: "test-region",
            currency_code: "usd",
            amount: 140,
            min_quantity: 101,
            max_quantity: 1000,
          }),
          expect.objectContaining({
            id: "test-price3-quantity-customer-default",
            region_id: "test-region",
            currency_code: "usd",
            amount: 150,
            price_list_id: null,
          }),
        ])
      )

      expect(variant.calculated_price).toEqual(100)
      expect(variant.original_price).toEqual(150)
      expect(variant.original_price).toEqual(
        variant.prices.find((p) => p.price_list_id === null).amount
      )
    })

    it("gets moneyamounts only with valid date interval for customer", async () => {
      const api = useApi()

      // customer with customer-group 5
      const authResponse = await api.post("/store/auth", {
        email: "test5@email.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const res = await api
        .get("/store/products/test-product-sale-customer?cart_id=test-cart", {
          headers: {
            Cookie: authCookie,
          },
        })
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const date = new Date()

      expect(variant).toEqual(
        expect.objectContaining({
          original_price: 150,
          calculated_price: 100,
        })
      )

      expect(variant.prices.length).toEqual(2)
      variant.prices.forEach((price) => {
        if (price.starts_at) {
          expect(new Date(price.starts_at).getTime()).toBeLessThan(
            date.getTime()
          )
        }
        if (price.ends_at) {
          expect(new Date(price.ends_at).getTime()).toBeGreaterThan(
            date.getTime()
          )
        }
      })
    })

    it("gets moneyamounts only with valid date interval for customer regardless of quantity limits", async () => {
      const api = useApi()

      // customer with customer-group 5
      const authResponse = await api.post("/store/auth", {
        email: "test5@email.com",
        password: "test",
      })

      const [authCookie] = authResponse.headers["set-cookie"][0].split(";")

      const res = await api
        .get(
          "/store/products/test-product-sale-customer-quantity?cart_id=test-cart",
          {
            headers: {
              Cookie: authCookie,
            },
          }
        )
        .catch((error) => console.log(error))

      const variant = res.data.product.variants[0]

      const date = new Date()

      expect(variant).toEqual(
        expect.objectContaining({
          original_price: 150,
          calculated_price: 100,
        })
      )

      expect(variant.prices.length).toEqual(3)
      variant.prices.forEach((price) => {
        if (price.starts_at) {
          expect(new Date(price.starts_at).getTime()).toBeLessThan(
            date.getTime()
          )
        }
        if (price.ends_at) {
          expect(new Date(price.ends_at).getTime()).toBeGreaterThan(
            date.getTime()
          )
        }
      })

      expect(variant.prices).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-price1-sale-customer-quantity-groups",
            region_id: "test-region",
            currency_code: "usd",
            amount: 100,
            max_quantity: 99,
            price_list: expect.objectContaining({}),
          }),
          expect.objectContaining({
            id: "test-price2-sale-customer-quantity-default",
            region_id: "test-region",
            currency_code: "usd",
            amount: 150,
          }),
          expect.objectContaining({
            id: "test-price1-sale-customer-quantity",
            region_id: "test-region",
            currency_code: "usd",
            amount: 110,
            max_quantity: 99,
          }),
        ])
      )
    })
  })
})
