const path = require("path")

const { bootstrapApp } = require("../../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../helpers/use-db")
const { setPort, useApi } = require("../../../../helpers/use-api")

const adminSeeder = require("../../../helpers/admin-seeder")
const cartSeeder = require("../../../helpers/cart-seeder")
const {
  simpleProductFactory,
  simpleCustomerFactory,
} = require("../../../../api/factories")
const { simpleSalesChannelFactory } = require("../../../../api/factories")
const {
  simpleOrderFactory,
  simpleRegionFactory,
  simpleCartFactory,
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
    let inventoryService
    let stockLocationService
    let salesChannelLocationService
    let regionId

    beforeEach(async () => {
      const api = useApi()

      prodVarInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )
      inventoryService = appContainer.resolve("inventoryService")
      stockLocationService = appContainer.resolve("stockLocationService")
      salesChannelLocationService = appContainer.resolve(
        "salesChannelLocationService"
      )

      const r = await simpleRegionFactory(dbConnection, {})
      regionId = r.id
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

      it("Adjusts reservations on successful fulfillment on updated reservation item", async () => {
        const api = useApi()

        const lineItemId1 = "line-item-id-1"

        // create new location for the inventoryItem with a quantity
        const loc = await stockLocationService.create({ name: "test-location" })

        const customer = await simpleCustomerFactory(dbConnection, {})

        const cart = await simpleCartFactory(dbConnection, {
          email: "adrien@test.com",
          region: regionId,
          line_items: [
            {
              id: lineItemId1,
              variant_id: variantId,
              quantity: 1,
              unit_price: 1000,
            },
          ],
          sales_channel_id: "test-channel",
          shipping_address: {},
          shipping_methods: [
            {
              shipping_option: {
                region_id: regionId,
              },
            },
          ],
        })

        await appContainer
          .resolve("cartService")
          .update(cart.id, { customer_id: customer.id })

        let inventoryItem = await api.get(
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

        await api.post(`/store/carts/${cart.id}/payment-sessions`)

        const completeRes = await api.post(`/store/carts/${cart.id}/complete`)

        const orderId = completeRes.data.data.id
        await salesChannelLocationService.associateLocation(
          "test-channel",
          locationId
        )

        await inventoryService.createInventoryLevel({
          inventory_item_id: invItemId,
          location_id: loc.id,
          stocked_quantity: 1,
        })

        inventoryItem = await api.get(
          `/admin/inventory-items/${invItemId}`,
          adminHeaders
        )

        expect(inventoryItem.data.inventory_item.location_levels).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              stocked_quantity: 1,
              reserved_quantity: 1,
              available_quantity: 0,
            }),
            expect.objectContaining({
              stocked_quantity: 1,
              reserved_quantity: 0,
              available_quantity: 1,
            }),
          ])
        )

        // update reservation item
        const reservationItems = await api.get(
          `/admin/reservations?line_item_id[]=${lineItemId1}`,
          adminHeaders
        )

        const reservationItem = reservationItems.data.reservations[0]

        const res = await api.post(
          `/admin/reservations/${reservationItem.id}`,
          { location_id: loc.id },
          adminHeaders
        )

        const fulfillmentRes = await api.post(
          `/admin/orders/${orderId}/fulfillment`,
          {
            items: [{ item_id: lineItemId1, quantity: 1 }],
            location_id: locationId,
          },
          adminHeaders
        )

        expect(fulfillmentRes.status).toBe(200)
        expect(
          fulfillmentRes.data.order.fulfillments[0].location_id
        ).toBeTruthy()

        inventoryItem = await api.get(
          `/admin/inventory-items/${invItemId}`,
          adminHeaders
        )

        const reservations = await api.get(
          `/admin/reservations?inventory_item_id[]=${invItemId}`,
          adminHeaders
        )

        expect(reservations.data.reservations.length).toBe(0)
        expect(inventoryItem.data.inventory_item.location_levels).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              location_id: locationId,
              stocked_quantity: 0,
              reserved_quantity: 0,
              available_quantity: 0,
            }),
            expect.objectContaining({
              location_id: loc.id,
              stocked_quantity: 1,
              reserved_quantity: 0,
              available_quantity: 1,
            }),
          ])
        )
      })

      it("Adjusts reservation on successful fulfillment with reservation", async () => {
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

      it("Deletes multiple reservations on successful fulfillment with reservation", async () => {
        const api = useApi()

        const a = await inventoryService.updateInventoryLevel(
          invItemId,
          locationId,
          { stocked_quantity: 2 }
        )

        await prodVarInventoryService.reserveQuantity(variantId, 1, {
          locationId: locationId,
          lineItemId: order.items[0].id,
        })

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
            stocked_quantity: 2,
            reserved_quantity: 2,
            available_quantity: 0,
          })
        )

        const fulfillmentRes = await api.post(
          `/admin/orders/${order.id}/fulfillment`,
          {
            items: [{ item_id: lineItemId, quantity: 2 }],
            location_id: locationId,
          },
          adminHeaders
        )

        expect(fulfillmentRes.status).toBe(200)
        expect(fulfillmentRes.data.order.fulfillment_status).toBe("fulfilled")

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

      it("Deletes single reservation on successful fulfillment with partial reservation", async () => {
        const api = useApi()

        await inventoryService.updateInventoryLevel(invItemId, locationId, {
          stocked_quantity: 2,
        })

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
            stocked_quantity: 2,
            reserved_quantity: 1,
            available_quantity: 1,
          })
        )

        const fulfillmentRes = await api.post(
          `/admin/orders/${order.id}/fulfillment`,
          {
            items: [{ item_id: lineItemId, quantity: 2 }],
            location_id: locationId,
          },
          adminHeaders
        )

        expect(fulfillmentRes.status).toBe(200)
        expect(fulfillmentRes.data.order.fulfillment_status).toBe("fulfilled")

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

      it("Adjusts single reservation on successful fulfillment with over-reserved line item", async () => {
        const api = useApi()

        const a = await inventoryService.updateInventoryLevel(
          invItemId,
          locationId,
          { stocked_quantity: 3 }
        )

        await prodVarInventoryService.reserveQuantity(variantId, 3, {
          locationId: locationId,
          lineItemId: order.items[0].id,
        })

        let inventoryItem = await api.get(
          `/admin/inventory-items/${invItemId}`,
          adminHeaders
        )

        expect(inventoryItem.data.inventory_item.location_levels[0]).toEqual(
          expect.objectContaining({
            stocked_quantity: 3,
            reserved_quantity: 3,
            available_quantity: 0,
          })
        )

        const fulfillmentRes = await api.post(
          `/admin/orders/${order.id}/fulfillment`,
          {
            items: [{ item_id: lineItemId, quantity: 2 }],
            location_id: locationId,
          },
          adminHeaders
        )

        expect(fulfillmentRes.status).toBe(200)
        expect(fulfillmentRes.data.order.fulfillment_status).toBe("fulfilled")

        inventoryItem = await api.get(
          `/admin/inventory-items/${invItemId}`,
          adminHeaders
        )

        const reservations = await api.get(
          `/admin/reservations?inventory_item_id[]=${invItemId}`,
          adminHeaders
        )

        expect(reservations.data.reservations.length).toBe(1)
        expect(reservations.data.reservations).toEqual([
          expect.objectContaining({
            quantity: 1,
          }),
        ])
        expect(inventoryItem.data.inventory_item.location_levels[0]).toEqual(
          expect.objectContaining({
            stocked_quantity: 1,
            reserved_quantity: 1,
            available_quantity: 0,
          })
        )
      })

      it("Prioritizes adjusting reservations at the chosen location", async () => {
        const api = useApi()

        const sl = await stockLocationService.create({
          name: "test-location 1",
        })

        await inventoryService.createInventoryLevel({
          inventory_item_id: invItemId,
          location_id: sl.id,
          stocked_quantity: 3,
        })

        const a = await inventoryService.updateInventoryLevel(
          invItemId,
          locationId,
          { stocked_quantity: 3 }
        )

        await prodVarInventoryService.reserveQuantity(variantId, 1, {
          locationId: locationId,
          lineItemId: order.items[0].id,
        })

        await prodVarInventoryService.reserveQuantity(variantId, 2, {
          locationId: sl.id,
          lineItemId: order.items[0].id,
        })

        let inventoryItem = await api.get(
          `/admin/inventory-items/${invItemId}`,
          adminHeaders
        )

        expect(inventoryItem.data.inventory_item.location_levels).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              location_id: locationId,
              stocked_quantity: 3,
              reserved_quantity: 1,
              available_quantity: 2,
            }),
            expect.objectContaining({
              location_id: sl.id,
              stocked_quantity: 3,
              reserved_quantity: 2,
              available_quantity: 1,
            }),
          ])
        )

        const fulfillmentRes = await api.post(
          `/admin/orders/${order.id}/fulfillment`,
          {
            items: [{ item_id: lineItemId, quantity: 2 }],
            location_id: locationId,
          },
          adminHeaders
        )

        expect(fulfillmentRes.status).toBe(200)
        expect(fulfillmentRes.data.order.fulfillment_status).toBe("fulfilled")

        inventoryItem = await api.get(
          `/admin/inventory-items/${invItemId}`,
          adminHeaders
        )

        const reservations = await api.get(
          `/admin/reservations?inventory_item_id[]=${invItemId}`,
          adminHeaders
        )

        expect(reservations.data.reservations.length).toBe(1)
        expect(reservations.data.reservations).toEqual([
          expect.objectContaining({
            quantity: 1,
            location_id: sl.id,
          }),
        ])
      })

      it("increases stocked quantity when return is received at location", async () => {
        const api = useApi()

        const fulfillmentRes = await api.post(
          `/admin/orders/${order.id}/fulfillment`,
          {
            items: [{ item_id: lineItemId, quantity: 1 }],
            location_id: locationId,
          },
          adminHeaders
        )

        const shipmentRes = await api.post(
          `/admin/orders/${order.id}/shipment`,
          {
            fulfillment_id: fulfillmentRes.data.order.fulfillments[0].id,
          },
          adminHeaders
        )

        expect(shipmentRes.status).toBe(200)

        let inventoryItem = await api.get(
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

        const requestReturnRes = await api.post(
          `/admin/orders/${order.id}/return`,
          {
            receive_now: true,
            location_id: locationId,
            items: [{ item_id: lineItemId, quantity: 1 }],
          },
          adminHeaders
        )

        expect(requestReturnRes.status).toBe(200)
        inventoryItem = await api.get(
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
