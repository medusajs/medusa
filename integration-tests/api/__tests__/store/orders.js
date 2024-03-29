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
  PaymentSession,
} = require("@medusajs/medusa")

const setupServer = require("../../../environment-helpers/setup-server")
const { useApi } = require("../../../environment-helpers/use-api")
const { initDb, useDb } = require("../../../environment-helpers/use-db")
const {
  simpleRegionFactory,
  simpleProductFactory,
  simpleCartFactory,
  simpleShippingOptionFactory,
  simpleOrderFactory,
} = require("../../../factories")
const { MedusaError } = require("medusa-core-utils")

jest.setTimeout(30000)

describe("/store/carts", () => {
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
        where: {
          type: ShippingProfile.default,
        },
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

    it("retrieves an order by id, with totals", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection)
      const product = await simpleProductFactory(dbConnection)

      const cartRes = await api.post("/store/carts", {
        region_id: region.id,
      })

      const cartId = cartRes.data.cart.id

      await api.post(`/store/carts/${cartId}/line-items`, {
        variant_id: product.variants[0].id,
        quantity: 1,
      })

      await api.post(`/store/carts/${cartId}`, {
        email: "testmailer@medusajs.com",
      })

      await api.post(`/store/carts/${cartId}/payment-sessions`).catch((err) => {
        console.error("Error creating payment session: ", err.response.data)
        return err.response
      })

      const responseSuccess = await api.post(`/store/carts/${cartId}/complete`)

      const orderId = responseSuccess.data.data.id

      const response = await api.get("/store/orders/" + orderId)

      expect(response.status).toEqual(200)
      expect(response.data.order).toEqual(
        expect.objectContaining({
          id: orderId,
          total: 100,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          tax_total: 0,
          subtotal: 100,
          discount_total: 0,
          shipping_total: 0,
          refunded_total: 0,
          paid_total: 100,
        })
      )
    })

    it("retrieves an order by cart id, with totals", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection)
      const product = await simpleProductFactory(dbConnection)

      const cartRes = await api.post("/store/carts", {
        region_id: region.id,
      })

      const cartId = cartRes.data.cart.id

      await api.post(`/store/carts/${cartId}/line-items`, {
        variant_id: product.variants[0].id,
        quantity: 1,
      })

      await api.post(`/store/carts/${cartId}`, {
        email: "testmailer@medusajs.com",
      })

      await api.post(`/store/carts/${cartId}/payment-sessions`).catch((err) => {
        console.error("Error creating payment session: ", err.response.data)
        return err.response
      })

      const responseSuccess = await api.post(`/store/carts/${cartId}/complete`)

      const orderId = responseSuccess.data.data.id

      const response = await api.get("/store/orders/cart/" + cartId)

      expect(response.status).toEqual(200)
      expect(response.data.order).toEqual(
        expect.objectContaining({
          id: orderId,
          cart_id: cartId,
          total: 100,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          tax_total: 0,
          subtotal: 100,
          discount_total: 0,
          shipping_total: 0,
          refunded_total: 0,
          paid_total: 100,
        })
      )
    })

    it("lookup order response contains only fields defined with `fields` param", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/orders?display_id=111&email=test@email.com&fields=status,email"
      )

      expect(Object.keys(response.data.order)).toHaveLength(24)
      expect(Object.keys(response.data.order)).toEqual(
        expect.arrayContaining([
          "id",
          "created_at",

          // fields
          "status",
          "email",

          // relations
          "shipping_address",
          "fulfillments",
          "items",
          "shipping_methods",
          "discounts",
          "customer",
          "payments",
          "region",

          // totals
          "shipping_total",
          "discount_total",
          "tax_total",
          "refunded_total",
          "total",
          "subtotal",
          "paid_total",
          "refundable_amount",
          "gift_card_total",
          "gift_card_tax_total",
        ])
      )
    })

    it("get order response contains only fields defined with `fields` param", async () => {
      const api = useApi()

      const response = await api.get("/store/orders/order_test?fields=status")

      expect(Object.keys(response.data.order)).toHaveLength(22)
      expect(Object.keys(response.data.order)).toEqual(
        expect.arrayContaining([
          "id",

          // fields
          "status",

          // default relations
          "shipping_address",
          "fulfillments",
          "items",
          "shipping_methods",
          "discounts",
          "customer",
          "payments",
          "region",

          // totals
          "shipping_total",
          "discount_total",
          "tax_total",
          "refunded_total",
          "total",
          "subtotal",
          "paid_total",
          "refundable_amount",
          "gift_card_total",
          "gift_card_tax_total",
        ])
      )
    })

    it("get order response contains only fields defined with `fields` and `expand` param", async () => {
      const api = useApi()

      const response = await api.get(
        "/store/orders/order_test?fields=status&expand=billing_address"
      )

      expect(Object.keys(response.data.order).sort()).toEqual(
        [
          "id",
          // fields
          "status",

          // selected relations
          "billing_address",

          // totals
          "shipping_total",
          "discount_total",
          "tax_total",
          "refunded_total",
          "total",
          "subtotal",
          "paid_total",
          "refundable_amount",
          "gift_card_total",
          "gift_card_tax_total",
          "item_tax_total",
          "shipping_tax_total",
        ].sort()
      )
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
      expect(responseFail.data.errors[0].type).toEqual("not_allowed")
      expect(responseFail.data.errors[0].code).toEqual(
        MedusaError.Codes.INSUFFICIENT_INVENTORY
      )

      let payments = await manager.find(Payment, { where: { cart_id: cartId } })
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

      payments = await manager.find(Payment, { where: { cart_id: cartId } })
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

    it("should return an order on cart already completed", async () => {
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

      const payments = await manager.find(Payment, {
        where: { cart_id: cartId },
      })
      expect(payments).toHaveLength(1)
      expect(payments).toContainEqual(
        expect.objectContaining({
          canceled_at: null,
        })
      )

      const successRes = await api.post(`/store/carts/${cartId}/complete`)

      expect(successRes.status).toEqual(200)
      expect(successRes.data.data).toEqual(
        expect.objectContaining({
          cart_id: cartId,
          id: expect.any(String),
        })
      )
      expect(successRes.data.type).toEqual("order")
    })
  })

  describe("Cart completion with failed payment removes taxlines", () => {
    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should remove taxlines when a cart completion fails", async () => {
      expect.assertions(2)

      const api = useApi()

      const region = await simpleRegionFactory(dbConnection)
      const product = await simpleProductFactory(dbConnection)

      const cartRes = await api.post("/store/carts", {})
      const cartId = cartRes.data.cart.id

      await api.post(`/store/carts/${cartId}/line-items`, {
        variant_id: product.variants[0].id,
        quantity: 1,
      })
      await api.post(`/store/carts/${cartId}`, {
        email: "testmailer@medusajs.com",
      })
      await api.post(`/store/carts/${cartId}/payment-sessions`)

      const cartResponse = await api.get(`/store/carts/${cartId}`)

      await dbConnection.manager.remove(
        PaymentSession,
        cartResponse.data.cart.payment_session
      )

      await api.post(`/store/carts/${cartId}/complete`).catch((err) => {
        expect(err.response.status).toEqual(400)
      })

      const lineItem = await dbConnection.manager.findOne(LineItem, {
        where: {
          id: cartResponse.data.cart.items[0].id,
        },
        relations: ["tax_lines"],
      })

      expect(lineItem.tax_lines).toHaveLength(0)
    })

    it("should remove taxlines when a payment authorization is pending", async () => {
      const cartId = "cart-id-tax-line-testing-for-pending-payment"

      const api = useApi()

      const region = await simpleRegionFactory(dbConnection)
      const shippingOption = await simpleShippingOptionFactory(dbConnection, {
        region_id: region.id,
      })
      const shippingOption1 = await simpleShippingOptionFactory(dbConnection, {
        region_id: region.id,
      })
      const product = await simpleProductFactory(dbConnection)

      const cart = await simpleCartFactory(dbConnection, {
        region: region.id,
        id: cartId,
      })

      await api.post(
        `/store/carts/${cartId}/shipping-methods`,
        {
          option_id: shippingOption.id,
        },
        { withCredentials: true }
      )

      await api.post(`/store/carts/${cartId}/line-items`, {
        variant_id: product.variants[0].id,
        quantity: 1,
      })
      await api.post(`/store/carts/${cartId}`, {
        email: "testmailer@medusajs.com",
      })
      await api.post(`/store/carts/${cartId}/payment-sessions`)

      const cartResponse = await api.get(`/store/carts/${cartId}`)

      const completedOrder = await api.post(`/store/carts/${cartId}/complete`)

      expect(completedOrder.status).toEqual(200)
      expect(completedOrder.data).toEqual(
        expect.objectContaining({
          data: expect.any(Object),
          payment_status: "pending",
          type: "cart",
        })
      )

      const lineItem = await dbConnection.manager.findOne(LineItem, {
        where: {
          id: cartResponse.data.cart.items[0].id,
        },
        relations: ["tax_lines"],
      })

      const cartWithShippingMethod1 = await api.post(
        `/store/carts/${cartId}/shipping-methods`,
        {
          option_id: shippingOption1.id,
        },
        { withCredentials: true }
      )

      expect(
        cartWithShippingMethod1.data.cart.shipping_methods[0].shipping_option_id
      ).toEqual(shippingOption1.id)
      expect(lineItem.tax_lines).toHaveLength(0)
    })
  })
})
