const path = require("path")
const {
  Region,
  Order,
  Customer,
  ShippingProfile,
  Product,
  ProductVariant,
  LineItem,
  Payment,
} = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")
const { simpleRegionFactory, simpleProductFactory } = require("../../factories")
const { MedusaError } = require("medusa-core-utils")

jest.setTimeout(30000)

describe("/store/carts", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd, verbose: false })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    medusaProcess.kill()
  })

  describe("GET /store/orders", () => {
    beforeEach(async () => {
      const manager = dbConnection.manager
      await manager.query(
        `ALTER SEQUENCE order_display_id_seq RESTART WITH 111`
      )
      await manager.insert(Region, {
        id: "region",
        name: "Test Region",
        currency_code: "usd",
        tax_rate: 0,
      })
      await manager.insert(Customer, {
        id: "cus_1234",
        email: "test@email.com",
      })
      await manager.insert(Order, {
        id: "order_test",
        email: "test@email.com",
        display_id: 111,
        customer_id: "cus_1234",
        region_id: "region",
        tax_rate: 0,
        currency_code: "usd",
      })

      const defaultProfile = await manager.findOne(ShippingProfile, {
        type: "default",
      })
      await manager.insert(Product, {
        id: "test-product",
        title: "test product",
        profile_id: defaultProfile.id,
        options: [{ id: "test-option", title: "Size" }],
      })

      await manager.insert(ProductVariant, {
        id: "test-variant",
        title: "test variant",
        product_id: "test-product",
        inventory_quantity: 1,
        options: [
          {
            option_id: "test-option",
            value: "Size",
          },
        ],
      })

      await manager.insert(LineItem, {
        id: "test-item",
        fulfilled_quantity: 1,
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 1,
        variant_id: "test-variant",
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("looks up order", async () => {
      const api = useApi()

      const response = await api
        .get("/store/orders?display_id=111&email=test@email.com")
        .catch((err) => {
          return err.response
        })
      expect(response.status).toEqual(200)
      expect(response.data.order.display_id).toEqual(111)
      expect(response.data.order.email).toEqual("test@email.com")
    })

    it("fails if display_id + email not provided", async () => {
      const api = useApi()

      const response = await api
        .get("/store/orders?display_id=111")
        .catch((err) => {
          return err.response
        })
      expect(response.status).toEqual(400)
    })

    it("fails if display_id + email not provided", async () => {
      const api = useApi()

      const response = await api
        .get("/store/orders?email=test@email.com")
        .catch((err) => {
          return err.response
        })
      expect(response.status).toEqual(400)
    })

    it("fails if email not correct", async () => {
      const api = useApi()

      const response = await api
        .get("/store/orders?display_id=111&email=test1@email.com")
        .catch((err) => {
          return err.response
        })

      expect(response.status).toEqual(404)
    })
  })

  describe("Cart Completion with INSUFFICIENT_INVENTORY", () => {
    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("recovers from failed completion", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection)
      const product = await simpleProductFactory(dbConnection)

      const cartRes = await api
        .post("/store/carts", {
          region_id: region.id,
        })
        .catch((err) => {
          return err.response
        })

      const cartId = cartRes.data.cart.id

      await api.post(`/store/carts/${cartId}/line-items`, {
        variant_id: product.variants[0].id,
        quantity: 1,
      })
      await api.post(`/store/carts/${cartId}`, {
        email: "testmailer@medusajs.com",
      })
      await api.post(`/store/carts/${cartId}/payment-sessions`)

      const manager = dbConnection.manager
      await manager.update(
        ProductVariant,
        { id: product.variants[0].id },
        {
          inventory_quantity: 0,
        }
      )

      const responseFail = await api
        .post(`/store/carts/${cartId}/complete`)
        .catch((err) => {
          return err.response
        })

      expect(responseFail.status).toEqual(409)
      expect(responseFail.data.type).toEqual("not_allowed")
      expect(responseFail.data.code).toEqual(
        MedusaError.Codes.INSUFFICIENT_INVENTORY
      )

      let payments = await manager.find(Payment, { cart_id: cartId })
      expect(payments).toHaveLength(1)
      expect(payments).toContainEqual(
        expect.objectContaining({
          canceled_at: expect.any(Date),
        })
      )

      await manager.update(
        ProductVariant,
        { id: product.variants[0].id },
        {
          inventory_quantity: 1,
        }
      )

      const responseSuccess = await api
        .post(`/store/carts/${cartId}/complete`)
        .catch((err) => {
          return err.response
        })

      expect(responseSuccess.status).toEqual(200)
      expect(responseSuccess.data.type).toEqual("order")

      payments = await manager.find(Payment, { cart_id: cartId })
      expect(payments).toHaveLength(2)
      expect(payments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            canceled_at: null,
          }),
        ])
      )
    })
  })

  describe("Cart consecutive completion", () => {
    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should fails on cart already completed", async () => {
      const api = useApi()
      const manager = dbConnection.manager

      const region = await simpleRegionFactory(dbConnection)
      const product = await simpleProductFactory(dbConnection)

      const cartRes = await api
        .post("/store/carts", {
          region_id: region.id,
        })
        .catch((err) => {
          return err.response
        })

      const cartId = cartRes.data.cart.id

      await api.post(`/store/carts/${cartId}/line-items`, {
        variant_id: product.variants[0].id,
        quantity: 1,
      })
      await api.post(`/store/carts/${cartId}`, {
        email: "testmailer@medusajs.com",
      })
      await api.post(`/store/carts/${cartId}/payment-sessions`)

      const responseSuccess = await api
        .post(`/store/carts/${cartId}/complete`)
        .catch((err) => {
          return err.response
        })

      expect(responseSuccess.status).toEqual(200)
      expect(responseSuccess.data.type).toEqual("order")

      const payments = await manager.find(Payment, { cart_id: cartId })
      expect(payments).toHaveLength(1)
      expect(payments).toContainEqual(
        expect.objectContaining({
          canceled_at: null,
        })
      )

      const responseFail = await api
        .post(`/store/carts/${cartId}/complete`)
        .catch((err) => {
          return err.response
        })

      expect(responseFail.status).toEqual(409)
      expect(responseFail.data.code).toEqual("cart_incompatible_state")
      expect(responseFail.data.message).toEqual(
        "Cart has already been completed"
      )
    })
  })
})
