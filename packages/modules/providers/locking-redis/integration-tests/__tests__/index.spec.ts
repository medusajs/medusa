import { ILockingModule } from "@medusajs/framework/types"
import { Modules, promiseAll } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { setTimeout } from "node:timers/promises"
import { Redis } from "ioredis"
import { RedisLockingProvider } from "../../src/services/redis-lock"

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

      it("should re-enter a lock held by the same owner when awaitQueue is set", async () => {
        await service.acquire("reentrant_key", {
          ownerId: "owner_reentry",
          expire: 10,
        })

        // Against the unfixed provider the awaitQueue branch never runs the
        // same-owner check, so this call backs off against its own lock and the
        // test dies on the jest timeout instead of resolving. That asymmetry
        // with the awaitQueue: false path above is the proof.
        await expect(
          service.acquire("reentrant_key", {
            ownerId: "owner_reentry",
            expire: 10,
            awaitQueue: true,
          })
        ).resolves.toBeUndefined()

        expect(
          await service.release("reentrant_key", { ownerId: "owner_reentry" })
        ).toBe(true)
      })

      it("should scope releaseAll to the given owner", async () => {
        await service.acquire("ra_mine", { ownerId: "owner_a", expire: 10 })
        await service.acquire("ra_theirs", { ownerId: "owner_b", expire: 10 })

        await service.releaseAll({ ownerId: "owner_a" })

        await expect(
          service.acquire("ra_mine", { ownerId: "owner_c", expire: 10 })
        ).resolves.toBeUndefined()

        await expect(
          service.acquire("ra_theirs", { ownerId: "owner_c", expire: 10 })
        ).rejects.toThrow(`Failed to acquire lock for key "ra_theirs"`)

        expect(await service.release("ra_mine", { ownerId: "owner_c" })).toBe(
          true
        )
        expect(await service.release("ra_theirs", { ownerId: "owner_b" })).toBe(
          true
        )
      })

      it("should not deadlock when two callers request the same keys in opposite orders", async () => {
        // The suite's module service serves every caller from a single ioredis
        // connection, so two callers started with Promise.all never interleave:
        // the first one queues both of its commands before the second one is
        // scheduled, takes both keys, and an argument-order implementation
        // looks safe. Each caller here therefore gets its own connection, and a
        // delay is injected before its second acquisition so both callers hold
        // their first key before either asks for its second.
        //
        // Under argument order that is the ABBA interleave: caller one holds
        // "abba_a", caller two holds "abba_b", and both then spin on the key
        // the other holds. Under the sorted order both callers target "abba_a"
        // first, so only one of them is ever in the critical section and the
        // injected delay is inconsequential.
        const redisUrl = process.env.REDIS_URL ?? "redis://localhost:6379"
        const clients: Redis[] = []

        const makeCaller = async (keys: string[], ownerId: string) => {
          // defineCommand attaches acquireLock to the instance at runtime and
          // the provider's own client type is not exported, so restate the one
          // command this test wraps.
          const client = new Redis(redisUrl, {
            lazyConnect: true,
          }) as Redis & {
            acquireLock: (
              key: string,
              ownerId: string,
              ttl: number
            ) => Promise<number>
          }
          clients.push(client)
          await client.connect()

          const provider = new RedisLockingProvider(
            { redisClient: client, prefix: "medusa_lock:" },
            {}
          )

          // Fault injection lives in the test; the provider is untouched.
          const acquireLock = client.acquireLock.bind(client)
          let calls = 0
          client.acquireLock = async (key, owner, ttl) => {
            if (++calls === 2) {
              await setTimeout(150)
            }
            return acquireLock(key, owner, ttl)
          }

          return async () => {
            await provider.acquire(keys, {
              ownerId,
              expire: 10,
              awaitQueue: true,
            })
            expect(await provider.release(keys, { ownerId })).toBe(true)
          }
        }

        try {
          const callerOne = await makeCaller(
            ["abba_a", "abba_b"],
            "owner_abba_one"
          )
          const callerTwo = await makeCaller(
            ["abba_b", "abba_a"],
            "owner_abba_two"
          )

          const settled = Promise.all([callerOne(), callerTwo()])
          // The teardown below aborts the in-flight command of a caller that is
          // still retrying; swallow that follow-up rejection.
          settled.catch(() => {})

          // awaitQueue has no overall deadline, so a deadlock here would hang
          // until the jest timeout killed the whole file. Racing a deadline
          // turns it into a readable assertion failure instead.
          const deadlocked =
            "deadlocked: both callers are still waiting on each other"
          const outcome = await Promise.race([
            settled,
            setTimeout(2000, deadlocked, { ref: false }),
          ])

          expect(outcome).not.toBe(deadlocked)
        } finally {
          // Disconnect first: it stops a still-spinning retry loop before the
          // cleanup runs, so a deadlocked run cannot leave the two keys held
          // for their whole TTL and fail the next run for the wrong reason.
          clients.forEach((client) => client.disconnect())
          await service.release(["abba_a", "abba_b"], {
            ownerId: "owner_abba_one",
          })
          await service.release(["abba_a", "abba_b"], {
            ownerId: "owner_abba_two",
          })
        }
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
