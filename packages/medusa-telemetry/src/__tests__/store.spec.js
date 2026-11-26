const mockSet = jest.fn()
const mockStoredConfig = {}

jest.mock(
  "configstore",
  () => ({
    default: jest.fn().mockImplementation(() => ({
      path: "/tmp/medusa/config.json",
      get: jest.fn((key) => mockStoredConfig[key]),
      set: mockSet,
      get all() {
        return { ...mockStoredConfig }
      },
    })),
  }),
  { virtual: true }
)

import Store from "../store"

describe("Store.setConfig", () => {
  it("falls back to the in-memory store when writing the config file fails", () => {
    mockSet.mockImplementation(() => {
      throw Object.assign(new Error("EPERM: operation not permitted, chown"), {
        code: "EPERM",
      })
    })

    const store = new Store()

    expect(() => store.setConfig("telemetry.enabled", false)).not.toThrow()
    expect(store.getConfig("telemetry.enabled")).toBe(false)
  })

  it("keeps the values read from disk when falling back", () => {
    mockStoredConfig["telemetry.enabled"] = false
    mockSet.mockImplementation(() => {
      throw Object.assign(new Error("EPERM: operation not permitted, chown"), {
        code: "EPERM",
      })
    })

    const store = new Store()

    store.setConfig("star.prompted", true)
    expect(store.getConfig("telemetry.enabled")).toBe(false)
    expect(store.getConfig("star.prompted")).toBe(true)
  })
})
