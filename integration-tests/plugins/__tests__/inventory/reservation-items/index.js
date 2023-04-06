const path = require("path")

const { bootstrapApp } = require("../../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../helpers/use-db")
const { setPort, useApi } = require("../../../../helpers/use-api")

const adminSeeder = require("../../../helpers/admin-seeder")

jest.setTimeout(30000)

const {
  simpleProductFactory,
  simpleOrderFactory,
  simpleRegionFactory,
} = require("../../../factories")
const { simpleSalesChannelFactory } = require("../../../../api/factories")
const adminHeaders = { headers: { Authorization: "Bearer test_token" } }

describe("Inventory Items endpoints", () => {
  let appContainer
  let dbConnection
  let express

  let inventoryItem
  let locationId

  let prodVarInventoryService
  let inventoryService
  let stockLocationService
  let salesChannelLocationService

  let reg
  let regionId
  let order
  let variantId
  let reservationItem
  let lineItemId

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

  beforeEach(async () => {
    const api = useApi()

    await adminSeeder(dbConnection)

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

    await simpleProductFactory(dbConnection, {
      id: "product1",
      sales_channels: [{ id: "test-channel" }],
    })

    const productRes = await api.get(`/admin/products/product1`, adminHeaders)

    variantId = productRes.data.product.variants[0].id

    const stockRes = await api.post(
      `/admin/stock-locations`,
      {
        name: "Fake Warehouse",
      },
      adminHeaders
    )
    locationId = stockRes.data.stock_location.id

    await salesChannelLocationService.associateLocation(
      "test-channel",
      locationId
    )

    inventoryItem = await inventoryService.createInventoryItem({
      sku: "1234",
    })

    await prodVarInventoryService.attachInventoryItem(
      variantId,
      inventoryItem.id
    )

    await inventoryService.createInventoryLevel({
      inventory_item_id: inventoryItem.id,
      location_id: locationId,
      stocked_quantity: 100,
    })

    order = await simpleOrderFactory(dbConnection, {
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
    const orderRes = await api.get(`/admin/orders/${order.id}`, adminHeaders)

    lineItemId = orderRes.data.order.items[0].id

    reservationItem = await inventoryService.createReservationItem({
      line_item_id: lineItemId,
      inventory_item_id: inventoryItem.id,
      location_id: locationId,
      quantity: 2,
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

  describe("Reservation items", () => {
    it("Create reservation item throws if available item quantity is less than reservation quantity", async () => {
      const api = useApi()

      const orderRes = await api.get(`/admin/orders/${order.id}`, adminHeaders)

      expect(orderRes.data.order.items[0].quantity).toBe(2)
      expect(orderRes.data.order.items[0].fulfilled_quantity).toBeFalsy()

      const payload = {
        quantity: 1,
        inventory_item_id: inventoryItem.id,
        line_item_id: lineItemId,
        location_id: locationId,
      }

      const res = await api
        .post(`/admin/reservations`, payload, adminHeaders)
        .catch((err) => err)

      expect(res.response.status).toBe(400)
      expect(res.response.data).toEqual({
        type: "invalid_data",
        message:
          "The reservation quantity cannot be greater than the unfulfilled line item quantity",
      })
    })

    it("Update reservation item throws if available item quantity is less than reservation quantity", async () => {
      const api = useApi()

      const orderRes = await api.get(`/admin/orders/${order.id}`, adminHeaders)

      expect(orderRes.data.order.items[0].quantity).toBe(2)
      expect(orderRes.data.order.items[0].fulfilled_quantity).toBeFalsy()

      const payload = {
        quantity: 3,
      }

      const res = await api
        .post(
          `/admin/reservations/${reservationItem.id}`,
          payload,
          adminHeaders
        )
        .catch((err) => err)

      expect(res.response.status).toBe(400)
      expect(res.response.data).toEqual({
        type: "invalid_data",
        message:
          "The reservation quantity cannot be greater than the unfulfilled line item quantity",
      })
    })
  })
})
