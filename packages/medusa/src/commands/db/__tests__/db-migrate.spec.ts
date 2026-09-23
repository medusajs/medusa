import { MedusaContainer } from "@medusajs/types"
import { initializeContainer } from "../../../loaders"
import main from "../migrate"

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("../../../loaders", () => ({
  initializeContainer: jest.fn(),
}))

jest.mock("@medusajs/framework", () => ({
  MEDUSA_CLI_PATH: "/mock/cli",
  MedusaAppLoader: jest.fn().mockImplementation(() => ({
    runModulesMigrations: jest.fn().mockResolvedValue(undefined),
  })),
  Migrator: jest.fn().mockImplementation(() => ({
    ensureMigrationsTable: jest.fn().mockResolvedValue(undefined),
  })),
}))

jest.mock("@medusajs/framework/links", () => ({
  LinkLoader: jest.fn().mockImplementation(() => ({
    load: jest.fn().mockResolvedValue(undefined),
  })),
}))

jest.mock("@medusajs/framework/utils", () => ({
  ContainerRegistrationKeys: {
    LOGGER: "logger",
    CONFIG_MODULE: "configModule",
  },
  getResolvedPlugins: jest.fn().mockResolvedValue([]),
  mergePluginModules: jest.fn(),
  isDefined: jest.fn().mockReturnValue(false),
  Modules: { SEARCH: "search" },
}))

jest.mock("../../utils", () => ({
  ensureDbExists: jest.fn().mockResolvedValue(undefined),
  isPgstreamEnabled: jest.fn().mockResolvedValue(false),
}))

jest.mock("../sync-links", () => ({
  syncLinks: jest.fn().mockResolvedValue(undefined),
}))

jest.mock("../../../loaders/search", () => ({
  isSearchModuleEnabled: jest.fn().mockReturnValue(true),
}))

jest.mock("child_process", () => ({
  fork: jest.fn(),
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildContainer(
  overrides: Record<string, unknown> = {}
): MedusaContainer {
  const store: Record<string, unknown> = {
    logger: { info: jest.fn(), error: jest.fn(), log: jest.fn() },
    configModule: { modules: {}, plugins: [] },
    ...overrides,
  }

  return {
    resolve: jest.fn((key: string) => {
      if (key in store) return store[key]
      throw new Error(`[mock container] Nothing registered for key: ${key}`)
    }),
  } as unknown as MedusaContainer
}

const defaultArgs = {
  directory: "/app",
  skipLinks: true,
  skipScripts: true,
  skipSearch: true,
  executeAllLinks: false,
  executeSafeLinks: false,
  executeAllSearch: false,
  executeSafeSearch: false,
  concurrency: undefined,
  allOrNothing: false,
}

/** Stands in for the forked CLI child, exiting with the given code. */
function mockFork(exitCode = 0) {
  const { fork } = require("child_process")

  ;(fork as jest.Mock).mockImplementation(() => ({
    on: (event: string, handler: (code?: number) => void) => {
      if (event === "close") {
        setImmediate(() => handler(exitCode))
      }
    },
  }))

  return fork as jest.Mock
}

/** The arguments the child was forked with, minus the CLI path. */
const forkedWith = (fork: jest.Mock) =>
  fork.mock.calls.map(([, args]) => args)

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("db:migrate – main", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest
      .spyOn(process, "exit")
      .mockImplementation((code?: string | number | null) => {
        return code as never
      })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe("container initialization failure", () => {
    it("exits with code 1 when initializeContainer throws", async () => {
      ;(initializeContainer as jest.Mock).mockRejectedValue(
        new Error("DB connection refused")
      )

      await main(defaultArgs)

      expect(process.exit).toHaveBeenCalledWith(1)
    })

    it("does not exit with code 0 when initializeContainer throws", async () => {
      ;(initializeContainer as jest.Mock).mockRejectedValue(
        new Error("DB connection refused")
      )

      await main(defaultArgs)

      expect(process.exit).not.toHaveBeenCalledWith(0)
    })

    it("falls back to console.error when logger is not yet initialized", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})
      const err = new Error("DB connection refused")
      ;(initializeContainer as jest.Mock).mockRejectedValue(err)

      await main(defaultArgs)

      expect(consoleSpy).toHaveBeenCalledWith(err)
    })
  })

  describe("search index flags", () => {
    beforeEach(() => {
      ;(initializeContainer as jest.Mock).mockResolvedValue(buildContainer())
    })

    it("forwards --execute-all-search to the search command", async () => {
      const fork = mockFork()

      await main({
        ...defaultArgs,
        skipSearch: false,
        executeAllSearch: true,
      })

      expect(forkedWith(fork)).toContainEqual([
        "db:migrate:search",
        "--execute-all-search",
      ])
    })

    it("forwards --execute-safe-search to the search command", async () => {
      const fork = mockFork()

      await main({
        ...defaultArgs,
        skipSearch: false,
        executeSafeSearch: true,
      })

      expect(forkedWith(fork)).toContainEqual([
        "db:migrate:search",
        "--execute-safe-search",
      ])
    })

    it("passes no flag when neither was given, so the command prompts", async () => {
      const fork = mockFork()

      await main({ ...defaultArgs, skipSearch: false })

      expect(forkedWith(fork)).toContainEqual(["db:migrate:search"])
    })

    it("fails the migration when the search command exits non-zero", async () => {
      mockFork(1)

      await main({ ...defaultArgs, skipSearch: false })

      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })

  describe("successful migration", () => {
    it("exits with code 0 when migration completes", async () => {
      ;(initializeContainer as jest.Mock).mockResolvedValue(buildContainer())

      await main(defaultArgs)

      expect(process.exit).toHaveBeenCalledWith(0)
    })

    it("uses the resolved logger to report migration-phase errors", async () => {
      const mockLogger = { info: jest.fn(), error: jest.fn(), log: jest.fn() }
      ;(initializeContainer as jest.Mock).mockResolvedValue(
        buildContainer({ logger: mockLogger })
      )

      const { MedusaAppLoader } = require("@medusajs/framework")
      const migrationError = new Error("migration failed")
      MedusaAppLoader.mockImplementation(() => ({
        runModulesMigrations: jest.fn().mockRejectedValue(migrationError),
      }))

      await main(defaultArgs)

      expect(mockLogger.error).toHaveBeenCalledWith(migrationError)
      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })
})
