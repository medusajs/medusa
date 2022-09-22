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
const { OrderEditItemChangeType } = require("@medusajs/medusa")

jest.setTimeout(30000)

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("[MEDUSA_FF_ORDER_EDITING] /store/order-edits", () => {
  let medusaProcess
  let dbConnection

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

  describe("GET /store/order-edits/:id", () => {
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

      const response = await api.get(`/store/order-edits/${orderEditId}`)

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
          requested_by: null,
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

      expect(response.data.order_edit.internal_note).not.toBeDefined()
      expect(response.data.order_edit.created_by).not.toBeDefined()
      expect(response.data.order_edit.canceled_by).not.toBeDefined()
      expect(response.data.order_edit.confirmed_by).not.toBeDefined()
    })
  })

  describe("POST /store/order-edits/:id/decline", () => {
    let declineableOrderEdit
    let declinedOrderEdit
    let confirmedOrderEdit
    beforeEach(async () => {
      await adminSeeder(dbConnection)

      declineableOrderEdit = await simpleOrderEditFactory(dbConnection, {
        id: IdMap.getId("order-edit-1"),
        created_by: "admin_user",
        requested_at: new Date(),
      })

      declinedOrderEdit = await simpleOrderEditFactory(dbConnection, {
        id: IdMap.getId("order-edit-2"),
        created_by: "admin_user",
        declined_reason: "wrong size",
        declined_at: new Date(),
      })

      confirmedOrderEdit = await simpleOrderEditFactory(dbConnection, {
        id: IdMap.getId("order-edit-3"),
        created_by: "admin_user",
        confirmed_at: new Date(),
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("declines an order edit", async () => {
      const api = useApi()
      const result = await api.post(
        `/store/order-edits/${declineableOrderEdit.id}/decline`,
        {
          declined_reason: "wrong color",
        }
      )

      expect(result.status).toEqual(200)
      expect(result.data.order_edit).toEqual(
        expect.objectContaining({
          status: "declined",
          declined_reason: "wrong color",
        })
      )
    })

    it("fails to decline an already declined order edit", async () => {
      const api = useApi()
      const result = await api.post(
        `/store/order-edits/${declinedOrderEdit.id}/decline`,
        {
          declined_reason: "wrong color",
        }
      )

      expect(result.status).toEqual(200)
      expect(result.data.order_edit).toEqual(
        expect.objectContaining({
          id: declinedOrderEdit.id,
          status: "declined",
          declined_reason: "wrong size",
          declined_at: expect.any(String),
        })
      )
    })

    it("fails to decline an already confirmed order edit", async () => {
      expect.assertions(2)

      const api = useApi()
      await api
        .post(`/store/order-edits/${confirmedOrderEdit.id}/decline`, {
          declined_reason: "wrong color",
        })
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            `Cannot decline an order edit with status confirmed.`
          )
        })
    })
  })
})
