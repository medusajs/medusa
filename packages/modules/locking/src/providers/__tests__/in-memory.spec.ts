import { InMemoryLockingProvider } from "../in-memory"

describe("InMemoryLockingProvider Multi-Key Rollback", () => {
  let provider: InMemoryLockingProvider

  beforeEach(() => {
    provider = new InMemoryLockingProvider()
  })

  it("should rollback acquired keys when a subsequent key fails to acquire", async () => {
    // Another caller acquires keyB
    await provider.acquire("keyB", { ownerId: "user_1" })

    // Caller attempts to acquire both keyA and keyB
    await expect(provider.acquire(["keyA", "keyB"])).rejects.toThrow(
      'Failed to acquire lock for key "keyB"'
    )

    // keyA must be released, so another caller can acquire keyA immediately
    await expect(
      provider.acquire("keyA", { ownerId: "user_2" })
    ).resolves.toBeUndefined()
  })

  it("should rollback acquired keys when ownerId is specified", async () => {
    await provider.acquire("keyB", { ownerId: "user_1" })

    await expect(
      provider.acquire(["keyA", "keyB"], { ownerId: "my_owner" })
    ).rejects.toThrow('Failed to acquire lock for key "keyB"')

    await expect(
      provider.acquire("keyA", { ownerId: "other_user" })
    ).resolves.toBeUndefined()
  })

  it("should release acquired keys before waiting in queue to prevent deadlocks and self-conflicts", async () => {
    await provider.acquire("keyB", { ownerId: "holder" })

    let queueAcquisitionResolved = false
    const queuedAcquisition = provider
      .acquire(["keyA", "keyB"], { awaitQueue: true })
      .then(() => {
        queueAcquisitionResolved = true
      })

    // Give microtasks a turn to run acquire_ loop
    await new Promise((resolve) => setTimeout(resolve, 20))

    // While queued on keyB, keyA should have been rolled back so another caller can acquire keyA
    await expect(
      provider.acquire("keyA", { ownerId: "temporary_user" })
    ).resolves.toBeUndefined()

    // Temporary user releases keyA
    await provider.release("keyA", { ownerId: "temporary_user" })

    // Now holder releases keyB
    await provider.release("keyB", { ownerId: "holder" })

    // The queued acquisition should now resolve cleanly without deadlock
    await expect(queuedAcquisition).resolves.toBeUndefined()
    expect(queueAcquisitionResolved).toBe(true)

    // And both keyA and keyB are held by the queued acquisition
    await expect(
      provider.acquire("keyA", { ownerId: "someone_else" })
    ).rejects.toThrow()
    await expect(
      provider.acquire("keyB", { ownerId: "someone_else" })
    ).rejects.toThrow()
  })
})
