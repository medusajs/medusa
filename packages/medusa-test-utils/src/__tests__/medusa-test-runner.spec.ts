jest.mock("@medusajs/framework/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
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

const dbUtilsFactoryMock = jest.fn()

jest.mock("../database", () => ({
  dbTestUtilFactory: () => dbUtilsFactoryMock(),
  getDatabaseURL: () => "postgres://localhost:5432/test",
}))

import { MedusaTestRunner, MedusaSuiteOptions } from "../medusa-test-runner"

/**
 * A tiny in-memory stand-in for the PostgreSQL template snapshot/restore flow.
 * `rows` is the live database, `template` is the captured baseline.
 */
function createFakeDb() {
  const state = {
    rows: [] as string[],
    template: null as string[] | null,
  }

  const dbUtils = {
    pgConnection_: null,
    create: jest.fn(async () => void 0),
    snapshot: jest.fn(async () => {
      state.template = [...state.rows]
    }),
    restore: jest.fn(async () => {
      state.rows = [...(state.template ?? [])]
    }),
    dropTemplate: jest.fn(async () => void 0),
    teardown: jest.fn(async () => void 0),
    shutdown: jest.fn(async () => void 0),
  }

  return { state, dbUtils }
}

type FakeSuite = {
  beforeAll?: (options: MedusaSuiteOptions) => Promise<void> | void
  tests: Array<(options: MedusaSuiteOptions) => Promise<void> | void>
}

/**
 * Replays the hook order Jest uses for a runner-level describe that contains
 * sibling nested describes:
 *
 * runner.beforeAll -> A.beforeAll -> runner.beforeEach -> a1 -> runner.beforeEach
 * -> a2 -> B.beforeAll -> runner.beforeEach -> b1
 */
async function replayJestRun(runner: any, suites: FakeSuite[]) {
  await runner.beforeAll()
  const options = runner.getOptions()

  for (const suite of suites) {
    await suite.beforeAll?.(options)

    for (const test of suite.tests) {
      await runner.beforeEach()
      await test(options)
      await runner.afterEach()
    }
  }
}

function createRunner(config: any, dbUtils: any) {
  dbUtilsFactoryMock.mockReturnValue(dbUtils)

  const runner = new MedusaTestRunner(config) as any

  // The application boot is orthogonal to the baseline behaviour under test.
  runner.setupApplication = jest.fn(async () => {
    runner.globalContainer = { resolve: jest.fn() }
  })

  return runner
}

describe("medusaIntegrationTestRunner database baseline", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("with an explicit seedBaseline", () => {
    it("captures the baseline once, before any test runs", async () => {
      const { state, dbUtils } = createFakeDb()

      const seedBaseline = jest.fn(async () => {
        state.rows.push("baseline")
      })

      const runner = createRunner({ seedBaseline }, dbUtils)

      await runner.beforeAll()

      expect(seedBaseline).toHaveBeenCalledTimes(1)
      expect(dbUtils.snapshot).toHaveBeenCalledTimes(1)
      expect(state.template).toEqual(["baseline"])
    })

    it("restores the baseline before every test, including the first one", async () => {
      const { state, dbUtils } = createFakeDb()
      const seen: string[][] = []

      const runner = createRunner(
        {
          seedBaseline: async () => {
            state.rows.push("baseline")
          },
        },
        dbUtils
      )

      await replayJestRun(runner, [
        {
          tests: [
            () => {
              seen.push([...state.rows])
              state.rows.push("leaked-from-first-test")
            },
            () => {
              seen.push([...state.rows])
            },
          ],
        },
      ])

      expect(dbUtils.restore).toHaveBeenCalledTimes(2)
      expect(seen).toEqual([["baseline"], ["baseline"]])
    })

    it("does not let a sibling suite's beforeAll become the baseline", async () => {
      const { state, dbUtils } = createFakeDb()
      const seen: Record<string, string[]> = {}

      const runner = createRunner(
        {
          seedBaseline: async () => {
            state.rows.push("baseline")
          },
        },
        dbUtils
      )

      await replayJestRun(runner, [
        {
          beforeAll: () => {
            state.rows.push("record-A")
          },
          tests: [
            () => {
              seen.a1 = [...state.rows]
            },
          ],
        },
        {
          beforeAll: () => {
            state.rows.push("record-B")
          },
          tests: [
            () => {
              seen.b1 = [...state.rows]
            },
          ],
        },
      ])

      // Both suites see the same baseline. Suite A's setup never gets frozen
      // into the template, so suite B is not wiped by suite A's leftovers.
      expect(state.template).toEqual(["baseline"])
      expect(seen.a1).toEqual(["baseline"])
      expect(seen.b1).toEqual(["baseline"])
      expect(dbUtils.snapshot).toHaveBeenCalledTimes(1)
    })

    it("lets a nested suite re-freeze the baseline with freezeDatabaseBaseline", async () => {
      const { state, dbUtils } = createFakeDb()
      const seen: string[][] = []

      const runner = createRunner(
        {
          seedBaseline: async () => {
            state.rows.push("baseline")
          },
        },
        dbUtils
      )

      await replayJestRun(runner, [
        {
          beforeAll: async (options) => {
            state.rows.push("record-B")
            await options.utils.freezeDatabaseBaseline()
          },
          tests: [
            () => {
              seen.push([...state.rows])
              state.rows.push("per-test")
            },
            () => {
              seen.push([...state.rows])
            },
          ],
        },
      ])

      expect(state.template).toEqual(["baseline", "record-B"])
      expect(seen).toEqual([
        ["baseline", "record-B"],
        ["baseline", "record-B"],
      ])
    })
  })

  describe("without seedBaseline (backwards compatible default)", () => {
    it("keeps snapshotting lazily on the first beforeEach", async () => {
      const { state, dbUtils } = createFakeDb()
      const seen: string[][] = []

      const runner = createRunner({}, dbUtils)

      await replayJestRun(runner, [
        {
          beforeAll: () => {
            state.rows.push("record-A")
          },
          tests: [
            () => {
              seen.push([...state.rows])
            },
            () => {
              seen.push([...state.rows])
            },
          ],
        },
      ])

      expect(dbUtils.snapshot).toHaveBeenCalledTimes(1)
      expect(dbUtils.restore).toHaveBeenCalledTimes(1)
      expect(state.template).toEqual(["record-A"])
      expect(seen).toEqual([["record-A"], ["record-A"]])
    })

    it("still lets the first suite's beforeAll win the baseline", async () => {
      const { state, dbUtils } = createFakeDb()
      const seen: Record<string, string[]> = {}

      const runner = createRunner({}, dbUtils)

      await replayJestRun(runner, [
        {
          beforeAll: () => {
            state.rows.push("record-A")
          },
          tests: [
            () => {
              seen.a1 = [...state.rows]
            },
          ],
        },
        {
          beforeAll: () => {
            state.rows.push("record-B")
          },
          tests: [
            () => {
              seen.b1 = [...state.rows]
            },
          ],
        },
      ])

      // Documents the limitation of the default: the lazy snapshot freezes the
      // first nested suite's setup, and the restore then wipes suite B's own.
      // Suites that hit this should pass `seedBaseline` or call
      // `utils.freezeDatabaseBaseline()`.
      expect(seen.a1).toEqual(["record-A"])
      expect(seen.b1).toEqual(["record-A"])
    })
  })
})
