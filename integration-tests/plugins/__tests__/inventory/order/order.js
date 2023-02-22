const path = require("path")

const { bootstrapApp } = require("../../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../helpers/use-db")
const { setPort, useApi } = require("../../../../helpers/use-api")

const adminSeeder = require("../../../helpers/admin-seeder")
const cartSeeder = require("../../../helpers/cart-seeder")
const { simpleProductFactory } = require("../../../../api/factories")
const { simpleSalesChannelFactory } = require("../../../../api/factories")
const {
  simpleOrderFactory,
  simpleRegionFactory,
} = require("../../../factories")

jest.setTimeout(30000)

const adminHeaders = { headers: { Authorization: "Bearer test_token" } }

describe("/store/carts", () => {
  let express
  let appContainer
  let dbConnection

  const doAfterEach = async () => {
    const db = useDb()
    return await db.teardown()
  }

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd })
    const { container, app, port } = await bootstrapApp({ cwd })
    appContainer = container

    setPort(port)
    express = app.listen(port, (err) => {
      process.send(port)
    })
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    express.close()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    const db = useDb()
    return await db.teardown()
  })

  describe("POST /store/carts/:id", () => {
    let order
    let locationId
    let invItemId
    let variantId
    let prodVarInventoryService

    beforeEach(async () => {
      const api = useApi()

      prodVarInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )
      const inventoryService = appContainer.resolve("inventoryService")
      const stockLocationService = appContainer.resolve("stockLocationService")
      const salesChannelLocationService = appContainer.resolve(
        "salesChannelLocationService"
      )

      const r = await simpleRegionFactory(dbConnection, {})
      await simpleSalesChannelFactory(dbConnection, {
        id: "test-channel",
        is_default: true,
      })

      await adminSeeder(dbConnection)

      const product = await simpleProductFactory(dbConnection, {
        id: "product1",
        sales_channels: [{ id: "test-channel" }],
      })
      variantId = product.variants[0].id

      const sl = await stockLocationService.create({ name: "test-location" })

      locationId = sl.id

      await salesChannelLocationService.associateLocation(
        "test-channel",
        locationId
      )

      const invItem = await inventoryService.createInventoryItem({
        sku: "test-sku",
      })
      invItemId = invItem.id

      await prodVarInventoryService.attachInventoryItem(variantId, invItem.id)

      await inventoryService.createInventoryLevel({
        inventory_item_id: invItem.id,
        location_id: locationId,
        stocked_quantity: 1,
      })

      const { id: orderId } = await simpleOrderFactory(dbConnection, {
        sales_channel: "test-channel",
        line_items: [
          {
            variant_id: variantId,
            quantity: 2,
            id: "line-item-id",
          },
        ],
        shipping_methods: [
          {
            shipping_option: {
              region_id: r.id,
            },
          },
        ],
      })

      const orderRes = await api.get(`/admin/orders/${orderId}`, adminHeaders)
      order = orderRes.data.order

      const inventoryItem = await api.get(
        `/admin/inventory-items/${invItem.id}`,
        adminHeaders
      )

      expect(inventoryItem.data.inventory_item.location_levels[0]).toEqual(
        expect.objectContaining({
          stocked_quantity: 1,
          reserved_quantity: 0,
          available_quantity: 1,
        })
      )
    })

    describe("Fulfillments", () => {
      const lineItemId = "line-item-id"
      it("Adjusts reservations on successful fulfillment with reservation", async () => {
        const api = useApi()

        await prodVarInventoryService.reserveQuantity(variantId, 1, {
          locationId: locationId,
          lineItemId: order.items[0].id,
        })

        let inventoryItem = await api.get(
          `/admin/inventory-items/${invItemId}`,
          adminHeaders
        )

        expect(inventoryItem.data.inventory_item.location_levels[0]).toEqual(
          expect.objectContaining({
            stocked_quantity: 1,
            reserved_quantity: 1,
            available_quantity: 0,
          })
        )

        const fulfillmentRes = await api.post(
          `/admin/orders/${order.id}/fulfillment`,
          {
            items: [{ item_id: lineItemId, quantity: 1 }],
            location_id: locationId,
          },
          adminHeaders
        )

        expect(fulfillmentRes.status).toBe(200)
        expect(fulfillmentRes.data.order.fulfillment_status).toBe(
          "partially_fulfilled"
        )

        inventoryItem = await api.get(
          `/admin/inventory-items/${invItemId}`,
          adminHeaders
        )

        const reservations = await api.get(
          `/admin/reservations?inventory_item_id[]=${invItemId}`,
          adminHeaders
        )

        expect(reservations.data.reservations.length).toBe(0)
        expect(inventoryItem.data.inventory_item.location_levels[0]).toEqual(
          expect.objectContaining({
            stocked_quantity: 0,
            reserved_quantity: 0,
            available_quantity: 0,
          })
        )
      })

      it("adjusts inventory levels on successful fulfillment without reservation", async () => {
        const api = useApi()

        const fulfillmentRes = await api.post(
          `/admin/orders/${order.id}/fulfillment`,
          {
            items: [{ item_id: lineItemId, quantity: 1 }],
            location_id: locationId,
          },
          adminHeaders
        )
        expect(fulfillmentRes.status).toBe(200)
        expect(fulfillmentRes.data.order.fulfillment_status).toBe(
          "partially_fulfilled"
        )

        const inventoryItem = await api.get(
          `/admin/inventory-items/${invItemId}`,
          adminHeaders
        )

        expect(inventoryItem.data.inventory_item.location_levels[0]).toEqual(
          expect.objectContaining({
            stocked_quantity: 0,
            reserved_quantity: 0,
            available_quantity: 0,
          })
        )
      })

      it("Fails to create fulfillment if there is not enough inventory at the fulfillment location", async () => {
        const api = useApi()

        const err = await api
          .post(
            `/admin/orders/${order.id}/fulfillment`,
            {
              items: [{ item_id: lineItemId, quantity: 2 }],
              location_id: locationId,
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(err.response.status).toBe(400)
        expect(err.response.data).toEqual({
          type: "not_allowed",
          message: `Insufficient stock for item: ${order.items[0].title}`,
        })

        const inventoryItem = await api.get(
          `/admin/inventory-items/${invItemId}`,
          adminHeaders
        )

        expect(inventoryItem.data.inventory_item.location_levels[0]).toEqual(
          expect.objectContaining({
            stocked_quantity: 1,
            reserved_quantity: 0,
            available_quantity: 1,
          })
        )
      })
    })
  })
})
