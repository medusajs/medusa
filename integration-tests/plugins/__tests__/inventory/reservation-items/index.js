const path = require("path")

const {
  startBootstrapApp,
} = require("../../../../environment-helpers/bootstrap-app")
const { initDb, useDb } = require("../../../../environment-helpers/use-db")
const {
  useApi,
  useExpressServer,
} = require("../../../../environment-helpers/use-api")

const adminSeeder = require("../../../../helpers/admin-seeder")

jest.setTimeout(30000)

const {
  simpleProductFactory,
  simpleOrderFactory,
  simpleRegionFactory,
} = require("../../../../factories")
const { simpleSalesChannelFactory } = require("../../../../factories")
const {
  getContainer,
} = require("../../../../environment-helpers/use-container")
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

describe("Inventory Items endpoints", () => {
  let appContainer
  let dbConnection
  let shutdownServer

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
    shutdownServer = await startBootstrapApp({ cwd })
    appContainer = getContainer()
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
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

    describe("List reservation items", () => {
      let item2
      let location2
      let reservation2

      beforeEach(async () => {
        const api = useApi()
        const stockRes = await api.post(
          `/admin/stock-locations`,
          {
            name: "Fake Warehouse 1",
          },
          adminHeaders
        )

        location2 = stockRes.data.stock_location.id

        await salesChannelLocationService.associateLocation(
          "test-channel",
          location2
        )

        const inventoryItem1 = await inventoryService.createInventoryItem({
          sku: "12345",
        })
        item2 = inventoryItem1.id

        await inventoryService.createInventoryLevel({
          inventory_item_id: item2,
          location_id: location2,
          stocked_quantity: 100,
        })

        order = await simpleOrderFactory(dbConnection, {
          sales_channel: "test-channel",
          line_items: [
            {
              variant_id: variantId,
              quantity: 2,
              id: "line-item-id-2",
            },
          ],
          shipping_methods: [
            {
              shipping_option: {
                region_id: regionId,
              },
            },
          ],
        })

        const orderRes = await api.get(
          `/admin/orders/${order.id}`,
          adminHeaders
        )

        reservation2 = await inventoryService.createReservationItem({
          line_item_id: "line-item-id-2",
          inventory_item_id: item2,
          location_id: location2,
          description: "test description",
          quantity: 1,
        })
      })

      it("lists reservation items", async () => {
        const api = useApi()

        const reservationsRes = await api.get(
          `/admin/reservations`,
          adminHeaders
        )
        expect(reservationsRes.data.reservations.length).toBe(2)
        expect(reservationsRes.data.reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: reservationItem.id,
            }),
            expect.objectContaining({
              id: reservation2.id,
            }),
          ])
        )
      })

      describe("Filters reservation items", () => {
        it("filters by location", async () => {
          const api = useApi()

          const reservationsRes = await api.get(
            `/admin/reservations?location_id[]=${locationId}`,
            adminHeaders
          )
          expect(reservationsRes.data.reservations.length).toBe(1)
          expect(reservationsRes.data.reservations[0].location_id).toBe(
            locationId
          )
        })

        it("filters by itemID", async () => {
          const api = useApi()

          const reservationsRes = await api.get(
            `/admin/reservations?inventory_item_id[]=${item2}`,
            adminHeaders
          )
          expect(reservationsRes.data.reservations.length).toBe(1)
          expect(reservationsRes.data.reservations[0].inventory_item_id).toBe(
            item2
          )
        })

        it("filters by quantity", async () => {
          const api = useApi()

          const reservationsRes = await api.get(
            `/admin/reservations?quantity[gt]=1`,
            adminHeaders
          )

          expect(reservationsRes.data.reservations.length).toBe(1)
          expect(reservationsRes.data.reservations[0].id).toBe(
            reservationItem.id
          )
        })

        it("filters by date", async () => {
          const api = useApi()

          const reservationsRes = await api.get(
            `/admin/reservations?created_at[gte]=${new Date(
              reservation2.created_at
            ).toISOString()}`,
            adminHeaders
          )

          expect(reservationsRes.data.reservations.length).toBe(1)
          expect(reservationsRes.data.reservations[0].id).toBe(reservation2.id)
        })

        it("filters by description using equals", async () => {
          const api = useApi()

          const reservationsRes = await api
            .get(
              `/admin/reservations?description=test%20description`,
              adminHeaders
            )
            .catch(console.log)

          expect(reservationsRes.data.reservations.length).toBe(1)
          expect(reservationsRes.data.reservations[0].id).toBe(reservation2.id)
        })

        it("filters by description using equals removes results", async () => {
          const api = useApi()

          const reservationsRes = await api.get(
            `/admin/reservations?description=description`,
            adminHeaders
          )

          expect(reservationsRes.data.reservations.length).toBe(0)
        })

        it("filters by description using contains", async () => {
          const api = useApi()

          const reservationsRes = await api.get(
            `/admin/reservations?description[contains]=descri`,
            adminHeaders
          )

          expect(reservationsRes.data.reservations.length).toBe(1)
          expect(reservationsRes.data.reservations[0].id).toBe(reservation2.id)
        })

        it("filters by description using starts_with", async () => {
          const api = useApi()

          const reservationsRes = await api
            .get(
              `/admin/reservations?description[starts_with]=test`,
              adminHeaders
            )
            .catch(console.log)

          expect(reservationsRes.data.reservations.length).toBe(1)
          expect(reservationsRes.data.reservations[0].id).toBe(reservation2.id)
        })

        it("filters by description using starts_with removes results", async () => {
          const api = useApi()

          const reservationsRes = await api.get(
            `/admin/reservations?description[starts_with]=description`,
            adminHeaders
          )

          expect(reservationsRes.data.reservations.length).toBe(0)
        })

        it("filters by description using ends_with", async () => {
          const api = useApi()

          const reservationsRes = await api.get(
            `/admin/reservations?description[ends_with]=test`,
            adminHeaders
          )

          expect(reservationsRes.data.reservations.length).toBe(0)
        })

        it("filters by description using ends_with removes results", async () => {
          const api = useApi()

          const reservationsRes = await api.get(
            `/admin/reservations?description[ends_with]=description`,
            adminHeaders
          )

          expect(reservationsRes.data.reservations.length).toBe(1)
          expect(reservationsRes.data.reservations[0].id).toBe(reservation2.id)
        })
      })
    })

    it("lists reservations with inventory_items and line items", async () => {
      const api = useApi()

      const res = await api.get(
        `/admin/reservations?expand=line_item,inventory_item`,
        adminHeaders
      )

      expect(res.status).toEqual(200)
      expect(res.data.reservations.length).toEqual(1)
      expect(res.data.reservations).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            inventory_item: expect.objectContaining({}),
            line_item: expect.objectContaining({
              order: expect.objectContaining({}),
            }),
          }),
        ])
      )
    })
  })
})
