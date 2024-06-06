import { IInventoryServiceNext, InventoryItemDTO } from "@medusajs/types"
import { SuiteOptions, moduleIntegrationTestRunner } from "medusa-test-utils"

import { Modules } from "@medusajs/modules-sdk"

jest.setTimeout(100000)

moduleIntegrationTestRunner({
  moduleName: Modules.INVENTORY,
  resolve: "@medusajs/inventory-next",
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IInventoryServiceNext>) => {
    describe("Inventory Module Service", () => {
      describe("create", () => {
        it("should create an inventory item", async () => {
          const data = { sku: "test-sku", origin_country: "test-country" }
          const inventoryItem = await service.create(data)

          expect(inventoryItem).toEqual(
            expect.objectContaining({ id: expect.any(String), ...data })
          )
        })

        it("should create inventory items from array", async () => {
          const data = [
            { sku: "test-sku", origin_country: "test-country" },
            { sku: "test-sku-1", origin_country: "test-country-1" },
          ]
          const inventoryItems = await service.create(data)

          expect(inventoryItems).toEqual([
            expect.objectContaining({ id: expect.any(String), ...data[0] }),
            expect.objectContaining({ id: expect.any(String), ...data[1] }),
          ])
        })
      })

      describe("createReservationItem", () => {
        let inventoryItem: InventoryItemDTO
        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 2,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              stocked_quantity: 2,
            },
          ])
        })

        it("should create a reservationItem", async () => {
          const data = {
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            quantity: 2,
          }

          const reservationItem = await service.createReservationItems(data)

          expect(reservationItem).toEqual(
            expect.objectContaining({ id: expect.any(String), ...data })
          )
        })

        it("should create adjust reserved_quantity of inventory level after creation", async () => {
          await service.createReservationItems({
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            quantity: 2,
          })

          const inventoryLevel =
            await service.retrieveInventoryLevelByItemAndLocation(
              inventoryItem.id,
              "location-1"
            )

          expect(inventoryLevel.reserved_quantity).toEqual(2)
        })

        it("should check inventory levels before creating reservation", async () => {
          const reserveMoreThanInStock = service.createReservationItems({
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            quantity: 3,
          })

          await expect(reserveMoreThanInStock).rejects.toThrow(
            `Not enough stock available for item ${inventoryItem.id} at location location-1`
          )

          let inventoryLevel =
            await service.retrieveInventoryLevelByItemAndLocation(
              inventoryItem.id,
              "location-1"
            )

          expect(inventoryLevel.reserved_quantity).toEqual(0)

          await service.createReservationItems({
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            allow_backorder: true,
            quantity: 3,
          })

          inventoryLevel =
            await service.retrieveInventoryLevelByItemAndLocation(
              inventoryItem.id,
              "location-1"
            )

          expect(inventoryLevel.reserved_quantity).toEqual(3)
        })

        it("should create reservationItems from array", async () => {
          const data = [
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              quantity: 2,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              allow_backorder: true,
              quantity: 3,
            },
          ]
          const reservationItems = await service.createReservationItems(data)

          expect(reservationItems).toEqual([
            expect.objectContaining({ id: expect.any(String), ...data[0] }),
            expect.objectContaining({ id: expect.any(String), ...data[1] }),
          ])
        })

        it("should fail to create a reservationItem for a non-existing location", async () => {
          const data = [
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-3",
              quantity: 2,
            },
          ]

          const err = await service
            .createReservationItems(data)
            .catch((error) => error)

          expect(err.message).toEqual(
            `Item ${inventoryItem.id} is not stocked at location location-3`
          )
        })
      })

      describe("createInventoryLevel", () => {
        let inventoryItem: InventoryItemDTO

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })
        })

        it("should create an inventoryLevel", async () => {
          const data = {
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            stocked_quantity: 2,
          }

          const inventoryLevel = await service.createInventoryLevels(data)

          expect(inventoryLevel).toEqual(
            expect.objectContaining({ id: expect.any(String), ...data })
          )
        })

        it("should create inventoryLevels from array", async () => {
          const data = [
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 2,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              stocked_quantity: 3,
            },
          ]
          const inventoryLevels = await service.createInventoryLevels(data)

          expect(inventoryLevels).toEqual([
            expect.objectContaining({ id: expect.any(String), ...data[0] }),
            expect.objectContaining({ id: expect.any(String), ...data[1] }),
          ])
        })

        it("should not create with required quantity", async () => {
          const data = {
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            stocked_quantity: 2,
            reserved_quantity: 1000,
          }

          const inventoryLevel = await service.createInventoryLevels(data)

          expect(inventoryLevel).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              ...data,
              reserved_quantity: 0,
            })
          )
        })
      })

      describe("update", () => {
        let inventoryItem: InventoryItemDTO

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })
        })

        it("should update the inventory item", async () => {
          const update = {
            id: inventoryItem.id,
            sku: "updated-sku",
          }
          const updated = await service.update(update)

          expect(updated).toEqual(expect.objectContaining(update))
        })

        it("should update multiple inventory items", async () => {
          const item2 = await service.create({
            sku: "test-sku-1",
          })

          const updates = [
            {
              id: inventoryItem.id,
              sku: "updated-sku",
            },
            {
              id: item2.id,
              sku: "updated-sku-2",
            },
          ]
          const updated = await service.update(updates)

          expect(updated).toEqual([
            expect.objectContaining(updates[0]),
            expect.objectContaining(updates[1]),
          ])
        })
      })

      describe("updateInventoryLevels", () => {
        let inventoryLevel
        let inventoryItem

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          const data = {
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            stocked_quantity: 2,
          }

          inventoryLevel = await service.createInventoryLevels(data)
        })

        it("should update inventory level", async () => {
          const updatedLevel = await service.updateInventoryLevels({
            location_id: "location-1",
            inventory_item_id: inventoryItem.id,
            incoming_quantity: 4,
          })

          expect(updatedLevel.incoming_quantity).toEqual(4)
        })

        it("should fail to update inventory level for item in location that isn't stocked", async () => {
          const error = await service
            .updateInventoryLevels({
              inventory_item_id: inventoryItem.id,
              location_id: "does-not-exist",
              stocked_quantity: 10,
            })
            .catch((error) => error)

          expect(error.message).toEqual(
            `Item ${inventoryItem.id} is not stocked at location does-not-exist`
          )
        })
      })

      describe("updateReservationItems", () => {
        let reservationItem
        let inventoryItem

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 10,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              stocked_quantity: 10,
            },
          ])

          reservationItem = await service.createReservationItems({
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            quantity: 3,
          })
        })

        it("should update a reservationItem", async () => {
          const update = {
            id: reservationItem.id,
            quantity: 1,
          }

          const updated = await service.updateReservationItems(update)

          expect(updated).toEqual(expect.objectContaining(update))
        })

        it("should adjust reserved_quantity of inventory level after updates increasing reserved quantity", async () => {
          const update = {
            id: reservationItem.id,
            quantity: 7,
          }

          await service.updateReservationItems(update)

          const inventoryLevel =
            await service.retrieveInventoryLevelByItemAndLocation(
              reservationItem.inventory_item_id,
              "location-1"
            )

          expect(inventoryLevel.reserved_quantity).toEqual(update.quantity)
        })

        it("should adjust reserved_quantity of inventory level after updates decreasing reserved quantity", async () => {
          const update = {
            id: reservationItem.id,
            quantity: 2,
          }

          await service.updateReservationItems(update)

          const inventoryLevel =
            await service.retrieveInventoryLevelByItemAndLocation(
              reservationItem.inventory_item_id,
              "location-1"
            )

          expect(inventoryLevel.reserved_quantity).toEqual(update.quantity)
        })

        it("should throw error when increasing reserved quantity beyond availability", async () => {
          const update = {
            id: reservationItem.id,
            quantity: 10,
          }

          const error = await service
            .updateReservationItems(update)
            .catch((e) => e)

          expect(error.message).toEqual(
            `Not enough stock available for item ${inventoryItem.id} at location location-1`
          )
        })
      })

      describe("deleteReservationItemsByLineItem", () => {
        let inventoryItem: InventoryItemDTO

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 2,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              stocked_quantity: 2,
            },
          ])

          await service.createReservationItems([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              quantity: 2,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              quantity: 2,
              line_item_id: "line-item-id",
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              quantity: 2,
              line_item_id: "line-item-id",
            },
          ])
        })

        it("should delete reseravation items by line item and restore them", async () => {
          const reservationsPreDeleted = await service.listReservationItems({
            line_item_id: "line-item-id",
          })

          expect(reservationsPreDeleted).toEqual([
            expect.objectContaining({
              location_id: "location-1",
              quantity: 2,
              line_item_id: "line-item-id",
            }),
            expect.objectContaining({
              location_id: "location-1",
              quantity: 2,
              line_item_id: "line-item-id",
            }),
          ])

          await service.deleteReservationItemsByLineItem("line-item-id")

          const reservationsPostDeleted = await service.listReservationItems({
            line_item_id: "line-item-id",
          })

          expect(reservationsPostDeleted).toEqual([])

          await service.restoreReservationItemsByLineItem("line-item-id")

          const reservationsPostRestored = await service.listReservationItems({
            line_item_id: "line-item-id",
          })

          expect(reservationsPostRestored).toEqual([
            expect.objectContaining({
              location_id: "location-1",
              quantity: 2,
              line_item_id: "line-item-id",
            }),
            expect.objectContaining({
              location_id: "location-1",
              quantity: 2,
              line_item_id: "line-item-id",
            }),
          ])
        })

        it("should adjust inventory levels accordingly when removing reservations by line item", async () => {
          const inventoryLevelBefore =
            await service.retrieveInventoryLevelByItemAndLocation(
              inventoryItem.id,
              "location-1"
            )

          expect(inventoryLevelBefore).toEqual(
            expect.objectContaining({ reserved_quantity: 6 })
          )

          await service.deleteReservationItemsByLineItem("line-item-id")

          const inventoryLevel =
            await service.retrieveInventoryLevelByItemAndLocation(
              inventoryItem.id,
              "location-1"
            )

          expect(inventoryLevel).toEqual(
            expect.objectContaining({ reserved_quantity: 2 })
          )
        })
      })

      describe("deleteReservationItemByLocationId", () => {
        let inventoryItem: InventoryItemDTO
        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 2,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              stocked_quantity: 2,
            },
          ])

          await service.createReservationItems([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              quantity: 2,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              quantity: 2,
              line_item_id: "line-item-id",
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              quantity: 2,
              line_item_id: "line-item-id",
            },
          ])
        })

        it("deleted reservation items by line item", async () => {
          const reservationsPreDeleted = await service.listReservationItems({
            location_id: "location-1",
          })

          expect(reservationsPreDeleted).toEqual([
            expect.objectContaining({
              location_id: "location-1",
              quantity: 2,
            }),
            expect.objectContaining({
              location_id: "location-1",
              quantity: 2,
            }),
          ])

          await service.deleteReservationItemByLocationId("location-1")

          const reservationsPostDeleted = await service.listReservationItems({
            location_id: "location-1",
          })

          expect(reservationsPostDeleted).toEqual([])
        })

        it("should adjust inventory levels accordingly when removing reservations by line item", async () => {
          const inventoryLevelPreDelete =
            await service.retrieveInventoryLevelByItemAndLocation(
              inventoryItem.id,
              "location-1"
            )

          expect(inventoryLevelPreDelete).toEqual(
            expect.objectContaining({ reserved_quantity: 4 })
          )

          await service.deleteReservationItemByLocationId("location-1")

          const inventoryLevel =
            await service.retrieveInventoryLevelByItemAndLocation(
              inventoryItem.id,
              "location-1"
            )

          expect(inventoryLevel).toEqual(
            expect.objectContaining({ reserved_quantity: 0 })
          )
        })
      })

      describe("deleteInventoryItemLevelByLocationId", () => {
        let inventoryItem: InventoryItemDTO

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 2,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              stocked_quantity: 2,
            },
          ])

          await service.createReservationItems({
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            quantity: 1,
          })
        })

        it("should remove inventory levels with given location id", async () => {
          const inventoryLevelsPreDeletion = await service.listInventoryLevels(
            {}
          )

          expect(inventoryLevelsPreDeletion).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                stocked_quantity: 2,
                location_id: "location-1",
                reserved_quantity: 1,
              }),
              expect.objectContaining({
                stocked_quantity: 2,
                location_id: "location-2",
              }),
            ])
          )

          await service.deleteInventoryItemLevelByLocationId("location-1")

          const inventoryLevelsPostDeletion = await service.listInventoryLevels(
            {}
          )

          expect(inventoryLevelsPostDeletion).toEqual([
            expect.objectContaining({
              stocked_quantity: 2,
              location_id: "location-2",
            }),
          ])
        })
      })

      describe("deleteInventoryLevel", () => {
        let inventoryItem: InventoryItemDTO
        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 2,
            },
          ])
        })

        it("should remove inventory levels with given location id", async () => {
          const inventoryLevelsPreDeletion = await service.listInventoryLevels(
            {}
          )

          expect(inventoryLevelsPreDeletion).toEqual([
            expect.objectContaining({
              stocked_quantity: 2,
              location_id: "location-1",
            }),
          ])

          await service.deleteInventoryLevel(inventoryItem.id, "location-1")

          const inventoryLevelsPostDeletion = await service.listInventoryLevels(
            {}
          )

          expect(inventoryLevelsPostDeletion).toEqual([])
        })
      })

      describe("adjustInventory", () => {
        let inventoryItem: InventoryItemDTO
        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 2,
            },
          ])
        })

        it("should updated inventory level stocked_quantity by quantity", async () => {
          const updatedLevel = await service.adjustInventory(
            inventoryItem.id,
            "location-1",
            2
          )
          expect(updatedLevel.stocked_quantity).toEqual(4)
        })

        it("should updated inventory level stocked_quantity by negative quantity", async () => {
          const updatedLevel = await service.adjustInventory(
            inventoryItem.id,
            "location-1",
            -1
          )
          expect(updatedLevel.stocked_quantity).toEqual(1!)
        })
      })

      describe("retrieveInventoryLevelByItemAndLocation", () => {
        let inventoryItem: InventoryItemDTO
        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })
          const inventoryItem1 = await service.create({
            sku: "test-sku-1",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 2,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              stocked_quantity: 3,
            },
            {
              inventory_item_id: inventoryItem1.id,
              location_id: "location-1",
              stocked_quantity: 3,
            },
          ])
        })

        it("should retrieve inventory level with provided location_id and inventory_item", async () => {
          const level = await service.retrieveInventoryLevelByItemAndLocation(
            inventoryItem.id,
            "location-1"
          )
          expect(level.stocked_quantity).toEqual(2)
        })
      })

      describe("retrieveAvailableQuantity", () => {
        let inventoryItem: InventoryItemDTO

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })
          const inventoryItem1 = await service.create({
            sku: "test-sku-1",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 4,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              stocked_quantity: 4,
            },
            {
              inventory_item_id: inventoryItem1.id,
              location_id: "location-1",
              stocked_quantity: 3,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-3",
              stocked_quantity: 3,
            },
          ])

          await service.createReservationItems({
            line_item_id: "test",
            inventory_item_id: inventoryItem.id,
            location_id: "location-2",
            quantity: 2,
          })
        })

        it("should calculate current stocked quantity across locations", async () => {
          const level = await service.retrieveAvailableQuantity(
            inventoryItem.id,
            ["location-1", "location-2"]
          )

          expect(level).toEqual(6)
        })
      })

      describe("retrieveStockedQuantity", () => {
        let inventoryItem: InventoryItemDTO

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          const inventoryItem1 = await service.create({
            sku: "test-sku-1",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 4,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              stocked_quantity: 4,
            },
            {
              inventory_item_id: inventoryItem1.id,
              location_id: "location-1",
              stocked_quantity: 3,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-3",
              stocked_quantity: 3,
            },
          ])
        })

        it("should retrieve stocked location", async () => {
          const stockedQuantity = await service.retrieveStockedQuantity(
            inventoryItem.id,
            ["location-1", "location-2"]
          )

          expect(stockedQuantity).toEqual(8)
        })
      })

      describe("retrieveReservedQuantity", () => {
        let inventoryItem: InventoryItemDTO

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          const inventoryItem1 = await service.create({
            sku: "test-sku-1",
            origin_country: "test-country",
          })

          await service.createInventoryLevels([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-1",
              stocked_quantity: 4,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              stocked_quantity: 4,
            },
            {
              inventory_item_id: inventoryItem1.id,
              location_id: "location-1",
              stocked_quantity: 3,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-3",
              stocked_quantity: 3,
            },
          ])

          await service.createReservationItems([
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-2",
              quantity: 2,
            },
            {
              inventory_item_id: inventoryItem1.id,
              location_id: "location-1",
              quantity: 2,
            },
            {
              inventory_item_id: inventoryItem.id,
              location_id: "location-3",
              quantity: 2,
            },
          ])
        })

        it("retrieves reserved quantity", async () => {
          const reservedQuantity = await service.retrieveReservedQuantity(
            inventoryItem.id,
            ["location-1", "location-2"]
          )

          expect(reservedQuantity).toEqual(2)
        })
      })

      describe("confirmInventory", () => {
        let inventoryItem: InventoryItemDTO

        beforeEach(async () => {
          inventoryItem = await service.create({
            sku: "test-sku",
            origin_country: "test-country",
          })

          await service.createInventoryLevels({
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            stocked_quantity: 4,
          })

          await service.createReservationItems({
            inventory_item_id: inventoryItem.id,
            location_id: "location-1",
            quantity: 2,
          })
        })

        it("should return true if quantity is less than or equal to available quantity", async () => {
          const reservedQuantity = await service.confirmInventory(
            inventoryItem.id,
            ["location-1"],
            2
          )

          expect(reservedQuantity).toBeTruthy()
        })

        it("should return false if quantity is more than available quantity", async () => {
          const reservedQuantity = await service.confirmInventory(
            inventoryItem.id,
            ["location-1"],
            3
          )

          expect(reservedQuantity).toBeFalsy()
        })
      })
    })
  },
})
