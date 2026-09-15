import { rateLimitDelay, retryOnRateLimit } from "../rate-limit"

// Cloud answers a rate limit with 429 and a `Retry-After`; a zero wait keeps
// these tests from sitting through the backoff.
const rateLimited = () =>
  Object.assign(new Error("Too many requests"), {
    status: 429,
    retry_after: 0,
  })

describe("rateLimitDelay", () => {
  it("should double the wait per attempt, up to a ceiling", () => {
    const delays = [0, 1, 2, 3, 4, 5, 6].map((attempt) =>
      rateLimitDelay(attempt, undefined, () => 1)
    )

    expect(delays).toEqual([
      2_000, 4_000, 8_000, 16_000, 32_000, 60_000, 60_000,
    ])
    // Jittered across the lower half of each window.
    expect(rateLimitDelay(0, undefined, () => 0)).toBe(1_000)
  })

  it("should prefer the wait Cloud asked for, capped", () => {
    expect(rateLimitDelay(0, 12_345)).toBe(12_345)
    expect(rateLimitDelay(0, 60 * 60 * 1000)).toBe(60_000)
  })
})

describe("retryOnRateLimit", () => {
  it("should wait out a rate limit and return the eventual result", async () => {
    const operation = jest
      .fn()
      .mockRejectedValueOnce(rateLimited())
      .mockRejectedValueOnce(rateLimited())
      .mockResolvedValue("indexed")

    await expect(
      retryOnRateLimit(operation, { label: "a write" })
    ).resolves.toBe("indexed")

    expect(operation).toHaveBeenCalledTimes(3)
  })

  it("should not retry anything that is not a rate limit", async () => {
    const operation = jest.fn().mockRejectedValue(new Error("bad schema"))

    await expect(
      retryOnRateLimit(operation, { label: "a write" })
    ).rejects.toThrow("bad schema")

    expect(operation).toHaveBeenCalledTimes(1)
  })
})
