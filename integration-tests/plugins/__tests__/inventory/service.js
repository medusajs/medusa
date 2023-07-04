const path = require("path")

const { bootstrapApp } = require("../../../helpers/bootstrap-app")
const { initDb, useDb } = require("../../../helpers/use-db")

jest.setTimeout(50000)

describe("Inventory Module", () => {
  let appContainer
  let dbConnection
  let express

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    dbConnection = await initDb({ cwd })
    const { container, app, port } = await bootstrapApp({ cwd })
    appContainer = container

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
    const db = useDb()
    return await db.teardown()
  })

  describe("Inventory Module Interface", () => {
    it("createInventoryItem", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const inventoryItem = await inventoryService.createInventoryItem({
        sku: "sku_1",
        origin_country: "CH",
        mid_code: "mid code",
        material: "lycra",
        weight: 100,
        length: 200,
        height: 50,
        width: 50,
        metadata: {
          abc: 123,
        },
        hs_code: "hs_code 123",
        requires_shipping: true,
      })

      expect(inventoryItem).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          sku: "sku_1",
          origin_country: "CH",
          hs_code: "hs_code 123",
          mid_code: "mid code",
          material: "lycra",
          weight: 100,
          length: 200,
          height: 50,
          width: 50,
          requires_shipping: true,
          metadata: { abc: 123 },
          deleted_at: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      )
    })

    it("updateInventoryItem", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const item = await inventoryService.createInventoryItem({
        sku: "sku_1",
        origin_country: "CH",
        mid_code: "mid code",
        material: "lycra",
        weight: 100,
        length: 200,
        height: 50,
        width: 50,
        metadata: {
          abc: 123,
        },
        hs_code: "hs_code 123",
        requires_shipping: true,
      })

      const updatedInventoryItem = await inventoryService.updateInventoryItem(
        item.id,
        {
          origin_country: "CZ",
          mid_code: "mid code 345",
          material: "lycra and polyester",
          weight: 500,
          metadata: {
            dce: 456,
          },
        }
      )

      expect(updatedInventoryItem).toEqual(
        expect.objectContaining({
          id: item.id,
          sku: item.sku,
          origin_country: "CZ",
          hs_code: item.hs_code,
          mid_code: "mid code 345",
          material: "lycra and polyester",
          weight: 500,
          length: item.length,
          height: item.height,
          width: item.width,
          requires_shipping: true,
          metadata: { dce: 456 },
          deleted_at: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      )
    })

    it("deleteInventoryItem and retrieveInventoryItem", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const item = await inventoryService.createInventoryItem({
        sku: "sku_1",
        origin_country: "CH",
        mid_code: "mid code",
        material: "lycra",
        weight: 100,
        length: 200,
        height: 50,
        width: 50,
        metadata: {
          abc: 123,
        },
        hs_code: "hs_code 123",
        requires_shipping: true,
      })

      await inventoryService.deleteInventoryItem(item.id)

      const deletedItem = inventoryService.retrieveInventoryItem(item.id)

      await expect(deletedItem).rejects.toThrow(
        `InventoryItem with id ${item.id} was not found`
      )
    })

    it("createInventoryLevel", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const inventoryItem = await inventoryService.createInventoryItem({
        sku: "sku_1",
        origin_country: "CH",
        mid_code: "mid code",
        material: "lycra",
        weight: 100,
        length: 200,
        height: 50,
        width: 50,
        metadata: {
          abc: 123,
        },
        hs_code: "hs_code 123",
        requires_shipping: true,
      })

      const inventoryLevel = await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: "location_123",
        stocked_quantity: 50,
        reserved_quantity: 15,
        incoming_quantity: 4,
      })

      await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: "second_location",
        stocked_quantity: 10,
        reserved_quantity: 1,
      })

      expect(inventoryLevel).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          incoming_quantity: 4,
          inventory_item_id: inventoryItem.id,
          location_id: "location_123",
          metadata: null,
          reserved_quantity: 15,
          stocked_quantity: 50,
          deleted_at: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      )

      expect(
        await inventoryService.retrieveStockedQuantity(inventoryItem.id, [
          "location_123",
        ])
      ).toEqual(50)

      expect(
        await inventoryService.retrieveAvailableQuantity(inventoryItem.id, [
          "location_123",
        ])
      ).toEqual(35)

      expect(
        await inventoryService.retrieveReservedQuantity(inventoryItem.id, [
          "location_123",
        ])
      ).toEqual(15)

      expect(
        await inventoryService.retrieveStockedQuantity(inventoryItem.id, [
          "location_123",
          "second_location",
        ])
      ).toEqual(60)

      expect(
        await inventoryService.retrieveAvailableQuantity(inventoryItem.id, [
          "location_123",
          "second_location",
        ])
      ).toEqual(44)

      expect(
        await inventoryService.retrieveReservedQuantity(inventoryItem.id, [
          "location_123",
          "second_location",
        ])
      ).toEqual(16)
    })

    it("updateInventoryLevel", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const inventoryItem = await inventoryService.createInventoryItem({
        sku: "sku_1",
        origin_country: "CH",
        mid_code: "mid code",
        material: "lycra",
        weight: 100,
        length: 200,
        height: 50,
        width: 50,
        metadata: {
          abc: 123,
        },
        hs_code: "hs_code 123",
        requires_shipping: true,
      })

      await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: "location_123",
        stocked_quantity: 50,
        reserved_quantity: 0,
        incoming_quantity: 0,
      })

      const updatedLevel = await inventoryService.updateInventoryLevel(
        inventoryItem.id,
        "location_123",
        {
          stocked_quantity: 25,
          reserved_quantity: 4,
          incoming_quantity: 10,
        }
      )

      expect(updatedLevel).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          incoming_quantity: 10,
          inventory_item_id: inventoryItem.id,
          location_id: "location_123",
          metadata: null,
          reserved_quantity: 4,
          stocked_quantity: 25,
          deleted_at: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      )
    })

    it("deleteInventoryLevel", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const inventoryItem = await inventoryService.createInventoryItem({
        sku: "sku_1",
        origin_country: "CH",
        mid_code: "mid code",
        material: "lycra",
        weight: 100,
        length: 200,
        height: 50,
        width: 50,
        metadata: {
          abc: 123,
        },
        hs_code: "hs_code 123",
        requires_shipping: true,
      })

      const inventoryLevel = await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: "location_123",
        stocked_quantity: 50,
        reserved_quantity: 0,
        incoming_quantity: 0,
      })

      await inventoryService.deleteInventoryLevel(
        inventoryItem.id,
        "location_123"
      )

      const deletedLevel = inventoryService.retrieveInventoryLevel(
        inventoryItem.id,
        "location_123"
      )

      await expect(deletedLevel).rejects.toThrow(
        `Inventory level for item ${inventoryItem.id} and location location_123 not found`
      )
    })

    it("createReservationItem", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const locationId = "location_123"
      const inventoryItem = await inventoryService.createInventoryItem({
        sku: "sku_1",
      })

      const tryReserve = inventoryService.createReservationItem({
        line_item_id: "line_item_123",
        inventory_item_id: inventoryItem.id,
        location_id: locationId,
        quantity: 10,
        metadata: {
          abc: 123,
        },
      })

      await expect(tryReserve).rejects.toThrow(
        `Item ${inventoryItem.id} is not stocked at location ${locationId}`
      )

      await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: locationId,
        stocked_quantity: 50,
        reserved_quantity: 0,
        incoming_quantity: 0,
      })

      const inventoryReservation = await inventoryService.createReservationItem(
        {
          line_item_id: "line_item_123",
          inventory_item_id: inventoryItem.id,
          location_id: locationId,
          quantity: 10,
          metadata: {
            abc: 123,
          },
        }
      )

      expect(inventoryReservation).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          line_item_id: "line_item_123",
          inventory_item_id: inventoryItem.id,
          location_id: locationId,
          quantity: 10,
          metadata: { abc: 123 },
          deleted_at: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      )

      const [available, reserved] = await Promise.all([
        inventoryService.retrieveAvailableQuantity(inventoryItem.id, [
          locationId,
        ]),
        inventoryService.retrieveReservedQuantity(inventoryItem.id, locationId),
      ])

      expect(available).toEqual(40)
      expect(reserved).toEqual(10)
    })

    it("updateReservationItem", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const locationId = "location_123"
      const newLocationId = "location_new"

      const inventoryItem = await inventoryService.createInventoryItem({
        sku: "sku_1",
      })

      await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: locationId,
        stocked_quantity: 50,
        reserved_quantity: 0,
        incoming_quantity: 0,
      })

      await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: newLocationId,
        stocked_quantity: 20,
        reserved_quantity: 5,
        incoming_quantity: 0,
      })

      const inventoryReservation = await inventoryService.createReservationItem(
        {
          line_item_id: "line_item_123",
          inventory_item_id: inventoryItem.id,
          location_id: locationId,
          quantity: 15,
          metadata: {
            abc: 123,
          },
        }
      )

      const [available, reserved] = await Promise.all([
        inventoryService.retrieveAvailableQuantity(
          inventoryItem.id,
          locationId
        ),
        inventoryService.retrieveReservedQuantity(inventoryItem.id, locationId),
      ])

      expect(available).toEqual(35)
      expect(reserved).toEqual(15)

      const updatedReservation = await inventoryService.updateReservationItem(
        inventoryReservation.id,
        {
          quantity: 5,
        }
      )

      expect(updatedReservation).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          line_item_id: "line_item_123",
          inventory_item_id: inventoryItem.id,
          location_id: locationId,
          quantity: 5,
          metadata: { abc: 123 },
        })
      )

      const [newAvailable, newReserved] = await Promise.all([
        inventoryService.retrieveAvailableQuantity(
          inventoryItem.id,
          locationId
        ),
        inventoryService.retrieveReservedQuantity(inventoryItem.id, locationId),
      ])

      expect(newAvailable).toEqual(45)
      expect(newReserved).toEqual(5)

      const updatedReservationLocation =
        await inventoryService.updateReservationItem(inventoryReservation.id, {
          quantity: 12,
          location_id: newLocationId,
        })

      expect(updatedReservationLocation).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          line_item_id: "line_item_123",
          inventory_item_id: inventoryItem.id,
          location_id: newLocationId,
          quantity: 12,
          metadata: { abc: 123 },
        })
      )

      const [
        oldLocationAvailable,
        oldLocationReserved,
        newLocationAvailable,
        newLocationReserved,
      ] = await Promise.all([
        inventoryService.retrieveAvailableQuantity(
          inventoryItem.id,
          locationId
        ),
        inventoryService.retrieveReservedQuantity(inventoryItem.id, locationId),
        inventoryService.retrieveAvailableQuantity(
          inventoryItem.id,
          newLocationId
        ),
        inventoryService.retrieveReservedQuantity(
          inventoryItem.id,
          newLocationId
        ),
      ])

      expect(oldLocationAvailable).toEqual(50)
      expect(oldLocationReserved).toEqual(0)
      expect(newLocationAvailable).toEqual(3)
      expect(newLocationReserved).toEqual(17)
    })

    it("deleteReservationItem and deleteReservationItemsByLineItem", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const locationId = "location_123"

      const inventoryItem = await inventoryService.createInventoryItem({
        sku: "sku_1",
      })

      await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: locationId,
        stocked_quantity: 10,
      })

      const inventoryReservation = await inventoryService.createReservationItem(
        {
          line_item_id: "line_item_123",
          inventory_item_id: inventoryItem.id,
          location_id: locationId,
          quantity: 1,
        }
      )

      for (let quant = 1; quant <= 3; quant++) {
        await inventoryService.createReservationItem({
          line_item_id: "line_item_444",
          inventory_item_id: inventoryItem.id,
          location_id: locationId,
          quantity: 1,
        })
      }

      const [available, reserved] = await Promise.all([
        inventoryService.retrieveAvailableQuantity(
          inventoryItem.id,
          locationId
        ),
        inventoryService.retrieveReservedQuantity(inventoryItem.id, locationId),
      ])

      expect(available).toEqual(6)
      expect(reserved).toEqual(4)

      await inventoryService.deleteReservationItemsByLineItem("line_item_444")
      const [afterDeleteLineitemAvailable, afterDeleteLineitemReserved] =
        await Promise.all([
          inventoryService.retrieveAvailableQuantity(
            inventoryItem.id,
            locationId
          ),
          inventoryService.retrieveReservedQuantity(
            inventoryItem.id,
            locationId
          ),
        ])

      expect(afterDeleteLineitemAvailable).toEqual(9)
      expect(afterDeleteLineitemReserved).toEqual(1)

      await inventoryService.deleteReservationItem(inventoryReservation.id)
      const [afterDeleteReservationAvailable, afterDeleteReservationReserved] =
        await Promise.all([
          inventoryService.retrieveAvailableQuantity(
            inventoryItem.id,
            locationId
          ),
          inventoryService.retrieveReservedQuantity(
            inventoryItem.id,
            locationId
          ),
        ])

      expect(afterDeleteReservationAvailable).toEqual(10)
      expect(afterDeleteReservationReserved).toEqual(0)
    })

    it("confirmInventory", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const locationId = "location_123"
      const secondLocationId = "location_551"

      const inventoryItem = await inventoryService.createInventoryItem({
        sku: "sku_1",
      })

      await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: locationId,
        stocked_quantity: 10,
        reserved_quantity: 5,
      })
      await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: secondLocationId,
        stocked_quantity: 6,
        reserved_quantity: 1,
      })

      expect(
        await inventoryService.confirmInventory(inventoryItem.id, locationId, 5)
      ).toBeTruthy()

      expect(
        await inventoryService.confirmInventory(
          inventoryItem.id,
          [locationId, secondLocationId],
          10
        )
      ).toBeTruthy()

      expect(
        await inventoryService.confirmInventory(inventoryItem.id, locationId, 6)
      ).toBeFalsy()

      expect(
        await inventoryService.confirmInventory(
          inventoryItem.id,
          [locationId, secondLocationId],
          11
        )
      ).toBeFalsy()
    })

    it("adjustInventory", async () => {
      const inventoryService = appContainer.resolve("inventoryService")

      const locationId = "location_123"
      const secondLocationId = "location_551"

      const inventoryItem = await inventoryService.createInventoryItem({
        sku: "sku_1",
      })

      await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: locationId,
        stocked_quantity: 10,
        reserved_quantity: 5,
      })
      await inventoryService.createInventoryLevel({
        inventory_item_id: inventoryItem.id,
        location_id: secondLocationId,
        stocked_quantity: 6,
        reserved_quantity: 1,
      })

      expect(
        await inventoryService.adjustInventory(inventoryItem.id, locationId, -5)
      ).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          inventory_item_id: inventoryItem.id,
          location_id: locationId,
          stocked_quantity: 5,
          reserved_quantity: 5,
          incoming_quantity: 0,
          metadata: null,
          deleted_at: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      )

      expect(
        await inventoryService.adjustInventory(
          inventoryItem.id,
          secondLocationId,
          -10
        )
      ).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          inventory_item_id: inventoryItem.id,
          location_id: secondLocationId,
          stocked_quantity: -4,
          reserved_quantity: 1,
          incoming_quantity: 0,
          metadata: null,
          deleted_at: null,
          created_at: expect.any(Date),
          updated_at: expect.any(Date),
        })
      )
    })
  })
})
