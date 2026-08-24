import { applyEnvVarsToProcess } from "../medusa-test-runner-utils/utils"

describe("applyEnvVarsToProcess", () => {
  const touched = ["MEDUSA_TEST_EXISTING", "MEDUSA_TEST_NEW"]
  let snapshot: Record<string, string | undefined>

  beforeEach(() => {
    snapshot = {}
    touched.forEach((key) => {
      snapshot[key] = process.env[key]
      delete process.env[key]
    })
  })

  afterEach(() => {
    touched.forEach((key) => {
      const value = snapshot[key]
      if (value === undefined) {
        delete process.env[key]
      } else {
        process.env[key] = value
      }
    })
  })

  it("applies the given values", () => {
    applyEnvVarsToProcess({ MEDUSA_TEST_NEW: "applied" })

    expect(process.env.MEDUSA_TEST_NEW).toBe("applied")
  })

  it("puts a pre-existing value back on restore", () => {
    process.env.MEDUSA_TEST_EXISTING = "original"

    const restore = applyEnvVarsToProcess({ MEDUSA_TEST_EXISTING: "overridden" })
    expect(process.env.MEDUSA_TEST_EXISTING).toBe("overridden")

    restore()
    expect(process.env.MEDUSA_TEST_EXISTING).toBe("original")
  })

  it("removes a key that did not exist before on restore", () => {
    const restore = applyEnvVarsToProcess({ MEDUSA_TEST_NEW: "leaked" })
    expect(process.env.MEDUSA_TEST_NEW).toBe("leaked")

    restore()
    expect("MEDUSA_TEST_NEW" in process.env).toBe(false)
  })

  it("restores an existing key and drops a new one in the same call", () => {
    process.env.MEDUSA_TEST_EXISTING = "original"

    const restore = applyEnvVarsToProcess({
      MEDUSA_TEST_EXISTING: "overridden",
      MEDUSA_TEST_NEW: "leaked",
    })

    restore()

    expect(process.env.MEDUSA_TEST_EXISTING).toBe("original")
    expect("MEDUSA_TEST_NEW" in process.env).toBe(false)
  })

  it("keeps an empty string rather than treating it as unset", () => {
    process.env.MEDUSA_TEST_EXISTING = ""

    const restore = applyEnvVarsToProcess({ MEDUSA_TEST_EXISTING: "overridden" })
    restore()

    expect(process.env.MEDUSA_TEST_EXISTING).toBe("")
    expect("MEDUSA_TEST_EXISTING" in process.env).toBe(true)
  })

  it("is a no-op when called a second time", () => {
    const restore = applyEnvVarsToProcess({ MEDUSA_TEST_NEW: "leaked" })

    restore()
    process.env.MEDUSA_TEST_NEW = "set by something else"
    restore()

    expect(process.env.MEDUSA_TEST_NEW).toBe("set by something else")
  })

  it("returns a callable when there is nothing to apply", () => {
    expect(() => applyEnvVarsToProcess()()).not.toThrow()
    expect(() => applyEnvVarsToProcess(undefined)()).not.toThrow()
  })
})
