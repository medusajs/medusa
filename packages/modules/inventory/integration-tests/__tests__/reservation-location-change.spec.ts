import { IInventoryService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IInventoryService>({
  moduleName: Modules.INVENTORY,
  injectedDependencies: {
    [Modules.EVENT_BUS]: new MockEventBusService(),
  },
  testSuite: ({ service }) => {
    describe("updateReservationItems - location change availability", () => {
      it("should reject moving a reservation to a location without enough stock", async () => {
        const inventoryItem = await service.createInventoryItems({
          sku: "loc-move-sku",
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
            stocked_quantity: 1,
          },
        ])

        const reservation = await service.createReservationItems({
          inventory_item_id: inventoryItem.id,
          location_id: "location-1",
          quantity: 10,
        })

        // Moving the 10-unit reservation to location-2 (only 1 in stock) must be
        // rejected, exactly as creating such a reservation directly would be.
        await expect(
          service.updateReservationItems({
            id: reservation.id,
            location_id: "location-2",
          })
        ).rejects.toThrow(
          `Not enough stock available for item ${inventoryItem.id} at location location-2`
        )

        // location-2 must not end up over-reserved (reserved 10 vs stocked 1).
        const level2 = await service.retrieveInventoryLevelByItemAndLocation(
          inventoryItem.id,
          "location-2"
        )
        expect(level2.reserved_quantity).toEqual(0)
      })
    })
  },
})
