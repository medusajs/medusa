const path = require("path")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const adminSeeder = require("../../helpers/admin-seeder")
const {
  simpleOrderEditFactory,
} = require("../../factories/simple-order-edit-factory")
const { IdMap } = require("medusa-test-utils")
const {
  simpleOrderItemChangeFactory,
} = require("../../factories/simple-order-item-change-factory")
const {
  simpleLineItemFactory,
  simpleProductFactory,
  simpleOrderFactory,
} = require("../../factories")
const { OrderEditItemChangeType, OrderEdit } = require("@medusajs/medusa")

jest.setTimeout(30000)

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("[MEDUSA_FF_ORDER_EDITING] /admin/order-edits", () => {
  let medusaProcess
  let dbConnection
  const adminUserId = "admin_user"

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_ORDER_EDITING: true },
      verbose: false,
    })
    dbConnection = connection
    medusaProcess = process
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
        created_by: "admin_user",
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
          created_by: "admin_user",
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

      expect(orderEdit).toBeUndefined()
      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id,
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
          created_by: "admin_user",
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
        created_by: "admin_user",
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
          created_by: "admin_user",
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

      const { id, order_id } = await simpleOrderEditFactory(dbConnection, {
        created_by: "admin_user",
      })

      const noChangesEdit = await simpleOrderEditFactory(dbConnection, {
        created_by: "admin_user",
      })

      await simpleLineItemFactory(dbConnection, {
        order_id: order_id,
        variant_id: product1.variants[0].id,
      })

      await simpleOrderItemChangeFactory(dbConnection, {
        order_edit_id: id,
        type: "item_add",
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
          created_by: "admin_user",
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
        created_by: "admin_user",
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
        created_by: "admin_user",
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
        created_by: "admin_user",
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
        created_by: "admin_user",
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
        created_by: "admin_user",
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

  describe("POST /admin/order-edits/:id", () => {
    const cancellableEditId = IdMap.getId("order-edit-1")
    const canceledEditId = IdMap.getId("order-edit-2")
    const confirmedEditId = IdMap.getId("order-edit-3")

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      await simpleOrderEditFactory(dbConnection, {
        id: cancellableEditId,
        created_by: "admin_user",
        internal_note: "test internal note",
      })

      await simpleOrderEditFactory(dbConnection, {
        id: canceledEditId,
        canceled_at: new Date(),
        canceled_by: "admin_user",
        created_by: "admin_user",
      })

      await simpleOrderEditFactory(dbConnection, {
        id: confirmedEditId,
        confirmed_at: new Date(),
        confirmed_by: "admin_user",
        created_by: "admin_user",
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
          created_by: "admin_user",
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
          created_by: "admin_user",
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
})
