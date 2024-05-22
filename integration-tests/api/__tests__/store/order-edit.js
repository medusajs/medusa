const path = require("path")

const startServerWithEnvironment =
  require("../../../environment-helpers/start-server-with-environment").default
const { useApi } = require("../../../environment-helpers/use-api")
const { useDb, initDb } = require("../../../environment-helpers/use-db")
const adminSeeder = require("../../../helpers/admin-seeder")
const {
  getClientAuthenticationCookie,
} = require("../../../helpers/client-authentication")
const {
  simpleOrderEditFactory,
} = require("../../../factories/simple-order-edit-factory")
const { IdMap } = require("medusa-test-utils")
const {
  simpleOrderItemChangeFactory,
} = require("../../../factories/simple-order-item-change-factory")
const {
  simpleLineItemFactory,
  simpleProductFactory,
  simpleOrderFactory,
  simpleCustomerFactory,
} = require("../../../factories")
const { OrderEditItemChangeType } = require("@medusajs/medusa")
const setupServer = require("../../../environment-helpers/setup-server")

jest.setTimeout(30000)

describe("/store/order-edits", () => {
  let medusaProcess
  let dbConnection

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    medusaProcess = await setupServer({
      cwd,
    })

    await simpleCustomerFactory(dbConnection, {
      id: "customer",
      email: "test@medusajs.com",
    })
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

      const response = await api.get(`/store/order-edits/${orderEditId}`, {
        headers: {
          Cookie: await getClientAuthenticationCookie(api),
        },
      })

      expect(response.status).toEqual(200)
      expect(response.data.order_edit).toEqual(
        expect.objectContaining({
          id: orderEditId,
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
      expect(response.data.order_edit.internal_note).not.toBeDefined()
      expect(response.data.order_edit.created_by).not.toBeDefined()
      expect(response.data.order_edit.canceled_by).not.toBeDefined()
      expect(response.data.order_edit.confirmed_by).not.toBeDefined()
    })

    it("fails to get an order edit with disallowed fields query params", async () => {
      const api = useApi()

      const err = await api
        .get(
          `/store/order-edits/${orderEditId}?fields=internal_note,order_id`,
          {
            headers: {
              Cookie: await getClientAuthenticationCookie(api),
            },
          }
        )
        .catch((e) => e)

      expect(err.response.data.message).toBe(
        "Requested fields [internal_note] are not valid"
      )
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
        created_by: expect.any(String),
        requested_at: new Date(),
      })

      declinedOrderEdit = await simpleOrderEditFactory(dbConnection, {
        id: IdMap.getId("order-edit-2"),
        created_by: expect.any(String),
        declined_reason: "wrong size",
        declined_at: new Date(),
      })

      confirmedOrderEdit = await simpleOrderEditFactory(dbConnection, {
        id: IdMap.getId("order-edit-3"),
        created_by: expect.any(String),
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
        },
        {
          headers: {
            Cookie: await getClientAuthenticationCookie(api),
          },
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
        },
        {
          headers: {
            Cookie: await getClientAuthenticationCookie(api),
          },
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
        .post(
          `/store/order-edits/${confirmedOrderEdit.id}/decline`,
          {
            declined_reason: "wrong color",
          },
          {
            headers: {
              Cookie: await getClientAuthenticationCookie(api),
            },
          }
        )
        .catch((err) => {
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            `Cannot decline an order edit with status confirmed.`
          )
        })
    })
  })

  describe("POST /store/order-edits/:id/complete", () => {
    let requestedOrderEdit
    let confirmedOrderEdit
    let createdOrderEdit

    beforeEach(async () => {
      await adminSeeder(dbConnection)

      requestedOrderEdit = await simpleOrderEditFactory(dbConnection, {
        id: IdMap.getId("order-edit-1"),
        created_by: expect.any(String),
        requested_at: new Date(),
      })

      confirmedOrderEdit = await simpleOrderEditFactory(dbConnection, {
        id: IdMap.getId("order-edit-2"),
        created_by: expect.any(String),
        confirmed_at: new Date(),
        confirmed_by: "admin_user",
      })

      createdOrderEdit = await simpleOrderEditFactory(dbConnection, {
        id: IdMap.getId("order-edit-3"),
        created_by: expect.any(String),
      })
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("idempotently complete an already confirmed order edit", async () => {
      const api = useApi()
      const result = await api.post(
        `/store/order-edits/${confirmedOrderEdit.id}/complete`,
        undefined,
        {
          headers: {
            Cookie: await getClientAuthenticationCookie(api),
          },
        }
      )

      expect(result.status).toEqual(200)
      expect(result.data.order_edit).toEqual(
        expect.objectContaining({
          id: confirmedOrderEdit.id,
          status: "confirmed",
          confirmed_at: expect.any(String),
        })
      )
    })

    it("fails to complete a non requested order edit", async () => {
      const api = useApi()
      const err = await api
        .post(`/store/order-edits/${createdOrderEdit.id}/complete`, undefined, {
          headers: {
            Cookie: await getClientAuthenticationCookie(api),
          },
        })
        .catch((e) => e)

      expect(err.response.status).toEqual(400)
      expect(err.response.data.message).toBe(
        `Cannot complete an order edit with status created`
      )
    })
  })
})
