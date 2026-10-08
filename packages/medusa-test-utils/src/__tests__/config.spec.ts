const loadConfigMock = jest.fn()
const getConfigFileMock = jest.fn()

jest.mock("@medusajs/framework/config", () => ({
  configManager: {
    loadConfig: (...args: unknown[]) => loadConfigMock(...args),
  },
}))

jest.mock("@medusajs/framework", () => ({
  logger: { info: jest.fn() },
}))

jest.mock("@medusajs/framework/utils", () => ({
  FeatureFlag: {},
  discoverAndRegisterFeatureFlags: jest.fn().mockResolvedValue(undefined),
  getConfigFile: (...args: unknown[]) => getConfigFileMock(...args),
}))

import { configLoaderOverride } from "../medusa-test-runner-utils/config"

describe("configLoaderOverride", () => {
  const clientUrl = "postgres://localhost:5432/medusa-test"

  const loadedProjectConfig = async (
    override: Parameters<typeof configLoaderOverride>[1],
    projectConfig: Record<string, unknown> = {}
  ) => {
    getConfigFileMock.mockResolvedValue({
      configModule: { projectConfig: { ...projectConfig }, admin: {} },
    })

    await configLoaderOverride("/project", override)

    return loadConfigMock.mock.calls.at(-1)![0].projectConfig.projectConfig
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should apply the database url and logging flag", async () => {
    const projectConfig = await loadedProjectConfig({ clientUrl, debug: true })

    expect(projectConfig.databaseUrl).toBe(clientUrl)
    expect(projectConfig.databaseLogging).toBe(true)
  })

  it("should apply a custom schema to the project config", async () => {
    const projectConfig = await loadedProjectConfig({
      clientUrl,
      schema: "custom",
    })

    expect(projectConfig.databaseSchema).toBe("custom")
  })

  it("should keep the configured schema when the runner uses the default one", async () => {
    const projectConfig = await loadedProjectConfig(
      { clientUrl, schema: "public" },
      { databaseSchema: "from-config" }
    )

    expect(projectConfig.databaseSchema).toBe("from-config")
  })
})
