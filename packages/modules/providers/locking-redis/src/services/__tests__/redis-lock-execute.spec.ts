import { MedusaError } from "@medusajs/framework/utils"
import { setTimeout as delay } from "node:timers/promises"
import { RedisLockingProvider } from "../redis-lock"

// The promisified timer is only used to wait — for the acquisition timeout, and
// between acquisition retries. Neither should fire on its own here, so it hangs
// by default and each test resolves it when it wants that wait to end.
jest.mock("node:timers/promises", () => ({
  setTimeout: jest.fn(),
}))

const delayMock = delay as unknown as jest.Mock

describe("RedisLockingProvider - execute", () => {
  let provider: RedisLockingProvider

  const redisClientMock = {
    defineCommand: jest.fn(),
    acquireLock: jest.fn(),
    releaseLock: jest.fn(),
    extendLock: jest.fn(),
  }

  // Lets the pending microtasks run without moving the clock, so `execute` gets
  // past acquiring the lock and into the job.
  const settle = async () => {
    await jest.advanceTimersByTimeAsync(0)
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    delayMock.mockImplementation(() => new Promise(() => {}))
    redisClientMock.acquireLock.mockResolvedValue(1)
    redisClientMock.releaseLock.mockResolvedValue(1)
    redisClientMock.extendLock.mockResolvedValue(1)

    provider = new RedisLockingProvider(
      {
        redisClient: redisClientMock as any,
        prefix: "test:",
      },
      {} as any
    )
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("should release the lock under the same owner it acquired it with", async () => {
    const job = jest.fn(async () => "done")

    await expect(provider.execute("key", job)).resolves.toBe("done")

    expect(redisClientMock.acquireLock).toHaveBeenCalledTimes(1)

    const [key, ownerId] = redisClientMock.acquireLock.mock.calls[0]

    expect(key).toBe("test:key")
    expect(ownerId).not.toEqual("*")
    expect(redisClientMock.releaseLock).toHaveBeenCalledWith(
      "test:key",
      ownerId
    )
  })

  it("should give every call its own owner", async () => {
    await provider.execute("key", async () => {})
    await provider.execute("key", async () => {})

    const [firstOwner, secondOwner] =
      redisClientMock.acquireLock.mock.calls.map((call) => call[1])

    expect(firstOwner).not.toEqual(secondOwner)
  })

  it("should keep the lease independent of the acquisition timeout", async () => {
    await provider.execute("key", async () => {}, { timeout: 2 })

    expect(redisClientMock.acquireLock).toHaveBeenCalledWith(
      "test:key",
      expect.any(String),
      60,
      true
    )
  })

  it("should acquire the lease for the requested expiration", async () => {
    await provider.execute("key", async () => {}, { expire: 900 })

    expect(redisClientMock.acquireLock).toHaveBeenCalledWith(
      "test:key",
      expect.any(String),
      900,
      true
    )
  })

  it("should renew the lease while the job is still running", async () => {
    let finishJob: () => void
    const job = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          finishJob = resolve
        })
    )

    const executing = provider.execute("key", job, { expire: 30 })
    await settle()

    await jest.advanceTimersByTimeAsync(10_000)
    expect(redisClientMock.extendLock).toHaveBeenCalledTimes(1)

    await jest.advanceTimersByTimeAsync(10_000)
    expect(redisClientMock.extendLock).toHaveBeenCalledTimes(2)
    expect(redisClientMock.extendLock).toHaveBeenLastCalledWith(
      "test:key",
      expect.any(String),
      30
    )

    finishJob!()
    await executing

    // Nothing keeps renewing a lock that has already been released.
    await jest.advanceTimersByTimeAsync(60_000)
    expect(redisClientMock.extendLock).toHaveBeenCalledTimes(2)
  })

  it("should renew every key it locked", async () => {
    let finishJob: () => void
    const job = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          finishJob = resolve
        })
    )

    const executing = provider.execute(["key_1", "key_2"], job, { expire: 30 })
    await settle()

    await jest.advanceTimersByTimeAsync(10_000)

    expect(redisClientMock.extendLock).toHaveBeenCalledWith(
      "test:key_1",
      expect.any(String),
      30
    )
    expect(redisClientMock.extendLock).toHaveBeenCalledWith(
      "test:key_2",
      expect.any(String),
      30
    )

    finishJob!()
    await executing
  })

  it("should abort the job's signal and throw when the lease is lost", async () => {
    redisClientMock.extendLock.mockResolvedValue(0)

    let observedSignal: AbortSignal | undefined
    const job = jest.fn(async (signal?: AbortSignal) => {
      observedSignal = signal

      await new Promise<void>((resolve) => {
        signal?.addEventListener("abort", () => resolve())
      })

      return "finished anyway"
    })

    const executing = provider
      .execute("key", job, { expire: 3 })
      .catch((error) => error)

    await settle()
    await jest.advanceTimersByTimeAsync(1_000)

    const error = await executing

    expect(observedSignal?.aborted).toBe(true)
    expect(error.type).toEqual(MedusaError.Types.CONFLICT)
    expect(error.message).toContain("Lost the lock")
  })

  it("should keep the job running when a renewal cannot reach redis", async () => {
    redisClientMock.extendLock
      .mockRejectedValueOnce(new Error("Connection is closed."))
      .mockResolvedValue(1)

    let finishJob: () => void
    const job = jest.fn(
      () =>
        new Promise<string>((resolve) => {
          finishJob = () => resolve("done")
        })
    )

    const executing = provider.execute("key", job, { expire: 3 })
    await settle()

    await jest.advanceTimersByTimeAsync(1_000)
    await jest.advanceTimersByTimeAsync(1_000)

    expect(redisClientMock.extendLock).toHaveBeenCalledTimes(2)

    finishJob!()
    await expect(executing).resolves.toBe("done")
  })

  it("should release a lock that was acquired after the acquisition timed out", async () => {
    let landAcquisition: (result: number) => void
    redisClientMock.acquireLock.mockReturnValue(
      new Promise((resolve) => {
        landAcquisition = resolve
      })
    )

    // The first wait is the acquisition timeout, which this test fires by hand.
    let fireTimeout: () => void
    delayMock.mockReturnValueOnce(
      new Promise((resolve) => {
        fireTimeout = () => resolve(undefined)
      })
    )

    const job = jest.fn(async () => "unreachable")
    const executing = provider
      .execute("key", job, { timeout: 1 })
      .catch((error) => error)

    await settle()
    fireTimeout!()

    const error = await executing

    expect(error.message).toEqual("Timed-out acquiring lock.")
    expect(job).not.toHaveBeenCalled()

    // The `SET` was already in flight when the timeout fired, so the keys end
    // up locked with nobody to use them. They have to be handed back.
    landAcquisition!(1)
    await settle()

    expect(redisClientMock.releaseLock).toHaveBeenCalledWith(
      "test:key",
      expect.any(String)
    )
  })
})
