import { AuditLogDTO } from "@medusajs/framework/types"
import { AuditBuffer } from "../buffer"

const entry = (n: number): AuditLogDTO =>
  ({ id: `audlog_${n}`, action: "test" }) as AuditLogDTO

const entries = (count: number, offset = 0) =>
  Array.from({ length: count }, (_, i) => entry(i + offset))

const createLogger = () => ({ warn: jest.fn(), error: jest.fn() })

describe("AuditBuffer", () => {
  afterEach(() => {
    jest.useRealTimers()
  })

  it("writes once the buffer reaches max size, in batches of max size", async () => {
    const write = jest.fn().mockResolvedValue(undefined)
    const buffer = new AuditBuffer({
      write,
      logger: createLogger(),
      maxSize: 2,
    })

    buffer.push(entries(1))
    expect(write).not.toHaveBeenCalled()

    buffer.push(entries(2, 1))
    await buffer.flush()

    expect(write.mock.calls.map(([batch]) => batch.length)).toEqual([2, 1])
    expect(buffer.size).toBe(0)
    buffer.stop()
  })

  it("writes pending entries when the flush interval elapses", async () => {
    jest.useFakeTimers()
    const write = jest.fn().mockResolvedValue(undefined)
    const buffer = new AuditBuffer({
      write,
      logger: createLogger(),
      flushIntervalMs: 500,
    })

    buffer.push(entries(3))
    jest.advanceTimersByTime(499)
    expect(write).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    await buffer.flush()

    expect(write).toHaveBeenCalledTimes(1)
    expect(write.mock.calls[0][0]).toHaveLength(3)
  })

  it("does not keep the process alive with its timer", () => {
    const write = jest.fn().mockResolvedValue(undefined)
    const buffer = new AuditBuffer({ write, logger: createLogger() })

    buffer.push(entries(1))

    expect((buffer as any).timer_.hasRef()).toBe(false)
    buffer.stop()
  })

  it("drops the oldest entries and warns with the count when over the cap", async () => {
    const logger = createLogger()
    const write = jest.fn().mockResolvedValue(undefined)
    const buffer = new AuditBuffer({
      write,
      logger,
      maxSize: 10,
      maxBuffered: 10,
    })
    // Hold the first drain open so later pushes pile up.
    let release!: () => void
    write.mockImplementationOnce(
      () => new Promise<void>((resolve) => (release = resolve))
    )

    buffer.push(entries(10))
    buffer.push(entries(12, 10))

    expect(buffer.size).toBe(10)
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining("dropped the 2 oldest")
    )

    release()
    await buffer.flush()

    const written = write.mock.calls.flatMap(([batch]) =>
      batch.map((e: AuditLogDTO) => e.id)
    )
    expect(written).toEqual([
      ...entries(10).map((e) => e.id),
      ...entries(10, 12).map((e) => e.id),
    ])
  })

  it("retries a failed write, then succeeds", async () => {
    const logger = createLogger()
    const write = jest
      .fn()
      .mockRejectedValueOnce(new Error("down"))
      .mockResolvedValueOnce(undefined)
    const buffer = new AuditBuffer({ write, logger, retryDelayMs: 0 })

    buffer.push(entries(2))
    await buffer.flush()

    expect(write).toHaveBeenCalledTimes(2)
    expect(logger.error).not.toHaveBeenCalled()
  })

  it("drops a batch after the last attempt and logs only the count and reason", async () => {
    const logger = createLogger()
    const write = jest.fn().mockRejectedValue(new Error("connection refused"))
    const buffer = new AuditBuffer({
      write,
      logger,
      retryDelayMs: 0,
      writeAttempts: 3,
    })

    buffer.push([{ ...entry(1), actor_id: "user_secret" }])
    await expect(buffer.flush()).resolves.toBeUndefined()

    expect(write).toHaveBeenCalledTimes(3)
    expect(buffer.size).toBe(0)
    expect(logger.error).toHaveBeenCalledTimes(1)

    const message = logger.error.mock.calls[0][0]
    expect(message).toContain("dropped 1 audit log(s)")
    expect(message).toContain("connection refused")
    expect(message).not.toContain("user_secret")
  })

  it("shares one drain between concurrent flushes and picks up entries pushed meanwhile", async () => {
    let release!: () => void
    const write = jest
      .fn()
      .mockImplementationOnce(
        () => new Promise<void>((resolve) => (release = resolve))
      )
      .mockResolvedValue(undefined)
    const buffer = new AuditBuffer({ write, logger: createLogger() })

    buffer.push(entries(1))
    const first = buffer.flush()
    buffer.push(entries(1, 1))
    const second = buffer.flush()

    expect(first).toBe(second)
    release()
    await second

    expect(write).toHaveBeenCalledTimes(2)
    expect(buffer.size).toBe(0)
  })
})
