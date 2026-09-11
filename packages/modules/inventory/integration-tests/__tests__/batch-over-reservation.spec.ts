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
    describe("createReservationItems - batch over-reservation for the same inventory item", () => {
      it("should not reserve more than available when a single batch has two entries for the same item+location", async () => {
        const item = await service.createInventoryItems({
          sku: "batch-oversell-sku",
          origin_country: "test-country",
        })

        await service.createInventoryLevels([
          {
            inventory_item_id: item.id,
            location_id: "location-1",
            stocked_quantity: 5,
          },
        ])

        // Two reservation entries in ONE call, both for the same item+location,
        // each quantity 5 (total demand 10 vs available 5). This is what an order
        // with two line items sharing an inventory item (a bundle/kit) produces.
        const reserve = service.createReservationItems([
          {
            inventory_item_id: item.id,
            location_id: "location-1",
            quantity: 5,
          },
          {
            inventory_item_id: item.id,
            location_id: "location-1",
            quantity: 5,
          },
        ])

        // The combined demand exceeds stock, so it must be rejected — exactly as
        // a single reservation of 10 against 5 would be.
        await expect(reserve).rejects.toThrow(/Not enough stock available/)

        const level = await service.retrieveInventoryLevelByItemAndLocation(
          item.id,
          "location-1"
        )
        // reserved_quantity must never exceed stocked_quantity.
        expect(Number(level.reserved_quantity)).toBeLessThanOrEqual(5)
      })
    })
  },
})
