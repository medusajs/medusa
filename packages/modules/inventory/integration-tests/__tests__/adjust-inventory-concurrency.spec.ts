import { IInventoryService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils"

jest.setTimeout(300000)

/**
 * Regression tests for concurrent stock adjustments.
 *
 * Two concurrent `adjustInventory` calls for the same inventory level must
 * both be reflected in `stocked_quantity` — the counter is a read-modify-write
 * and previously lost updates when two calls interleaved.
 */

moduleIntegrationTestRunner<IInventoryService>({
  moduleName: Modules.INVENTORY,
  injectedDependencies: {
    [Modules.EVENT_BUS]: new MockEventBusService(),
  },
  testSuite: ({ service }) => {
    describe("Concurrent inventory adjustments", () => {
      let inventoryItemId: string
      const locationId = "location-1"

      beforeEach(async () => {
        const item = await service.createInventoryItems({
          sku: "concurrent-adjust-sku",
          origin_country: "test-country",
        })
        inventoryItemId = item.id

        await service.createInventoryLevels([
          {
            inventory_item_id: inventoryItemId,
            location_id: locationId,
            stocked_quantity: 0,
          },
        ])
      })

      it("should apply both of two concurrent increments to stocked_quantity", async () => {
        const adjust = () =>
          service.adjustInventory(inventoryItemId, locationId, 5)

        const results = await Promise.allSettled([adjust(), adjust()])
        const rejected = results.filter((r) => r.status === "rejected")
        expect(rejected).toHaveLength(0)

        const level = await service.retrieveInventoryLevelByItemAndLocation(
          inventoryItemId,
          locationId
        )
        expect(level.stocked_quantity).toEqual(10)
      })

      it("should apply concurrent opposite adjustments without losing either", async () => {
        await service.adjustInventory(inventoryItemId, locationId, 10)

        const results = await Promise.allSettled([
          service.adjustInventory(inventoryItemId, locationId, -4),
          service.adjustInventory(inventoryItemId, locationId, -6),
        ])
        const rejected = results.filter((r) => r.status === "rejected")
        expect(rejected).toHaveLength(0)

        const level = await service.retrieveInventoryLevelByItemAndLocation(
          inventoryItemId,
          locationId
        )
        expect(level.stocked_quantity).toEqual(0)
      })
    })
  },
})
