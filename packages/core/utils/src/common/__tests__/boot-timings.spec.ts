import { timeBoot } from "../boot-timings"

describe("timeBoot", () => {
  const original = process.env.MEDUSA_LOG_BOOT_TIMINGS
  let info: jest.SpyInstance

  beforeEach(() => {
    info = jest.spyOn(console, "info").mockImplementation(() => {})
  })

  afterEach(() => {
    info.mockRestore()
    if (original === undefined) {
      delete process.env.MEDUSA_LOG_BOOT_TIMINGS
    } else {
      process.env.MEDUSA_LOG_BOOT_TIMINGS = original
    }
  })

  it("is a pass-through when timings are off", async () => {
    delete process.env.MEDUSA_LOG_BOOT_TIMINGS
    const promise = Promise.resolve("value")

    expect(timeBoot("phase", () => promise)).toBe(promise)
    await expect(promise).resolves.toBe("value")
    expect(info).not.toHaveBeenCalled()
  })

  it("returns a sync value as is when timings are off", () => {
    delete process.env.MEDUSA_LOG_BOOT_TIMINGS
    expect(timeBoot("phase", () => 42)).toBe(42)
    expect(info).not.toHaveBeenCalled()
  })

  it("logs the phase and returns the value when timings are on", async () => {
    process.env.MEDUSA_LOG_BOOT_TIMINGS = "true"

    await expect(timeBoot("phase", async () => "value")).resolves.toBe("value")

    expect(info).toHaveBeenCalledTimes(1)
    expect(info.mock.calls[0][0]).toMatch(/^\[boot\] phase: \d+ms/)
  })

  it("logs and rethrows when the phase throws and timings are on", async () => {
    process.env.MEDUSA_LOG_BOOT_TIMINGS = "true"

    await expect(
      timeBoot("failing", async () => {
        throw new Error("boom")
      })
    ).rejects.toThrow("boom")

    expect(info.mock.calls[0][0]).toMatch(/^\[boot\] failing:/)
  })
})
