const path = require("path")
const { OrderEditItemChangeType, OrderEdit } = require("@medusajs/medusa")
const { IdMap } = require("medusa-test-utils")

const { useApi } = require("../../../../environment-helpers/use-api")
const { useDb, initDb } = require("../../../../environment-helpers/use-db")
const adminSeeder = require("../../../../helpers/admin-seeder")
const {
  simpleOrderEditFactory,
} = require("../../../../factories/simple-order-edit-factory")
const {
  simpleOrderItemChangeFactory,
} = require("../../../../factories/simple-order-item-change-factory")
const {
  simpleLineItemFactory,
  simpleProductFactory,
  simpleOrderFactory,
  simpleDiscountFactory,
  simpleCartFactory,
  simpleRegionFactory,
} = require("../../../../factories")
const setupServer = require("../../../../environment-helpers/setup-server")

jest.setTimeout(100000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

describe("/admin/order-edits", () => {
  let medusaProcess
  let dbConnection
  const adminUserId = "admin_user"

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

  describe("GET /admin/order-edits/:id", () => {
    const orderEditId = IdMap.getId("order-edit-1")
    const prodId1 = IdMap.getId("prodId1")
    const prodId2 = IdMap.getId("prodId2")
    const prodId3 = IdMap.getId("prodId3")
    const changeUpdateId = IdMap.getId("order-edit-1-change-update")
    const changeCreateId = IdMap.getId("order-edit-1-change-create")
    const changeRemoveId = IdMap.getId("order-edit-1-change-remove")
    const lineItemId1 = IdMap.getId("line-item-1")
    const lineItemId2 = IdMap.getId("line-item-2")
    const lineItemCreateId = IdMap.getId("line-item-create")
    const lineItemUpdateId = IdMap.getId("line-item-update")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      const product1 = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })
      const product2 = await simpleProductFactory(dbConnection, {
        id: prodId2,
      })
      const product3 = await simpleProductFactory(dbConnection, {
        id: prodId3,
      })

      const order = await simpleOrderFactory(dbConnection, {
        email: "test@testson.com",
        tax_rate: null,
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12.5,
        },
        line_items: [
          {
            id: lineItemId1,
            variant_id: product1.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                rate: 10,
                code: "code1",
                name: "code1",
              },
            ],
          },
          {
            id: lineItemId2,
            variant_id: product2.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                rate: 10,
                code: "code2",
                name: "code2",
              },
            ],
          },
        ],
      })

      const orderEdit = await simpleOrderEditFactory(dbConnection, {
        id: orderEditId,
        order_id: order.id,
        created_by: expect.any(String),
        internal_note: "test internal note",
      })

      await simpleLineItemFactory(dbConnection, {
        id: lineItemUpdateId,
        order_id: null,
        variant_id: product1.variants[0].id,
        unit_price: 1000,
        quantity: 2,
      })
      await simpleLineItemFactory(dbConnection, {
        id: lineItemCreateId,
        order_id: null,
        variant_id: product3.variants[0].id,
        unit_price: 100,
        quantity: 2,
      })

      await simpleOrderItemChangeFactory(dbConnection, {
        id: changeCreateId,
        type: OrderEditItemChangeType.ITEM_ADD,
        line_item_id: lineItemCreateId,
        order_edit_id: orderEdit.id,
      })
      await simpleOrderItemChangeFactory(dbConnection, {
        id: changeUpdateId,
        type: OrderEditItemChangeType.ITEM_UPDATE,
        line_item_id: lineItemUpdateId,
        original_line_item_id: lineItemId1,
        order_edit_id: orderEdit.id,
      })
      await simpleOrderItemChangeFactory(dbConnection, {
        id: changeRemoveId,
        type: OrderEditItemChangeType.ITEM_REMOVE,
        original_line_item_id: lineItemId2,
        order_edit_id: orderEdit.id,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("gets order edit", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/order-edits/${orderEditId}`,
        adminHeaders
      )

      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          created_by: expect.any(String),
          requested_by: null,
          canceled_by: null,
          confirmed_by: null,
          internal_note: "test internal note",
          items: expect.arrayContaining([]),
          changes: expect.arrayContaining([
            expect.objectContaining({
              type: "item_add",
              order_edit_id: orderEditId,
              original_line_item_id: null,
              line_item_id: lineItemCreateId,
              line_item: expect.any(Object),
              original_line_item: null,
            }),
            expect.objectContaining({
              type: "item_update",
              order_edit_id: orderEditId,
              original_line_item_id: lineItemId1,
              line_item_id: lineItemUpdateId,
              line_item: expect.any(Object),
              original_line_item: expect.any(Object),
            }),
            expect.objectContaining({
              type: "item_remove",
              order_edit_id: orderEditId,
              original_line_item_id: lineItemId2,
              line_item_id: null,
              line_item: null,
              original_line_item: expect.any(Object),
            }),
          ]),
          // Items are cloned during the creation which explain why it is 0 for a fake order edit since it does
          // not use the logic of the service. Must be check in another test
          shipping_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          discount_total: 0,
          tax_total: 0,
          total: 0,
          subtotal: 0,
        })
      )
      expect(response.status).toEqual(200)
    })
  })

  describe("GET /admin/order-edits/", () => {
    const orderEditId = IdMap.getId("order-edit-1")
    const prodId1 = IdMap.getId("prodId1")
    const prodId2 = IdMap.getId("prodId2")
    const lineItemId1 = IdMap.getId("line-item-1")
    const lineItemId2 = IdMap.getId("line-item-2")
    const orderId = IdMap.getId("order-1")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      const product1 = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })
      const product2 = await simpleProductFactory(dbConnection, {
        id: prodId2,
      })

      const order = await simpleOrderFactory(dbConnection, {
        id: orderId,
        email: "test@testson.com",
        tax_rate: null,
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12.5,
        },
        line_items: [
          {
            id: lineItemId1,
            variant_id: product1.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                rate: 10,
                code: "code1",
                name: "code1",
              },
            ],
          },
          {
            id: lineItemId2,
            variant_id: product2.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                rate: 10,
                code: "code2",
                name: "code2",
              },
            ],
          },
        ],
      })

      await simpleOrderEditFactory(dbConnection, {
        id: orderEditId,
        order_id: order.id,
        created_by: expect.any(String),
        internal_note: "test internal note",
      })

      const additionalOrder = await simpleOrderFactory(dbConnection, {
        id: IdMap.getId("random-order-id"),
        tax_rate: null,
        fulfillment_status: "fulfilled",
        payment_status: "captured",
      })

      await simpleOrderEditFactory(dbConnection, {
        id: IdMap.getId("random-oe-id"),
        order_id: additionalOrder.id,
        created_by: expect.any(String),
        internal_note: "test unused note",
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("list order edits", async () => {
      const api = useApi()

      const response = await api.get(`/admin/order-edits`, adminHeaders)

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(2)
      expect(response.data.offset).toEqual(0)
      expect(response.data.limit).toEqual(20)
      expect(response.data.order_edits).toHaveLength(2)
      expect(response.data.order_edits).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: orderEditId,
            created_by: expect.any(String),
            requested_by: null,
            canceled_by: null,
            confirmed_by: null,
            internal_note: "test internal note",
            items: expect.arrayContaining([]),
            changes: [],
            shipping_total: 0,
            gift_card_total: 0,
            gift_card_tax_total: 0,
            discount_total: 0,
            tax_total: 0,
            total: 0,
            subtotal: 0,
          }),
          expect.objectContaining({
            order_id: IdMap.getId("random-order-id"),
            created_by: expect.any(String),
            requested_by: null,
            canceled_by: null,
            confirmed_by: null,
            internal_note: "test unused note",
            items: expect.arrayContaining([]),
            changes: [],
            shipping_total: 0,
            gift_card_total: 0,
            gift_card_tax_total: 0,
            discount_total: 0,
            tax_total: 0,
            total: 0,
            subtotal: 0,
          }),
        ])
      )
    })

    it("list order edits by order id", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/order-edits?order_id=${orderId}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.offset).toEqual(0)
      expect(response.data.limit).toEqual(20)
      expect(response.data.order_edits).toHaveLength(1)
      expect(response.data.order_edits).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: orderEditId,
            order_id: orderId,
            created_by: expect.any(String),
            requested_by: null,
            canceled_by: null,
            confirmed_by: null,
            internal_note: "test internal note",
            items: expect.arrayContaining([]),
            changes: [],
            shipping_total: 0,
            gift_card_total: 0,
            gift_card_tax_total: 0,
            discount_total: 0,
            tax_total: 0,
            total: 0,
            subtotal: 0,
          }),
        ])
      )
    })

    it("list order edits with free text search", async () => {
      const api = useApi()

      let response = await api.get(
        `/admin/order-edits?q=internal`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.offset).toEqual(0)
      expect(response.data.limit).toEqual(20)
      expect(response.data.order_edits).toHaveLength(1)
      expect(response.data.order_edits).toEqual([
        expect.objectContaining({
          id: orderEditId,
          created_by: expect.any(String),
          requested_by: null,
          canceled_by: null,
          confirmed_by: null,
          internal_note: "test internal note",
          items: expect.arrayContaining([]),
          changes: [],
          shipping_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          discount_total: 0,
          tax_total: 0,
          total: 0,
          subtotal: 0,
        }),
      ])

      response = await api.get(`/admin/order-edits?q=test2`, adminHeaders)

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(0)
      expect(response.data.offset).toEqual(0)
      expect(response.data.limit).toEqual(20)
      expect(response.data.order_edits).toHaveLength(0)
    })
  })

  describe("DELETE /admin/order-edits/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("deletes order edit", async () => {
      const { id } = await simpleOrderEditFactory(dbConnection, {
        created_by: adminUserId,
      })

      const api = useApi()

      const response = await api.delete(
        `/admin/order-edits/${id}`,
        adminHeaders
      )

      const orderEdit = await dbConnection.manager.findOne(OrderEdit, {
        where: { id },
        withDeleted: true,
      })

      expect(orderEdit).toBeNull()
      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id,
        object: "order_edit",
        deleted: true,
      })
    })

    it("deletes order edit which has quantity changes", async () => {
      const api = useApi()

      const initialProduct = await simpleProductFactory(dbConnection, {
        variants: [{ id: "initial-variant" }],
      })

      const cart = await simpleCartFactory(dbConnection, {
        email: "tst@test.com",
        line_items: [
          {
            id: "line-item-id",
            variant_id: initialProduct.variants[0].id,
            quantity: 1,
            unit_price: 1000,
          },
        ],
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const completeRes = await api.post(`/store/carts/${cart.id}/complete`)

      const order = completeRes.data.data

      let response = await api.post(
        `/admin/order-edits/`,
        {
          order_id: order.id,
        },
        adminHeaders
      )

      const orderEditId = response.data.order_edit.id

      const itemToUpdate = response.data.order_edit.items.find(
        (item) => item.original_item_id === "line-item-id"
      )

      await api.post(
        `/admin/order-edits/${orderEditId}/items/${itemToUpdate.id}`,
        { quantity: 10 },
        adminHeaders
      )

      response = await api.delete(
        `/admin/order-edits/${orderEditId}`,
        adminHeaders
      )

      const orderEdit = await dbConnection.manager.findOne(OrderEdit, {
        where: { id: orderEditId },
        withDeleted: true,
      })

      expect(orderEdit).toBeNull()
      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id: orderEditId,
        object: "order_edit",
        deleted: true,
      })
    })

    it("deletes already removed order edit", async () => {
      const { id } = await simpleOrderEditFactory(dbConnection, {
        created_by: adminUserId,
      })

      const api = useApi()

      const response = await api.delete(
        `/admin/order-edits/${id}`,
        adminHeaders
      )

      const idempontentResponse = await api.delete(
        `/admin/order-edits/${id}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id,
        object: "order_edit",
        deleted: true,
      })

      expect(idempontentResponse.status).toEqual(200)
      expect(idempontentResponse.data).toEqual({
        id,
        object: "order_edit",
        deleted: true,
      })
    })

    test.each([
      [
        "requested",
        {
          requested_at: new Date(),
          requested_by: adminUserId,
        },
      ],
      [
        "confirmed",
        {
          confirmed_at: new Date(),
          confirmed_by: adminUserId,
        },
      ],
      [
        "declined",
        {
          declined_at: new Date(),
          declined_by: adminUserId,
        },
      ],
      [
        "canceled",
        {
          canceled_at: new Date(),
          canceled_by: adminUserId,
        },
      ],
    ])("fails to delete order edit with status %s", async (status, data) => {
      expect.assertions(2)

      const { id } = await simpleOrderEditFactory(dbConnection, {
        created_by: adminUserId,
        ...data,
      })

      const api = useApi()

      await api
        .delete(`/admin/order-edits/${id}`, adminHeaders)
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            `Cannot delete order edit with status ${status}`
          )
        })
    })
  })

  describe("POST /admin/order-edits", () => {
    let orderId
    const prodId1 = IdMap.getId("prodId1")
    const prodId2 = IdMap.getId("prodId2")
    const lineItemId1 = IdMap.getId("line-item-1")
    const lineItemId2 = IdMap.getId("line-item-2")
    const confirmedOrderEditId = IdMap.getId("confirmed-order-edit")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      const product1 = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })
      const product2 = await simpleProductFactory(dbConnection, {
        id: prodId2,
      })

      const order = await simpleOrderFactory(dbConnection, {
        email: "test@testson.com",
        tax_rate: null,
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12.5,
        },
        line_items: [
          {
            id: lineItemId1,
            variant_id: product1.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                item_id: lineItemId1,
                rate: 10,
                code: "default",
                name: "default",
              },
            ],
          },
          {
            id: lineItemId2,
            variant_id: product2.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                item_id: lineItemId2,
                rate: 10,
                code: "default",
                name: "default",
              },
            ],
          },
        ],
      })
      orderId = order.id
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("creates an order edit", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/order-edits/`,
        {
          order_id: orderId,
          internal_note: "This is an internal note",
        },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          order_id: orderId,
          created_by: expect.any(String),
          requested_by: null,
          canceled_by: null,
          confirmed_by: null,
          internal_note: "This is an internal note",
          // The items are cloned from the items of the order
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.not.stringContaining(lineItemId1),
              order_id: null,
              order_edit_id: expect.any(String),
              original_item_id: lineItemId1,
              quantity: 1,
              fulfilled_quantity: 1,
              shipped_quantity: 1,
              unit_price: 1000,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 10,
                }),
              ]),
            }),
            expect.objectContaining({
              id: expect.not.stringContaining(lineItemId2),
              order_id: null,
              order_edit_id: expect.any(String),
              original_item_id: lineItemId2,
              quantity: 1,
              fulfilled_quantity: 1,
              shipped_quantity: 1,
              unit_price: 1000,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 10,
                }),
              ]),
            }),
          ]),
          shipping_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          discount_total: 0,
          tax_total: 200,
          subtotal: 2000,
          total: 2200,
        })
      )
    })

    it("throw an error if an active order edit already exists", async () => {
      const api = useApi()

      const payload = {
        order_id: orderId,
        internal_note: "This is an internal note",
      }

      await api.post(`/admin/order-edits/`, payload, adminHeaders)
      const err = await api
        .post(`/admin/order-edits/`, payload, adminHeaders)
        .catch((e) => e)

      expect(err.message).toBe("Request failed with status code 400")
      expect(err.response.data.message).toBe(
        `An active order edit already exists for the order ${payload.order_id}`
      )
    })

    it("created a new order edit if none are active anymore", async () => {
      const api = useApi()

      await simpleOrderEditFactory(dbConnection, {
        id: confirmedOrderEditId,
        order_id: orderId,
        internal_note: "test",
        confirmed_at: new Date(),
        created_by: expect.any(String),
      })

      const payload = {
        order_id: orderId,
        internal_note: "This is an internal note",
      }

      const response = await api.post(
        `/admin/order-edits/`,
        payload,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          order_id: orderId,
          created_by: expect.any(String),
          requested_by: null,
          canceled_by: null,
          confirmed_by: null,
          internal_note: "This is an internal note",
          // The items are cloned from the items of the order
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.not.stringContaining(lineItemId1),
              order_id: null,
              order_edit_id: expect.any(String),
              original_item_id: lineItemId1,
              quantity: 1,
              fulfilled_quantity: 1,
              shipped_quantity: 1,
              unit_price: 1000,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 10,
                }),
              ]),
            }),
            expect.objectContaining({
              id: expect.not.stringContaining(lineItemId2),
              order_id: null,
              order_edit_id: expect.any(String),
              original_item_id: lineItemId2,
              quantity: 1,
              fulfilled_quantity: 1,
              shipped_quantity: 1,
              unit_price: 1000,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 10,
                }),
              ]),
            }),
          ]),
          shipping_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          discount_total: 0,
          tax_total: 200,
          subtotal: 2000,
          total: 2200,
        })
      )
    })
  })

  describe("POST /admin/order-edits/:id/request", () => {
    let orderEditId
    let orderEditIdNoChanges
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      const product1 = await simpleProductFactory(dbConnection)
      const product2 = await simpleProductFactory(dbConnection)

      const order = await simpleOrderFactory(dbConnection, {
        id: IdMap.getId("order-test-2"),
        email: "test@testson.com",
        tax_rate: null,
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 0,
        },
        line_items: [
          {
            id: "lineItemId1",
            variant_id: product2.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                rate: 10,
                code: "code1",
                name: "code1",
              },
            ],
          },
        ],
        shipping_methods: [
          {
            shipping_option: {
              name: "random",
              region_id: "test-region",
            },
            price: 10,
            tax_lines: [
              {
                rate: 0,
                code: "code1",
                name: "code1",
              },
            ],
          },
        ],
      })

      const { id } = await simpleOrderEditFactory(dbConnection, {
        created_by: expect.any(String),
        order_id: order.id,
      })

      const noChangesEdit = await simpleOrderEditFactory(dbConnection, {
        created_by: expect.any(String),
      })

      const lineItemAdded = await simpleLineItemFactory(dbConnection, {
        order_id: null,
        order_edit_id: id,
        variant_id: product1.variants[0].id,
        unit_price: 2000,
        quantity: 1,
        tax_lines: [
          {
            rate: 0,
            code: "code1",
            name: "code1",
          },
        ],
      })

      await simpleOrderItemChangeFactory(dbConnection, {
        order_edit_id: id,
        type: OrderEditItemChangeType.ITEM_ADD,
        line_item_id: lineItemAdded.id,
      })

      orderEditId = id
      orderEditIdNoChanges = noChangesEdit.id
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("requests order edit", async () => {
      const api = useApi()

      const result = await api.post(
        `/admin/order-edits/${orderEditId}/request`,
        {
          payment_collection_description: "Payment collection description",
        },
        adminHeaders
      )

      expect(result.status).toEqual(200)
      expect(result.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          requested_at: expect.any(String),
          requested_by: "admin_user",
          status: "requested",
        })
      )
    })

    it("creates payment collection if difference_due > 0", async () => {
      const api = useApi()

      const result = await api.post(
        `/admin/order-edits/${orderEditId}/request`,
        {},
        adminHeaders
      )

      expect(result.status).toEqual(200)
      expect(result.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          requested_at: expect.any(String),
          requested_by: "admin_user",
          status: "requested",
          payment_collection_id: expect.any(String),
        })
      )
    })

    it("fails to request an order edit with no changes", async () => {
      expect.assertions(2)
      const api = useApi()

      try {
        await api.post(
          `/admin/order-edits/${orderEditIdNoChanges}/request`,
          {},
          adminHeaders
        )
      } catch (err) {
        expect(err.response.status).toEqual(400)
        expect(err.response.data.message).toEqual(
          "Cannot request a confirmation on an edit with no changes"
        )
      }
    })

    it("requests order edit", async () => {
      const api = useApi()

      const result = await api
        .post(`/admin/order-edits/${orderEditId}/request`, {}, adminHeaders)
        .catch((err) => console.log(err))

      expect(result.status).toEqual(200)
      expect(result.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          requested_at: expect.any(String),
          requested_by: "admin_user",
          status: "requested",
        })
      )
    })
  })

  describe("POST /admin/order-edits/:id", () => {
    let orderEditId
    const prodId1 = IdMap.getId("prodId1")
    const lineItemId1 = IdMap.getId("line-item-1")
    const orderId1 = IdMap.getId("order-id-1")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      const product1 = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })

      const order = await simpleOrderFactory(dbConnection, {
        id: orderId1,
        email: "test@testson.com",
        tax_rate: null,
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12.5,
        },
        line_items: [
          {
            id: lineItemId1,
            variant_id: product1.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                rate: 10,
                code: "code1",
                name: "code1",
              },
            ],
          },
        ],
      })

      const api = useApi()
      const response = await api.post(
        `/admin/order-edits/`,
        {
          order_id: orderId1,
          internal_note: "This is an internal note",
        },
        adminHeaders
      )
      orderEditId = response.data.order_edit.id
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("updates an order edit", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/order-edits/${orderEditId}`,
        { internal_note: "changed note" },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          created_by: expect.any(String),
          requested_by: null,
          canceled_by: null,
          confirmed_by: null,
          internal_note: "changed note",
          items: expect.arrayContaining([
            expect.objectContaining({
              order_id: null,
              order_edit_id: orderEditId,
              original_item_id: lineItemId1,
              quantity: 1,
              fulfilled_quantity: 1,
              shipped_quantity: 1,
              unit_price: 1000,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 10,
                }),
              ]),
            }),
          ]),
          discount_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 1000,
          tax_total: 100,
          total: 1100,
        })
      )
    })
  })

  describe("POST /admin/order-edits/:id/items", () => {
    const orderEditId = IdMap.getId("order-edit-1")
    const prodId1 = IdMap.getId("prodId1")
    const lineItemId1 = IdMap.getId("line-item-1")
    const orderId1 = IdMap.getId("order-id-1")
    const toBeAddedVariantId = IdMap.getId("variant id")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      const product1 = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })

      const toBeAddedProduct = await simpleProductFactory(dbConnection, {
        variants: [
          {
            id: toBeAddedVariantId,
            prices: [{ currency: "usd", amount: 200 }],
          },
        ],
      })

      const order = await simpleOrderFactory(dbConnection, {
        id: orderId1,
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        tax_rate: null,
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12.5,
        },
      })

      await simpleOrderEditFactory(dbConnection, {
        id: orderEditId,
        order_id: order.id,
        created_by: expect.any(String),
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("creates line item that will be added to the order", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/order-edits/${orderEditId}/items`,
        { variant_id: toBeAddedVariantId, quantity: 2 },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          created_by: expect.any(String),
          requested_by: null,
          canceled_by: null,
          confirmed_by: null,
          // "Add item" change has been created
          changes: [
            expect.objectContaining({
              type: "item_add",
              order_edit_id: orderEditId,
              original_line_item_id: null,
              line_item_id: expect.any(String),
            }),
          ],
          items: expect.arrayContaining([
            expect.objectContaining({
              variant: expect.objectContaining({ id: toBeAddedVariantId }),
              quantity: 2,
              order_id: null, // <-- NOT associated with the order at this point
              tax_lines: [
                expect.objectContaining({
                  rate: 12.5,
                  name: "default",
                  code: "default",
                }),
              ],
            }),
          ]),
          /*
           * Computed totals are appended to the response
           */
          discount_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 2 * 200,
          tax_total: 0.125 * 2 * 200,
          total: 400 + 50,
        })
      )
    })

    it("adding line item to the order edit will create adjustments percentage discount", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection, { tax_rate: 10 })

      const initialProduct = await simpleProductFactory(dbConnection, {
        variants: [{ id: "initial-variant" }],
      })

      const toBeAddedProduct = await simpleProductFactory(dbConnection, {
        variants: [
          {
            id: toBeAddedVariantId,
            prices: [{ currency: "usd", amount: 200 }],
          },
        ],
      })

      const discount = await simpleDiscountFactory(dbConnection, {
        code: "20PERCENT",
        rule: {
          type: "percentage",
          allocation: "item",
          value: 20,
        },
        regions: [region.id],
      })

      const cart = await simpleCartFactory(dbConnection, {
        email: "testy@test.com",
        region: region.id,
        line_items: [
          { variant_id: initialProduct.variants[0].id, quantity: 1 },
        ],
      })

      // Apply the discount on the cart and complete the cart to create an order.

      await api.post(`/store/carts/${cart.id}`, {
        discounts: [{ code: "20PERCENT" }],
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const completeRes = await api.post(`/store/carts/${cart.id}/complete`)

      const orderWithDiscount = completeRes.data.data

      // Create an order edit for the created order

      const {
        data: { order_edit },
      } = await api.post(
        `/admin/order-edits/`,
        {
          order_id: orderWithDiscount.id,
        },
        adminHeaders
      )

      const response = await api.post(
        `/admin/order-edits/${order_edit.id}/items`,
        { variant_id: toBeAddedVariantId, quantity: 2 },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          order_id: orderWithDiscount.id,
          items: expect.arrayContaining([
            // New line item
            expect.objectContaining({
              adjustments: [
                expect.objectContaining({
                  discount_id: discount.id,
                  amount: 80,
                }),
              ],
              tax_lines: [expect.objectContaining({ rate: 10 })],
              unit_price: 200,
              quantity: 2,
            }),
            // Already existing line item
            expect.objectContaining({
              adjustments: [
                expect.objectContaining({
                  discount_id: discount.id,
                  amount: 20,
                }),
              ],
              tax_lines: [expect.objectContaining({ rate: 10 })],
              unit_price: 100,
              quantity: 1,
              variant: expect.objectContaining({
                id: initialProduct.variants[0].id,
              }),
            }),
          ]),
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 500, // 1 * 100$ + 2 * 200$
          discount_total: 100, // discount === 20%
          tax_total: 40, // tax rate === 10%
          total: 440,
        })
      )
    })

    it("adding line item to the order edit will create adjustments for fixed discount case", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection, { tax_rate: 10 })

      const initialProduct = await simpleProductFactory(dbConnection, {
        variants: [{ id: "initial-variant" }],
      })

      const toBeAddedProduct = await simpleProductFactory(dbConnection, {
        variants: [
          {
            id: toBeAddedVariantId,
            prices: [{ currency: "usd", amount: 200 }],
          },
        ],
      })

      const discount = await simpleDiscountFactory(dbConnection, {
        code: "30FIXED",
        rule: {
          type: "fixed",
          value: 30,
        },
        regions: [region.id],
      })

      const cart = await simpleCartFactory(dbConnection, {
        email: "testy@test.com",
        region: region.id,
        line_items: [
          { variant_id: initialProduct.variants[0].id, quantity: 1 },
        ],
      })

      // Apply the discount on the cart and complete the cart to create an order.

      await api.post(`/store/carts/${cart.id}`, {
        discounts: [{ code: "30FIXED" }],
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const completeRes = await api.post(`/store/carts/${cart.id}/complete`)

      const orderWithDiscount = completeRes.data.data

      // all fixed discount is allocated to single initial line item
      expect(orderWithDiscount.items[0].adjustments[0].amount).toEqual(30)

      // Create an order edit for the created order

      const {
        data: { order_edit },
      } = await api.post(
        `/admin/order-edits/`,
        {
          order_id: orderWithDiscount.id,
        },
        adminHeaders
      )

      const response = await api.post(
        `/admin/order-edits/${order_edit.id}/items`,
        { variant_id: toBeAddedVariantId, quantity: 2 },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          order_id: orderWithDiscount.id,
          items: expect.arrayContaining([
            // New line item
            expect.objectContaining({
              adjustments: [
                expect.objectContaining({
                  discount_id: discount.id,
                  amount: 24,
                }),
              ],
              unit_price: 200,
              quantity: 2,
            }),
            // Already existing line item
            expect.objectContaining({
              adjustments: [
                expect.objectContaining({
                  discount_id: discount.id,
                  amount: 6,
                }),
              ],
              unit_price: 100,
              quantity: 1,
              variant: expect.objectContaining({
                id: initialProduct.variants[0].id,
              }),
            }),
          ]),
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 500, // 1 * 100$ + 2 * 200$
          discount_total: 30, // discount === fixed 30
          tax_total: 47, // tax rate === 10%
          total: 470 + 47,
        })
      )
    })
  })

  describe("DELETE /admin/order-edits/:id/changes/:change_id", () => {
    let product
    const orderId1 = IdMap.getId("order-id-1")
    const orderEditId = IdMap.getId("order-edit-1")
    const orderEditId2 = IdMap.getId("order-edit-2")
    const prodId1 = IdMap.getId("prodId1")
    const lineItemId1 = IdMap.getId("line-item-1")
    const changeUpdateId = IdMap.getId("order-id-1-change-1")
    const changeUpdateId2 = IdMap.getId("order-id-1-change-2")
    const lineItemUpdateId = IdMap.getId("line-item-1-update")
    const lineItemUpdateId2 = IdMap.getId("line-item-1-update-2")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      product = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })

      await simpleOrderFactory(dbConnection, {
        id: orderId1,
        email: "test@testson.com",
        tax_rate: null,
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12.5,
        },
        line_items: [
          {
            id: lineItemId1,
            variant_id: product.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
          },
        ],
      })

      await simpleLineItemFactory(dbConnection, {
        id: lineItemUpdateId,
        order_id: null,
        variant_id: product.variants[0].id,
        unit_price: 100,
        quantity: 2,
      })

      await simpleLineItemFactory(dbConnection, {
        id: lineItemUpdateId2,
        order_id: null,
        variant_id: product.variants[0].id,
        unit_price: 100,
        quantity: 2,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("deletes an item change from an order edit", async () => {
      await simpleLineItemFactory(dbConnection, {
        id: lineItemUpdateId,
        order_id: null,
        variant_id: product.variants[0].id,
        unit_price: 100,
        quantity: 2,
      })

      await simpleOrderEditFactory(dbConnection, {
        id: orderEditId,
        order_id: orderId1,
        created_by: expect.any(String),
        internal_note: "test internal note",
      })

      await simpleOrderItemChangeFactory(dbConnection, {
        id: changeUpdateId,
        type: OrderEditItemChangeType.ITEM_UPDATE,
        line_item_id: lineItemUpdateId,
        original_line_item_id: lineItemId1,
        order_edit_id: orderEditId,
      })

      const api = useApi()

      let res = await api.get(`/admin/order-edits/${orderEditId}`, adminHeaders)

      expect(res.status).toEqual(200)
      expect(res.data.order_edit.changes.length).toBe(1)

      res = await api.delete(
        `/admin/order-edits/${orderEditId}/changes/${changeUpdateId}`,
        adminHeaders
      )

      expect(res.status).toEqual(200)
      expect(res.data).toEqual(
        expect.objectContaining({
          id: changeUpdateId,
          object: "item_change",
          deleted: true,
        })
      )

      res = await api.get(`/admin/order-edits/${orderEditId}`, adminHeaders)

      expect(res.status).toEqual(200)
      expect(res.data.order_edit.changes.length).toBe(0)
    })

    it("return invalid error if the item change does not belong to the order edit", async () => {
      await simpleOrderEditFactory(dbConnection, {
        id: orderEditId,
        order_id: orderId1,
        created_by: expect.any(String),
        internal_note: "test internal note 2",
      })

      await simpleOrderItemChangeFactory(dbConnection, {
        id: changeUpdateId,
        type: OrderEditItemChangeType.ITEM_UPDATE,
        line_item_id: lineItemUpdateId,
        original_line_item_id: lineItemId1,
        order_edit_id: orderEditId,
      })

      await simpleOrderEditFactory(dbConnection, {
        id: orderEditId2,
        order_id: orderId1,
        created_by: expect.any(String),
        internal_note: "test internal note 2",
      })

      await simpleOrderItemChangeFactory(dbConnection, {
        id: changeUpdateId2,
        type: OrderEditItemChangeType.ITEM_UPDATE,
        line_item_id: lineItemUpdateId2,
        original_line_item_id: lineItemId1,
        order_edit_id: orderEditId2,
      })

      const api = useApi()

      const response = await api
        .delete(
          `/admin/order-edits/${orderEditId}/changes/${changeUpdateId2}`,
          adminHeaders
        )
        .catch((e) => e)

      expect(response.response.status).toEqual(400)
      expect(response.response.data.message).toEqual(
        `The item change you are trying to delete doesn't belong to the OrderEdit with id: ${orderEditId}.`
      )
    })

    it("return an error if the order edit is confirmed", async () => {
      await simpleOrderEditFactory(dbConnection, {
        id: orderEditId,
        order_id: orderId1,
        created_by: expect.any(String),
        internal_note: "test internal note 3",
        confirmed_at: new Date(),
      })

      await simpleOrderItemChangeFactory(dbConnection, {
        id: changeUpdateId,
        type: OrderEditItemChangeType.ITEM_UPDATE,
        line_item_id: lineItemUpdateId,
        original_line_item_id: lineItemId1,
        order_edit_id: orderEditId,
      })

      const api = useApi()

      const response = await api
        .delete(
          `/admin/order-edits/${orderEditId}/changes/${changeUpdateId}`,
          adminHeaders
        )
        .catch((e) => e)

      expect(response.response.status).toEqual(400)
      expect(response.response.data.message).toEqual(
        "Cannot delete and item change from a confirmed order edit"
      )
    })

    it("return an error if the order edit is canceled", async () => {
      await simpleOrderEditFactory(dbConnection, {
        id: orderEditId,
        order_id: orderId1,
        created_by: expect.any(String),
        internal_note: "test internal note 4",
        canceled_at: new Date(),
      })

      await simpleOrderItemChangeFactory(dbConnection, {
        id: changeUpdateId,
        type: OrderEditItemChangeType.ITEM_UPDATE,
        line_item_id: lineItemUpdateId,
        original_line_item_id: lineItemId1,
        order_edit_id: orderEditId,
      })

      const api = useApi()

      const response = await api
        .delete(
          `/admin/order-edits/${orderEditId}/changes/${changeUpdateId}`,
          adminHeaders
        )
        .catch((e) => e)

      expect(response.response.status).toEqual(400)
      expect(response.response.data.message).toEqual(
        "Cannot delete and item change from a canceled order edit"
      )
    })
  })

  describe("POST /admin/order-edits/:id/cancel", () => {
    const cancellableEditId = IdMap.getId("order-edit-1")
    const canceledEditId = IdMap.getId("order-edit-2")
    const confirmedEditId = IdMap.getId("order-edit-3")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simpleOrderEditFactory(dbConnection, {
        id: cancellableEditId,
        created_by: expect.any(String),
        internal_note: "test internal note",
      })

      await simpleOrderEditFactory(dbConnection, {
        id: canceledEditId,
        canceled_at: new Date(),
        canceled_by: "admin_user",
        created_by: expect.any(String),
      })

      await simpleOrderEditFactory(dbConnection, {
        id: confirmedEditId,
        confirmed_at: new Date(),
        confirmed_by: "admin_user",
        created_by: expect.any(String),
        internal_note: "test internal note",
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("cancels an order edit", async () => {
      const api = useApi()

      const response = await api.post(
        `/admin/order-edits/${cancellableEditId}/cancel`,
        {},
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: cancellableEditId,
          created_by: expect.any(String),
          canceled_by: "admin_user",
          canceled_at: expect.any(String),
          status: "canceled",
        })
      )
    })

    it("cancels an already cancelled order edit", async () => {
      expect.assertions(2)
      const api = useApi()

      const response = await api.post(
        `/admin/order-edits/${canceledEditId}/cancel`,
        {},
        adminHeaders
      )
      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: canceledEditId,
          created_by: expect.any(String),
          canceled_by: "admin_user",
          canceled_at: expect.any(String),
          status: "canceled",
        })
      )
    })

    it("cancels an already cancelled order edit", async () => {
      expect.assertions(2)
      const api = useApi()

      try {
        await api.post(
          `/admin/order-edits/${confirmedEditId}/cancel`,
          {},
          adminHeaders
        )
      } catch (err) {
        expect(err.response.status).toEqual(400)
        expect(err.response.data.message).toEqual(
          "Cannot cancel order edit with status confirmed"
        )
      }
    })
  })

  describe("POST /admin/order-edits/:id/confirm", () => {
    let product
    let product2
    const prodId1 = IdMap.getId("product-1")
    const prodId2 = IdMap.getId("product-2")
    const lineItemId1 = IdMap.getId("line-item-1")
    const lineItemId2 = IdMap.getId("line-item-2")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      product = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })

      product2 = await simpleProductFactory(dbConnection, {
        id: prodId2,
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("confirms an order edit", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection, { tax_rate: 10 })

      const cart = await simpleCartFactory(dbConnection, {
        email: "adrien@test.com",
        region: region.id,
        line_items: [
          {
            id: lineItemId1,
            variant_id: product.variants[0].id,
            quantity: 1,
            unit_price: 1000,
          },
          {
            id: lineItemId2,
            variant_id: product2.variants[0].id,
            quantity: 1,
            unit_price: 1000,
          },
        ],
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const completeRes = await api.post(`/store/carts/${cart.id}/complete`)

      const order = completeRes.data.data

      let response = await api.post(
        `/admin/order-edits/`,
        {
          order_id: order.id,
          internal_note: "This is an internal note",
        },
        adminHeaders
      )

      const orderEditId = response.data.order_edit.id

      const itemToUpdate = response.data.order_edit.items.find(
        (item) => item.original_item_id === lineItemId1
      )

      response = await api.post(
        `/admin/order-edits/${orderEditId}/items/${itemToUpdate.id}`,
        { quantity: 2 },
        adminHeaders
      )

      const orderEditItems = response.data.order_edit.items

      response = await api.post(
        `/admin/order-edits/${orderEditId}/confirm`,
        {},
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          created_by: expect.any(String),
          confirmed_by: "admin_user",
          confirmed_at: expect.any(String),
          status: "confirmed",
          discount_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 3000,
          tax_total: 300,
          total: 3300,
        })
      )

      response = await api.get(`/admin/orders/${order.id}`, adminHeaders)

      expect(response.status).toEqual(200)
      expect(response.data.order).toEqual(
        expect.objectContaining({
          items: expect.arrayContaining([
            expect.objectContaining({
              id: orderEditItems[0].id,
              original_item_id: orderEditItems[0].original_item_id,
            }),
            expect.objectContaining({
              id: orderEditItems[1].id,
              original_item_id: orderEditItems[1].original_item_id,
            }),
          ]),
          shipping_total: 0,
          discount_total: 0,
          tax_total: 300,
          refunded_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          subtotal: 3000,
          total: 3300,
          paid_total: 2200,
          refundable_amount: 2200,
        })
      )
    })

    it("confirms an already confirmed order edit", async () => {
      const api = useApi()

      const confirmedOrderEdit = await simpleOrderEditFactory(dbConnection, {
        created_by: expect.any(String),
        confirmed_at: new Date(),
        confirmed_by: "admin_user",
      })

      const response = await api.post(
        `/admin/order-edits/${confirmedOrderEdit.id}/confirm`,
        {},
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: confirmedOrderEdit.id,
          created_by: expect.any(String),
          confirmed_by: "admin_user",
          confirmed_at: expect.any(String),
          status: "confirmed",
        })
      )
    })

    it("confirms an already canceled order edit", async () => {
      const api = useApi()

      const canceledOrderEdit = await simpleOrderEditFactory(dbConnection, {
        created_by: expect.any(String),
        canceled_at: new Date(),
        canceled_by: "admin_user",
      })

      const err = await api
        .post(
          `/admin/order-edits/${canceledOrderEdit.id}/confirm`,
          {},
          adminHeaders
        )
        .catch((e) => e)

      expect(err.response.status).toEqual(400)
      expect(err.response.data.message).toEqual(
        "Cannot confirm an order edit with status canceled"
      )
    })

    it("confirms an already declined order edit", async () => {
      const api = useApi()

      const declinedOrderEdit = await simpleOrderEditFactory(dbConnection, {
        created_by: expect.any(String),
        declined_at: new Date(),
        declined_by: "admin_user",
      })

      const err = await api
        .post(
          `/admin/order-edits/${declinedOrderEdit.id}/confirm`,
          {},
          adminHeaders
        )
        .catch((e) => e)

      expect(err.response.status).toEqual(400)
      expect(err.response.data.message).toEqual(
        "Cannot confirm an order edit with status declined"
      )
    })
  })

  describe("POST /admin/order-edits/:id/items/:item_id", () => {
    let product
    let product2
    const orderId = IdMap.getId("order-1")
    const prodId1 = IdMap.getId("product-1")
    const prodId2 = IdMap.getId("product-2")
    const lineItemId1 = IdMap.getId("line-item-1")
    const lineItemId2 = IdMap.getId("line-item-2")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      product = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })

      product2 = await simpleProductFactory(dbConnection, {
        id: prodId2,
      })

      await simpleOrderFactory(dbConnection, {
        id: orderId,
        email: "test@testson.com",
        tax_rate: null,
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12.5,
        },
        line_items: [
          {
            id: lineItemId1,
            variant_id: product.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                item_id: lineItemId1,
                rate: 12.5,
                code: "default",
                name: "default",
              },
            ],
          },
          {
            id: lineItemId2,
            variant_id: product2.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                item_id: lineItemId2,
                rate: 12.5,
                code: "default",
                name: "default",
              },
            ],
          },
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("creates an order edit item change of type update on line item update", async () => {
      const api = useApi()

      const {
        data: { order_edit },
      } = await api.post(
        `/admin/order-edits/`,
        {
          order_id: orderId,
          internal_note: "This is an internal note",
        },
        adminHeaders
      )

      const orderEditId = order_edit.id
      const updateItemId = order_edit.items.find(
        (item) => item.original_item_id === lineItemId1
      ).id

      const response = await api.post(
        `/admin/order-edits/${orderEditId}/items/${updateItemId}`,
        { quantity: 2 },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit.changes).toHaveLength(1)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          changes: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              type: "item_update",
              order_edit_id: orderEditId,
              original_line_item_id: lineItemId1,
              line_item_id: expect.any(String),
              line_item: expect.objectContaining({
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                original_item_id: lineItemId1,
                order_edit_id: orderEditId,
                cart_id: null,
                order_id: null,
                swap_id: null,
                claim_order_id: null,
                title: expect.any(String),
                description: "",
                thumbnail: "",
                is_return: false,
                is_giftcard: false,
                should_merge: true,
                allow_discounts: true,
                has_shipping: null,
                unit_price: 1000,
                variant_id: expect.any(String),
                quantity: 2,
                fulfilled_quantity: 1,
                returned_quantity: null,
                shipped_quantity: 1,
                metadata: null,
                variant: expect.any(Object),
              }),
              original_line_item: expect.objectContaining({
                id: lineItemId1,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                cart_id: null,
                order_id: orderId,
                swap_id: null,
                claim_order_id: null,
                title: expect.any(String),
                description: "",
                thumbnail: "",
                is_return: false,
                is_giftcard: false,
                should_merge: true,
                allow_discounts: true,
                has_shipping: null,
                unit_price: 1000,
                variant_id: expect.any(String),
                quantity: 1,
                fulfilled_quantity: 1,
                returned_quantity: null,
                shipped_quantity: 1,
                metadata: null,
                variant: expect.any(Object),
              }),
            }),
          ]),
          status: "created",
          order_id: orderId,
          internal_note: "This is an internal note",
          created_by: expect.any(String),
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId1,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 2,
              fulfilled_quantity: 1,
              returned_quantity: null,
              shipped_quantity: 1,
              metadata: null,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 12.5,
                  name: "default",
                  code: "default",
                }),
              ]),
            }),
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId2,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 1,
              fulfilled_quantity: 1,
              returned_quantity: null,
              shipped_quantity: 1,
              metadata: null,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 12.5,
                  name: "default",
                  code: "default",
                }),
              ]),
            }),
          ]),
          discount_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 3000,
          tax_total: 375,
          total: 3375,
        })
      )
    })

    it("update an exising order edit item change of type update on multiple line item update", async () => {
      const api = useApi()

      const {
        data: { order_edit },
      } = await api.post(
        `/admin/order-edits/`,
        {
          order_id: orderId,
          internal_note: "This is an internal note",
        },
        adminHeaders
      )

      const orderEditId = order_edit.id
      const updateItemId = order_edit.items.find(
        (item) => item.original_item_id === lineItemId1
      ).id

      await api.post(
        `/admin/order-edits/${orderEditId}/items/${updateItemId}`,
        { quantity: 2 },
        adminHeaders
      )

      const response = await api.post(
        `/admin/order-edits/${orderEditId}/items/${updateItemId}`,
        { quantity: 3 },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit.changes).toHaveLength(1)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          changes: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              type: "item_update",
              order_edit_id: orderEditId,
              original_line_item_id: lineItemId1,
              line_item_id: expect.any(String),
              line_item: expect.objectContaining({
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                original_item_id: lineItemId1,
                order_edit_id: orderEditId,
                cart_id: null,
                order_id: null,
                swap_id: null,
                claim_order_id: null,
                title: expect.any(String),
                description: "",
                thumbnail: "",
                is_return: false,
                is_giftcard: false,
                should_merge: true,
                allow_discounts: true,
                has_shipping: null,
                unit_price: 1000,
                variant_id: expect.any(String),
                quantity: 3,
                fulfilled_quantity: 1,
                returned_quantity: null,
                shipped_quantity: 1,
                metadata: null,
                variant: expect.any(Object),
              }),
              original_line_item: expect.objectContaining({
                id: lineItemId1,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                cart_id: null,
                order_id: orderId,
                swap_id: null,
                claim_order_id: null,
                title: expect.any(String),
                description: "",
                thumbnail: "",
                is_return: false,
                is_giftcard: false,
                should_merge: true,
                allow_discounts: true,
                has_shipping: null,
                unit_price: 1000,
                variant_id: expect.any(String),
                quantity: 1,
                fulfilled_quantity: 1,
                returned_quantity: null,
                shipped_quantity: 1,
                metadata: null,
                variant: expect.any(Object),
              }),
            }),
          ]),
          status: "created",
          order_id: orderId,
          internal_note: "This is an internal note",
          created_by: expect.any(String),
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId1,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 3,
              fulfilled_quantity: 1,
              returned_quantity: null,
              shipped_quantity: 1,
              metadata: null,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 12.5,
                  name: "default",
                  code: "default",
                }),
              ]),
            }),
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId2,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 1,
              fulfilled_quantity: 1,
              returned_quantity: null,
              shipped_quantity: 1,
              metadata: null,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 12.5,
                  name: "default",
                  code: "default",
                }),
              ]),
            }),
          ]),
          discount_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 4000,
          tax_total: 500,
          total: 4500,
        })
      )
    })

    it("update an exising order edit item change of type update on multiple line item update with correct totals including discounts", async () => {
      const api = useApi()

      const region = await simpleRegionFactory(dbConnection, { tax_rate: 10 })

      const discountCode = "FIX_DISCOUNT"
      const discount = await simpleDiscountFactory(dbConnection, {
        code: discountCode,
        rule: {
          type: "fixed",
          allocation: "total",
          value: 2000,
        },
        regions: [region.id],
      })

      const cart = await simpleCartFactory(dbConnection, {
        email: "adrien@test.com",
        region: region.id,
        line_items: [
          {
            id: lineItemId1,
            variant_id: product.variants[0].id,
            quantity: 1,
            unit_price: 1000,
          },
          {
            id: lineItemId2,
            variant_id: product2.variants[0].id,
            quantity: 1,
            unit_price: 1000,
          },
        ],
      })

      await api.post(`/store/carts/${cart.id}`, {
        discounts: [{ code: discountCode }],
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const completeRes = await api.post(`/store/carts/${cart.id}/complete`)

      const order = completeRes.data.data

      const {
        data: { order_edit },
      } = await api.post(
        `/admin/order-edits/`,
        {
          order_id: order.id,
          internal_note: "This is an internal note",
        },
        adminHeaders
      )

      const orderEditId = order_edit.id
      const updateItemId = order_edit.items.find(
        (item) => item.original_item_id === lineItemId1
      ).id

      let response = await api.post(
        `/admin/order-edits/${orderEditId}/items/${updateItemId}`,
        { quantity: 2 },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit.changes).toHaveLength(1)

      let item1 = response.data.order_edit.items.find(
        (item) => item.original_item_id === lineItemId1
      )
      expect(item1.adjustments).toHaveLength(1)

      let item2 = response.data.order_edit.items.find(
        (item) => item.original_item_id === lineItemId2
      )
      expect(item2.adjustments).toHaveLength(1)

      expect(item1.adjustments[0].amount).toBeCloseTo(1333, 0)
      expect(item2.adjustments[0].amount).toBeCloseTo(667, 0)

      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          changes: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              type: "item_update",
              order_edit_id: orderEditId,
              original_line_item_id: lineItemId1,
              line_item_id: expect.any(String),
            }),
          ]),
          status: "created",
          order_id: order.id,
          internal_note: "This is an internal note",
          created_by: expect.any(String),
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId1,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 2,
              fulfilled_quantity: null,
              returned_quantity: null,
              shipped_quantity: null,
              metadata: null,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 10,
                }),
              ]),
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  discount_id: discount.id,
                }),
              ]),
            }),
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId2,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 1,
              fulfilled_quantity: null,
              returned_quantity: null,
              shipped_quantity: null,
              metadata: null,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 10,
                }),
              ]),
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  discount_id: discount.id,
                }),
              ]),
            }),
          ]),
          discount_total: 2000,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 3000,
          tax_total: 100,
          total: 1100,
        })
      )

      response = await api.post(
        `/admin/order-edits/${orderEditId}/items/${updateItemId}`,
        { quantity: 3 },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit.changes).toHaveLength(1)

      item1 = response.data.order_edit.items.find(
        (item) => item.original_item_id === lineItemId1
      )
      expect(item1.adjustments).toHaveLength(1)

      item2 = response.data.order_edit.items.find(
        (item) => item.original_item_id === lineItemId2
      )
      expect(item2.adjustments).toHaveLength(1)

      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          changes: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              type: "item_update",
              order_edit_id: orderEditId,
              original_line_item_id: lineItemId1,
              line_item_id: expect.any(String),
            }),
          ]),
          status: "created",
          order_id: order.id,
          internal_note: "This is an internal note",
          created_by: expect.any(String),
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId1,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 3,
              fulfilled_quantity: null,
              returned_quantity: null,
              shipped_quantity: null,
              metadata: null,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 10,
                }),
              ]),
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  discount_id: discount.id,
                  amount: 1500,
                }),
              ]),
            }),
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId2,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 1,
              fulfilled_quantity: null,
              returned_quantity: null,
              shipped_quantity: null,
              metadata: null,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 10,
                }),
              ]),
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  discount_id: discount.id,
                  amount: 500,
                }),
              ]),
            }),
          ]),
          discount_total: 2000,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 4000,
          tax_total: 200,
          total: 2200,
        })
      )
    })
  })

  describe("Preserve custom adjustments on items change", () => {
    let product
    let product2
    const orderId = IdMap.getId("order-1")
    const prodId1 = IdMap.getId("product-1")
    const prodId2 = IdMap.getId("product-2")
    const lineItemId1 = IdMap.getId("line-item-1")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      product = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })

      product2 = await simpleProductFactory(dbConnection, {
        id: prodId2,
      })

      await simpleOrderFactory(dbConnection, {
        id: orderId,
        email: "test@testson.com",
        region: {
          id: "test-region",
          name: "Test region",
          tax_rate: 12.5,
        },
        tax_rate: null,
        line_items: [
          {
            adjustments: [
              {
                item_id: lineItemId1,
                amount: 200,
                description: "custom adjustment that should be persisted",
              },
            ],
            id: lineItemId1,
            variant_id: product.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                item_id: lineItemId1,
                rate: 12.5,
                code: "default",
                name: "default",
              },
            ],
          },
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("preserve custom line item on update item change", async () => {
      const api = useApi()

      const {
        data: { order_edit },
      } = await api.post(
        `/admin/order-edits/`,
        {
          order_id: orderId,
          internal_note: "This is an internal note",
        },
        adminHeaders
      )

      const orderEditId = order_edit.id
      const updateItemId = order_edit.items.find(
        (item) => item.original_item_id === lineItemId1
      ).id

      const response = await api.post(
        `/admin/order-edits/${orderEditId}/items/${updateItemId}`,
        { quantity: 2 },
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit.changes).toHaveLength(1)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          changes: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              type: "item_update",
              order_edit_id: orderEditId,
              original_line_item_id: lineItemId1,
              line_item_id: expect.any(String),
              line_item: expect.objectContaining({
                id: expect.any(String),
              }),
              original_line_item: expect.objectContaining({
                id: lineItemId1,
              }),
            }),
          ]),
          status: "created",
          order_id: orderId,
          internal_note: "This is an internal note",
          created_by: expect.any(String),
          items: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId1,
              order_edit_id: orderEditId,
              quantity: 2,
              adjustments: [
                expect.objectContaining({
                  amount: 200,
                  description: "custom adjustment that should be persisted",
                  discount_id: null,
                }),
              ],
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 12.5,
                  name: "default",
                  code: "default",
                }),
              ]),
            }),
          ]),
          // 2 items with unit price 1000 and a custom line item adjustment of 200
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          discount_total: 200,
          subtotal: 2 * 1000,
          tax_total: (2000 - 200) * 0.125,
          total: 1800 * 0.125 + 1800,
        })
      )
    })
  })

  describe("DELETE /admin/order-edits/:id/items/:item_id", () => {
    let product
    let product2
    let discountCode
    let discountCodeLarge
    let cart
    const orderId = IdMap.getId("order-1")
    const discountOrderId = IdMap.getId("order-2")
    const prodId1 = IdMap.getId("product-1")
    const prodId2 = IdMap.getId("product-2")
    const lineItemId1 = IdMap.getId("line-item-1")
    const lineItemId2 = IdMap.getId("line-item-2")
    const lineItemId1Discount = IdMap.getId("line-item-1-discount")
    const lineItemId2Discount = IdMap.getId("line-item-2-discount")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      product = await simpleProductFactory(dbConnection, {
        id: prodId1,
      })

      product2 = await simpleProductFactory(dbConnection, {
        id: prodId2,
      })

      const region = await simpleRegionFactory(dbConnection, {
        id: "test-region",
        name: "Test region",
        tax_rate: 12.5,
      })

      await simpleOrderFactory(dbConnection, {
        id: orderId,
        email: "test-2@testson.com",
        tax_rate: null,
        fulfillment_status: "fulfilled",
        payment_status: "captured",
        region_id: "test-region",
        line_items: [
          {
            id: lineItemId1,
            variant_id: product.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                item_id: lineItemId1,
                rate: 12.5,
                code: "default",
                name: "default",
              },
            ],
          },
          {
            id: lineItemId2,
            variant_id: product2.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
            tax_lines: [
              {
                item_id: lineItemId2,
                rate: 12.5,
                code: "default",
                name: "default",
              },
            ],
          },
        ],
      })

      discountCode = "FIX_DISCOUNT_SMALL"
      const discount = await simpleDiscountFactory(dbConnection, {
        code: discountCode,
        rule: {
          type: "fixed",
          allocation: "total",
          value: 500,
        },
        regions: ["test-region"],
      })

      discountCodeLarge = "FIX_DISCOUNT_LARGE"
      const discountLarge = await simpleDiscountFactory(dbConnection, {
        code: discountCodeLarge,
        rule: {
          type: "fixed",
          allocation: "total",
          value: 1200,
        },
        regions: ["test-region"],
      })

      cart = await simpleCartFactory(dbConnection, {
        email: "adrien@test.com",
        region: "test-region",
        line_items: [
          {
            id: lineItemId1Discount,
            variant_id: product.variants[0].id,
            quantity: 1,
            unit_price: 1000,
          },
          {
            id: lineItemId2Discount,
            variant_id: product2.variants[0].id,
            quantity: 1,
            unit_price: 1000,
          },
        ],
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("creates an order edit item change of type delete on line item delete", async () => {
      const api = useApi()

      const {
        data: { order_edit },
      } = await api
        .post(
          `/admin/order-edits/`,
          {
            order_id: orderId,
          },
          adminHeaders
        )
        .catch(console.log)

      const orderEditId = order_edit.id
      const editLineItemId = order_edit.items.find(
        (it) => it.original_item_id === lineItemId1
      ).id

      const response = await api
        .delete(
          `/admin/order-edits/${orderEditId}/items/${editLineItemId}`,
          adminHeaders
        )
        .catch(console.log)

      expect(response.status).toEqual(200)
      expect(response.data.order_edit.changes).toHaveLength(1)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          changes: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              type: "item_remove",
              order_edit_id: orderEditId,
              original_line_item_id: lineItemId1,
              line_item_id: null,
              line_item: null,
              original_line_item: expect.objectContaining({
                id: lineItemId1,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                cart_id: null,
                order_id: orderId,
                swap_id: null,
                claim_order_id: null,
                title: expect.any(String),
                description: "",
                thumbnail: "",
                is_return: false,
                is_giftcard: false,
                should_merge: true,
                allow_discounts: true,
                has_shipping: null,
                unit_price: 1000,
                variant_id: expect.any(String),
                quantity: 1,
                fulfilled_quantity: 1,
                returned_quantity: null,
                shipped_quantity: 1,
                metadata: null,
                variant: expect.any(Object),
              }),
            }),
          ]),
          status: "created",
          order_id: orderId,
          created_by: expect.any(String),
          items: [
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId2,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 1,
              fulfilled_quantity: 1,
              returned_quantity: null,
              shipped_quantity: 1,
              metadata: null,
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 12.5,
                  name: "default",
                  code: "default",
                }),
              ]),
            }),
          ],
          discount_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 1000,
          tax_total: 125,
          total: 1125,
        })
      )
    })

    it("creates an order edit item change of type delete on line item delete and adjusts discount allocation from one to two items", async () => {
      const api = useApi()

      await api.post(`/store/carts/${cart.id}`, {
        discounts: [{ code: discountCode }],
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const completeRes = await api.post(`/store/carts/${cart.id}/complete`)

      const discountOrder = completeRes.data.data

      const {
        data: { order_edit },
      } = await api.post(
        `/admin/order-edits/`,
        {
          order_id: discountOrder.id,
        },
        adminHeaders
      )

      const editLineItemId = order_edit.items.find(
        (it) => it.original_item_id === lineItemId1Discount
      ).id

      const orderEditId = order_edit.id
      await api.delete(
        `/admin/order-edits/${orderEditId}/items/${editLineItemId}`,
        adminHeaders
      )

      const response = await api.get(
        `/admin/order-edits/${orderEditId}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit.changes).toHaveLength(1)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          changes: [
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              type: "item_remove",
              order_edit_id: orderEditId,
              original_line_item_id: lineItemId1Discount,
              line_item_id: null,
              original_line_item: expect.objectContaining({
                id: lineItemId1Discount,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                cart_id: expect.any(String),
                order_id: discountOrder.id,
                swap_id: null,
                claim_order_id: null,
                title: expect.any(String),
                description: "",
                thumbnail: "",
                is_return: false,
                is_giftcard: false,
                should_merge: true,
                allow_discounts: true,
                has_shipping: null,
                unit_price: 1000,
                variant_id: expect.any(String),
                quantity: 1,
                returned_quantity: null,
                shipped_quantity: null,
                metadata: null,
                variant: expect.any(Object),
              }),
            }),
          ],
          status: "created",
          order_id: discountOrder.id,
          created_by: expect.any(String),
          items: [
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId2Discount,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              description: "",
              thumbnail: "",
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 1,
              returned_quantity: null,
              metadata: null,
              adjustments: [
                expect.objectContaining({
                  id: expect.any(String),
                  item_id: expect.any(String),
                  description: "discount",
                  discount_id: expect.any(String),
                  amount: 500,
                  metadata: null,
                }),
              ],
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 12.5,
                  name: "default",
                  code: "default",
                }),
              ]),
            }),
          ],
          discount_total: 500,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 1000,
          tax_total: 63,
          total: 563,
        })
      )
    })

    it("creates an order edit item change of type delete on line item delete and adjusts discount allocation from one to two items with discount amount being larger than the unit price of the remaining line item", async () => {
      const api = useApi()

      await api.post(`/store/carts/${cart.id}`, {
        discounts: [{ code: discountCodeLarge }],
      })

      await api.post(`/store/carts/${cart.id}/payment-sessions`)

      const completeRes = await api.post(`/store/carts/${cart.id}/complete`)

      const discountOrder = completeRes.data.data

      const {
        data: { order_edit },
      } = await api.post(
        `/admin/order-edits/`,
        {
          order_id: discountOrder.id,
        },
        adminHeaders
      )

      const editLineItemId = order_edit.items.find(
        (it) => it.original_item_id === lineItemId1Discount
      ).id

      const orderEditId = order_edit.id
      await api.delete(
        `/admin/order-edits/${orderEditId}/items/${editLineItemId}`,
        adminHeaders
      )

      const response = await api.get(
        `/admin/order-edits/${orderEditId}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.order_edit.changes).toHaveLength(1)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          changes: [
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              type: "item_remove",
              order_edit_id: orderEditId,
              original_line_item_id: lineItemId1Discount,
              line_item_id: null,
              original_line_item: expect.objectContaining({
                id: lineItemId1Discount,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                cart_id: expect.any(String),
                order_id: discountOrder.id,
                swap_id: null,
                claim_order_id: null,
                title: expect.any(String),
                description: "",
                thumbnail: "",
                is_return: false,
                is_giftcard: false,
                should_merge: true,
                allow_discounts: true,
                has_shipping: null,
                unit_price: 1000,
                variant_id: expect.any(String),
                quantity: 1,
                returned_quantity: null,
                shipped_quantity: null,
                metadata: null,
                variant: expect.any(Object),
              }),
            }),
          ],
          status: "created",
          order_id: discountOrder.id,
          created_by: expect.any(String),
          items: [
            expect.objectContaining({
              id: expect.any(String),
              original_item_id: lineItemId2Discount,
              order_edit_id: orderEditId,
              cart_id: null,
              order_id: null,
              swap_id: null,
              claim_order_id: null,
              title: expect.any(String),
              description: "",
              thumbnail: "",
              is_return: false,
              is_giftcard: false,
              should_merge: true,
              allow_discounts: true,
              has_shipping: null,
              unit_price: 1000,
              variant_id: expect.any(String),
              quantity: 1,
              returned_quantity: null,
              metadata: null,
              adjustments: [
                expect.objectContaining({
                  id: expect.any(String),
                  item_id: expect.any(String),
                  description: "discount",
                  discount_id: expect.any(String),
                  amount: 1000,
                  metadata: null,
                }),
              ],
              tax_lines: expect.arrayContaining([
                expect.objectContaining({
                  rate: 12.5,
                  name: "default",
                  code: "default",
                }),
              ]),
            }),
          ],
          discount_total: 1000,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 1000,
          tax_total: 0,
          total: 0,
        })
      )
    })
  })
})
