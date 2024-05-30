const path = require("path")
const {
  ReturnReason,
  Order,
  LineItem,
  CustomShippingOption,
  ShippingMethod,
  Fulfillment,
} = require("@medusajs/medusa")
const idMap = require("medusa-test-utils/src/id-map").default

const setupServer = require("../../../../environment-helpers/setup-server")
const { useApi } = require("../../../../environment-helpers/use-api")
const { initDb, useDb } = require("../../../../environment-helpers/use-db")

const orderSeeder = require("../../../../helpers/order-seeder")
const swapSeeder = require("../../../../helpers/swap-seeder")
const adminSeeder = require("../../../../helpers/admin-seeder")
const claimSeeder = require("../../../../helpers/claim-seeder")

const {
  expectPostCallToReturn,
  expectAllPostCallsToReturn,
  callGet,
  partial,
} = require("../../../../helpers/call-helpers")
const {
  simpleShippingOptionFactory,
  simpleOrderFactory,
  simplePaymentFactory,
  simpleProductFactory,
  simpleLineItemFactory,
} = require("../../../../factories")

const adminReqConfig = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

jest.setTimeout(30000)

describe("/admin/orders", () => {
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

  describe("GET /admin/orders", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("gets orders", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/orders", adminReqConfig)
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)
    })

    it("gets orders ordered by display_id", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/orders?order=display_id", adminReqConfig)
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)

      const sortedOrders = response.data.orders.sort((a, b) => {
        return a.display_id - b.display_id
      })

      expect(response.data.orders).toEqual(sortedOrders)
    })
  })

  describe("POST /admin/orders/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("updates a shipping adress", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/orders/test-order",
          {
            email: "test@test.com",
            shipping_address: {
              address_1: "Some Street",
              address_2: "",
              province: "",
              postal_code: "1235",
              city: "losangeles",
              country_code: "us",
            },
          },
          adminReqConfig
        )
        .catch((err) => {
          console.log(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.order.shipping_address).toMatchSnapshot({
        id: expect.any(String),
        address_1: "Some Street",
        address_2: "",
        province: "",
        postal_code: "1235",
        city: "losangeles",
        country_code: "us",
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    })

    it("creates a billing address", async () => {
      const api = useApi()

      await dbConnection.manager.query(
        `update "order" set billing_address_id = null where id = 'test-order'`
      )

      const response = await api
        .post(
          "/admin/orders/test-order",
          {
            billing_address: {
              first_name: "asafas",
              last_name: "safas",
              address_1: "asfsa",
              city: "safas",
              country_code: "us",
              postal_code: "3243",
            },
          },
          adminReqConfig
        )
        .catch((err) => {
          console.log(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.order.billing_address).toEqual(
        expect.objectContaining({
          first_name: "asafas",
          last_name: "safas",
          address_1: "asfsa",
          city: "safas",
          country_code: "us",
          postal_code: "3243",
        })
      )
    })

    it("creates a shipping address", async () => {
      const api = useApi()

      await dbConnection.manager.query(
        `update "order" set shipping_address_id = null where id = 'test-order'`
      )

      const response = await api
        .post(
          "/admin/orders/test-order",
          {
            shipping_address: {
              first_name: "asafas",
              last_name: "safas",
              address_1: "asfsa",
              city: "safas",
              country_code: "us",
              postal_code: "3243",
            },
          },
          adminReqConfig
        )
        .catch((err) => {
          console.log(err.response.data)
        })

      expect(response.status).toEqual(200)
      expect(response.data.order.shipping_address).toEqual(
        expect.objectContaining({
          first_name: "asafas",
          last_name: "safas",
          address_1: "asfsa",
          city: "safas",
          country_code: "us",
          postal_code: "3243",
        })
      )
    })
  })

  describe("GET /admin/orders", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)
      await swapSeeder(dbConnection)

      const manager = dbConnection.manager

      const order2 = manager.create(Order, {
        id: "test-order-not-payed",
        customer_id: "test-customer",
        email: "test@email.com",
        fulfillment_status: "not_fulfilled",
        payment_status: "awaiting",
        billing_address: {
          id: "test-billing-address",
          first_name: "lebron",
        },
        shipping_address: {
          id: "test-shipping-address",
          first_name: "lebron",
          country_code: "us",
        },
        region_id: "test-region",
        currency_code: "usd",
        tax_rate: 0,
        discounts: [
          {
            id: "test-discount",
            code: "TEST134",
            is_dynamic: false,
            rule: {
              id: "test-rule",
              description: "Test Discount",
              type: "percentage",
              value: 10,
              allocation: "total",
            },
            is_disabled: false,
            regions: [
              {
                id: "test-region",
              },
            ],
          },
        ],
        payments: [
          {
            id: "test-payment",
            amount: 10000,
            currency_code: "usd",
            amount_refunded: 0,
            provider_id: "test-pay",
            data: {},
          },
        ],
        items: [],
      })

      await manager.save(order2)

      const li2 = manager.create(LineItem, {
        id: "test-item",
        fulfilled_quantity: 0,
        returned_quantity: 0,
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 1,
        variant_id: "test-variant",
        order_id: "test-order-not-payed",
      })

      await manager.save(li2)
      const order3 = manager.create(Order, {
        id: "test-order-not-payed-with-fulfillment",
        customer_id: "test-customer",
        email: "test@email.com",
        fulfillment_status: "not_fulfilled",
        payment_status: "awaiting",
        billing_address: {
          id: "test-billing-address",
          first_name: "lebron",
        },
        shipping_address: {
          id: "test-shipping-address",
          first_name: "lebron",
          country_code: "us",
        },
        region_id: "test-region",
        currency_code: "usd",
        tax_rate: 0,
        discounts: [
          {
            id: "test-discount",
            code: "TEST134",
            is_dynamic: false,
            rule: {
              id: "test-rule",
              description: "Test Discount",
              type: "percentage",
              value: 10,
              allocation: "total",
            },
            is_disabled: false,
            regions: [
              {
                id: "test-region",
              },
            ],
          },
        ],
        payments: [
          {
            id: "test-payment",
            amount: 10000,
            currency_code: "usd",
            amount_refunded: 0,
            provider_id: "test-pay",
            data: {},
          },
        ],
        items: [],
      })

      await manager.save(order3)

      const li3 = manager.create(LineItem, {
        id: "test-item-ful",
        fulfilled_quantity: 1,
        returned_quantity: 0,
        title: "Line Item",
        description: "Line Item Desc",
        thumbnail: "https://test.js/1234",
        unit_price: 8000,
        quantity: 2,
        variant_id: "test-variant",
        order_id: "test-order-not-payed-with-fulfillment",
      })

      await manager.save(li3)

      const ful1 = manager.create(Fulfillment, {
        id: "ful-1",
        order_id: "test-order-not-payed-with-fulfillment",
        provider_id: "test-ful",
        items: [{ item_id: "test-item-ful", quantity: 1 }],
        data: {},
      })

      await manager.save(ful1)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("cancels an order with refund should fail", async () => {
      const api = useApi()

      const refundOrder = await simpleOrderFactory(dbConnection, {
        id: "refunded-order",
        customer_id: "test-customer",
        email: "test@email.com",
        fulfillment_status: "not_fulfilled",
        payment_status: "refunded",
        billing_address: {
          id: "test-billing-address",
          first_name: "lebron",
        },
        shipping_address: {
          id: "test-shipping-address",
          first_name: "lebron",
          country_code: "us",
        },
        region_id: "test-region",
        currency_code: "usd",
        tax_rate: 0,
        discounts: [],
        payments: [],
        items: [],
        refunds: [
          {
            amount: 1000,
            reason: "return",
          },
        ],
      })

      const err = await api
        .post(`/admin/orders/${refundOrder.id}/cancel`, {}, adminReqConfig)
        .catch((e) => e)

      expect(err.response.status).toEqual(400)
      expect(err.response.data.message).toEqual(
        "Order with refund(s) cannot be canceled"
      )
    })

    it("cancels an order and increments inventory_quantity", async () => {
      const api = useApi()

      const initialInventoryRes = await api.get("/store/variants/test-variant")

      expect(initialInventoryRes.data.variant.inventory_quantity).toEqual(1)

      const response = await api
        .post(`/admin/orders/test-order-not-payed/cancel`, {}, adminReqConfig)
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)

      const secondInventoryRes = await api.get("/store/variants/test-variant")

      expect(secondInventoryRes.data.variant.inventory_quantity).toEqual(2)
    })

    it("cancels a fulfillment and then an order and increments inventory_quantity correctly", async () => {
      const api = useApi()

      const initialInventoryRes = await api.get("/store/variants/test-variant")

      expect(initialInventoryRes.data.variant.inventory_quantity).toEqual(1)

      const cancelRes = await api.post(
        `/admin/orders/test-order-not-payed-with-fulfillment/fulfillments/ful-1/cancel`,
        {},
        adminReqConfig
      )

      expect(cancelRes.status).toEqual(200)

      const response = await api.post(
        `/admin/orders/test-order-not-payed-with-fulfillment/cancel`,
        {},
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      const secondInventoryRes = await api.get("/store/variants/test-variant")

      expect(secondInventoryRes.data.variant.inventory_quantity).toEqual(3)
    })

    it("cancels an order but does not increment inventory_quantity of unmanaged variant", async () => {
      const api = useApi()
      const manager = dbConnection.manager

      await manager.query(
        `UPDATE "product_variant"
         SET manage_inventory= false
         WHERE id = 'test-variant'`
      )

      const initialInventoryRes = await api.get("/store/variants/test-variant")

      expect(initialInventoryRes.data.variant.inventory_quantity).toEqual(1)

      const response = await api
        .post(`/admin/orders/test-order-not-payed/cancel`, {}, adminReqConfig)
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)

      const secondInventoryRes = await api.get("/store/variants/test-variant")

      expect(secondInventoryRes.data.variant.inventory_quantity).toEqual(1)
    })
  })

  describe("POST /admin/orders/:id/swaps", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)
      await claimSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a swap on a claim", async () => {
      const api = useApi()

      const swapOnSwap = await api.post(
        "/admin/orders/order-with-claim/swaps",
        {
          return_items: [
            {
              item_id: "test-item-co-2",
              quantity: 1,
            },
          ],
          additional_items: [{ variant_id: "test-variant", quantity: 1 }],
        },
        adminReqConfig
      )

      expect(swapOnSwap.status).toEqual(200)
    })
  })

  describe("POST /admin/orders/:id/claims", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)
      await claimSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a claim", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/orders/test-order/claims",
        {
          type: "replace",
          claim_items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason: "production_failure",
              tags: ["fluff"],
              images: ["https://test.image.com"],
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant",
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )
      expect(response.status).toEqual(200)

      const variant = await api.get("/admin/products", adminReqConfig)

      // find test variant and verify that its inventory quantity has changed
      const toTest = variant.data.products[0].variants.find(
        (v) => v.id === "test-variant"
      )
      expect(toTest.inventory_quantity).toEqual(0)

      expect(response.data.order.claims[0].shipping_address_id).toEqual(
        "test-shipping-address"
      )
      expect(response.data.order.claims[0].shipping_address).toEqual(
        expect.objectContaining({
          first_name: "lebron",
          country_code: "us",
        })
      )

      expect(response.data.order.claims[0].claim_items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item_id: "test-item",
            quantity: 1,
            reason: "production_failure",
            images: expect.arrayContaining([
              expect.objectContaining({
                url: "https://test.image.com",
              }),
            ]),
          }),
        ])
      )

      expect(response.data.order.claims[0].additional_items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant",
            quantity: 1,
          }),
        ])
      )
    })

    it("creates a claim on order with discount", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/orders/discount-order/claims",
          {
            type: "refund",
            claim_items: [
              {
                item_id: "test-item-1",
                quantity: 1,
                reason: "production_failure",
                tags: ["fluff"],
                images: ["https://test.image.com"],
              },
            ],
            additional_items: [
              {
                variant_id: "test-variant",
                quantity: 1,
              },
            ],
          },
          adminReqConfig
        )
        .catch((err) => console.log(err))
      expect(response.status).toEqual(200)
    })

    it("creates a claim on a claim", async () => {
      const api = useApi()

      const claimOnClaim = await api
        .post(
          "/admin/orders/order-with-claim/claims",
          {
            type: "replace",
            claim_items: [
              {
                item_id: "test-item-co-2",
                quantity: 1,
                reason: "production_failure",
                tags: ["fluff"],
                images: ["https://test.image.com"],
              },
            ],
            additional_items: [
              {
                variant_id: "test-variant",
                quantity: 1,
              },
            ],
          },
          adminReqConfig
        )
        .catch((err) => {
          console.log(err)
        })

      expect(claimOnClaim.status).toEqual(200)
    })

    it("creates a claim with a shipping address", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/orders/test-order/claims",
        {
          type: "replace",
          shipping_address: {
            first_name: "test",
            last_name: "testson",
            address_1: "Test",
            city: "testvill",
            postal_code: "12345",
            country_code: "us",
          },
          claim_items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason: "production_failure",
              tags: ["fluff"],
              images: ["https://test.image.com"],
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant",
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )
      expect(response.status).toEqual(200)

      expect(response.data.order.claims[0].shipping_address).toEqual(
        expect.objectContaining({
          first_name: "test",
          last_name: "testson",
          address_1: "Test",
          city: "testvill",
          postal_code: "12345",
          country_code: "us",
        })
      )

      expect(response.data.order.claims[0].claim_items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item_id: "test-item",
            quantity: 1,
            reason: "production_failure",
            images: expect.arrayContaining([
              expect.objectContaining({
                url: "https://test.image.com",
              }),
            ]),
          }),
        ])
      )

      expect(response.data.order.claims[0].additional_items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant",
            quantity: 1,
          }),
        ])
      )
    })

    it("creates a claim with return shipping", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/orders/test-order/claims",
        {
          type: "replace",
          claim_items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason: "production_failure",
              tags: ["fluff"],
              images: ["https://test.image.com"],
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant",
              quantity: 1,
            },
          ],
          return_shipping: { option_id: "test-return-option", price: 0 },
        },
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      expect(response.data.order.claims[0].claim_items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item_id: "test-item",
            quantity: 1,
            reason: "production_failure",
            images: expect.arrayContaining([
              expect.objectContaining({
                url: "https://test.image.com",
              }),
            ]),
          }),
        ])
      )

      expect(response.data.order.claims[0].additional_items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            variant_id: "test-variant",
            quantity: 1,
          }),
        ])
      )

      expect(
        response.data.order.claims[0].return_order.shipping_method
      ).toEqual(
        expect.objectContaining({
          price: 0,
          shipping_option_id: "test-return-option",
        })
      )
    })

    it("updates a claim", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/orders/test-order/claims",
        {
          type: "replace",
          claim_items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason: "production_failure",
              tags: ["fluff"],
              images: ["https://test.image.com"],
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant",
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )
      expect(response.status).toEqual(200)

      const cid = response.data.order.claims[0].id
      const { status, data: updateData } = await api.post(
        `/admin/orders/test-order/claims/${cid}`,
        {
          shipping_methods: [
            {
              id: "test-method",
            },
          ],
        },
        adminReqConfig
      )

      expect(status).toEqual(200)
      expect(updateData.order.claims[0].shipping_methods).toHaveLength(1)
      expect(updateData.order.claims[0].shipping_methods).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-method",
          }),
        ])
      )
    })

    it("updates claim items", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/orders/test-order/claims",
        {
          type: "replace",
          claim_items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason: "production_failure",
              tags: ["fluff"],
              images: ["https://test.image.com"],
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant",
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )
      expect(response.status).toEqual(200)

      let claim = response.data.order.claims[0]
      const cid = claim.id
      const { status, data: updateData } = await api.post(
        `/admin/orders/test-order/claims/${cid}`,
        {
          claim_items: claim.claim_items.map((i) => ({
            id: i.id,
            note: "Something new",
            images: [
              ...i.images.map((i) => ({ id: i.id })),
              { url: "https://new.com/image" },
            ],
            tags: [
              { value: "completely" },
              { value: "NEW" },
              { value: " tags" },
            ],
          })),
        },
        adminReqConfig
      )

      expect(status).toEqual(200)
      expect(updateData.order.claims.length).toEqual(1)

      claim = updateData.order.claims[0]

      expect(claim.claim_items.length).toEqual(1)
      expect(claim.claim_items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: claim.claim_items[0].id,
            reason: "production_failure",
            note: "Something new",
            images: expect.arrayContaining([
              expect.objectContaining({
                url: "https://test.image.com",
              }),
              expect.objectContaining({
                url: "https://new.com/image",
              }),
            ]),
            // tags: expect.arrayContaining([
            //   expect.objectContaining({ value: "completely" }),
            //   expect.objectContaining({ value: "new" }),
            //   expect.objectContaining({ value: "tags" }),
            // ]),
          }),
        ])
      )
    })

    it("updates claim items - removes image", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/orders/test-order/claims",
        {
          type: "replace",
          claim_items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason: "production_failure",
              tags: ["fluff"],
              images: ["https://test.image.com"],
            },
          ],
          additional_items: [
            {
              variant_id: "test-variant",
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )
      expect(response.status).toEqual(200)

      let claim = response.data.order.claims[0]
      const cid = claim.id
      const { status, data: updateData } = await api.post(
        `/admin/orders/test-order/claims/${cid}`,
        {
          claim_items: claim.claim_items.map((i) => ({
            id: i.id,
            note: "Something new",
            images: [],
            tags: [
              { value: "completely" },
              { value: "NEW" },
              { value: " tags" },
            ],
          })),
        },
        adminReqConfig
      )

      expect(status).toEqual(200)
      expect(updateData.order.claims.length).toEqual(1)

      claim = updateData.order.claims[0]

      expect(claim.claim_items.length).toEqual(1)
      expect(claim.claim_items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: claim.claim_items[0].id,
            reason: "production_failure",
            note: "Something new",
            images: [],
            // tags: expect.arrayContaining([
            //   expect.objectContaining({ value: "completely" }),
            //   expect.objectContaining({ value: "new" }),
            //   expect.objectContaining({ value: "tags" }),
            // ]),
          }),
        ])
      )
    })

    it("fulfills a claim", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/orders/test-order/claims",
          {
            type: "replace",
            shipping_methods: [
              {
                id: "test-method",
              },
            ],
            claim_items: [
              {
                item_id: "test-item",
                quantity: 1,
                reason: "production_failure",
                tags: ["fluff"],
                images: ["https://test.image.com"],
              },
            ],
            additional_items: [
              {
                variant_id: "test-variant",
                quantity: 1,
              },
            ],
          },
          adminReqConfig
        )
        .catch((err) => {
          console.log(err)
        })

      const cid = response.data.order.claims[0].id
      const fulRes = await api.post(
        `/admin/orders/test-order/claims/${cid}/fulfillments`,
        {},
        adminReqConfig
      )
      expect(fulRes.status).toEqual(200)
      expect(fulRes.data.order.claims).toHaveLength(1)
      expect(fulRes.data.order.claims).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: cid,
            order_id: "test-order",
            fulfillment_status: "fulfilled",
          }),
        ])
      )

      const fid = fulRes.data.order.claims[0].fulfillments[0].id
      const iid = fulRes.data.order.claims[0].additional_items[0].id

      expect(fulRes.data.order.claims[0].fulfillments).toHaveLength(1)
      expect(fulRes.data.order.claims[0].fulfillments).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            items: [
              {
                fulfillment_id: fid,
                item_id: iid,
                quantity: 1,
              },
            ],
          }),
        ])
      )
    })

    it("creates a claim on a claim additional item", async () => {
      const api = useApi()

      const response = await api
        .post(
          "/admin/orders/test-order/claims",
          {
            type: "replace",
            shipping_methods: [
              {
                id: "test-method",
              },
            ],
            claim_items: [
              {
                item_id: "test-item",
                quantity: 1,
                reason: "production_failure",
                tags: ["fluff"],
                images: ["https://test.image.com"],
              },
            ],
            additional_items: [
              {
                variant_id: "test-variant",
                quantity: 1,
              },
            ],
          },
          adminReqConfig
        )
        .catch((err) => {
          console.log(err)
        })

      const cid = response.data.order.claims[0].id
      const fulRes = await api.post(
        `/admin/orders/test-order/claims/${cid}/fulfillments`,
        {},
        adminReqConfig
      )

      const claimItemIdToClaim =
        fulRes.data.order.claims[0].additional_items[0].id

      const claimRes = await api
        .post(
          "/admin/orders/test-order/claims",
          {
            type: "replace",
            shipping_methods: [
              {
                id: "test-method",
              },
            ],
            claim_items: [
              {
                item_id: claimItemIdToClaim,
                quantity: 1,
                reason: "production_failure",
                tags: ["fluff"],
                images: ["https://test.image2.com"],
              },
            ],
            additional_items: [
              {
                variant_id: "test-variant-2",
                quantity: 1,
              },
            ],
          },
          adminReqConfig
        )
        .catch((err) => {
          console.log(err)
        })

      expect(claimRes.status).toEqual(200)
      expect(claimRes.data.order.claims.length).toEqual(2)

      const newClaim = claimRes.data.order.claims.find(
        (c) => c.fulfillment_status === "not_fulfilled"
      )

      expect(newClaim.claim_items[0].item.id).toEqual(claimItemIdToClaim)
    })

    it("creates a claim on a swap additional item", async () => {
      const api = useApi()

      // create a swap
      const response = await api
        .post(
          "/admin/orders/test-order/swaps",
          {
            custom_shipping_options: [{ option_id: "test-option", price: 0 }],
            return_items: [
              {
                item_id: "test-item",
                quantity: 1,
              },
            ],
            additional_items: [{ variant_id: "test-variant-2", quantity: 1 }],
          },
          adminReqConfig
        )
        .catch((e) => console.log(e))

      const sid = response.data.order.swaps[0].id
      const manager = dbConnection.manager

      // add a shipping method so we can fulfill the swap
      const sm = manager.create(ShippingMethod, {
        id: "test-method-swap-cart",
        swap_id: sid,
        shipping_option_id: "test-option",
        price: 0,
        data: {},
      })

      await manager.save(sm)

      // fulfill the swap
      const fulRes = await api
        .post(
          `/admin/orders/test-order/swaps/${sid}/fulfillments`,
          {},
          adminReqConfig
        )
        .catch((e) => console.log(e))

      // ship the swap
      await api
        .post(
          `/admin/orders/test-order/swaps/${sid}/shipments`,
          {
            fulfillment_id: fulRes.data.order.swaps[0].fulfillments[0].id,
          },
          adminReqConfig
        )
        .catch((e) => console.log(e))

      const claimItemIdToClaim =
        fulRes.data.order.swaps[0].additional_items[0].id

      // create a claim on the exchange
      const claimRes = await api
        .post(
          "/admin/orders/test-order/claims",
          {
            type: "replace",
            claim_items: [
              {
                item_id: claimItemIdToClaim,
                quantity: 1,
                reason: "production_failure",
                tags: ["fluff"],
                images: ["https://test.image2.com"],
              },
            ],
            additional_items: [
              {
                variant_id: "test-variant-2",
                quantity: 1,
              },
            ],
          },
          adminReqConfig
        )
        .catch((err) => {
          console.log(err)
        })

      expect(claimRes.status).toEqual(200)
      expect(claimRes.data.order.claims.length).toEqual(1)

      const newClaim = claimRes.data.order.claims[0]

      expect(newClaim.claim_items[0].item.id).toEqual(claimItemIdToClaim)
    })

    it("Only allow canceling claim after canceling fulfillments", async () => {
      const order_id = "order-with-claim"

      const order = await callGet({
        path: `/admin/orders/${order_id}`,
        get: "order",
      })

      const claim = order.claims.filter((s) => s.id === "claim-w-f")[0]
      const claim_id = claim.id

      const expectCancelToReturn = partial(expectPostCallToReturn, {
        path: `/admin/orders/${order_id}/claims/${claim_id}/cancel`,
      })

      await expectCancelToReturn({ code: 400 })

      await expectAllPostCallsToReturn({
        code: 200,
        col: claim.fulfillments,
        pathf: (f) =>
          `/admin/orders/${order_id}/claims/${claim_id}/fulfillments/${f.id}/cancel`,
      })

      await expectCancelToReturn({ code: 200 })
    })

    it("Only allow canceling claim after canceling returns", async () => {
      const order_id = "order-with-claim"

      const order = await callGet({
        path: `/admin/orders/${order_id}`,
        get: "order",
      })

      const claim = order.claims.filter((c) => c.id === "claim-w-r")[0]
      const claim_id = claim.id

      const expectCancelToReturn = partial(expectPostCallToReturn, {
        path: `/admin/orders/${order_id}/claims/${claim_id}/cancel`,
      })

      await expectCancelToReturn({ code: 400 })

      await expectPostCallToReturn({
        code: 200,
        path: `/admin/returns/${claim.return_order.id}/cancel`,
      })

      await expectCancelToReturn({ code: 200 })
    })

    it("fails to creates a claim due to no stock on additional items", async () => {
      const api = useApi()
      try {
        await api.post(
          "/admin/orders/test-order/claims",
          {
            type: "replace",
            claim_items: [
              {
                item_id: "test-item",
                quantity: 1,
                reason: "production_failure",
                tags: ["fluff"],
                images: ["https://test.image.com"],
              },
            ],
            additional_items: [
              {
                variant_id: "test-variant",
                quantity: 2,
              },
            ],
          },
          adminReqConfig
        )
      } catch (e) {
        expect(e.response.status).toEqual(400)
        expect(e.response.data.message).toEqual(
          "Variant with id: test-variant does not have the required inventory"
        )
      }
    })
  })

  describe("POST /admin/orders/:id/claims", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)
      await swapSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a claim on a swap", async () => {
      const api = useApi()
      const shippingOption = await simpleShippingOptionFactory(dbConnection)

      const claimOnClaim = await api
        .post(
          "/admin/orders/order-with-swap/claims",
          {
            type: "replace",
            claim_items: [
              {
                item_id: "return-item-1",
                quantity: 1,
                reason: "production_failure",
                tags: ["fluff"],
                images: ["https://test.image.com"],
              },
            ],
            additional_items: [
              {
                variant_id: "test-variant",
                quantity: 1,
              },
            ],
            shipping_methods: [
              {
                option_id: shippingOption.id,
                price: 1000,
                data: {
                  test: "test",
                },
              },
            ],
          },
          adminReqConfig
        )
        .catch((err) => {
          console.log(err)
        })

      expect(claimOnClaim.status).toEqual(200)
    })
  })

  describe("POST /admin/orders/:id/return", () => {
    let rrId
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)

      const created = dbConnection.manager.create(ReturnReason, {
        value: "too_big",
        label: "Too Big",
      })
      const result = await dbConnection.manager.save(created)

      rrId = result.id
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a return", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/orders/test-order/return",
        {
          items: [
            {
              item_id: "test-item",
              quantity: 1,
              reason_id: rrId,
              note: "TOO SMALL",
            },
          ],
        },
        adminReqConfig
      )
      expect(response.status).toEqual(200)

      expect(response.data.order.returns[0].refund_amount).toEqual(7200)
      expect(response.data.order.returns[0].items).toHaveLength(1)
      expect(response.data.order.returns[0].items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            item_id: "test-item",
            quantity: 1,
            reason_id: rrId,
            note: "TOO SMALL",
          }),
        ])
      )
    })

    it("Receives return with custom refund amount passed on receive", async () => {
      const api = useApi()

      const orderId = "test-order"
      const itemId = "test-item"

      const returned = await api.post(
        `/admin/orders/${orderId}/return`,
        {
          items: [
            {
              // item has a unit_price of 8000 with a 800 adjustment
              item_id: itemId,
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )

      const returnOrder = returned.data.order.returns[0]

      expect(returned.status).toEqual(200)
      expect(returnOrder.refund_amount).toEqual(7200)

      const received = await api.post(
        `/admin/returns/${returnOrder.id}/receive`,
        {
          items: [
            {
              item_id: itemId,
              quantity: 1,
            },
          ],
          refund: 0,
        },
        adminReqConfig
      )

      const receivedReturn = received.data.return

      expect(received.status).toEqual(200)
      expect(receivedReturn.refund_amount).toEqual(0)

      const orderRes = await api.get(`/admin/orders/${orderId}`, adminReqConfig)

      const order = orderRes.data.order

      expect(order.refunds.length).toEqual(0)
    })

    it("increases inventory_quantity when return is received", async () => {
      const api = useApi()

      const returned = await api.post(
        "/admin/orders/test-order/return",
        {
          items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
          receive_now: true,
        },
        adminReqConfig
      )

      // Find variant that should have its inventory_quantity updated
      const toTest = returned.data.order.items.find((i) => i.id === "test-item")

      expect(returned.status).toEqual(200)
      expect(toTest.variant.inventory_quantity).toEqual(2)
    })

    it("does not increases inventory_quantity when return is received when inventory is not managed", async () => {
      const api = useApi()
      const manager = dbConnection.manager

      await manager.query(
        `UPDATE "product_variant"
         SET manage_inventory= false
         WHERE id = 'test-variant'`
      )

      const returned = await api.post(
        "/admin/orders/test-order/return",
        {
          items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
          receive_now: true,
        },
        adminReqConfig
      )

      // Find variant that should have its inventory_quantity updated
      const toTest = returned.data.order.items.find((i) => i.id === "test-item")

      expect(returned.status).toEqual(200)
      expect(toTest.variant.inventory_quantity).toEqual(1)
    })
  })

  describe("GET /admin/orders", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      // Manually insert date for filtering
      const createdAt = new Date("26 January 1997 12:00 UTC")
      await orderSeeder(dbConnection, {
        created_at: createdAt.toISOString(),
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists all orders", async () => {
      const api = useApi()

      const response = await api.get("/admin/orders?fields=id", adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.orders).toHaveLength(6)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-order",
          }),

          expect.objectContaining({
            id: "test-order-w-c",
          }),

          expect.objectContaining({
            id: "test-order-w-s",
          }),
          expect.objectContaining({
            id: "test-order-w-f",
          }),
          expect.objectContaining({
            id: "test-order-w-r",
          }),
          expect.objectContaining({
            id: "discount-order",
          }),
        ])
      )
    })

    it("lists orders with specific fields and relations", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id,created_at&expand=billing_address",
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toHaveLength(6)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          {
            id: "test-order",
            created_at: expect.any(String),
            billing_address: expect.objectContaining({
              id: "test-billing-address",
              first_name: "lebron",
            }),
            shipping_total: expect.any(Number),
            shipping_tax_total: expect.any(Number),
            discount_total: expect.any(Number),
            item_tax_total: expect.any(Number),
            tax_total: expect.any(Number),
            refunded_total: expect.any(Number),
            total: expect.any(Number),
            subtotal: expect.any(Number),
            paid_total: expect.any(Number),
            refundable_amount: expect.any(Number),
            gift_card_total: expect.any(Number),
            gift_card_tax_total: expect.any(Number),
          },
        ])
      )
    })

    it("lists all orders with a fulfillment status = fulfilled and payment status = captured", async () => {
      const api = useApi()

      const response = await api
        .get(
          "/admin/orders?fulfillment_status[]=fulfilled&payment_status[]=captured",
          adminReqConfig
        )
        .catch((err) => console.log(err))

      expect(response.status).toEqual(200)
      expect(response.data.orders).toHaveLength(2)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-order",
          }),
          expect.objectContaining({
            id: "discount-order",
          }),
        ])
      )
    })

    it("fails to lists all orders with an invalid status", async () => {
      expect.assertions(3)
      const api = useApi()

      await api
        .get("/admin/orders?status[]=test", adminReqConfig)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("invalid_data")
          expect(err.response.data.message).toEqual(
            "each value in status must be one of the following values: pending, completed, archived, canceled, requires_action"
          )
        })
    })

    it("list all orders with matching order email", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id,email&q=test@email",
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.orders).toHaveLength(1)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-order",
            email: "test@email.com",
          }),
        ])
      )
    })

    it("list all orders with matching customer phone", async () => {
      const order = await simpleOrderFactory(dbConnection, {
        customer: {
          phone: "1234567890",
        },
      })

      const api = useApi()

      const response = await api.get("/admin/orders?q=123456", adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.orders).toHaveLength(1)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: order.id,
            customer: expect.objectContaining({
              phone: "1234567890",
            }),
          }),
        ])
      )
    })

    it("list all orders with matching customer first_name", async () => {
      const order = await simpleOrderFactory(dbConnection, {
        customer: {
          first_name: "john",
        },
      })

      const api = useApi()

      const response = await api.get("/admin/orders?q=john", adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.orders).toHaveLength(1)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: order.id,
            customer: expect.objectContaining({
              first_name: "john",
            }),
          }),
        ])
      )
    })

    it("list all orders with matching customer last_name", async () => {
      const order = await simpleOrderFactory(dbConnection, {
        customer: {
          last_name: "Doe",
        },
      })

      const api = useApi()

      const response = await api.get("/admin/orders?q=Doe", adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.orders).toHaveLength(1)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: order.id,
            customer: expect.objectContaining({
              last_name: "Doe",
            }),
          }),
        ])
      )
    })

    it("list all orders with matching shipping_address first name", async () => {
      const api = useApi()

      const response = await api.get("/admin/orders?q=lebron", adminReqConfig)

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(2)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-order",
            shipping_address: expect.objectContaining({ first_name: "lebron" }),
          }),
          expect.objectContaining({
            id: "discount-order",
            shipping_address: expect.objectContaining({ first_name: "lebron" }),
          }),
        ])
      )
    })

    it("successfully lists orders with greater than", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id&created_at[gt]=01-26-1990",
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toHaveLength(6)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-order",
          }),
          expect.objectContaining({
            id: "test-order-w-c",
          }),

          expect.objectContaining({
            id: "test-order-w-s",
          }),
          expect.objectContaining({
            id: "test-order-w-f",
          }),
          expect.objectContaining({
            id: "test-order-w-r",
          }),
          expect.objectContaining({
            id: "discount-order",
          }),
        ])
      )
    })

    it("successfully lists no orders with greater than", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id&created_at[gt]=01-26-2000",
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toEqual([])
    })

    it("successfully lists orders with less than", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id&created_at[lt]=01-26-2000",
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toHaveLength(6)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-order",
          }),
          expect.objectContaining({
            id: "test-order-w-c",
          }),

          expect.objectContaining({
            id: "test-order-w-s",
          }),
          expect.objectContaining({
            id: "test-order-w-f",
          }),
          expect.objectContaining({
            id: "test-order-w-r",
          }),
          expect.objectContaining({
            id: "discount-order",
          }),
        ])
      )
    })

    it("successfully lists no orders with less than", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id&created_at[lt]=01-26-1990",
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toEqual([])
    })

    it("successfully lists orders using unix (greater than)", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id&created_at[gt]=633351600",
        adminReqConfig
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toHaveLength(6)
      expect(response.data.orders).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "test-order",
          }),
          expect.objectContaining({
            id: "test-order-w-c",
          }),

          expect.objectContaining({
            id: "test-order-w-s",
          }),
          expect.objectContaining({
            id: "test-order-w-f",
          }),
          expect.objectContaining({
            id: "test-order-w-r",
          }),
          expect.objectContaining({
            id: "discount-order",
          }),
        ])
      )
    })

    it.each([
      [
        "returns",
        "test-order-w-r",
        (o) => o.returns,
        (r) => `/admin/returns/${r.id}/cancel`,
      ],
      [
        "swaps",
        "test-order-w-s",
        (o) => o.swaps,
        (s) => `/admin/orders/test-order-w-s/swaps/${s.id}/cancel`,
      ],
      [
        "claims",
        "test-order-w-c",
        (o) => o.claims,
        (c) => `/admin/orders/test-order-w-c/claims/${c.id}/cancel`,
      ],
      [
        "fulfillments",
        "test-order-w-f",
        (o) => o.fulfillments,
        (f) => `/admin/orders/test-order-w-f/fulfillments/${f.id}/cancel`,
      ],
    ])(
      "Only allows canceling order after canceling %s",
      async (id, o, of, pf) => {
        const order_id = o

        const order = await callGet({
          path: `/admin/orders/${order_id}`,
          get: "order",
        })

        const expectCanceltoReturn = partial(expectPostCallToReturn, {
          path: `/admin/orders/${order_id}/cancel`,
        })

        await expectCanceltoReturn({ code: 400 })

        await expectAllPostCallsToReturn({
          code: 200,
          col: of(order),
          pathf: pf,
        })

        await expectCanceltoReturn({ code: 200 })
      }
    )
  })

  describe("POST /admin/orders/:id/swaps", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)
      await swapSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a swap", async () => {
      const api = useApi()

      await simpleShippingOptionFactory(dbConnection, {
        id: "testytest",
        is_return: true,
        region_id: "test-region",
      })

      const response = await api.post(
        "/admin/orders/test-order/swaps",
        {
          return_items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
          additional_items: [{ variant_id: "test-variant-2", quantity: 1 }],
          return_shipping: {
            option_id: "testytest",
            price: 400,
          },
        },
        adminReqConfig
      )
      expect(response.status).toEqual(200)
    })

    describe("Given an existing discount order", () => {
      describe("When a store operator attemps to create a swap form the discount order", () => {
        it("Then should successfully create the swap", async () => {
          const api = useApi()

          const response = await api.post(
            "/admin/orders/test-order/swaps",
            {
              return_items: [
                {
                  item_id: "test-item",
                  quantity: 1,
                },
              ],
              additional_items: [{ variant_id: "test-variant-2", quantity: 1 }],
            },
            adminReqConfig
          )

          const swapCartId = response.data.order.swaps[0].cart_id

          const swapCartRes = await api.get(
            `/store/carts/${swapCartId}`,
            adminReqConfig
          )
          const cart = swapCartRes.data.cart

          expect(response.status).toEqual(200)
          expect(cart.items.length).toEqual(2)
          expect(cart.items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                unit_price: -8000,
                adjustments: [
                  expect.objectContaining({
                    amount: -800,
                  }),
                ],
              }),
              expect.objectContaining({
                unit_price: 8000,
                adjustments: [
                  expect.objectContaining({
                    amount: 800,
                  }),
                ],
              }),
            ])
          )
          expect(cart.total).toEqual(0)
        })
      })

      describe("And given a swap cart", () => {
        describe("When a line item is added to the swap cart", () => {
          it("Then should not delete existing return line item adjustments", async () => {
            const api = useApi()

            const createSwapRes = await api.post(
              "/admin/orders/test-order/swaps",
              {
                return_items: [
                  {
                    item_id: "test-item",
                    quantity: 1,
                  },
                ],
                additional_items: [{ variant_id: "test-variant", quantity: 1 }],
              },
              adminReqConfig
            )

            const swapCartId = createSwapRes.data.order.swaps[0].cart_id

            const response = await api.post(
              `/store/carts/${swapCartId}/line-items`,
              {
                variant_id: "test-variant-2",
                quantity: 1,
              },
              adminReqConfig
            )

            const cart = response.data.cart
            const items = cart.items
            const [returnItem] = items.filter((i) => i.is_return)
            expect(returnItem.adjustments).toHaveLength(1)
            expect(returnItem.adjustments).toEqual(
              expect.arrayContaining([
                expect.objectContaining({
                  amount: -800,
                }),
              ])
            )
            expect(cart.total).toBe(7200)
          })
        })
      })
    })

    it("creates a swap with custom shipping options", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/orders/test-order/swaps",
        {
          return_items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
          additional_items: [{ variant_id: "test-variant-2", quantity: 1 }],
          custom_shipping_options: [{ option_id: "test-option", price: 0 }],
        },
        adminReqConfig
      )

      const swap = response.data.order.swaps[0]

      const manager = dbConnection.manager
      const customOptions = await manager.find(CustomShippingOption, {
        where: {
          shipping_option_id: "test-option",
        },
      })

      expect(response.status).toEqual(200)
      expect(customOptions).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            shipping_option_id: "test-option",
            price: 0,
            cart_id: swap.cart_id,
          }),
        ])
      )
    })

    it("creates a swap and a return", async () => {
      const api = useApi()

      const returnedOrderFirst = await api.post(
        "/admin/orders/order-with-swap/return",
        {
          items: [
            {
              item_id: "test-item-many",
              quantity: 2,
            },
          ],
          receive_now: true,
        },
        adminReqConfig
      )

      expect(returnedOrderFirst.status).toEqual(200)

      const returnedOrderSecond = await api.post(
        "/admin/orders/order-with-swap/return",
        {
          items: [
            {
              item_id: "test-item-many",
              quantity: 1,
            },
          ],
          receive_now: true,
        },
        adminReqConfig
      )

      // find item to test returned quantity for
      const toTest = returnedOrderSecond.data.order.items.find(
        (i) => i.id === "test-item-many"
      )

      expect(returnedOrderSecond.status).toEqual(200)
      expect(toTest.returned_quantity).toBe(3)
    })

    it("creates a swap and receives the items", async () => {
      const api = useApi()

      const createdSwapOrder = await api.post(
        "/admin/orders/test-order/swaps",
        {
          return_items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
          additional_items: [{ variant_id: "test-variant-2", quantity: 1 }],
        },
        adminReqConfig
      )

      expect(createdSwapOrder.status).toEqual(200)

      const swap = createdSwapOrder.data.order.swaps[0]

      const receivedSwap = await api.post(
        `/admin/returns/${swap.return_order.id}/receive`,
        {
          items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )

      expect(receivedSwap.status).toEqual(200)
      expect(receivedSwap.data.return.status).toBe("received")
    })

    it("creates a swap on a swap", async () => {
      const api = useApi()

      const swapOnSwap = await api.post(
        "/admin/orders/order-with-swap/swaps",
        {
          return_items: [
            {
              item_id: "test-item-swapped",
              quantity: 1,
            },
          ],
          additional_items: [{ variant_id: "test-variant", quantity: 1 }],
        },
        adminReqConfig
      )

      expect(swapOnSwap.status).toEqual(200)
    })

    it("receives a swap on swap", async () => {
      const api = useApi()

      const received = await api.post(
        `/admin/returns/return-on-swap/receive`,
        {
          items: [
            {
              item_id: "test-item-swapped",
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )

      expect(received.status).toEqual(200)
    })

    it("creates a swap with return and return shipping", async () => {
      const api = useApi()

      const response = await api.post(
        "/admin/orders/test-order/swaps",
        {
          return_items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
          return_shipping: { option_id: "test-return-option", price: 0 },
        },
        adminReqConfig
      )

      expect(response.status).toEqual(200)

      const swap = response.data.order.swaps[0]
      expect(swap.return_order.items).toHaveLength(1)
      expect(swap.return_order.items[0]).toEqual(
        expect.objectContaining({
          item_id: "test-item",
          quantity: 1,
        })
      )

      expect(swap.return_order.shipping_method).toEqual(
        expect.objectContaining({
          price: 0,
          shipping_option_id: "test-return-option",
        })
      )

      expect(swap.return_order.shipping_method.tax_lines).toHaveLength(1)
      expect(swap.return_order.shipping_method.tax_lines[0]).toEqual(
        expect.objectContaining({
          rate: 0,
          name: "default",
        })
      )
    })

    it("creates a return on a swap", async () => {
      const api = useApi()

      const returnOnSwap = await api.post(
        "/admin/orders/order-with-swap/return",
        {
          items: [
            {
              item_id: "test-item-swapped",
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )

      expect(returnOnSwap.status).toEqual(200)
    })

    it("creates a return on an order", async () => {
      const api = useApi()

      const returnOnOrder = await api.post(
        "/admin/orders/test-order/return",
        {
          items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )

      expect(returnOnOrder.status).toEqual(200)

      await api.post("/admin/orders/test-order/capture", {}, adminReqConfig)

      const returnId = returnOnOrder.data.order.returns[0].id

      const received = await api.post(
        `/admin/returns/${returnId}/receive`,
        {
          items: [
            {
              item_id: "test-item",
              quantity: 1,
            },
          ],
        },
        adminReqConfig
      )

      expect(received.status).toEqual(200)
    })

    it("Only allows canceling swap after canceling fulfillments", async () => {
      const swap_id = "swap-w-f"

      const swap = await callGet({
        path: `/admin/swaps/${swap_id}`,
        get: "swap",
      })

      const { order_id } = swap

      const expectCancelToReturn = partial(expectPostCallToReturn, {
        path: `/admin/orders/${order_id}/swaps/${swap_id}/cancel`,
      })

      await expectCancelToReturn({ code: 400 })

      await expectAllPostCallsToReturn({
        code: 200,
        col: swap.fulfillments,
        pathf: (f) =>
          `/admin/orders/${order_id}/swaps/${swap_id}/fulfillments/${f.id}/cancel`,
      })

      await expectCancelToReturn({ code: 200 })
    })

    it("Only allows canceling swap after canceling return", async () => {
      const swap_id = "swap-w-r"

      const swap = await callGet({
        path: `/admin/swaps/${swap_id}`,
        get: "swap",
      })

      const { order_id } = swap

      const expectCancelToReturn = partial(expectPostCallToReturn, {
        path: `/admin/orders/${order_id}/swaps/${swap_id}/cancel`,
      })

      await expectCancelToReturn({ code: 400 })

      await expectPostCallToReturn({
        code: 200,
        path: `/admin/returns/${swap.return_order.id}/cancel`,
      })

      await expectCancelToReturn({ code: 200 })
    })
  })

  describe("GET /admin/orders/:id", () => {
    const testOrderId = "test-order"

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("retrieves an order with fields and expand", async () => {
      const api = useApi()

      const order = await api.get(
        `/admin/orders/${testOrderId}?fields=id&expand=region`,
        adminReqConfig
      )

      expect(order.status).toEqual(200)
      // id + totals + region relation
      expect(order.data.order).toEqual({
        id: "test-order",
        region: expect.any(Object),
        shipping_total: 1000,
        shipping_tax_total: 0,
        discount_total: 800,
        item_tax_total: 0,
        tax_total: 0,
        refunded_total: 0,
        total: 8200,
        subtotal: 8000,
        paid_total: 10000,
        refundable_amount: 10000,
        gift_card_total: 0,
        gift_card_tax_total: 0,
      })
    })

    it("retrieves an order with expand returnable_items only should return the entire object and only returnable_items as relation", async () => {
      const api = useApi()

      const order = await api.get(
        `/admin/orders/${testOrderId}?expand=returnable_items`,
        adminReqConfig
      )

      expect(order.status).toEqual(200)
      // all order properties + totals + returnable_items relation
      expect(order.data.order).toEqual({
        id: "test-order",
        status: "pending",
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        display_id: expect.any(Number),
        cart_id: null,
        draft_order_id: null,
        customer_id: "test-customer",
        email: "test@email.com",
        region_id: "test-region",
        currency_code: "usd",
        tax_rate: 0,
        canceled_at: null,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        metadata: null,
        no_notification: null,
        sales_channel_id: null,
        returnable_items: expect.any(Array),
        shipping_total: 1000,
        shipping_tax_total: 0,
        discount_total: 800,
        item_tax_total: 0,
        tax_total: 0,
        refunded_total: 0,
        total: 8200,
        subtotal: 8000,
        paid_total: 10000,
        refundable_amount: 10000,
        gift_card_total: 0,
        gift_card_tax_total: 0,
        items: [{ refundable: 7200 }],
        claims: [],
        swaps: [],
      })
    })

    it("retrieves an order with expand returnable_items and field id should return the id and the retunable_items", async () => {
      const api = useApi()

      const order = await api.get(
        `/admin/orders/${testOrderId}?expand=returnable_items&fields=id`,
        adminReqConfig
      )

      expect(order.status).toEqual(200)
      // id + totals + returnable_items relation
      expect(order.data.order).toEqual({
        id: "test-order",
        returnable_items: expect.any(Array),
        shipping_total: 1000,
        shipping_tax_total: 0,
        discount_total: 800,
        item_tax_total: 0,
        tax_total: 0,
        refunded_total: 0,
        total: 8200,
        subtotal: 8000,
        paid_total: 10000,
        refundable_amount: 10000,
        gift_card_total: 0,
        gift_card_tax_total: 0,
      })
    })

    it("retrieves an order should include the items totals", async () => {
      const api = useApi()

      const order = await api.get(
        `/admin/orders/${testOrderId}`,
        adminReqConfig
      )

      expect(order.status).toEqual(200)
      expect(order.data.order).toEqual(
        expect.objectContaining({
          id: "test-order",
        })
      )

      order.data.order.items.forEach((item) => {
        expect(item.total).toBeDefined()
        expect(item.subtotal).toBeDefined()
      })
    })

    it("retrieves an order should include deleted items variants", async () => {
      const api = useApi()

      const variantTitle = "test variant"

      const product = await simpleProductFactory(dbConnection, {
        variants: [
          {
            title: variantTitle,
          },
        ],
      })

      const lineItem = await simpleLineItemFactory(dbConnection, {
        order_id: testOrderId,
        variant_id: product.variants[0].id,
      })

      await dbConnection.manager.query(
        `UPDATE product_variant
         set deleted_at = NOW()
         WHERE id = '${product.variants[0].id}';`
      )

      const order = await api.get(
        `/admin/orders/${testOrderId}`,
        adminReqConfig
      )

      expect(order.status).toEqual(200)
      expect(order.data.order).toEqual(
        expect.objectContaining({
          id: "test-order",
          items: expect.arrayContaining([
            expect.objectContaining({
              id: lineItem.id,
              variant: expect.objectContaining({
                id: product.variants[0].id,
                deleted_at: expect.any(String),
              }),
            }),
          ]),
        })
      )
    })

    it("retrieves an order should include a deleted region", async () => {
      const api = useApi()

      await dbConnection.manager.query(
        `UPDATE region
         set deleted_at = NOW()
         WHERE id = 'test-region';`
      )

      const order = await api.get(
        `/admin/orders/${testOrderId}`,
        adminReqConfig
      )

      expect(order.status).toEqual(200)
      expect(order.data.order).toEqual(
        expect.objectContaining({
          id: "test-order",
          region: expect.objectContaining({
            id: "test-region",
            deleted_at: expect.any(String),
          }),
        })
      )
    })

    it("retrieves an order should include a deleted discount", async () => {
      const api = useApi()

      await dbConnection.manager.query(
        `UPDATE discount
         set deleted_at = NOW()
         WHERE id = 'test-discount';`
      )

      const order = await api.get(
        `/admin/orders/${testOrderId}`,
        adminReqConfig
      )

      expect(order.status).toEqual(200)
      expect(order.data.order).toEqual(
        expect.objectContaining({
          id: "test-order",
          discounts: expect.arrayContaining([
            expect.objectContaining({
              id: "test-discount",
              deleted_at: expect.any(String),
            }),
          ]),
        })
      )
    })
  })

  describe("POST /orders/:id/refund", () => {
    const orderId = idMap.getId("refund-order-1")

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)

      const product1 = await simpleProductFactory(dbConnection, {})

      await simpleOrderFactory(dbConnection, {
        id: orderId,
        tax_rate: null,
        email: "test@testson.com",
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        line_items: [
          {
            variant_id: product1.variants[0].id,
            id: idMap.getId("item-1"),
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
          },
        ],
      })

      await simplePaymentFactory(dbConnection, {
        provider_id: "test-pay",
        order: orderId,
        amount: 300,
        captured: true,
      })

      await simplePaymentFactory(dbConnection, {
        provider_id: "test-pay",
        order: orderId,
        amount: 700,
        captured: true,
      })
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("set status on refunded order", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/orders/${orderId}/refund`,
        { amount: 1000, reason: "other" },
        adminReqConfig
      )

      expect(response.data.order).toEqual(
        expect.objectContaining({
          payment_status: "refunded",
          refunded_total: 1000,
          subtotal: 1000,
          total: 1000,
          paid_total: 1000,
          refundable_amount: 0,
        })
      )
    })

    it("set correct status on partially refunded order", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/orders/${orderId}/refund`,
        { amount: 500, reason: "other" },
        adminReqConfig
      )

      expect(response.data.order).toEqual(
        expect.objectContaining({
          payment_status: "partially_refunded",
          refunded_total: 500,
          subtotal: 1000,
          total: 1000,
          paid_total: 1000,
          refundable_amount: 500,
        })
      )
    })
  })
})
