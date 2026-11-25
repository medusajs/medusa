const mockSet = jest.fn()

jest.mock(
  "configstore",
  () => ({
    default: jest.fn().mockImplementation(() => ({
      path: "/tmp/medusa/config.json",
      get: jest.fn(),
      set: mockSet,
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
})
