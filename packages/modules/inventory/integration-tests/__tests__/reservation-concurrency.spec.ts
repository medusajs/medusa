import { Context, IInventoryService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(15000)

moduleIntegrationTestRunner<IInventoryService>({
  moduleName: Modules.INVENTORY,
  testSuite: ({ service, MikroOrmWrapper }) => {
    // Hold a real service mutation open until the competing transaction waits
    // on it in PostgreSQL. The second call owns its usual service transaction.
    async function compete(
      first: (context: Context) => Promise<unknown>,
      second: () => Promise<unknown>
    ) {
      const manager = MikroOrmWrapper.forkManager()
      const observer = MikroOrmWrapper.forkManager()
      let pending: ReturnType<typeof Promise.allSettled> | undefined
      await manager.begin()
      try {
        await first({ transactionManager: manager })
        await manager.flush()
        const [{ pid }] = await manager.execute(
          "select pg_backend_pid() as pid"
        )
        pending = Promise.allSettled([second()])
        let blocked = false
        const deadline = Date.now() + 2000
        while (!blocked && Date.now() < deadline) {
          const [row] = await observer.execute(
            "select exists (select 1 from pg_stat_activity where ? = any(pg_blocking_pids(pid))) as blocked",
            [pid]
          )
          blocked = row.blocked
          if (!blocked) await new Promise((resolve) => setTimeout(resolve, 10))
        }
        expect(blocked).toBe(true)
        await manager.commit()
        return (await pending)[0]
      } finally {
        if (manager.isInTransaction()) await manager.rollback()
        await pending
      }
    }

    it.each([
      { stocked: 1, quantity: 1, backorder: false, count: 1 },
      { stocked: 4, quantity: 1.25, backorder: false, count: 2 },
      { stocked: 1, quantity: 2, backorder: true, count: 2 },
    ])(
      "serializes direct reservations ($stocked stocked, $quantity each, backorder=$backorder)",
      async ({ stocked, quantity, backorder, count }) => {
        const item = await service.createInventoryItems({ sku: "concurrent" })
        const key = { inventory_item_id: item.id, location_id: "location" }
        await service.createInventoryLevels({
          ...key,
          stocked_quantity: stocked,
        })
        const reserve = (context?: Context) =>
          service.createReservationItems(
            { ...key, quantity, allow_backorder: backorder },
            context
          )
        const outcome = await compete(reserve, reserve)
        const rows = await service.listReservationItems(key)
        const [level] = await service.listInventoryLevels(key)
        await service.deleteReservationItems(rows.map((row) => row.id))
        const [after] = await service.listInventoryLevels(key)
        expect({
          outcome: outcome.status,
          rows: rows.length,
          reserved: level.reserved_quantity,
          sum: rows.reduce((sum, row) => sum + Number(row.quantity), 0),
          afterDelete: after.reserved_quantity,
        }).toEqual({
          outcome: count === 1 ? "rejected" : "fulfilled",
          rows: count,
          reserved: quantity * count,
          sum: quantity * count,
          afterDelete: 0,
        })
        if (outcome.status === "rejected") {
          expect(outcome.reason.message).toBe(
            `Not enough stock available for item ${item.id} at location location`
          )
        }
      }
    )
    it("uses current reservation quantities after competing updates", async () => {
      const item = await service.createInventoryItems({ sku: "updates" })
      const key = { inventory_item_id: item.id, location_id: "location" }
      await service.createInventoryLevels({ ...key, stocked_quantity: 10 })
      const rows = await service.createReservationItems([
        { ...key, quantity: 1 },
        { ...key, quantity: 1 },
      ])
      const outcome = await compete(
        (context) =>
          service.updateReservationItems(
            rows.map(({ id }) => ({ id, quantity: 2 })),
            context
          ),
        () => service.updateReservationItems({ id: rows[0].id, quantity: 3 })
      )
      expect(outcome.status).toBe("fulfilled")
      const quantities = await service.listReservationItems(key)
      const [level] = await service.listInventoryLevels(key)
      expect(quantities.map((row) => Number(row.quantity)).sort()).toEqual([
        2, 3,
      ])
      expect(level.reserved_quantity).toBe(5)
    })

    it.each(["destination", ""])("checks move stock at %j", async (to) => {
      const item = await service.createInventoryItems({ sku: "movement" })
      const key = { inventory_item_id: item.id, location_id: "source" }
      await service.createInventoryLevels([
        { ...key, stocked_quantity: 10 },
        { ...key, location_id: to, stocked_quantity: 1 },
      ])
      const row = await service.createReservationItems({ ...key, quantity: 8 })
      await expect(
        service.updateReservationItems({
          id: row.id,
          location_id: to,
        })
      ).rejects.toThrow("Not enough stock available")
      const unchanged = await service.retrieveReservationItem(row.id)
      expect([unchanged.location_id, unchanged.quantity]).toEqual(["source", 8])
      const levels = await service.listInventoryLevels(
        { inventory_item_id: item.id },
        { order: { location_id: "ASC" } }
      )
      expect(levels.map((level) => level.reserved_quantity)).toEqual([0, 8])
    })
    it.each(["hard", "soft", "location", "line"] as const)(
      "coordinates %s deletion with a concurrent creation",
      async (kind) => {
        const item = await service.createInventoryItems({ sku: "deletion" })
        const key = { inventory_item_id: item.id, location_id: "location" }
        await service.createInventoryLevels({ ...key, stocked_quantity: 10 })
        const input = { ...key, quantity: 1, line_item_id: "line" }
        const row = await service.createReservationItems(input)
        const remove = {
          hard: () => service.deleteReservationItems(row.id),
          soft: () => service.softDeleteReservationItems([row.id]),
          location: () => service.deleteReservationItemByLocationId("location"),
          line: () => service.deleteReservationItemsByLineItem("line"),
        }[kind]
        expect(
          (
            await compete(
              (context) => service.createReservationItems(input, context),
              remove
            )
          ).status
        ).toBe("fulfilled")
        expect(await service.listReservationItems(key)).toHaveLength(1)
        expect(
          (await service.listInventoryLevels(key))[0].reserved_quantity
        ).toBe(1)
        await service.deleteReservationItems(row.id)
        expect(
          (await service.listInventoryLevels(key))[0].reserved_quantity
        ).toBe(1)
      }
    )

    it.each(["id", "line"] as const)(
      "counts concurrent and repeated %s restores once",
      async (kind) => {
        const item = await service.createInventoryItems({ sku: "restoration" })
        const key = { inventory_item_id: item.id, location_id: "location" }
        await service.createInventoryLevels({ ...key, stocked_quantity: 10 })
        const row = await service.createReservationItems({
          ...key,
          quantity: 1,
          line_item_id: "line",
        })
        await service.softDeleteReservationItems([row.id])
        const restore = (context?: Context) =>
          kind === "id"
            ? service.restoreReservationItems([row.id], undefined, context)
            : service.restoreReservationItemsByLineItem("line", context)
        expect((await compete(restore, restore)).status).toBe("fulfilled")
        const [afterConcurrent] = await service.listInventoryLevels(key)
        await restore()
        const [afterRepeated] = await service.listInventoryLevels(key)
        expect(await service.listReservationItems(key)).toHaveLength(1)
        expect([
          afterConcurrent.reserved_quantity,
          afterRepeated.reserved_quantity,
        ]).toEqual([1, 1])
      }
    )
    it("refreshes caller-owned state and rolls back its reservations", async () => {
      const item = await service.createInventoryItems({ sku: "parent" })
      const key = { inventory_item_id: item.id, location_id: "location" }
      await service.createInventoryLevels({ ...key, stocked_quantity: 2 })
      const manager = MikroOrmWrapper.forkManager()
      const context = { transactionManager: manager }
      await manager.begin()
      try {
        await service.listInventoryLevels(key, {}, context)
        await service.createReservationItems({ ...key, quantity: 1 })
        await service.createReservationItems({ ...key, quantity: 1 }, context)
        await manager.flush()
        expect(
          (await service.listInventoryLevels(key, {}, context))[0]
            .reserved_quantity
        ).toBe(2)
        await expect(
          service.createReservationItems({ ...key, quantity: 1 }, context)
        ).rejects.toThrow("Not enough stock available")
        const pending = { ...key, location_id: "pending" }
        await service.createInventoryLevels(
          { ...pending, stocked_quantity: 1 },
          context
        )
        const [{ count }] = await manager.execute(
          "select count(*)::int as count from inventory_level where location_id = ?",
          [pending.location_id]
        )
        expect(count).toBe(0)
        await service.createReservationItems(
          { ...pending, quantity: 1 },
          context
        )
        expect(
          (await service.listInventoryLevels(pending, {}, context))[0]
            .reserved_quantity
        ).toBe(1)
      } finally {
        await manager.rollback()
      }
      expect(await service.listReservationItems(key)).toHaveLength(1)
      expect(
        (await service.listInventoryLevels(key))[0].reserved_quantity
      ).toBe(1)
    })
  },
})
