import { IInventoryService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils"

jest.setTimeout(300000)

/**
 * Regression tests for concurrent reservation creation.
 *
 * Two concurrent `createReservationItems` calls for the same inventory level
 * must not both be able to reserve the same available stock, and the
 * `reserved_quantity` aggregate must stay consistent with the number of live
 * reservation rows.
 */

moduleIntegrationTestRunner<IInventoryService>({
  moduleName: Modules.INVENTORY,
  injectedDependencies: {
    [Modules.EVENT_BUS]: new MockEventBusService(),
  },
  testSuite: ({ service }) => {
    describe("Concurrent reservations", () => {
      let inventoryItemId: string
      const locationId = "location-1"

      beforeEach(async () => {
        const item = await service.createInventoryItems({
          sku: "concurrent-sku",
          origin_country: "test-country",
        })
        inventoryItemId = item.id

        await service.createInventoryLevels([
          {
            inventory_item_id: inventoryItemId,
            location_id: locationId,
            stocked_quantity: 1,
          },
        ])
      })

      it("should reject one of two concurrent reservations exceeding available stock", async () => {
        const reserve = () =>
          service.createReservationItems({
            inventory_item_id: inventoryItemId,
            location_id: locationId,
            quantity: 1,
          })

        const results = await Promise.allSettled([reserve(), reserve()])

        const fulfilled = results.filter((r) => r.status === "fulfilled")
        const rejected = results.filter((r) => r.status === "rejected")

        console.log(
          "CONCURRENCY SUMMARY:",
          JSON.stringify({
            fulfilled: fulfilled.length,
            rejected: rejected.length,
          })
        )

        expect(fulfilled.length).toEqual(1)
        expect(rejected.length).toEqual(1)

        const levels = await service.listInventoryLevels({
          inventory_item_id: inventoryItemId,
          location_id: locationId,
        })
        console.log(
          "LEVEL AFTER CREATE:",
          JSON.stringify(levels[0].reserved_quantity)
        )
        expect(levels[0].reserved_quantity).toEqual(1)
      })

      it("should keep reserved_quantity consistent across concurrent backordered creations and their deletion", async () => {
        const reserve = () =>
          service.createReservationItems({
            inventory_item_id: inventoryItemId,
            location_id: locationId,
            quantity: 1,
            allow_backorder: true,
          })

        const results = await Promise.allSettled([reserve(), reserve()])
        const fulfilled = results.filter((r) => r.status === "fulfilled")
        expect(fulfilled.length).toEqual(2)

        const levelsAfterCreate = await service.listInventoryLevels({
          inventory_item_id: inventoryItemId,
          location_id: locationId,
        })
        console.log(
          "LEVEL AFTER BACKORDERED CREATES:",
          JSON.stringify(levelsAfterCreate[0].reserved_quantity)
        )
        expect(levelsAfterCreate[0].reserved_quantity).toEqual(2)

        const reservations = await service.listReservationItems({
          inventory_item_id: inventoryItemId,
        })
        expect(reservations).toHaveLength(2)

        await service.deleteReservationItems(reservations.map((r) => r.id!))

        const levels = await service.listInventoryLevels({
          inventory_item_id: inventoryItemId,
          location_id: locationId,
        })
        console.log(
          "LEVEL AFTER DELETE:",
          JSON.stringify(levels[0].reserved_quantity)
        )
        expect(levels[0].reserved_quantity).toEqual(0)
      })
    })
  },
})
