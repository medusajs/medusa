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
          },
          {
            id: lineItemId2,
            variant_id: product2.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
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
          items: expect.arrayContaining([
            expect.objectContaining({ id: lineItemCreateId, quantity: 2 }),
            expect.objectContaining({ id: lineItemId1, quantity: 2 }),
          ]),
          removed_items: expect.arrayContaining([
            expect.objectContaining({ id: lineItemId2, quantity: 1 }),
          ]),
          shipping_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          discount_total: 0,
          tax_total: 0,
          total: 2200,
          subtotal: 2200,
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
          },
          {
            id: lineItemId2,
            variant_id: product2.variants[0].id,
            quantity: 1,
            fulfilled_quantity: 1,
            shipped_quantity: 1,
            unit_price: 1000,
          },
        ],
      })
      orderId = order.id
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("creates and order edit", async () => {
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
          items: expect.arrayContaining([
            expect.objectContaining({
              id: lineItemId1,
              quantity: 1,
              fulfilled_quantity: 1,
              shipped_quantity: 1,
              unit_price: 1000,
            }),
            expect.objectContaining({
              id: lineItemId2,
              quantity: 1,
              fulfilled_quantity: 1,
              shipped_quantity: 1,
              unit_price: 1000,
            }),
          ]),
          shipping_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          discount_total: 0,
          tax_total: 0,
          total: 2000,
          subtotal: 2000,
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
  })

  describe("POST /admin/order-edits/:id", () => {
    const orderEditId = IdMap.getId("order-edit-1")
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
          },
        ],
      })

      await simpleOrderEditFactory(dbConnection, {
        id: orderEditId,
        order_id: order.id,
        created_by: "admin_user",
        internal_note: "test internal note",
      })
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
          /*
           * Computed items are appended to the response
           */
          items: [
            expect.objectContaining({
              id: lineItemId1,
              order_id: orderId1,
            }),
          ],
          /*
           * Computed totals are appended to the response
           */
          discount_total: 0,
          gift_card_total: 0,
          gift_card_tax_total: 0,
          shipping_total: 0,
          subtotal: 1000,
          tax_total: 0,
          total: 1000,
        })
      )
    })
  })
})
