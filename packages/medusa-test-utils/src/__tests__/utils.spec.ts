import {
  applyEnvVarsToProcess,
  formatError,
} from "../medusa-test-runner-utils/utils"

describe("applyEnvVarsToProcess", () => {
  const NEW_KEY = "MEDUSA_TEST_UTILS_NEW_ENV"
  const EXISTING_KEY = "MEDUSA_TEST_UTILS_EXISTING_ENV"

  afterEach(() => {
    delete process.env[NEW_KEY]
    delete process.env[EXISTING_KEY]
  })

  it("applies the provided env vars to process.env", () => {
    applyEnvVarsToProcess({ [NEW_KEY]: "value" })
    expect(process.env[NEW_KEY]).toBe("value")
  })

  it("restores previously unset keys by deleting them", () => {
    delete process.env[NEW_KEY]

    const restore = applyEnvVarsToProcess({ [NEW_KEY]: "value" })
    expect(process.env[NEW_KEY]).toBe("value")

    restore()
    expect(process.env[NEW_KEY]).toBeUndefined()
  })

  it("restores previously set keys to their original value", () => {
    process.env[EXISTING_KEY] = "original"

    const restore = applyEnvVarsToProcess({ [EXISTING_KEY]: "overridden" })
    expect(process.env[EXISTING_KEY]).toBe("overridden")

    restore()
    expect(process.env[EXISTING_KEY]).toBe("original")
  })

  it("is idempotent when restore runs more than once", () => {
    process.env[EXISTING_KEY] = "original"

    const restore = applyEnvVarsToProcess({ [EXISTING_KEY]: "overridden" })

    restore()
    process.env[EXISTING_KEY] = "changed-after-restore"
    restore()
    expect(process.env[EXISTING_KEY]).toBe("changed-after-restore")
  })
})

describe("formatError", () => {
  it("includes the postgres error details", () => {
    const error = Object.assign(new Error("database does not exist"), {
      code: "3D000",
      detail: "some detail",
    })

    expect(formatError(error)).toBe(
      "database does not exist\ncode: 3D000\ndetail: some detail"
    )
  })

  it("falls back to the error name when there is no message", () => {
    expect(formatError(new AggregateError([]))).toBe("AggregateError")
  })

  it("includes aggregated errors", () => {
    const error = new AggregateError([new Error("first"), new Error("second")])

    expect(formatError(error)).toBe("AggregateError\nfirst\nsecond")
  })

  it("includes the error cause", () => {
    const error = new Error("outer", { cause: new Error("inner") })

    expect(formatError(error)).toBe("outer\ncaused by: inner")
  })
})
