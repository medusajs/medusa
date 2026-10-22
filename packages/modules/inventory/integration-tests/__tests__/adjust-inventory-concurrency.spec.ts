import { Context, IInventoryService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(15000)

moduleIntegrationTestRunner<IInventoryService>({
  moduleName: Modules.INVENTORY,
  testSuite: ({ service, MikroOrmWrapper }) => {
    async function seed(stocked = 10) {
      const item = await service.createInventoryItems({
        sku: "stock-adjustment",
      })
      const key = { inventory_item_id: item.id, location_id: "location" }
      const level = await service.createInventoryLevels({
        ...key,
        stocked_quantity: stocked,
      })
      return { item, key, level }
    }

    // Commit the first real mutation only after PostgreSQL observes its waiter.
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
      { stocked: 0, first: 5, second: 5, total: 10 },
      { stocked: 10, first: -4, second: -6, total: 0 },
      { stocked: 0, first: 0.1, second: 0.2, total: 0.3 },
    ])(
      "preserves concurrent adjustments of $first and $second",
      async ({ stocked, first, second, total }) => {
        const { item, key, level } = await seed(stocked)
        const outcome = await compete(
          (context) =>
            service.adjustInventory(item.id, key.location_id, first, context),
          () => service.adjustInventory(item.id, key.location_id, second)
        )
        expect(outcome.status).toBe("fulfilled")
        const [updated] = await service.listInventoryLevels(key)
        const [stored] = await MikroOrmWrapper.forkManager().execute(
          "select raw_stocked_quantity from inventory_level where id = ?",
          [level.id]
        )
        expect(updated.stocked_quantity).toBe(total)
        expect(stored.raw_stocked_quantity.value).toBe(String(total))
      }
    )

    it("refreshes preloaded caller stock and retains its rollback", async () => {
      const { item, key } = await seed()
      const manager = MikroOrmWrapper.forkManager()
      await manager.begin()
      try {
        const context = { transactionManager: manager }
        await service.listInventoryLevels(key, {}, context)
        await service.adjustInventory(item.id, key.location_id, 5)
        const first = await service.adjustInventory(
          item.id,
          key.location_id,
          2,
          context
        )
        const second = await service.adjustInventory(
          item.id,
          key.location_id,
          3,
          context
        )
        expect([first.stocked_quantity, second.stocked_quantity]).toEqual([
          17, 20,
        ])
      } finally {
        if (manager.isInTransaction()) await manager.rollback()
      }
      expect((await service.listInventoryLevels(key))[0].stocked_quantity).toBe(
        15
      )
    })

    it("adjusts an unflushed caller level without committing it", async () => {
      const item = await service.createInventoryItems({ sku: "pending-stock" })
      const manager = MikroOrmWrapper.forkManager()
      const key = { inventory_item_id: item.id, location_id: "pending" }
      await manager.begin()
      try {
        const context = { transactionManager: manager }
        const level = await service.createInventoryLevels(
          { ...key, stocked_quantity: 2 },
          context
        )
        expect(
          await manager.execute("select id from inventory_level where id = ?", [
            level.id,
          ])
        ).toHaveLength(0)
        const updated = await service.adjustInventory(
          item.id,
          key.location_id,
          3,
          context
        )
        expect(updated.stocked_quantity).toBe(5)
      } finally {
        if (manager.isInTransaction()) await manager.rollback()
      }
      expect(await service.listInventoryLevels(key)).toHaveLength(0)
    })
  },
})
