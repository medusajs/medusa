const path = require("path")

const setupServer = require("../../../../helpers/setup-server")
const { useApi } = require("../../../../helpers/use-api")
const { initDb, useDb } = require("../../../../helpers/use-db")

const draftOrderSeeder = require("../../../helpers/draft-order-seeder")
const adminSeeder = require("../../../helpers/admin-seeder")
const { simpleDiscountFactory } = require("../../../factories")

jest.setTimeout(30000)

const adminReqConfig = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/draft-orders", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({ cwd })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("POST /admin/draft-orders", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await draftOrderSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a draft order cart", async () => {
      const api = useApi()

      await simpleDiscountFactory(dbConnection, {
        code: "testytest",
        regions: ["test-region"],
      })

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        discounts: [{ code: "testytest" }],
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )
      expect(response.status).toEqual(200)
    })

    it("creates a draft order with a custom shipping option price", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
            price: 500,
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )
      expect(response.status).toEqual(200)

      const draftOrderId = response.data.draft_order.id

      const draftOrderResponse = await api.get(
        `/admin/draft-orders/${draftOrderId}`,
        adminReqConfig
      )
      expect(draftOrderResponse.status).toEqual(200)
      expect(draftOrderResponse.data.draft_order.cart.shipping_total).toEqual(
        500
      )
    })

    it("creates a draft order with a billing address that is an AddressPayload and a shipping address that is an ID", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        billing_address: {
          first_name: "kap",
          last_name: "test",
          country_code: "us",
        },
        shipping_address: "oli-shipping",
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const {
        status,
        data: { draft_order },
      } = await api.post("/admin/draft-orders", payload, adminReqConfig)

      expect(status).toEqual(200)
      expect(draft_order.cart.billing_address_id).not.toBeNull()
      expect(draft_order.cart.shipping_address_id).not.toBeNull()

      const afterCreate = await api.get(
        `/admin/draft-orders/${draft_order.id}`,
        adminReqConfig
      )

      expect(afterCreate.data.draft_order.cart.shipping_address).toEqual(
        expect.objectContaining({
          id: "oli-shipping",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
      expect(afterCreate.data.draft_order.cart.billing_address).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          first_name: "kap",
          last_name: "test",
          country_code: "us",
        })
      )
    })

    it("creates a draft order with a shipping address that is an AddressPayload and a billing adress that is an ID", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        shipping_address: {
          first_name: "kap",
          last_name: "test",
          country_code: "us",
        },
        billing_address: "oli-shipping",
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const {
        status,
        data: { draft_order },
      } = await api.post("/admin/draft-orders", payload, adminReqConfig)

      expect(status).toEqual(200)
      expect(draft_order.cart.billing_address_id).not.toBeNull()
      expect(draft_order.cart.shipping_address_id).not.toBeNull()

      const afterCreate = await api.get(
        `/admin/draft-orders/${draft_order.id}`,
        adminReqConfig
      )

      expect(afterCreate.data.draft_order.cart.billing_address).toEqual(
        expect.objectContaining({
          id: "oli-shipping",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        })
      )
      expect(afterCreate.data.draft_order.cart.shipping_address).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          first_name: "kap",
          last_name: "test",
          country_code: "us",
        })
      )
    })

    it("creates a draft order cart and creates new user", async () => {
      const api = useApi()

      const payload = {
        email: "non-existing@test.dk",
        customer_id: "non-existing",
        shipping_address: "oli-shipping",
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: "test-region",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      const draftOrder = response.data.draft_order

      expect(draftOrder.cart.customer_id).toBeDefined()
      expect(draftOrder.cart.email).toEqual("non-existing@test.dk")
    })

    it("fails to create a draft order with option requirement", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        items: [
          {
            quantity: 1,
            metadata: {},
            unit_price: 1,
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option-req",
          },
        ],
      }

      const response = await api
        .post("/admin/draft-orders", payload, adminReqConfig)
        .catch((err) => {
          return err.response
        })
      expect(response.status).toEqual(400)
    })

    it("creates a draft order with option requirement", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
          {
            quantity: 1,
            metadata: {},
            unit_price: 10000,
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option-req",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )
      expect(response.status).toEqual(200)
    })

    it("creates a draft order with custom item", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
          {
            quantity: 1,
            metadata: {},
            unit_price: 10000,
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )
      expect(response.status).toEqual(200)
    })

    it("creates a draft order without a single item", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )
      expect(response.data.draft_order.cart.items).toEqual([])
      expect(response.status).toEqual(200)
    })

    it("creates a draft order with product variant with custom price and custom item price set to 0", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        discounts: [{ code: "TEST" }],
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
            unit_price: 10000000,
          },
          {
            quantity: 2,
            metadata: {},
            unit_price: -1000,
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )

      const created = await api.get(
        `/admin/draft-orders/${response.data.draft_order.id}`,
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(created.data.draft_order.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant",
            unit_price: 10000000,
          }),
          expect.objectContaining({
            unit_price: 0,
          }),
        ])
      )
      // Check that discount is applied
      expect(created.data.draft_order.cart.discounts[0]).toEqual(
        expect.objectContaining({
          code: "TEST",
        })
      )
    })

    it("creates a draft order with discount and line item", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        discounts: [{ code: "TEST" }],
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )

      const draftOrder = response.data.draft_order
      const lineItemId = draftOrder.cart.items[0].id

      expect(response.status).toEqual(200)
      expect(draftOrder.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant",
            unit_price: 8000,
            quantity: 2,
            adjustments: expect.arrayContaining([
              expect.objectContaining({
                item_id: lineItemId,
                amount: 1600,
                description: "discount",
                discount_id: "test-discount",
              }),
            ]),
          }),
        ])
      )
    })

    it("creates a draft order with fixed discount amount allocated to the total", async () => {
      const api = useApi()

      const testVariantId = "test-variant"
      const testVariant2Id = "test-variant-2"
      const discountAmount = 1000

      const discount = await simpleDiscountFactory(dbConnection, {
        code: "test-fixed",
        regions: ["test-region"],
        rule: {
          type: "fixed",
          allocation: "total",
          value: discountAmount,
        },
      })

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        discounts: [{ code: discount.code }],
        items: [
          {
            variant_id: testVariantId,
            quantity: 2,
            metadata: {},
          },
          {
            variant_id: testVariant2Id,
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      const draftOrder = response.data.draft_order
      const lineItem1 = draftOrder.cart.items.find(
        (item) => item.variant_id === testVariantId
      )
      const lineItem2 = draftOrder.cart.items.find(
        (item) => item.variant_id === testVariant2Id
      )

      expect(draftOrder.cart.items).toHaveLength(2)

      expect(lineItem1.adjustments).toHaveLength(1)
      expect(lineItem1.adjustments[0].amount).toBeCloseTo(444, 0) // discountAmount * (line item amount / amount) = 444.4444444444
      expect(lineItem1).toEqual(
        expect.objectContaining({
          variant_id: testVariantId,
          unit_price: lineItem1.unit_price,
          quantity: lineItem1.quantity,
          adjustments: expect.arrayContaining([
            expect.objectContaining({
              item_id: lineItem1.id,
              description: "discount",
              discount_id: discount.id,
            }),
          ]),
        })
      )

      expect(lineItem2.adjustments).toHaveLength(1)
      expect(lineItem2.adjustments[0].amount).toBeCloseTo(556, 0) // discountAmount * (line item amount / amount) = 555.5555555555
      expect(lineItem2).toEqual(
        expect.objectContaining({
          variant_id: testVariant2Id,
          unit_price: lineItem2.unit_price,
          quantity: lineItem2.quantity,
          adjustments: expect.arrayContaining([
            expect.objectContaining({
              item_id: lineItem2.id,
              description: "discount",
              discount_id: discount.id,
            }),
          ]),
        })
      )
    })

    it("creates a draft order with discount and free shipping along the line item", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        shipping_address: "oli-shipping",
        discounts: [{ code: "TEST" }, { code: "free-shipping" }],
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )

      const created = await api.get(
        `/admin/draft-orders/${response.data.draft_order.id}`,
        adminReqConfig
      )

      const draftOrder = created.data.draft_order
      const lineItemId = draftOrder.cart.items[0].id

      expect(response.status).toEqual(200)
      expect(draftOrder.cart.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant",
            unit_price: 8000,
            quantity: 2,
            adjustments: expect.arrayContaining([
              expect.objectContaining({
                item_id: lineItemId,
                amount: 1600,
                description: "discount",
                discount_id: "test-discount",
              }),
            ]),
          }),
        ])
      )

      // Check that discounts are applied
      expect(draftOrder.cart.discounts).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            code: "TEST",
          }),
          expect.objectContaining({
            code: "FREE-SHIPPING",
          }),
        ])
      )
    })

    it("creates a draft order with created shipping address", async () => {
      const api = useApi()

      const payload = {
        email: "oli@test.dk",
        shipping_address: {
          first_name: "new",
          last_name: "one",
          address_1: "New place 1",
          city: "Copenhagen",
          country_code: "us",
          postal_code: "2100",
        },
        items: [
          {
            variant_id: "test-variant",
            quantity: 2,
            metadata: {},
          },
          {
            quantity: 1,
            metadata: {},
            unit_price: 10000,
          },
        ],
        region_id: "test-region",
        customer_id: "oli-test",
        shipping_methods: [
          {
            option_id: "test-option",
          },
        ],
      }

      const response = await api.post(
        "/admin/draft-orders",
        payload,
        adminReqConfig
      )
      expect(response.status).toEqual(200)
    })

    it("creates a draft order and registers manual payment", async () => {
      const api = useApi()

      // register system payment for draft order
      const orderResponse = await api.post(
        `/admin/draft-orders/test-draft-order/pay`,
        {},
        adminReqConfig
      )

      const createdOrder = await api.get(
        `/admin/orders/${orderResponse.data.order.id}`,
        adminReqConfig
      )

      const updatedDraftOrder = await api.get(
        `/admin/draft-orders/test-draft-order`,
        adminReqConfig
      )

      expect(orderResponse.status).toEqual(200)
      // expect newly created order to have id of draft order
      expect(createdOrder.data.order.draft_order_id).toEqual("test-draft-order")
      // expect system payment provider and the payment to be "captured"
      expect(createdOrder.data.order.payments.length).toEqual(1)
      expect(createdOrder.data.order.payments[0].provider_id).toEqual("system")
      expect(createdOrder.data.order.payments[0].captured_at).not.toEqual(null)

      // expect draft order to be complete
      expect(updatedDraftOrder.data.draft_order.status).toEqual("completed")
      expect(updatedDraftOrder.data.draft_order.completed_at).not.toEqual(null)
    })
  })

  describe("GET /admin/draft-orders", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await draftOrderSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists draft orders", async () => {
      const api = useApi()

      const response = await api.get("/admin/draft-orders", adminReqConfig)

      expect(response.status).toEqual(200)

      expect(response.data.draft_orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "test-draft-order" }),
        ])
      )
    })

    it("lists draft orders with query", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/draft-orders?q=oli@test",
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      expect(response.data.draft_orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            cart: expect.objectContaining({ email: "oli@test.dk" }),
          }),
        ])
      )
    })

    it("lists no draft orders on query for non-existing email", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/draft-orders?q=heyo@heyo.dk",
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      expect(response.data.draft_orders).toEqual([])
      expect(response.data.count).toEqual(0)
    })
  })

  describe("GET /admin/draft-orders/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await draftOrderSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("retrieves a draft-order should include the items totals", async () => {
      const api = useApi()

      const order = await api.get(
        "/admin/draft-orders/test-draft-order",
        adminReqConfig
      )

      expect(order.status).toEqual(200)
      expect(order.data.draft_order).toEqual(
        expect.objectContaining({
          id: "test-draft-order",
        })
      )

      order.data.draft_order.cart.items.forEach((item) => {
        expect(item.total).toBeDefined()
        expect(item.subtotal).toBeDefined()
      })
    })
  })

  describe("DELETE /admin/draft-orders/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await draftOrderSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("deletes a draft order", async () => {
      const api = useApi()

      const response = await api.delete(
        "/admin/draft-orders/test-draft-order",
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      expect(response.data).toEqual({
        id: "test-draft-order",
        object: "draft-order",
        deleted: true,
      })
    })
  })

  describe("POST /admin/draft-orders/:id/line-items/:line_id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await draftOrderSeeder(dbConnection, { status: "open" })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates a line item on the draft order", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/draft-orders/test-draft-order/line-items/test-item",
        {
          title: "Update title",
          unit_price: 1000,
        },
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      const updatedDraftOrder = await api.get(
        `/admin/draft-orders/test-draft-order`,
        adminReqConfig
      )

      const item = updatedDraftOrder.data.draft_order.cart.items[0]

      expect(item.title).toEqual("Update title")
      expect(item.unit_price).toEqual(1000)
      expect(updatedDraftOrder.data.draft_order.cart.subtotal).not.toEqual(
        undefined
      )
      expect(updatedDraftOrder.data.draft_order.cart.subtotal).not.toEqual(0)
    })

    it("removes the line item, if quantity is 0", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/draft-orders/test-draft-order/line-items/test-item",
        {
          title: "Update title",
          quantity: 0,
        },
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      const updatedDraftOrder = await api.get(
        `/admin/draft-orders/test-draft-order`,
        adminReqConfig
      )

      const items = updatedDraftOrder.data.draft_order.cart.items

      expect(items).toEqual([])
    })
  })

  describe("POST /admin/draft-orders/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await draftOrderSeeder(dbConnection, { status: "open" })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates the draft order", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/draft-orders/test-draft-order",
        {
          email: "lebron@james.com",
          billing_address: {
            first_name: "lebron",
            last_name: "james",
            address_1: "hollywood boulevard 1",
            city: "hollywood",
            country_code: "us",
            postal_code: "2100",
          },
          shipping_address: {
            first_name: "lebron",
            last_name: "james",
            address_1: "hollywood boulevard 1",
            city: "hollywood",
            country_code: "us",
            postal_code: "2100",
          },
          discounts: [{ code: "TEST" }],
        },
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      const dorder = response.data.draft_order

      expect(dorder.cart.email).toEqual("lebron@james.com")
      expect(dorder.cart.billing_address.first_name).toEqual("lebron")
      expect(dorder.cart.shipping_address.last_name).toEqual("james")
      expect(dorder.cart.discounts[0].code).toEqual("TEST")
      expect(dorder.cart.total).toEqual(7200)
    })

    it("updates the draft order, removing discount", async () => {
      const api = useApi()

      const updatedDraftOrder = await api.post(
        "/admin/draft-orders/test-draft-order",
        {
          discounts: [{ code: "TEST" }],
        },
        adminReqConfig
      )

      expect(updatedDraftOrder.data.draft_order.cart.total).toEqual(7200)

      const orderWithNoDiscount = await api.post(
        "/admin/draft-orders/test-draft-order",
        {
          discounts: [],
        },
        adminReqConfig
      )

      expect(orderWithNoDiscount.data.draft_order.cart.total).toEqual(8000)
    })
  })
})
