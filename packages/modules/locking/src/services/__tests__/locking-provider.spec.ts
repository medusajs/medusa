import LockingProviderService from "../locking-provider"

describe("LockingProviderService", () => {
  const logger = { error: jest.fn() } as any

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shuts down every registered provider that supports it", async () => {
    const shutdownA = jest.fn().mockResolvedValue(undefined)
    const shutdownB = jest.fn().mockResolvedValue(undefined)

    const service = new LockingProviderService({
      logger,
      lp_a: { shutdown: shutdownA },
      lp_b: { shutdown: shutdownB },
    } as any)

    await service.shutdown()

    expect(shutdownA).toHaveBeenCalledTimes(1)
    expect(shutdownB).toHaveBeenCalledTimes(1)
  })

  it("skips providers without a shutdown method", async () => {
    const service = new LockingProviderService({
      logger,
      lp_in_memory: {},
    } as any)

    await expect(service.shutdown()).resolves.toBeUndefined()
  })

  it("keeps shutting down the other providers when one fails", async () => {
    const shutdownB = jest.fn().mockResolvedValue(undefined)

    const service = new LockingProviderService({
      logger,
      lp_a: { shutdown: jest.fn().mockRejectedValue(new Error("boom")) },
      lp_b: { shutdown: shutdownB },
    } as any)

    await service.shutdown()

    expect(shutdownB).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledWith(expect.stringContaining("boom"))
  })
})
