const path = require("path")
import { ReturnReason, ShippingMethod } from "@medusajs/medusa"
import { createReturnableOrder } from "../claims"

const setupServer = require("../../../helpers/setup-server")
const { useApi } = require("../../../helpers/use-api")
const { initDb, useDb } = require("../../../helpers/use-db")

const orderSeeder = require("../../helpers/order-seeder")
const adminSeeder = require("../../helpers/admin-seeder")

jest.setTimeout(30000)

const authHeader = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

describe("/admin/returns", () => {
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

  describe("POST /admin/returns/:id", () => {
    let rrId

    beforeEach(async () => {
      await adminSeeder(dbConnection)
      await orderSeeder(dbConnection)

      const created = dbConnection.manager.create(ReturnReason, {
        value: "too_big",
        label: "Too Big",
      })
      const resultRR = await dbConnection.manager.save(created)
      rrId = resultRR.id
    })

    afterEach(async () => {
      const db = useDb()
      await db.teardown()
    })

    it("should receive a return on an item added through swap additional items", async () => {
      const api = useApi()

      // create a swap
      const response = await api.post(
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
        authHeader
      )

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
      const fulRes = await api.post(
        `/admin/orders/test-order/swaps/${sid}/fulfillments`,
        {},
        authHeader
      )

      // ship the swap
      await api.post(
        `/admin/orders/test-order/swaps/${sid}/shipments`,
        {
          fulfillment_id: fulRes.data.order.swaps[0].fulfillments[0].id,
        },
        authHeader
      )

      const swapItemId = fulRes.data.order.swaps[0].additional_items[0].id

      // request a return
      const returnRes = await api.post(
        `/admin/orders/test-order/return`,
        {
          items: [
            {
              item_id: swapItemId,
              quantity: 1,
              reason_id: rrId,
            },
          ],
        },
        authHeader
      )

      const returnId = returnRes.data.order.returns[0].id

      const receiveRes = await api.post(
        `/admin/returns/${returnId}/receive`,
        {
          items: [
            {
              item_id: swapItemId,
              quantity: 1,
            },
          ],
        },
        authHeader
      )

      expect(receiveRes.status).toEqual(200)
    })

    it("should receive a return on an item added through claim additional items", async () => {
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
          authHeader
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

      const claimItemId = fulRes.data.order.claims[0].additional_items[0].id

      // request a return
      const returnRes = await api.post(
        `/admin/orders/test-order/return`,
        {
          items: [
            {
              item_id: claimItemId,
              quantity: 1,
              reason_id: rrId,
            },
          ],
          return_shipping: {
            option_id: "test-option",
            price: 0,
          },
        },
        authHeader
      )

      const returnId = returnRes.data.order.returns[0].id

      const receiveRes = await api.post(
        `/admin/returns/${returnId}/receive`,
        {
          items: [
            {
              item_id: claimItemId,
              quantity: 1,
            },
          ],
        },
        authHeader
      )

      expect(receiveRes.status).toEqual(200)
    })
  })

  describe("POST /admin/returns/:id/receive", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("should receive a return partially", async () => {
      const api = useApi()

      const order = await createReturnableOrder(dbConnection)
      const itemId = "test-item"

      // create a return
      const response = await api.post(
        `/admin/orders/${order.id}/return`,
        {
          items: [
            {
              item_id: itemId,
              quantity: 2,
            },
          ],
        },
        authHeader
      )

      const returnId = response.data.order.returns[0].id

      // receive a return
      const receiveRes = await api.post(
        `/admin/returns/${returnId}/receive`,
        {
          items: [
            {
              item_id: itemId,
              quantity: 1,
            },
          ],
        },
        authHeader
      )

      const receivedReturn = receiveRes.data.return

      expect(receivedReturn.items.length).toEqual(1)
      const receivedItem = receivedReturn.items[0]

      expect(receivedItem.requested_quantity).toEqual(2)
      expect(receivedItem.received_quantity).toEqual(1)
    })
  })
})
