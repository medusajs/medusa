const path = require("path")
const {
  ReturnReason,
  Order,
  LineItem,
  CustomShippingOption,
  ShippingMethod,
} = require("@medusajs/medusa")

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const orderSeeder = require("../../helpers/order-seeder")
const swapSeeder = require("../../helpers/swap-seeder")
const adminSeeder = require("../../helpers/admin-seeder")
const claimSeeder = require("../../helpers/claim-seeder")

const {
  expectPostCallToReturn,
  expectAllPostCallsToReturn,
  callGet,
  partial,
} = require("../../helpers/call-helpers")

jest.setTimeout(30000)

describe("/admin/orders", () => {
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

  describe("GET /admin/orders", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("gets orders", async () => {
      const api = useApi()

      const response = await api
        .get("/admin/orders", {
          headers: {
            Authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)
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
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
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
  })

  describe("GET /admin/orders", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)
        await swapSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }

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
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("cancels an order and increments inventory_quantity", async () => {
      const api = useApi()

      const initialInventoryRes = await api.get("/store/variants/test-variant")

      expect(initialInventoryRes.data.variant.inventory_quantity).toEqual(1)

      const response = await api
        .post(
          `/admin/orders/test-order-not-payed/cancel`,
          {},
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })
      expect(response.status).toEqual(200)

      const secondInventoryRes = await api.get("/store/variants/test-variant")

      expect(secondInventoryRes.data.variant.inventory_quantity).toEqual(2)
    })

    it("cancels an order but does not increment inventory_quantity of unmanaged variant", async () => {
      const api = useApi()
      const manager = dbConnection.manager

      await manager.query(
        `UPDATE "product_variant" SET manage_inventory=false WHERE id = 'test-variant'`
      )

      const initialInventoryRes = await api.get("/store/variants/test-variant")

      expect(initialInventoryRes.data.variant.inventory_quantity).toEqual(1)

      const response = await api
        .post(
          `/admin/orders/test-order-not-payed/cancel`,
          {},
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
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
      try {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)
        await claimSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(swapOnSwap.status).toEqual(200)
    })
  })

  describe("POST /admin/orders/:id/claims", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)
        await claimSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )
      expect(response.status).toEqual(200)

      const variant = await api.get("/admin/products", {
        headers: {
          authorization: "Bearer test_token",
        },
      })

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
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
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
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "bearer test_token",
          },
        }
      )

      expect(status).toEqual(200)
      expect(updateData.order.claims[0].shipping_methods).toEqual([
        expect.objectContaining({
          id: "test-method",
        }),
      ])
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "bearer test_token",
          },
        }
      )

      expect(status).toEqual(200)
      expect(updateData.order.claims.length).toEqual(1)

      claim = updateData.order.claims[0]

      expect(claim.claim_items.length).toEqual(1)
      expect(claim.claim_items).toEqual([
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
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      const cid = response.data.order.claims[0].id
      const fulRes = await api.post(
        `/admin/orders/test-order/claims/${cid}/fulfillments`,
        {},
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
      )
      expect(fulRes.status).toEqual(200)
      expect(fulRes.data.order.claims).toEqual([
        expect.objectContaining({
          id: cid,
          order_id: "test-order",
          fulfillment_status: "fulfilled",
        }),
      ])

      const fid = fulRes.data.order.claims[0].fulfillments[0].id
      const iid = fulRes.data.order.claims[0].additional_items[0].id
      expect(fulRes.data.order.claims[0].fulfillments).toEqual([
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
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => {
          console.log(err)
        })

      const cid = response.data.order.claims[0].id
      const fulRes = await api.post(
        `/admin/orders/test-order/claims/${cid}/fulfillments`,
        {},
        {
          headers: {
            Authorization: "Bearer test_token",
          },
        }
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
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
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
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
        )
        .catch((e) => console.log(e))

      const sid = response.data.order.swaps[0].id
      const manager = dbConnection.manager

      // add a shipping method so we can fulfill the swap
      const sm = await manager.create(ShippingMethod, {
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
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
        )
        .catch((e) => console.log(e))

      // ship the swap
      await api
        .post(
          `/admin/orders/test-order/swaps/${sid}/shipments`,
          {
            fulfillment_id: fulRes.data.order.swaps[0].fulfillments[0].id,
          },
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
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
          {
            headers: {
              Authorization: "Bearer test_token",
            },
          }
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
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
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
      try {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)
        await swapSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a claim on a swap", async () => {
      const api = useApi()

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
          },
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
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
      try {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)

        const created = dbConnection.manager.create(ReturnReason, {
          value: "too_big",
          label: "Too Big",
        })
        const result = await dbConnection.manager.save(created)

        rrId = result.id
      } catch (err) {
        console.log(err)
        throw err
      }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )
      expect(response.status).toEqual(200)

      expect(response.data.order.returns[0].refund_amount).toEqual(7200)
      expect(response.data.order.returns[0].items).toEqual([
        expect.objectContaining({
          item_id: "test-item",
          quantity: 1,
          reason_id: rrId,
          note: "TOO SMALL",
        }),
      ])
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        `UPDATE "product_variant" SET manage_inventory=false WHERE id = 'test-variant'`
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      // Find variant that should have its inventory_quantity updated
      const toTest = returned.data.order.items.find((i) => i.id === "test-item")

      expect(returned.status).toEqual(200)
      expect(toTest.variant.inventory_quantity).toEqual(1)
    })
  })

  describe("GET /admin/orders", () => {
    beforeEach(async () => {
      try {
        await adminSeeder(dbConnection)
        // Manually insert date for filtering
        const createdAt = new Date("26 January 1997 12:00 UTC")
        await orderSeeder(dbConnection, {
          created_at: createdAt.toISOString(),
        })
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("lists all orders", async () => {
      const api = useApi()

      const response = await api.get("/admin/orders?fields=id", {
        headers: {
          authorization: "Bearer test_token",
        },
      })

      expect(response.status).toEqual(200)
      expect(response.data.orders).toEqual([
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
    })

    it("lists all orders with a fulfillment status = fulfilled and payment status = captured", async () => {
      const api = useApi()

      const response = await api
        .get(
          "/admin/orders?fulfillment_status[]=fulfilled&payment_status[]=captured",
          {
            headers: {
              authorization: "Bearer test_token",
            },
          }
        )
        .catch((err) => console.log(err))

      expect(response.status).toEqual(200)
      expect(response.data.orders).toEqual([
        expect.objectContaining({
          id: "test-order",
        }),
        expect.objectContaining({
          id: "discount-order",
        }),
      ])
    })

    it("fails to lists all orders with an invalid status", async () => {
      expect.assertions(3)
      const api = useApi()

      await api
        .get("/admin/orders?status[]=test", {
          headers: {
            authorization: "Bearer test_token",
          },
        })
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.type).toEqual("invalid_data")
          expect(err.response.data.message).toEqual(
            "each value in status must be a valid enum value"
          )
        })
    })

    it("list all orders with matching order email", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id,email&q=test@email",
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.orders).toEqual([
        expect.objectContaining({
          id: "test-order",
          email: "test@email.com",
        }),
      ])
    })

    it("list all orders with matching shipping_address first name", async () => {
      const api = useApi()

      const response = await api.get("/admin/orders?q=lebron", {
        headers: {
          authorization: "Bearer test_token",
        },
      })

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(2)
      expect(response.data.orders).toEqual([
        expect.objectContaining({
          id: "test-order",
          shipping_address: expect.objectContaining({ first_name: "lebron" }),
        }),
        expect.objectContaining({
          id: "discount-order",
          shipping_address: expect.objectContaining({ first_name: "lebron" }),
        }),
      ])
    })

    it("successfully lists orders with greater than", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id&created_at[gt]=01-26-1990",
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toEqual([
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
    })

    it("successfully lists no orders with greater than", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id&created_at[gt]=01-26-2000",
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toEqual([])
    })

    it("successfully lists orders with less than", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id&created_at[lt]=01-26-2000",
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toEqual([
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
    })

    it("successfully lists no orders with less than", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id&created_at[lt]=01-26-1990",
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toEqual([])
    })

    it("successfully lists orders using unix (greater than)", async () => {
      const api = useApi()

      const response = await api.get(
        "/admin/orders?fields=id&created_at[gt]=633351600",
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(response.status).toEqual(200)
      expect(response.data.orders).toEqual([
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
      try {
        await adminSeeder(dbConnection)
        await orderSeeder(dbConnection)
        await swapSeeder(dbConnection)
      } catch (err) {
        console.log(err)
        throw err
      }
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("creates a swap", async () => {
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
            {
              headers: {
                authorization: "Bearer test_token",
              },
            }
          )

          const swapCartId = response.data.order.swaps[0].cart_id

          const swapCartRes = await api.get(`/store/carts/${swapCartId}`, {
            headers: {
              authorization: "Bearer test_token",
            },
          })
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
              {
                headers: {
                  authorization: "Bearer test_token",
                },
              }
            )

            const swapCartId = createSwapRes.data.order.swaps[0].cart_id

            const response = await api.post(
              `/store/carts/${swapCartId}/line-items`,
              {
                variant_id: "test-variant-2",
                quantity: 1,
              },
              {
                headers: {
                  authorization: "Bearer test_token",
                },
              }
            )

            const cart = response.data.cart
            const items = cart.items
            const [returnItem] = items.filter((i) => i.is_return)
            expect(returnItem.adjustments).toEqual([
              expect.objectContaining({
                amount: -800,
              }),
            ])
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      const swap = response.data.order.swaps[0]

      const manager = dbConnection.manager
      const customOptions = await manager.find(CustomShippingOption, {
        shipping_option_id: "test-option",
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      // find item to test returned quantiy for
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(received.status).toEqual(200)
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(returnOnOrder.status).toEqual(200)

      await api.post(
        "/admin/orders/test-order/capture",
        {},
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

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
        {
          headers: {
            authorization: "Bearer test_token",
          },
        }
      )

      expect(received.status).toEqual(200)
    })

    it("Only allows canceling swap after canceling fulfillments", async () => {
      try {
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
      } catch (e) {
        console.log(e)
      }
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
})
