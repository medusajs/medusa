import { Modules } from "@medusajs/modules-sdk"
import { ILockingModuleService } from "@medusajs/types"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"
import { setTimeout } from "timers/promises"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.LOCKING,
  testSuite: ({ service }: SuiteOptions<ILockingModuleService>) => {
    describe("Locking Module Service", () => {
      let stock = 5
      function replenishStock() {
        stock = 5
      }
      function hasStock() {
        return stock > 0
      }
      async function reduceStock() {
        await setTimeout(10)
        stock--
      }
      async function buy() {
        if (hasStock()) {
          await reduceStock()
          return true
        }
        return false
      }

      it("should execute functions respecint the key locked", async () => {
        // 10 parallel calls to buy should oversell the stock
        const prom: any[] = []
        for (let i = 0; i < 10; i++) {
          prom.push(buy())
        }
        await Promise.all(prom)
        expect(stock).toBe(-5)

        replenishStock()

        // 10 parallel calls to buy should with lock should not oversell the stock
        const promWLock: any[] = []
        for (let i = 0; i < 10; i++) {
          promWLock.push(service.execute("item_1", buy))
        }
        await Promise.all(promWLock)

        expect(stock).toBe(0)
      })

      it("should acquire lock and release it", async () => {
        await service.acquire("key_name", "user_id_123")

        const userReleased = await service.release("key_name", "user_id_456")
        const anotherUserLock = service.acquire("key_name", "user_id_456")

        expect(userReleased).toBe(false)
        await expect(anotherUserLock).rejects.toThrowError(
          `"key_name" is already locked.`
        )

        const releasing = await service.release("key_name", "user_id_123")

        expect(releasing).toBe(true)
      })

      it("should acquire lock and release it during parallel calls", async () => {
        const keyToLock = "mySpecialKey"
        const user_1 = "user_id_456"
        const user_2 = "user_id_000"

        expect(service.acquire(keyToLock, user_1)).resolves.toBeUndefined()

        expect(service.acquire(keyToLock, user_1)).resolves.toBeUndefined()

        expect(service.acquire(keyToLock, user_2)).rejects.toThrowError(
          `"${keyToLock}" is already locked.`
        )

        expect(service.acquire(keyToLock, user_2)).rejects.toThrowError(
          `"${keyToLock}" is already locked.`
        )

        await service.acquire(keyToLock, user_1)

        const releaseNotLocked = await service.release(keyToLock, "user_id_000")
        expect(releaseNotLocked).toBe(false)

        const release = await service.release(keyToLock, user_1)
        expect(release).toBe(true)
      })
    })
  },
})
