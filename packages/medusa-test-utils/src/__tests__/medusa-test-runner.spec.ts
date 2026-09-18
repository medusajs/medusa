jest.mock("@medusajs/framework", () => ({
  container: {
    resolve: jest.fn(() => ({})),
    register: jest.fn(),
    hasRegistration: jest.fn(() => false),
    dispose: jest.fn().mockResolvedValue(undefined),
  },
  MedusaAppLoader: class {
    load = jest.fn().mockResolvedValue({})
  },
}))

jest.mock("@medusajs/framework/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}))

jest.mock("@medusajs/framework/migrations", () => ({
  Migrator: class {
    ensureMigrationsTable = jest.fn().mockResolvedValue(undefined)
  },
}))

jest.mock("@medusajs/framework/utils", () => ({
  ContainerRegistrationKeys: {
    CONFIG_MODULE: "configModule",
    LOGGER: "logger",
    PG_CONNECTION: "pgConnection",
  },
  getResolvedPlugins: jest.fn().mockResolvedValue([]),
  mergePluginModules: jest.fn(),
}))

jest.mock("@medusajs/framework/awilix", () => ({
  asValue: jest.fn((val) => val),
}))

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: jest.fn(() => ({})),
    CancelToken: {
      source: jest.fn(() => ({
        token: "token",
        cancel: jest.fn(),
      })),
    },
  },
}))

type MockDbUtils = {
  pgConnection_: any
  create: jest.Mock
  snapshot: jest.Mock
  restore: jest.Mock
  dropTemplate: jest.Mock
  shutdown: jest.Mock
  teardown: jest.Mock
}

const mockDbUtilsInstances: MockDbUtils[] = []

jest.mock("../database", () => ({
  getDatabaseURL: jest.fn((name) => `postgres://localhost:5432/${name}`),
  dbTestUtilFactory: jest.fn(() => {
    const instance: MockDbUtils = {
      pgConnection_: {},
      create: jest.fn().mockResolvedValue(undefined),
      snapshot: jest.fn().mockResolvedValue(undefined),
      restore: jest.fn().mockResolvedValue(undefined),
      dropTemplate: jest.fn().mockResolvedValue(undefined),
      shutdown: jest.fn().mockResolvedValue(undefined),
      teardown: jest.fn().mockResolvedValue(undefined),
    }
    mockDbUtilsInstances.push(instance)
    return instance
  }),
}))

jest.mock("../medusa-test-runner-utils", () => ({
  applyEnvVarsToProcess: jest.fn(),
  clearInstances: jest.fn().mockResolvedValue(undefined),
  closeWaitingroomClient: jest.fn().mockResolvedValue(undefined),
  configLoaderOverride: jest.fn().mockResolvedValue(undefined),
  formatError: jest.fn((e: any) => e?.message ?? String(e)),
  initDb: jest.fn().mockResolvedValue({}),
  migrateDatabase: jest.fn().mockResolvedValue(undefined),
  startApp: jest.fn().mockImplementation(async () => ({
    shutdown: jest.fn().mockResolvedValue(undefined),
    container: {
      resolve: jest.fn(() => ({})),
      register: jest.fn(),
      hasRegistration: jest.fn(() => false),
      dispose: jest.fn().mockResolvedValue(undefined),
    },
    port: 9000,
  })),
  syncLinks: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("../medusa-test-runner-utils/wait-workflow-executions", () => ({
  waitWorkflowExecutions: jest.fn().mockResolvedValue(undefined),
}))

import { medusaIntegrationTestRunner } from "../medusa-test-runner"
import { waitWorkflowExecutions } from "../medusa-test-runner-utils/wait-workflow-executions"

describe("medusaIntegrationTestRunner baseline snapshots", () => {
  describe("with explicit seedBaseline", () => {
    let capturedOptions: any = null
    const seedBaselineMock = jest.fn(async (options) => {
      capturedOptions = options
    })

    const runnerIdx = mockDbUtilsInstances.length

    medusaIntegrationTestRunner({
      seedBaseline: seedBaselineMock,
      testSuite: ({ api, getContainer, dbUtils, utils }) => {
        describe("Suite A", () => {
          it("first test in Suite A runs restore from baseline template", async () => {
            const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
            expect(seedBaselineMock).toHaveBeenCalledTimes(1)
            expect(capturedOptions).toBeDefined()
            expect(capturedOptions.api).toBeDefined()
            expect(capturedOptions.getContainer).toBeDefined()

            // Snapshot taken during beforeAll after seedBaseline
            expect(runnerDbUtils.snapshot).toHaveBeenCalledTimes(1)

            // Before the first test runs, beforeEach must have restored the baseline template
            expect(runnerDbUtils.restore).toHaveBeenCalledTimes(1)
          })

          it("second test in Suite A runs restore from baseline template", async () => {
            const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
            expect(runnerDbUtils.restore).toHaveBeenCalledTimes(2)
          })
        })

        describe("Suite B (sibling nested describe)", () => {
          it("first test in Suite B starts with fresh baseline restore without wiped state", async () => {
            const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
            // Suite B also gets the restored template from seedBaseline
            expect(runnerDbUtils.restore).toHaveBeenCalledTimes(3)
          })
        })
      },
    })
  })

  describe("with hooks.seedBaseline alias", () => {
    const hooksSeedBaselineMock = jest.fn()
    const runnerIdx = mockDbUtilsInstances.length

    medusaIntegrationTestRunner({
      hooks: {
        seedBaseline: hooksSeedBaselineMock,
      },
      testSuite: () => {
        it("invokes hooks.seedBaseline once before snapshot and restores before test", async () => {
          const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
          expect(hooksSeedBaselineMock).toHaveBeenCalledTimes(1)
          expect(runnerDbUtils.snapshot).toHaveBeenCalledTimes(1)
          expect(runnerDbUtils.restore).toHaveBeenCalledTimes(1)
        })
      },
    })
  })

  describe("with hooks.afterSetup alias", () => {
    const hooksAfterSetupMock = jest.fn()
    const runnerIdx = mockDbUtilsInstances.length

    medusaIntegrationTestRunner({
      hooks: {
        afterSetup: hooksAfterSetupMock,
      },
      testSuite: () => {
        it("invokes hooks.afterSetup once before snapshot and restores before test", async () => {
          const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
          expect(hooksAfterSetupMock).toHaveBeenCalledTimes(1)
          expect(runnerDbUtils.snapshot).toHaveBeenCalledTimes(1)
          expect(runnerDbUtils.restore).toHaveBeenCalledTimes(1)
        })
      },
    })
  })

  describe("with utils.freezeDatabaseBaseline() and dbUtils.snapshot()", () => {
    const runnerIdx = mockDbUtilsInstances.length

    medusaIntegrationTestRunner({
      testSuite: ({ utils, dbUtils }) => {
        describe("manual baseline freezing", () => {
          beforeAll(async () => {
            await utils.freezeDatabaseBaseline({ templateName: "custom-template-1" })
          })

          it("skips restore on first test after freezeDatabaseBaseline with custom template", async () => {
            const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
            // Snapshot was called in beforeAll with custom template
            expect(runnerDbUtils.snapshot).toHaveBeenCalledWith(
              expect.objectContaining({ templateName: "custom-template-1" })
            )
            expect(waitWorkflowExecutions).toHaveBeenCalled()
            // Restore was skipped for test 1
            expect(runnerDbUtils.restore).toHaveBeenCalledTimes(0)
          })

          it("restores snapshot on second test", async () => {
            const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
            expect(runnerDbUtils.restore).toHaveBeenCalledTimes(1)
          })
        })

        describe("dbUtils.snapshot delegate", () => {
          beforeAll(async () => {
            await dbUtils.snapshot({ templateName: "custom-template-2" })
          })

          it("skips restore on first test after dbUtils.snapshot with custom template", async () => {
            const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
            // Snapshot was called again in beforeAll with custom template
            expect(runnerDbUtils.snapshot).toHaveBeenCalledWith(
              expect.objectContaining({ templateName: "custom-template-2" })
            )
            // Restore was skipped for test 1 of this block (count remains 1 from previous block's test 2)
            expect(runnerDbUtils.restore).toHaveBeenCalledTimes(1)
          })

          it("restores snapshot on subsequent test", async () => {
            const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
            expect(runnerDbUtils.restore).toHaveBeenCalledTimes(2)
          })
        })
      },
    })
  })

  describe("backward-compatible fallback without seedBaseline", () => {
    const runnerIdx = mockDbUtilsInstances.length

    medusaIntegrationTestRunner({
      testSuite: () => {
        it("test 1 lazily creates snapshot on first beforeEach without restoring", async () => {
          const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
          expect(runnerDbUtils.snapshot).toHaveBeenCalledTimes(1)
          expect(runnerDbUtils.restore).toHaveBeenCalledTimes(0)
        })

        it("test 2 restores the snapshot created in test 1", async () => {
          const runnerDbUtils = mockDbUtilsInstances[runnerIdx]
          expect(runnerDbUtils.restore).toHaveBeenCalledTimes(1)
        })
      },
    })
  })
})
