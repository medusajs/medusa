const path = require("path")

const startServerWithEnvironment =
  require("../../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../../helpers/use-api")
const { useDb } = require("../../../../helpers/use-db")

const {
  simpleCartFactory,
  simpleRegionFactory,
  simpleShippingOptionFactory,
  simpleCustomShippingOptionFactory,
  simpleProductFactory,
  simplePriceListFactory,
  simpleDiscountFactory,
  simpleSalesChannelFactory,
} = require("../../../factories")
const { IdMap } = require("medusa-test-utils")

jest.setTimeout(30000)

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /store/carts", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_TAX_INCLUSIVE_PRICING: true },
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("POST /store/carts/:id/shipping-methods", () => {
    let includesTaxShippingOption
    let cart
    let customSoCart

    beforeEach(async () => {
      try {
        const shippingAddress = {
          id: "test-shipping-address",
          first_name: "lebron",
          country_code: "us",
        }
        const region = await simpleRegionFactory(dbConnection, {
          id: "test-region",
        })
        cart = await simpleCartFactory(dbConnection, {
          id: "test-cart",
          email: "some-customer1@email.com",
          region: region.id,
          shipping_address: shippingAddress,
          currency_code: "usd",
        })
        customSoCart = await simpleCartFactory(dbConnection, {
          id: "test-cart-with-cso",
          email: "some-customer2@email.com",
          region: region.id,
          shipping_address: shippingAddress,
          currency_code: "usd",
        })
        includesTaxShippingOption = await simpleShippingOptionFactory(
          dbConnection,
          {
            includes_tax: true,
            region_id: region.id,
          }
        )
        await simpleCustomShippingOptionFactory(dbConnection, {
          id: "another-cso-test",
          cart_id: customSoCart.id,
          shipping_option_id: includesTaxShippingOption.id,
          price: 5,
        })
      } catch (err) {
        console.log(err)
      }
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("should add a normal shipping method to the cart", async () => {
      const api = useApi()

      const cartWithShippingMethodRes = await api.post(
        `/store/carts/${cart.id}/shipping-methods`,
        {
          option_id: includesTaxShippingOption.id,
        },
        { withCredentials: true }
      )

      expect(cartWithShippingMethodRes.status).toEqual(200)
      expect(cartWithShippingMethodRes.data.cart.shipping_methods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            shipping_option_id: includesTaxShippingOption.id,
            includes_tax: true,
          }),
        ])
      )
    })

    it("should add a custom shipping method to the cart", async () => {
      const api = useApi()

      const cartWithCustomShippingMethodRes = await api
        .post(
          `/store/carts/${customSoCart.id}/shipping-methods`,
          {
            option_id: includesTaxShippingOption.id,
          },
          { withCredentials: true }
        )
        .catch((err) => err.response)

      expect(cartWithCustomShippingMethodRes.status).toEqual(200)
      expect(
        cartWithCustomShippingMethodRes.data.cart.shipping_methods
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            shipping_option_id: includesTaxShippingOption.id,
            includes_tax: true,
            price: 5,
          }),
        ])
      )
    })
  })

  describe("POST /store/carts/:id", () => {
    const variantId1 = IdMap.getId("test-variant-1")
    const variantId2 = IdMap.getId("test-variant-2")
    const productId1 = IdMap.getId("test-product-1")
    const productId2 = IdMap.getId("test-product-2")
    const regionId = IdMap.getId("test-region")
    const regionData = {
      id: regionId,
      includes_tax: false,
      currency_code: "usd",
      countries: ["us"],
      tax_rate: 20,
      name: "region test",
    }

    const buildProductData = (productId, variantId, salesChannelId) => {
      return {
        id: productId,
        sales_channels: [{ id: salesChannelId }],
        variants: [
          {
            id: variantId,
            prices: [],
          },
        ],
      }
    }
    const buildPriceListData = (variantId, price, includesTax) => {
      return {
        status: "active",
        type: "sale",
        prices: [
          {
            variant_id: variantId,
            amount: price,
            currency_code: "usd",
            region_id: regionId,
          },
        ],
        includes_tax: includesTax,
      }
    }
    const customnerPayload = {
      email: "adrien@test.dk",
      password: "adrientest",
      first_name: "adrien",
      last_name: "adrien",
    }
    const createCartPayload = {
      region_id: regionId,
      items: [
        {
          variant_id: variantId1,
          quantity: 1,
        },
        {
          variant_id: variantId2,
          quantity: 1,
        },
      ],
    }

    describe("with a cart with full tax exclusive variant pricing", () => {
      beforeEach(async () => {
        const salesChannel = await simpleSalesChannelFactory(dbConnection, {
          id: "test-channel",
          is_default: true,
        })
        await simpleRegionFactory(dbConnection, regionData)
        await simpleProductFactory(
          dbConnection,
          buildProductData(productId1, variantId1, salesChannel.id)
        )
        await simplePriceListFactory(
          dbConnection,
          buildPriceListData(variantId1, 100, false)
        )
        await simpleProductFactory(
          dbConnection,
          buildProductData(productId2, variantId2, salesChannel.id)
        )
        await simplePriceListFactory(
          dbConnection,
          buildPriceListData(variantId2, 100, false)
        )
      })

      afterEach(async () => {
        const db = useDb()
        return await db.teardown()
      })

      it("should calculates correct payment totals on cart completion", async () => {
        const api = useApi()

        const customerRes = await api.post(
          "/store/customers",
          customnerPayload,
          { withCredentials: true }
        )

        const createCartRes = await api.post("/store/carts", createCartPayload)

        const cart = createCartRes.data.cart

        await api.post(`/store/carts/${cart.id}`, {
          customer_id: customerRes.data.customer.id,
        })

        await api.post(`/store/carts/${cart.id}/payment-sessions`)

        const createdOrder = await api.post(
          `/store/carts/${cart.id}/complete-cart`
        )

        expect(createdOrder.data.type).toEqual("order")
        expect(createdOrder.data.data.discount_total).toEqual(0)
        expect(createdOrder.data.data.subtotal).toEqual(200)
        expect(createdOrder.data.data.total).toEqual(240)

        expect(createdOrder.status).toEqual(200)
      })
    })

    describe("with a cart with full tax inclusive variant pricing", () => {
      const variantId1 = IdMap.getId("test-variant-1-tax-inclusive")
      const variantId2 = IdMap.getId("test-variant-2-tax-inclusive")
      const productId1 = IdMap.getId("test-product-1-tax-inclusive")
      const productId2 = IdMap.getId("test-product-2-tax-inclusive")

      const createCartPayload = {
        region_id: regionId,
        items: [
          {
            variant_id: variantId1,
            quantity: 1,
          },
          {
            variant_id: variantId2,
            quantity: 1,
          },
        ],
      }

      beforeEach(async () => {
        const salesChannel = await simpleSalesChannelFactory(dbConnection, {
          id: "test-channel",
          is_default: true,
        })

        await simpleRegionFactory(dbConnection, regionData)
        await simpleProductFactory(
          dbConnection,
          buildProductData(productId1, variantId1, salesChannel.id)
        )
        await simplePriceListFactory(
          dbConnection,
          buildPriceListData(variantId1, 120, true)
        )
        await simpleProductFactory(
          dbConnection,
          buildProductData(productId2, variantId2, salesChannel.id)
        )
        await simplePriceListFactory(
          dbConnection,
          buildPriceListData(variantId2, 120, true)
        )
      })

      afterEach(async () => {
        const db = useDb()
        return await db.teardown()
      })

      it("should calculates correct payment totals on cart completion", async () => {
        const api = useApi()

        const customerRes = await api.post(
          "/store/customers",
          customnerPayload,
          { withCredentials: true }
        )

        const createCartRes = await api.post("/store/carts", createCartPayload)

        const cart = createCartRes.data.cart

        await api.post(`/store/carts/${cart.id}`, {
          customer_id: customerRes.data.customer.id,
        })

        await api.post(`/store/carts/${cart.id}/payment-sessions`)

        const createdOrder = await api.post(
          `/store/carts/${cart.id}/complete-cart`
        )

        expect(createdOrder.data.type).toEqual("order")
        expect(createdOrder.data.data.discount_total).toEqual(0)
        expect(createdOrder.data.data.subtotal).toEqual(200)
        expect(createdOrder.data.data.total).toEqual(240)

        expect(createdOrder.status).toEqual(200)
      })
    })

    describe("with a cart mixing tax inclusive and exclusive variant pricing", () => {
      const variantId1 = IdMap.getId("test-variant-1-mixed-tax-inclusive")
      const variantId2 = IdMap.getId("test-variant-2-mixed-tax-inclusive")
      const productId1 = IdMap.getId("test-product-1-mixed-tax-inclusive")
      const productId2 = IdMap.getId("test-product-2-mixed-tax-inclusive")

      const createCartPayload = {
        region_id: regionId,
        items: [
          {
            variant_id: variantId1,
            quantity: 1,
          },
          {
            variant_id: variantId2,
            quantity: 1,
          },
        ],
      }

      beforeEach(async () => {
        const salesChannel = await simpleSalesChannelFactory(dbConnection, {
          id: "test-channel",
          is_default: true,
        })

        await simpleRegionFactory(dbConnection, regionData)
        await simpleProductFactory(
          dbConnection,
          buildProductData(productId1, variantId1, salesChannel.id)
        )
        await simplePriceListFactory(
          dbConnection,
          buildPriceListData(variantId1, 120, true)
        )
        await simpleProductFactory(
          dbConnection,
          buildProductData(productId2, variantId2, salesChannel.id)
        )
        await simplePriceListFactory(
          dbConnection,
          buildPriceListData(variantId2, 100, false)
        )
      })

      afterEach(async () => {
        const db = useDb()
        return await db.teardown()
      })

      it("should calculates correct payment totals on cart completion", async () => {
        const api = useApi()

        const customerRes = await api.post(
          "/store/customers",
          customnerPayload,
          { withCredentials: true }
        )

        const createCartRes = await api.post("/store/carts", createCartPayload)

        const cart = createCartRes.data.cart

        await api.post(`/store/carts/${cart.id}`, {
          customer_id: customerRes.data.customer.id,
        })

        await api.post(`/store/carts/${cart.id}/payment-sessions`)

        const createdOrder = await api.post(
          `/store/carts/${cart.id}/complete-cart`
        )

        expect(createdOrder.data.type).toEqual("order")
        expect(createdOrder.data.data.discount_total).toEqual(0)
        expect(createdOrder.data.data.subtotal).toEqual(200)
        expect(createdOrder.data.data.total).toEqual(240)

        expect(createdOrder.status).toEqual(200)
      })
    })
  })

  describe("POST /store/carts/:id/line-items", () => {
    const cartIdWithItemPercentageDiscount =
      "test-cart-w-item-percentage-discount"
    const percentage15discountId = IdMap.getId("percentage15discountId")
    const variantId1 = IdMap.getId("test-variant-1")
    const variantId2 = IdMap.getId("test-variant-2")
    const productId1 = IdMap.getId("test-product-1")
    const productId2 = IdMap.getId("test-product-2")
    const regionId = IdMap.getId("test-region")
    const regionData = {
      id: regionId,
      includes_tax: false,
      currency_code: "usd",
      countries: ["us"],
      tax_rate: 20,
      name: "region test",
    }
    const buildProductData = (productId, variantId) => {
      return {
        id: productId,
        variants: [
          {
            id: variantId,
            prices: [],
          },
        ],
      }
    }
    const buildPriceListData = (variantId, price, includesTax) => {
      return {
        status: "active",
        type: "sale",
        prices: [
          {
            variant_id: variantId,
            amount: price,
            currency_code: "usd",
            region_id: regionId,
          },
        ],
        includes_tax: includesTax,
      }
    }

    describe("with a cart mixing tax inclusive and exclusive variant pricing", () => {
      beforeEach(async () => {
        const region = await simpleRegionFactory(dbConnection, regionData)
        await simpleCartFactory(dbConnection, {
          id: cartIdWithItemPercentageDiscount,
          region,
        })
        await simpleProductFactory(
          dbConnection,
          buildProductData(productId1, variantId1)
        )
        await simplePriceListFactory(
          dbConnection,
          buildPriceListData(variantId1, 120, true)
        )
        await simpleProductFactory(
          dbConnection,
          buildProductData(productId2, variantId2)
        )
        await simplePriceListFactory(
          dbConnection,
          buildPriceListData(variantId2, 100, false)
        )

        const tenDaysAgo = ((today) =>
          new Date(today.setDate(today.getDate() - 10)))(new Date())
        const tenDaysFromToday = ((today) =>
          new Date(today.setDate(today.getDate() + 10)))(new Date())
        await simpleDiscountFactory(dbConnection, {
          id: percentage15discountId,
          code: percentage15discountId,
          regions: [regionId],
          rule: {
            type: "percentage",
            value: "15",
            allocation: "item",
          },
          starts_at: tenDaysAgo,
          ends_at: tenDaysFromToday,
        })
      })

      afterEach(async () => {
        const db = useDb()
        return await db.teardown()
      })

      it("calculates correct item totals for percentage discount with mix of tax inclusive/exclusive items", async () => {
        const api = useApi()

        await api.post(`/store/carts/${cartIdWithItemPercentageDiscount}`, {
          region_id: regionId,
          discounts: [{ code: percentage15discountId }],
        })

        await api.post(
          `/store/carts/${cartIdWithItemPercentageDiscount}/line-items`,
          {
            variant_id: variantId1,
            quantity: 2,
          },
          { withCredentials: true }
        )
        const response = await api.post(
          `/store/carts/${cartIdWithItemPercentageDiscount}/line-items`,
          {
            variant_id: variantId2,
            quantity: 2,
          },
          { withCredentials: true }
        )

        const expectedItemTotals = {
          subtotal: 200,
          discount_total: 30,
          total: 204,
          original_total: 240,
          original_tax_total: 40,
          tax_total: 34,
        }

        const expectedAdjustment = {
          amount: 30,
          discount_id: percentage15discountId,
          description: "discount",
        }

        expect(response.data.cart.items).toHaveLength(2)
        expect(response.data.cart.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              includes_tax: true,
              cart_id: cartIdWithItemPercentageDiscount,
              unit_price: 120,
              variant_id: variantId1,
              quantity: 2,
              adjustments: [expect.objectContaining(expectedAdjustment)],
              ...expectedItemTotals,
            }),
            expect.objectContaining({
              includes_tax: false,
              cart_id: cartIdWithItemPercentageDiscount,
              unit_price: 100,
              variant_id: variantId2,
              quantity: 2,
              adjustments: [expect.objectContaining(expectedAdjustment)],
              ...expectedItemTotals,
            }),
          ])
        )
      })
    })
  })
})
