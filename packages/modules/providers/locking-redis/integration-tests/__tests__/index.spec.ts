import { ILockingModule } from "@medusajs/framework/types"
import { Modules, promiseAll } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { setTimeout } from "node:timers/promises"

jest.setTimeout(5000)

const providerId = "locking-redis"
moduleIntegrationTestRunner<ILockingModule>({
  moduleName: Modules.LOCKING,
  moduleOptions: {
    providers: [
      {
        id: providerId,
        resolve: require.resolve("../../src"),
        is_default: true,
        options: {
          redisUrl: process.env.REDIS_URL ?? "redis://localhost:6379",
        },
      },
    ],
  },
  testSuite: ({ service }) => {
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

      beforeEach(async () => {
        await service.releaseAll()
      })

      it("should execute functions respecting the key locked", async () => {
        // 10 parallel calls to buy should oversell the stock
        const prom: any[] = []
        for (let i = 0; i < 10; i++) {
          prom.push(buy())
        }
        await Promise.all(prom)
        expect(stock).toBe(-5)

        replenishStock()

        // 10 parallel calls to buy with lock should not oversell the stock
        const promWLock: any[] = []
        for (let i = 0; i < 10; i++) {
          promWLock.push(service.execute("item_1", buy))
        }
        await Promise.all(promWLock)

        expect(stock).toBe(0)
      })

      it("should acquire lock and release it", async () => {
        await service.acquire("key_name", {
          ownerId: "user_id_123",
        })

        const userReleased = await service.release("key_name", {
          ownerId: "user_id_456",
        })
        const anotherUserLock = service.acquire("key_name", {
          ownerId: "user_id_456",
        })

        expect(userReleased).toBe(false)
        await expect(anotherUserLock).rejects.toThrow(
          `Failed to acquire lock for key "key_name"`
        )

        const releasing = await service.release("key_name", {
          ownerId: "user_id_123",
        })

        expect(releasing).toBe(true)
      })

      it("should acquire lock and release it during parallel calls", async () => {
        const keyToLock = "mySpecialKey"
        const user_1 = {
          ownerId: "user_id_456",
        }
        const user_2 = {
          ownerId: "user_id_000",
        }

        await expect(
          service.acquire(keyToLock, user_1)
        ).resolves.toBeUndefined()

        await expect(
          service.acquire(keyToLock, user_1)
        ).resolves.toBeUndefined()

        await expect(service.acquire(keyToLock, user_2)).rejects.toThrow(
          `Failed to acquire lock for key "${keyToLock}"`
        )

        await expect(service.acquire(keyToLock, user_2)).rejects.toThrow(
          `Failed to acquire lock for key "${keyToLock}"`
        )

        await service.acquire(keyToLock, user_1)

        const releaseNotLocked = await service.release(keyToLock, {
          ownerId: "user_id_000",
        })
        expect(releaseNotLocked).toBe(false)

        const release = await service.release(keyToLock, user_1)
        expect(release).toBe(true)
      })

      it("should fail to acquire the same key when no owner is provided", async () => {
        const keyToLock = "mySpecialKey"

        const user_2 = {
          ownerId: "user_id_000",
        }

        await expect(service.acquire(keyToLock)).resolves.toBeUndefined()

        await expect(service.acquire(keyToLock)).rejects.toThrow(
          `Failed to acquire lock for key "${keyToLock}"`
        )

        await expect(service.acquire(keyToLock)).rejects.toThrow(
          `Failed to acquire lock for key "${keyToLock}"`
        )

        await expect(service.acquire(keyToLock, user_2)).rejects.toThrow(
          `Failed to acquire lock for key "${keyToLock}"`
        )

        await expect(service.acquire(keyToLock, user_2)).rejects.toThrow(
          `Failed to acquire lock for key "${keyToLock}"`
        )

        const releaseNotLocked = await service.release(keyToLock, {
          ownerId: "user_id_000",
        })
        expect(releaseNotLocked).toBe(false)

        const release = await service.release(keyToLock)
        expect(release).toBe(true)
      })
    })

    it("should release lock in case of failure", async () => {
      const fn_1 = jest.fn(async () => {
        throw new Error("Error")
      })
      const fn_2 = jest.fn(async () => {})

      await service.execute("lock_key", fn_1).catch(() => {})
      await service.execute("lock_key", fn_2).catch(() => {})

      expect(fn_1).toHaveBeenCalledTimes(1)
      expect(fn_2).toHaveBeenCalledTimes(1)
    })

    it("should release lock in case of timeout failure", async () => {
      const fn_1 = jest.fn(async () => {
        await setTimeout(1010)
        return "fn_1"
      })

      const fn_2 = jest.fn(async () => {
        return "fn_2"
      })

      const fn_3 = jest.fn(async () => {
        return "fn_3"
      })

      const ops = [
        service
          .execute("lock_key", fn_1, {
            timeout: 1,
          })
          .catch((e) => e),

        service
          .execute("lock_key", fn_2, {
            timeout: 1,
          })
          .catch((e) => e),

        service
          .execute("lock_key", fn_3, {
            timeout: 5,
          })
          .catch((e) => e),
      ]

      const res = await promiseAll(ops)

      expect(res).toEqual(["fn_1", Error("Timed-out acquiring lock."), "fn_3"])

      expect(fn_1).toHaveBeenCalledTimes(1)
      expect(fn_2).toHaveBeenCalledTimes(0)
      expect(fn_3).toHaveBeenCalledTimes(1)
    })
  },
})
