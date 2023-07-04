const path = require("path")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const orderSeeder = require("../../helpers/order-seeder")
const swapSeeder = require("../../helpers/swap-seeder")
const adminSeeder = require("../../helpers/admin-seeder")

const {
  simpleProductFactory,
  simpleCartFactory,
  simpleDiscountFactory,
  simpleRegionFactory,
  simpleShippingOptionFactory,
} = require("../../factories")
const {
  simpleCustomerFactory,
} = require("../../factories/simple-customer-factory")
const {
  default: startServerWithEnvironment,
} = require("../../../helpers/start-server-with-environment")

jest.setTimeout(30000)

describe("/admin/swaps", () => {
  describe("tax exclusive", () => {
    let medusaProcess
    let dbConnection

    beforeAll(async () => {
      const cwd = path.resolve(path.join(__dirname, "..", ".."))
      dbConnection = await initDb({ cwd })
      medusaProcess = await setupServer({ cwd })
    })

    afterAll(async () => {
      const db = useDb()
      await db.shutdown()
      medusaProcess.kill()
    })

    describe("GET /admin/swaps/:id", () => {
      beforeEach(async () => {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)
        await swapSeeder(dbConnection)
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("gets a swap with cart and totals", async () => {
        const api = useApi()

        const response = await api
          .get("/admin/swaps/test-swap", {
            headers: {
              Authorization: "Bearer test_token",
            },
          })
          .catch((err) => {
            console.log(err)
          })
        expect(response.status).toEqual(200)
        expect(response.data.swap).toEqual(
          expect.objectContaining({
            id: "test-swap",
          })
        )

        expect(response.data.swap.cart).toEqual(
          expect.objectContaining({
            id: "test-cart-w-swap",
            shipping_total: 1000,
            subtotal: 1000,
            total: 2000,
          })
        )
        expect(response.data.swap.cart).toHaveProperty("discount_total")
        expect(response.data.swap.cart).toHaveProperty("gift_card_total")
      })

      it("gets a swap with a discount", async () => {
        const api = useApi()

        const response = await api
          .get("/admin/swaps/disc-swap", {
            headers: {
              Authorization: "Bearer test_token",
            },
          })
          .catch((err) => {
            console.log(err)
          })
        expect(response.status).toEqual(200)
        expect(response.data.swap).toEqual(
          expect.objectContaining({
            id: "disc-swap",
          })
        )

        expect(response.data.swap.cart).toEqual(
          expect.objectContaining({
            id: "disc-swap-cart",
            discount_total: -800,
            shipping_total: 1000,
            subtotal: -8000,
            total: -6200,
          })
        )
      })
    })

    describe("GET /admin/swaps/", () => {
      beforeEach(async () => {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)
        await swapSeeder(dbConnection)
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("lists all swaps", async () => {
        const api = useApi()

        const response = await api
          .get("/admin/swaps/", {
            headers: {
              Authorization: "Bearer test_token",
            },
          })
          .catch((err) => {
            console.log(err)
          })

        expect(response.status).toEqual(200)
        expect(response.data).toHaveProperty("count")
        expect(response.data.offset).toBe(0)
        expect(response.data.limit).toBe(50)
        expect(response.data.swaps).toContainEqual(
          expect.objectContaining({
            id: "test-swap",
          })
        )
      })
    })

    describe("Complete swap flow", () => {
      beforeEach(async () => {
        try {
          await adminSeeder(dbConnection)
        } catch (err) {
          console.log(err)
          throw err
        }
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("completes swap and ensures difference due", async () => {
        // ********* FACTORIES *********
        const prodA = await simpleProductFactory(dbConnection, {
          id: "prod-a",
          variants: [
            { id: "prod-a-var", prices: [{ amount: 1000, currency: "dkk" }] },
          ],
        })

        await simpleProductFactory(dbConnection, {
          id: "prod-b",
          variants: [
            { id: "prod-b-var", prices: [{ amount: 1000, currency: "dkk" }] },
          ],
        })

        await simpleRegionFactory(dbConnection, {
          id: "test-region",
          currency_code: "dkk",
        })

        await simpleDiscountFactory(dbConnection, {
          id: "test-discount",
          regions: ["test-region"],
          code: "TEST",
          rule: {
            type: "percentage",
            value: "10",
            allocation: "total",
            conditions: [
              {
                type: "products",
                operator: "in",
                products: [prodA.id],
              },
            ],
          },
        })

        await simpleCustomerFactory(dbConnection, {
          id: "test-customer",
          email: "test@customer.com",
        })

        const so = await simpleShippingOptionFactory(dbConnection, {
          region_id: "test-region",
        })

        await simpleCartFactory(dbConnection, {
          customer: "test-customer",
          id: "cart-test",
          line_items: [
            {
              id: "line-item",
              variant_id: "prod-a-var",
              cart_id: "cart-test",
              unit_price: 1000,
              quantity: 1,
            },
          ],
          region: "test-region",
          shipping_address: {
            address_1: "test",
            country_code: "us",
            first_name: "chris",
            last_name: "rock",
            postal_code: "101",
          },
        })

        const api = useApi()

        // ********* PREPARE CART *********

        try {
          await api.post("/store/carts/cart-test", {
            discounts: [{ code: "TEST" }],
          })
        } catch (error) {
          console.log(error)
        }

        await api.post("/store/carts/cart-test/shipping-methods", {
          option_id: so.id,
          data: {},
        })
        await api.post("/store/carts/cart-test/payment-sessions")
        await api.post("/store/carts/cart-test/payment-session", {
          provider_id: "test-pay",
        })

        // ********* COMPLETE CART *********
        const completedOrder = await api.post("/store/carts/cart-test/complete")

        // ********* PREPARE ORDER *********
        const orderId = completedOrder.data.data.id
        const fulfilledOrder = await api.post(
          `/admin/orders/${orderId}/fulfillment`,
          {
            items: [{ item_id: "line-item", quantity: 1 }],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )

        const fulfillmentId = fulfilledOrder.data.order.fulfillments[0].id

        await api.post(
          `/admin/orders/${orderId}/shipment`,
          {
            fulfillment_id: fulfillmentId,
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )

        await api.post(
          `/admin/orders/${orderId}/capture`,
          {},
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )

        // ********* CREATE SWAP *********
        const createSwap = await api.post(
          `/admin/orders/${completedOrder.data.data.id}/swaps`,
          {
            return_items: [
              {
                item_id: "line-item",
                quantity: 1,
              },
            ],
            additional_items: [{ variant_id: "prod-b-var", quantity: 1 }],
          },
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
        )

        let swap = createSwap.data.order.swaps[0]

        // ********* PREPARE SWAP CART *********
        await api.post(`/store/carts/${swap.cart_id}/shipping-methods`, {
          option_id: so.id,
          data: {},
        })

        await api.post(`/store/carts/${swap.cart_id}/payment-sessions`)
        await api.post(`/store/carts/${swap.cart_id}/payment-session`, {
          provider_id: "test-pay",
        })

        // ********* COMPLETE SWAP CART *********
        await api.post(`/store/carts/${swap.cart_id}/complete`)

        swap = await api
          .get(`/admin/swaps/${swap.id}`, {
            headers: {
              Authorization: "Bearer test_token",
            },
          })
          .catch((err) => {
            console.log(err)
          })

        const swapCart = await api.get(
          `/store/carts/${swap.data.swap.cart_id}`,
          {}
        )

        // ********* VALIDATE  *********
        expect(swap.data.swap.difference_due).toBe(swapCart.data.cart.total)
      })
    })
  })
  describe("tax inclusive", () => {
    let medusaProcess
    let dbConnection

    beforeAll(async () => {
      const cwd = path.resolve(path.join(__dirname, "..", ".."))
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

    describe("Complete swap flow with discount", () => {
      beforeEach(async () => {
        try {
          await adminSeeder(dbConnection)
        } catch (err) {
          console.log(err)
          throw err
        }
      })

      afterEach(async () => {
        const db = useDb()
        await db.teardown()
      })

      it("completes swap and ensures difference due", async () => {
        // ********* FACTORIES *********
        await simpleRegionFactory(dbConnection, {
          id: "test-region",
          currency_code: "dkk",
          includes_tax: true,
        })

        const prodA = await simpleProductFactory(dbConnection, {
          id: "prod-a",
          variants: [
            {
              id: "prod-a-var",
              prices: [
                { amount: 1000, currency: "dkk", region_id: "test-region" },
              ],
            },
          ],
        })

        await simpleProductFactory(dbConnection, {
          id: "prod-b",
          variants: [
            {
              id: "prod-b-var",
              prices: [
                { amount: 1000, currency: "dkk", region_id: "test-region" },
              ],
            },
          ],
        })

        await simpleDiscountFactory(dbConnection, {
          id: "test-discount",
          regions: ["test-region"],
          code: "TEST",
          rule: {
            type: "fixed",
            value: "10",
            allocation: "total",
          },
        })

        await simpleCustomerFactory(dbConnection, {
          id: "test-customer",
          email: "test@customer.com",
        })

        const so = await simpleShippingOptionFactory(dbConnection, {
          region_id: "test-region",
        })

        await simpleCartFactory(dbConnection, {
          customer: "test-customer",
          id: "cart-test",
          line_items: [
            {
              id: "line-item",
              includes_tax: true,
              variant_id: "prod-a-var",
              cart_id: "cart-test",
              unit_price: 1000,
              quantity: 1,
            },
          ],
          region: "test-region",
          shipping_address: {
            address_1: "test",
            country_code: "us",
            first_name: "chris",
            last_name: "rock",
            postal_code: "101",
          },
        })

        const api = useApi()

        // ********* PREPARE CART *********

        try {
          await api.post("/store/carts/cart-test", {
            discounts: [{ code: "TEST" }],
          })
        } catch (error) {
          console.log(error)
        }

        await api.post("/store/carts/cart-test/shipping-methods", {
          option_id: so.id,
          data: {},
        })
        await api.post("/store/carts/cart-test/payment-sessions")
        await api.post("/store/carts/cart-test/payment-session", {
          provider_id: "test-pay",
        })

        // ********* COMPLETE CART *********
        const completedOrder = await api.post("/store/carts/cart-test/complete")

        // ********* PREPARE ORDER *********
        const orderId = completedOrder.data.data.id
        const fulfilledOrder = await api.post(
          `/admin/orders/${orderId}/fulfillment`,
          {
            items: [{ item_id: "line-item", quantity: 1 }],
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )

        const fulfillmentId = fulfilledOrder.data.order.fulfillments[0].id

        await api.post(
          `/admin/orders/${orderId}/shipment`,
          {
            fulfillment_id: fulfillmentId,
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )

        await api.post(
          `/admin/orders/${orderId}/capture`,
          {},
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )

        // ********* CREATE SWAP *********
        const createSwap = await api.post(
          `/admin/orders/${completedOrder.data.data.id}/swaps`,
          {
            return_items: [
              {
                item_id: "line-item",
                quantity: 1,
              },
            ],
            additional_items: [{ variant_id: "prod-b-var", quantity: 1 }],
          },
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
        )

        let swap = createSwap.data.order.swaps[0]

        // ********* PREPARE SWAP CART *********
        await api.post(`/store/carts/${swap.cart_id}/shipping-methods`, {
          option_id: so.id,
          data: {},
        })

        await api.post(`/store/carts/${swap.cart_id}/payment-sessions`)
        await api.post(`/store/carts/${swap.cart_id}/payment-session`, {
          provider_id: "test-pay",
        })

        // ********* COMPLETE SWAP CART *********
        await api.post(`/store/carts/${swap.cart_id}/complete`)

        swap = await api
          .get(`/admin/swaps/${swap.id}`, {
            headers: {
              Authorization: "Bearer test_token",
            },
          })
          .catch((err) => {
            console.log(err)
          })

        const swapCart = await api.get(
          `/store/carts/${swap.data.swap.cart_id}`,
          {}
        )

        // ********* VALIDATE *********
        expect(swap.data.swap.difference_due).toBe(swapCart.data.cart.total)
      })
    })
  })
})
