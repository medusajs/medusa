import { applyEnvVarsToProcess } from "../medusa-test-runner-utils/utils"

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
