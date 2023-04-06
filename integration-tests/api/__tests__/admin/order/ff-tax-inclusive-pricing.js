const path = require("path")

const startServerWithEnvironment =
  require("../../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../../helpers/use-api")
const { useDb } = require("../../../../helpers/use-db")

const adminSeeder = require("../../../helpers/admin-seeder")

const {
  simpleRegionFactory,
  simpleShippingOptionFactory,
  simpleOrderFactory,
  simpleProductFactory,
} = require("../../../factories")

jest.setTimeout(30000)

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("[MEDUSA_FF_TAX_INCLUSIVE_PRICING] /admin/orders", () => {
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

  describe("POST /admin/orders/:id/shipping-methods", () => {
    let includesTaxShippingOption
    let order

    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        const shippingAddress = {
          id: "test-shipping-address",
          first_name: "lebron",
          country_code: "us",
        }
        const region = await simpleRegionFactory(dbConnection, {
          id: "test-region",
        })
        order = await simpleOrderFactory(dbConnection, {
          id: "test-order",
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
      } catch (err) {
        console.log(err)
      }
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("should add a normal shipping method to the order", async () => {
      const api = useApi()

      const orderWithShippingMethodRes = await api.post(
        `/admin/orders/${order.id}/shipping-methods`,
        {
          option_id: includesTaxShippingOption.id,
          price: 10,
        },
        adminReqConfig
      )

      expect(orderWithShippingMethodRes.status).toEqual(200)
      expect(orderWithShippingMethodRes.data.order.shipping_methods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            shipping_option_id: includesTaxShippingOption.id,
            includes_tax: true,
          }),
        ])
      )
    })
  })

  describe("POST /admin/orders/:id/swaps", () => {
    const prodId = "prod_1234"
    const variant1 = "variant_1234"
    const variant2 = "variant_5678"
    const regionId = "test-region"
    const lineItemId = "litem_1234"
    const orderId = "order_1234"

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simpleRegionFactory(dbConnection, {
        id: regionId,
        includes_tax: true,
        currency_code: "usd",
        tax_rate: 10,
      })

      await simpleProductFactory(dbConnection, {
        id: prodId,
        variants: [
          {
            id: variant1,
            prices: [{ currency: "usd", amount: 1000, region_id: regionId }],
          },
          {
            id: variant2,
            prices: [{ currency: "usd", amount: 1000, region_id: regionId }],
          },
        ],
      })

      await simpleOrderFactory(dbConnection, {
        id: orderId,
        email: "test@testson.com",
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        region: regionId,
        currency_code: "usd",
        line_items: [
          {
            id: lineItemId,
            variant_id: variant1,
            tax_lines: [
              {
                rate: 10,
                name: "VAT",
                code: "vat",
              },
            ],
            unit_price: 1000,
            includes_tax: true,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
          },
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a swap with tax inclusive return lines", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/orders/${orderId}/swaps`,
        {
          return_items: [
            {
              item_id: lineItemId,
              quantity: 1,
            },
          ],
          additional_items: [{ variant_id: variant2, quantity: 1 }],
        },
        adminReqConfig
      )

      let swap = response.data.order.swaps[0]
      const order = response.data.order

      swap = await api.get(`/admin/swaps/${swap.id}`, adminReqConfig)

      swap = swap.data.swap

      let swapCart = await api.get(`/store/carts/${swap.cart_id}`)

      swapCart = swapCart.data.cart

      const returnedItemOnSwap = swapCart.items.find((itm) => itm.is_return)
      const returnedItemOnOrder = order.items[0]

      expect(returnedItemOnSwap.total).toEqual(-1000)
      expect(returnedItemOnOrder.total).toEqual(1000)
      expect(response.status).toEqual(200)
    })
  })
})
