import { setTimeout as sleep } from "node:timers/promises"
import { InMemoryLockingProvider } from "../in-memory"

jest.setTimeout(10000)

describe("InMemoryLockingProvider", () => {
  let provider: InMemoryLockingProvider

  beforeEach(() => {
    provider = new InMemoryLockingProvider()
  })

  describe("acquiring several keys", () => {
    it("runs the job as soon as the key it waited on is released", async () => {
      // "B" is held for a moment; a caller needing "A" and "B" has to wait on
      // "B", then carry on with the "A" it already holds.
      const holder = provider.execute(["B"], async () => {
        await sleep(100)
        return "held"
      })

      const started = Date.now()
      const second = provider.execute(["A", "B"], async () => "ran", {
        timeout: 5,
      })

      await expect(second).resolves.toBe("ran")
      expect(Date.now() - started).toBeLessThan(1000)
      await expect(holder).resolves.toBe("held")
    })

    it("resumes from the key it waited on when no owner id is given", async () => {
      await provider.acquire("B", { ownerId: "someone-else" })

      const waiting = provider.acquire(["A", "B"], { awaitQueue: true })
      await sleep(50)
      await provider.release("B", { ownerId: "someone-else" })

      await expect(waiting).resolves.toBeUndefined()

      // Both keys are now held by the ownerless caller.
      await expect(provider.acquire("A")).rejects.toThrow(
        `Failed to acquire lock for key "A"`
      )
      await expect(provider.acquire("B")).rejects.toThrow(
        `Failed to acquire lock for key "B"`
      )
    })

    it("takes a key named twice in one call once", async () => {
      await expect(
        provider.acquire(["A", "A"], { awaitQueue: true })
      ).resolves.toBeUndefined()
      await expect(provider.release("A")).resolves.toBe(true)
    })

    it("does not deadlock two callers that want the same keys in opposite orders", async () => {
      // Someone holds "B". Y (B then A) queues on it first; X (A then B) takes
      // "A" and queues on it second. Once "B" is released, X and Y would each
      // hold one key and wait on the other's, unless keys are taken in a fixed
      // order.
      const holder = provider.execute(["B"], async () => {
        await sleep(50)
        return "held"
      })
      const y = provider.execute(["B", "A"], async () => "y", { timeout: 2 })
      await sleep(5)
      const x = provider.execute(["A", "B"], async () => "x", { timeout: 2 })

      const started = Date.now()
      await expect(Promise.all([x, y])).resolves.toEqual(["x", "y"])
      expect(Date.now() - started).toBeLessThan(1000)
      await expect(holder).resolves.toBe("held")
    })
  })

  describe("timing out", () => {
    it("gives back the keys it had already taken", async () => {
      // "B" is held for longer than the waiter's timeout. The waiter takes "A",
      // waits on "B", and times out. "A" must be free straight away, not once
      // "B" is released.
      const holder = provider.execute(["B"], async () => {
        await sleep(1500)
        return "held"
      })

      const waiter = provider.execute(["A", "B"], async () => "ran", {
        timeout: 1,
      })
      await expect(waiter).rejects.toThrow("Timed-out acquiring lock.")

      const started = Date.now()
      await expect(
        provider.execute(["A"], async () => "got A", { timeout: 2 })
      ).resolves.toBe("got A")
      expect(Date.now() - started).toBeLessThan(200)

      await expect(holder).resolves.toBe("held")
    })

    it("does not take the keys later, once the key it waited on is released", async () => {
      const holder = provider.execute(["B"], async () => {
        await sleep(1200)
        return "held"
      })

      await expect(
        provider.execute(["A", "B"], async () => "ran", { timeout: 1 })
      ).rejects.toThrow("Timed-out acquiring lock.")
      await expect(holder).resolves.toBe("held")

      // Nothing lingers from the timed-out call.
      await expect(provider.acquire(["A", "B"])).resolves.toBeUndefined()
    })
  })
})
