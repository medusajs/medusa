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
} = require("../../../../factories")
const {
  getContainer,
} = require("../../../../environment-helpers/use-container")
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

describe("Inventory Items endpoints", () => {
  let appContainer
  let dbConnection
  let shutdownServer

  let variantId
  let inventoryItems
  let locationId
  let location2Id
  let location3Id

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
    // create inventory item
    await adminSeeder(dbConnection)

    const api = useApi()

    await simpleProductFactory(
      dbConnection,
      {
        id: "test-product",
        variants: [],
      },
      100
    )

    const prodVarInventoryService = appContainer.resolve(
      "productVariantInventoryService"
    )

    const response = await api.post(
      `/admin/products/test-product/variants`,
      {
        title: "Test Variant w. inventory",
        sku: "MY_SKU",
        material: "material",
        origin_country: "UK",
        hs_code: "hs001",
        mid_code: "mids",
        weight: 300,
        length: 100,
        height: 200,
        width: 150,
        manage_inventory: true,
        options: [
          {
            option_id: "test-product-option",
            value: "SS",
          },
        ],
        prices: [{ currency_code: "usd", amount: 2300 }],
      },
      adminHeaders
    )

    const variant = response.data.product.variants[0]

    variantId = variant.id

    inventoryItems = await prodVarInventoryService.listInventoryItemsByVariant(
      variantId
    )

    const stockRes = await api.post(
      `/admin/stock-locations`,
      {
        name: "Fake Warehouse",
      },
      adminHeaders
    )
    locationId = stockRes.data.stock_location.id

    const secondStockRes = await api.post(
      `/admin/stock-locations`,
      {
        name: "Another random Warehouse",
      },
      adminHeaders
    )
    location2Id = secondStockRes.data.stock_location.id

    const thirdStockRes = await api.post(
      `/admin/stock-locations`,
      {
        name: "Another random Warehouse",
      },
      adminHeaders
    )
    location3Id = thirdStockRes.data.stock_location.id
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    const db = useDb()
    return await db.teardown()
  })

  describe("Inventory Items", () => {
    it("should create, update and delete the inventory location levels", async () => {
      const api = useApi()
      const inventoryItemId = inventoryItems[0].id

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/location-levels`,
        {
          location_id: locationId,
          stocked_quantity: 17,
          incoming_quantity: 2,
        },
        adminHeaders
      )

      const inventoryService = appContainer.resolve("inventoryService")
      const stockLevel = await inventoryService.retrieveInventoryLevel(
        inventoryItemId,
        locationId
      )

      expect(stockLevel.location_id).toEqual(locationId)
      expect(stockLevel.inventory_item_id).toEqual(inventoryItemId)
      expect(stockLevel.stocked_quantity).toEqual(17)
      expect(stockLevel.incoming_quantity).toEqual(2)

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
        {
          stocked_quantity: 21,
          incoming_quantity: 0,
        },
        adminHeaders
      )

      const newStockLevel = await inventoryService.retrieveInventoryLevel(
        inventoryItemId,
        locationId
      )
      expect(newStockLevel.stocked_quantity).toEqual(21)
      expect(newStockLevel.incoming_quantity).toEqual(0)

      await api.delete(
        `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
        adminHeaders
      )
      const invLevel = await inventoryService
        .retrieveInventoryLevel(inventoryItemId, locationId)
        .catch((e) => e)

      expect(invLevel.message).toEqual(
        `Inventory level for item ${inventoryItemId} and location ${locationId} not found`
      )
    })

    it("should update the inventory item", async () => {
      const api = useApi()
      const inventoryItemId = inventoryItems[0].id

      const response = await api.post(
        `/admin/inventory-items/${inventoryItemId}`,
        {
          mid_code: "updated mid_code",
          weight: 120,
        },
        adminHeaders
      )

      expect(response.data.inventory_item).toEqual(
        expect.objectContaining({
          origin_country: "UK",
          hs_code: "hs001",
          mid_code: "updated mid_code",
          weight: 120,
          length: 100,
          height: 200,
          width: 150,
        })
      )
    })

    it("should fail to update the location level to negative quantity", async () => {
      const api = useApi()

      const inventoryItemId = inventoryItems[0].id

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/location-levels`,
        {
          location_id: locationId,
          stocked_quantity: 17,
          incoming_quantity: 2,
        },
        adminHeaders
      )

      const res = await api
        .post(
          `/admin/inventory-items/${inventoryItemId}/location-levels/${locationId}`,
          {
            incoming_quantity: -1,
            stocked_quantity: -1,
          },
          adminHeaders
        )
        .catch((error) => error)

      expect(res.response.status).toEqual(400)
      expect(res.response.data).toEqual({
        type: "invalid_data",
        message:
          "incoming_quantity must not be less than 0, stocked_quantity must not be less than 0",
      })
    })

    it("should retrieve the inventory item", async () => {
      const api = useApi()
      const inventoryItemId = inventoryItems[0].id

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/location-levels`,
        {
          location_id: locationId,
          stocked_quantity: 15,
          incoming_quantity: 5,
        },
        adminHeaders
      )

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/location-levels`,
        {
          location_id: location2Id,
          stocked_quantity: 7,
          incoming_quantity: 0,
        },
        adminHeaders
      )

      const response = await api.get(
        `/admin/inventory-items/${inventoryItemId}`,
        adminHeaders
      )

      expect(response.data).toEqual({
        inventory_item: expect.objectContaining({
          height: 200,
          hs_code: "hs001",
          id: inventoryItemId,
          length: 100,
          location_levels: [
            expect.objectContaining({
              available_quantity: 15,
              deleted_at: null,
              id: expect.any(String),
              incoming_quantity: 5,
              inventory_item_id: inventoryItemId,
              location_id: locationId,
              metadata: null,
              reserved_quantity: 0,
              stocked_quantity: 15,
            }),
            expect.objectContaining({
              available_quantity: 7,
              deleted_at: null,
              id: expect.any(String),
              incoming_quantity: 0,
              inventory_item_id: inventoryItemId,
              location_id: location2Id,
              metadata: null,
              reserved_quantity: 0,
              stocked_quantity: 7,
            }),
          ],
          material: "material",
          metadata: null,
          mid_code: "mids",
          origin_country: "UK",
          requires_shipping: true,
          sku: "MY_SKU",
          weight: 300,
          width: 150,
        }),
      })
    })

    it("should create the inventory item using the api", async () => {
      const product = await simpleProductFactory(dbConnection, {})

      const api = useApi()

      const productRes = await api.get(
        `/admin/products/${product.id}`,
        adminHeaders
      )

      const variantId = productRes.data.product.variants[0].id

      let variantInventoryRes = await api.get(
        `/admin/variants/${variantId}/inventory`,
        adminHeaders
      )

      expect(variantInventoryRes.data).toEqual({
        variant: {
          id: variantId,
          inventory: [],
          sales_channel_availability: [],
        },
      })
      expect(variantInventoryRes.status).toEqual(200)

      const inventoryItemCreateRes = await api.post(
        `/admin/inventory-items`,
        { variant_id: variantId, sku: "attach_this_to_variant" },
        adminHeaders
      )

      variantInventoryRes = await api.get(
        `/admin/variants/${variantId}/inventory`,
        adminHeaders
      )

      expect(variantInventoryRes.data).toEqual({
        variant: expect.objectContaining({
          id: variantId,
          inventory: [
            expect.objectContaining({
              ...inventoryItemCreateRes.data.inventory_item,
            }),
          ],
        }),
      })
      expect(variantInventoryRes.status).toEqual(200)
    })

    it("should list the location levels based on id param constraint", async () => {
      const api = useApi()
      const inventoryItemId = inventoryItems[0].id

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/location-levels`,
        {
          location_id: location2Id,
          stocked_quantity: 10,
        },
        adminHeaders
      )

      await api.post(
        `/admin/inventory-items/${inventoryItemId}/location-levels`,
        {
          location_id: location3Id,
          stocked_quantity: 5,
        },
        adminHeaders
      )

      const result = await api.get(
        `/admin/inventory-items/${inventoryItemId}/location-levels?location_id[]=${location2Id}`,
        adminHeaders
      )

      expect(result.status).toEqual(200)
      expect(result.data.inventory_item.location_levels).toHaveLength(1)
      expect(result.data.inventory_item.location_levels[0]).toEqual(
        expect.objectContaining({
          stocked_quantity: 10,
        })
      )
    })

    describe("List inventory items", () => {
      it("should list inventory items with location", async () => {
        const api = useApi()

        await api.post(
          `/admin/products/test-product/variants`,
          {
            title: "Test Variant w. inventory 2",
            sku: "MY_SKU1",
            material: "material",
            origin_country: "UK",
            manage_inventory: true,
            options: [
              {
                option_id: "test-product-option",
                value: "M",
              },
            ],
            prices: [{ currency_code: "usd", amount: 200 }],
          },
          adminHeaders
        )

        const inventoryItemId = inventoryItems[0].id

        await api.post(
          `/admin/inventory-items/${inventoryItemId}/location-levels`,
          {
            location_id: location3Id,
            stocked_quantity: 5,
          },
          adminHeaders
        )

        const unfilteredResponse = await api.get(
          `/admin/inventory-items`,
          adminHeaders
        )
        expect(unfilteredResponse.data.inventory_items).toHaveLength(2)

        const response = await api.get(
          `/admin/inventory-items?location_id=${location3Id}`,
          adminHeaders
        )

        expect(response.data.inventory_items).toHaveLength(1)
        expect(response.data.inventory_items[0]).toEqual(
          expect.objectContaining({
            id: inventoryItemId,
            sku: "MY_SKU",
          })
        )
      })

      it("should list the inventory items", async () => {
        const api = useApi()
        const inventoryItemId = inventoryItems[0].id

        await api.post(
          `/admin/inventory-items/${inventoryItemId}/location-levels`,
          {
            location_id: location2Id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemId}/location-levels`,
          {
            location_id: location3Id,
            stocked_quantity: 5,
          },
          adminHeaders
        )

        const response = await api.get(`/admin/inventory-items`, adminHeaders)

        expect(response.data.inventory_items).toHaveLength(1)
        expect(response.data.inventory_items[0]).toEqual(
          expect.objectContaining({
            id: inventoryItemId,
            sku: "MY_SKU",
            origin_country: "UK",
            hs_code: "hs001",
            mid_code: "mids",
            material: "material",
            weight: 300,
            length: 100,
            height: 200,
            width: 150,
            requires_shipping: true,
            metadata: null,
            variants: expect.arrayContaining([
              expect.objectContaining({
                id: variantId,
                title: "Test Variant w. inventory",
                product_id: "test-product",
                sku: "MY_SKU",
                manage_inventory: true,
                hs_code: "hs001",
                origin_country: "UK",
                mid_code: "mids",
                material: "material",
                weight: 300,
                length: 100,
                height: 200,
                width: 150,
                metadata: null,
                product: expect.objectContaining({
                  id: "test-product",
                }),
              }),
            ]),
            location_levels: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                inventory_item_id: inventoryItemId,
                location_id: location2Id,
                stocked_quantity: 10,
                reserved_quantity: 0,
                incoming_quantity: 0,
                metadata: null,
                available_quantity: 10,
              }),
              expect.objectContaining({
                id: expect.any(String),
                inventory_item_id: inventoryItemId,
                location_id: location3Id,
                stocked_quantity: 5,
                reserved_quantity: 0,
                incoming_quantity: 0,
                metadata: null,
                available_quantity: 5,
              }),
            ]),
            reserved_quantity: 0,
            stocked_quantity: 15,
          })
        )
      })

      it("should list the inventory items searching by title, description and sku", async () => {
        const api = useApi()

        const inventoryService = appContainer.resolve("inventoryService")

        await inventoryService.createInventoryItems([
          {
            title: "Test Item",
          },
          {
            description: "Test Desc",
          },
          {
            sku: "Test Sku",
          },
        ])

        const response = await api.get(
          `/admin/inventory-items?q=test`,
          adminHeaders
        )

        expect(response.data.inventory_items).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              sku: "MY_SKU",
            }),
          ])
        )
        expect(response.data.inventory_items).toHaveLength(3)
        expect(response.data.inventory_items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              sku: "Test Sku",
            }),
            expect.objectContaining({
              description: "Test Desc",
            }),
            expect.objectContaining({
              title: "Test Item",
            }),
          ])
        )
      })
    })

    it("should remove associated levels and reservations when deleting an inventory item", async () => {
      const api = useApi()
      const inventoryService = appContainer.resolve("inventoryService")

      const invItem2 = await inventoryService.createInventoryItem({
        sku: "1234567",
      })

      const stockRes = await api.post(
        `/admin/stock-locations`,
        {
          name: "Fake Warehouse 1",
        },
        adminHeaders
      )

      locationId = stockRes.data.stock_location.id

      const level = await inventoryService.createInventoryLevel({
        inventory_item_id: invItem2.id,
        location_id: locationId,
        stocked_quantity: 10,
      })

      const reservation = await inventoryService.createReservationItem({
        inventory_item_id: invItem2.id,
        location_id: locationId,
        quantity: 5,
      })

      const [, reservationCount] = await inventoryService.listReservationItems({
        location_id: locationId,
      })

      expect(reservationCount).toEqual(1)

      const [, inventoryLevelCount] =
        await inventoryService.listInventoryLevels({
          location_id: locationId,
        })

      expect(inventoryLevelCount).toEqual(1)

      const res = await api.delete(
        `/admin/stock-locations/${locationId}`,
        adminHeaders
      )

      expect(res.status).toEqual(200)

      const [, reservationCountPostDelete] =
        await inventoryService.listReservationItems({
          location_id: locationId,
        })

      expect(reservationCountPostDelete).toEqual(0)

      const [, inventoryLevelCountPostDelete] =
        await inventoryService.listInventoryLevels({
          location_id: locationId,
        })

      expect(inventoryLevelCountPostDelete).toEqual(0)
    })

    it("should remove the product variant associations when deleting an inventory item", async () => {
      const api = useApi()

      await simpleProductFactory(
        dbConnection,
        {
          id: "test-product-new",
          variants: [],
        },
        5
      )

      const response = await api.post(
        `/admin/products/test-product-new/variants`,
        {
          title: "Test2",
          sku: "MY_SKU2",
          manage_inventory: true,
          options: [
            {
              option_id: "test-product-new-option",
              value: "Blue",
            },
          ],
          prices: [{ currency_code: "usd", amount: 100 }],
        },
        { headers: { "x-medusa-access-token": "test_token" } }
      )

      const secondVariantId = response.data.product.variants.find(
        (v) => v.sku === "MY_SKU2"
      ).id

      const inventoryService = appContainer.resolve("inventoryService")
      const variantInventoryService = appContainer.resolve(
        "productVariantInventoryService"
      )

      const invItem2 = await inventoryService.createInventoryItem({
        sku: "123456",
      })

      await variantInventoryService.attachInventoryItem(
        variantId,
        invItem2.id,
        2
      )
      await variantInventoryService.attachInventoryItem(
        secondVariantId,
        invItem2.id,
        2
      )

      expect(
        await variantInventoryService.listInventoryItemsByVariant(variantId)
      ).toHaveLength(2)

      expect(
        await variantInventoryService.listInventoryItemsByVariant(
          secondVariantId
        )
      ).toHaveLength(2)

      await api.delete(`/admin/inventory-items/${invItem2.id}`, {
        headers: { "x-medusa-access-token": "test_token" },
      })

      expect(
        await variantInventoryService.listInventoryItemsByVariant(variantId)
      ).toHaveLength(1)

      expect(
        await variantInventoryService.listInventoryItemsByVariant(
          secondVariantId
        )
      ).toHaveLength(1)
    })

    describe("inventory service", () => {
      let inventoryService
      let productInventoryService

      beforeAll(() => {
        inventoryService = appContainer.resolve("inventoryService")
        productInventoryService = appContainer.resolve(
          "productVariantInventoryService"
        )
      })

      it("should bulk remove the inventory items", async () => {
        const [items] = await inventoryService.listInventoryItems()

        const ids = items.map((item) => item.id)

        expect(ids).not.toBeFalsy()

        await inventoryService.deleteInventoryItem(ids)

        const [emptyItems] = await inventoryService.listInventoryItems()
        expect(emptyItems).toHaveLength(0)
      })

      it("should bulk create the inventory levels", async () => {
        const [items] = await inventoryService.listInventoryItems()

        const itemId = items[0].id

        await inventoryService.createInventoryLevels([
          {
            inventory_item_id: itemId,
            location_id: locationId,
            stocked_quantity: 10,
          },
          {
            inventory_item_id: itemId,
            location_id: location2Id,
            stocked_quantity: 10,
          },
        ])

        const [levels] = await inventoryService.listInventoryLevels({
          inventory_item_id: itemId,
        })
        expect(levels).toHaveLength(2)
        expect(levels).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: itemId,
              location_id: locationId,
            }),
            expect.objectContaining({
              inventory_item_id: itemId,
              location_id: location2Id,
            }),
          ])
        )
      })

      it("should bulk create the inventory items", async () => {
        const items = [
          {
            sku: "sku-1",
          },
          {
            sku: "sku-2",
          },
        ]
        const createdItems = await inventoryService.createInventoryItems(items)

        expect(createdItems).toHaveLength(2)
        expect(createdItems).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              sku: "sku-1",
            }),
            expect.objectContaining({
              sku: "sku-2",
            }),
          ])
        )
      })

      it("should bulk delete the inventory levels by location id", async () => {
        const [items] = await inventoryService.listInventoryItems()

        const itemId = items[0].id

        await inventoryService.createInventoryLevels([
          {
            inventory_item_id: itemId,
            location_id: locationId,
            stocked_quantity: 10,
          },
          {
            inventory_item_id: itemId,
            location_id: location2Id,
            stocked_quantity: 10,
          },
        ])

        await inventoryService.deleteInventoryItemLevelByLocationId([
          locationId,
          location2Id,
        ])

        const [levels] = await inventoryService.listInventoryLevels({
          inventory_item_id: itemId,
        })
        expect(levels).toHaveLength(0)
      })

      it("should bulk delete the inventory levels by location id", async () => {
        const [items] = await inventoryService.listInventoryItems()

        const itemId = items[0].id

        await inventoryService.createInventoryLevels([
          {
            inventory_item_id: itemId,
            location_id: locationId,
            stocked_quantity: 10,
          },
          {
            inventory_item_id: itemId,
            location_id: location2Id,
            stocked_quantity: 10,
          },
        ])

        await inventoryService.deleteInventoryItemLevelByLocationId([
          locationId,
          location2Id,
        ])

        const [levels] = await inventoryService.listInventoryLevels({
          inventory_item_id: itemId,
        })
        expect(levels).toHaveLength(0)
      })

      it("should fail to create the reservations with invalid configuration", async () => {
        const order = await simpleOrderFactory(dbConnection, {
          line_items: [
            { id: "line-item-1", quantity: 1 },
            { id: "line-item-2", quantity: 1 },
          ],
        })

        const [items] = await inventoryService.listInventoryItems()

        const itemId = items[0].id

        const error = await inventoryService
          .createReservationItems([
            {
              inventory_item_id: itemId,
              location_id: locationId,
              line_item_id: "line-item-1",
              quantity: 1,
            },
            {
              inventory_item_id: itemId,
              location_id: locationId,
              line_item_id: "line-item-2",
              quantity: 1,
            },
          ])
          .catch((err) => err)

        expect(error.message).toEqual(
          `Item ${itemId} is not stocked at location ${locationId}, Item ${itemId} is not stocked at location ${locationId}`
        )
      })

      it("should bulk delete the reservations by their line item ids", async () => {
        const order = await simpleOrderFactory(dbConnection, {
          line_items: [
            { id: "line-item-1", quantity: 1 },
            { id: "line-item-2", quantity: 1 },
          ],
        })

        const [items] = await inventoryService.listInventoryItems()

        const itemId = items[0].id

        await inventoryService.createInventoryLevel({
          inventory_item_id: itemId,
          location_id: locationId,
          stocked_quantity: 10,
        })

        await inventoryService.createReservationItems([
          {
            inventory_item_id: itemId,
            location_id: locationId,
            line_item_id: "line-item-1",
            quantity: 1,
          },
          {
            inventory_item_id: itemId,
            location_id: locationId,
            line_item_id: "line-item-2",
            quantity: 1,
          },
        ])

        const [reservations] = await inventoryService.listReservationItems({
          inventory_item_id: itemId,
        })
        expect(reservations).toHaveLength(2)

        await inventoryService.deleteReservationItemsByLineItem([
          "line-item-1",
          "line-item-2",
        ])

        const [deletedReservations] =
          await inventoryService.listReservationItems({
            inventory_item_id: itemId,
          })
        expect(deletedReservations).toHaveLength(0)
      })

      it("should bulk delete the reservations by their location id", async () => {
        const order = await simpleOrderFactory(dbConnection, {
          line_items: [
            { id: "line-item-1", quantity: 1 },
            { id: "line-item-2", quantity: 1 },
          ],
        })

        const [items] = await inventoryService.listInventoryItems()

        const itemId = items[0].id

        await inventoryService.createInventoryLevel({
          inventory_item_id: itemId,
          location_id: locationId,
          stocked_quantity: 10,
        })

        await inventoryService.createInventoryLevel({
          inventory_item_id: itemId,
          location_id: location2Id,
          stocked_quantity: 10,
        })

        await inventoryService.createReservationItems([
          {
            inventory_item_id: itemId,
            location_id: locationId,
            line_item_id: "line-item-1",
            quantity: 1,
          },
          {
            inventory_item_id: itemId,
            location_id: location2Id,
            line_item_id: "line-item-2",
            quantity: 1,
          },
        ])

        const [reservations] = await inventoryService.listReservationItems({
          inventory_item_id: itemId,
        })
        expect(reservations).toHaveLength(2)

        await inventoryService.deleteReservationItemByLocationId([
          location2Id,
          locationId,
        ])

        const [deletedReservations] =
          await inventoryService.listReservationItems({
            inventory_item_id: itemId,
          })
        expect(deletedReservations).toHaveLength(0)
      })

      it("should bulk update the inventory levels", async () => {
        const [items] = await inventoryService.listInventoryItems()

        const itemId = items[0].id

        await inventoryService.createInventoryLevel({
          inventory_item_id: itemId,
          location_id: locationId,
          stocked_quantity: 10,
        })

        await inventoryService.createInventoryLevel({
          inventory_item_id: itemId,
          location_id: location2Id,
          stocked_quantity: 10,
        })

        const levels = await inventoryService.listInventoryLevels({
          inventory_item_id: itemId,
        })
        expect(levels).toHaveLength(2)

        await inventoryService.updateInventoryLevels([
          {
            inventory_item_id: itemId,
            location_id: locationId,
            stocked_quantity: 20,
          },
          {
            inventory_item_id: itemId,
            location_id: location2Id,
            stocked_quantity: 25,
          },
        ])

        const [updatedLevels] = await inventoryService.listInventoryLevels({
          inventory_item_id: itemId,
        })

        expect(updatedLevels).toHaveLength(2)
        expect(updatedLevels).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: itemId,
              location_id: locationId,
              stocked_quantity: 20,
            }),
            expect.objectContaining({
              inventory_item_id: itemId,
              location_id: location2Id,
              stocked_quantity: 25,
            }),
          ])
        )
      })
    })
  })
})
