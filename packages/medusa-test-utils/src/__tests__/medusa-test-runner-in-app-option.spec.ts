const mockWarn = jest.fn()

jest.mock("@medusajs/framework/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: mockWarn,
    error: jest.fn(),
  },
}))

jest.mock("@medusajs/framework/awilix", () => ({
  asValue: jest.fn(),
}))

jest.mock("@medusajs/framework/migrations", () => ({
  Migrator: jest.fn(),
}))

jest.mock("@medusajs/framework/utils", () => ({
  ContainerRegistrationKeys: {
    LOGGER: "logger",
    CONFIG_MODULE: "configModule",
  },
  getResolvedPlugins: jest.fn(),
  mergePluginModules: jest.fn(),
}))

jest.mock("../medusa-test-runner-utils", () => ({
  applyEnvVarsToProcess: jest.fn(),
  clearInstances: jest.fn(),
  closeWaitingroomClient: jest.fn(),
  configLoaderOverride: jest.fn(),
  formatError: (error: any) => String(error?.message ?? error),
  initDb: jest.fn(),
  migrateDatabase: jest.fn(),
  startApp: jest.fn(),
  syncLinks: jest.fn(),
}))

jest.mock("../medusa-test-runner-utils/wait-workflow-executions", () => ({
  waitWorkflowExecutions: jest.fn(async () => void 0),
}))

jest.mock("../database", () => ({
  dbTestUtilFactory: () => ({ pgConnection_: null }),
  getDatabaseURL: () => "postgres://localhost:5432/test",
}))

type RunnerFn =
  typeof import("../medusa-test-runner").medusaIntegrationTestRunner

/**
 * Reloads the module so the "warn only once" flag starts fresh.
 */
function loadRunner(): RunnerFn {
  jest.resetModules()
  return require("../medusa-test-runner").medusaIntegrationTestRunner
}

/**
 * `medusaIntegrationTestRunner` calls `describe`, so it can only run while Jest
 * collects the file. Every registered block holds a single skipped test: Jest
 * rejects a `beforeAll` in a block with no tests, and skips the hooks when no
 * test in the block runs. Nothing boots.
 */
function register(runner: RunnerFn, options: Record<string, any>) {
  runner({
    ...options,
    testSuite: () => {
      it.skip("never runs", () => void 0)
    },
  } as any)
}

const deprecationWarnings = () =>
  mockWarn.mock.calls.filter((call) => String(call[0]).includes("inApp"))

const observed: Record<string, { count: number; message?: string }> = {}

function record(label: string, register_: (runner: RunnerFn) => void) {
  mockWarn.mockClear()
  register_(loadRunner())

  const warnings = deprecationWarnings()
  observed[label] = {
    count: warnings.length,
    message: warnings[0]?.[0],
  }
}

record("explicitTrue", (runner) => register(runner, { inApp: true }))
record("explicitFalse", (runner) => register(runner, { inApp: false }))
record("omitted", (runner) => register(runner, {}))
record("repeated", (runner) => {
  register(runner, { inApp: true })
  register(runner, { inApp: true })
  register(runner, { inApp: true })
})

describe("medusaIntegrationTestRunner inApp option", () => {
  it("warns that inApp is deprecated when it is passed", () => {
    expect(observed.explicitTrue.count).toBe(1)
    expect(observed.explicitTrue.message).toContain("deprecated")
  })

  it("warns when inApp is passed as false, since it is still a dead option", () => {
    expect(observed.explicitFalse.count).toBe(1)
  })

  it("does not warn when inApp is omitted", () => {
    expect(observed.omitted.count).toBe(0)
  })

  it("warns only once per process", () => {
    expect(observed.repeated.count).toBe(1)
  })
})
