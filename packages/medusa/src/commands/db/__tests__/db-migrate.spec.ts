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
}))

jest.mock("../../utils", () => ({
  ensureDbExists: jest.fn().mockResolvedValue(undefined),
  isPgstreamEnabled: jest.fn().mockResolvedValue(false),
}))

jest.mock("../sync-links", () => ({
  syncLinks: jest.fn().mockResolvedValue(undefined),
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
  executeAllLinks: false,
  executeSafeLinks: false,
  concurrency: undefined,
  allOrNothing: false,
}

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
