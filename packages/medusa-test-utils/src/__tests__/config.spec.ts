const loadConfig = jest.fn()
const configModule: any = { projectConfig: {}, admin: {} }

jest.mock("@medusajs/framework/utils", () => ({
  FeatureFlag: {},
  discoverAndRegisterFeatureFlags: jest.fn(),
  getConfigFile: jest.fn(() => ({ configModule, error: null })),
}))

jest.mock("@medusajs/framework/config", () => ({
  configManager: { loadConfig },
}))

jest.mock("@medusajs/framework", () => ({
  logger: { info: jest.fn(), error: jest.fn() },
}))

import { configLoaderOverride } from "../medusa-test-runner-utils/config"

describe("configLoaderOverride", () => {
  beforeEach(() => {
    configModule.projectConfig = {}
    configModule.admin = {}
    loadConfig.mockClear()
  })

  it("applies the schema override to the project config", async () => {
    await configLoaderOverride("/entry", {
      clientUrl: "postgres://localhost:5432/medusa-test",
      schema: "tests",
    })

    expect(configModule.projectConfig.databaseSchema).toBe("tests")
  })

  it("leaves the schema untouched when no override is provided", async () => {
    await configLoaderOverride("/entry", {
      clientUrl: "postgres://localhost:5432/medusa-test",
    })

    expect(configModule.projectConfig.databaseSchema).toBeUndefined()
  })
})
