import { MedusaAppLoader } from "@medusajs/framework"
import { LinkLoader } from "@medusajs/framework/links"
import { MigrationScriptsMigrator } from "@medusajs/framework/migrations"
import { MedusaModule } from "@medusajs/framework/modules-sdk"
import {
  ContainerRegistrationKeys,
  getResolvedPlugins,
} from "@medusajs/framework/utils"
import { WorkflowLoader } from "@medusajs/framework/workflows"
import { MedusaContainer } from "@medusajs/types"
import { runMigrationScripts } from "../db/run-scripts"

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock("@medusajs/framework", () => ({
  MedusaAppLoader: jest.fn(),
}))

jest.mock("@medusajs/framework/links", () => ({
  LinkLoader: jest.fn(),
}))

jest.mock("@medusajs/framework/workflows", () => ({
  WorkflowLoader: jest.fn(),
}))

jest.mock("@medusajs/framework/migrations", () => ({
  MigrationScriptsMigrator: jest.fn(),
}))

jest.mock("@medusajs/framework/modules-sdk", () => ({
  MedusaModule: {
    clearInstances: jest.fn(),
  },
}))

jest.mock("@medusajs/framework/utils", () => ({
  ContainerRegistrationKeys: {
    CONFIG_MODULE: "configModule",
    QUERY: "query",
    LOGGER: "logger",
    PG_CONNECTION: "pgConnection",
  },
  getResolvedPlugins: jest.fn(),
  mergePluginModules: jest.fn(),
  PolicyOperation: {},
}))

jest.mock("../utils", () => ({
  ensureDbExists: jest.fn(),
}))

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mockQuery = { graph: jest.fn() }

function buildContainer(
  overrides: Record<string, unknown> = {}
): MedusaContainer {
  const store: Record<string, unknown> = {
    configModule: { modules: {}, plugins: [] },
    query: mockQuery,
    logger: { info: jest.fn(), log: jest.fn(), error: jest.fn() },
    pgConnection: {},
    ...overrides,
  }

  return {
    resolve: jest.fn((key: string) => {
      if (key in store) return store[key]
      throw new Error(`[mock container] Nothing registered for key: ${key}`)
    }),
    register: jest.fn(),
  } as unknown as MedusaContainer
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("runMigrationScripts", () => {
  const mockLogger = { info: jest.fn(), log: jest.fn(), error: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()

    // Default: no plugins
    ;(getResolvedPlugins as jest.Mock).mockResolvedValue([])

    // LinkLoader mock
    ;(LinkLoader as jest.Mock).mockImplementation(() => ({
      load: jest.fn().mockResolvedValue(undefined),
    }))

    // MedusaAppLoader mock — captures the options it was called with
    ;(MedusaAppLoader as jest.Mock).mockImplementation((opts) => ({
      _opts: opts,
      load: jest.fn().mockResolvedValue({
        onApplicationPrepareShutdown: jest.fn().mockResolvedValue(undefined),
        onApplicationShutdown: jest.fn().mockResolvedValue(undefined),
        onApplicationStart: jest.fn().mockResolvedValue(undefined),
      }),
    }))

    // MigrationScriptsMigrator mock — no pending scripts by default
    ;(MigrationScriptsMigrator as jest.Mock).mockImplementation(() => ({
      ensureMigrationsTable: jest.fn().mockResolvedValue(undefined),
      getPendingMigrations: jest.fn().mockResolvedValue([]),
      run: jest.fn().mockResolvedValue(undefined),
    }))

    // WorkflowLoader mock
    ;(WorkflowLoader as jest.Mock).mockImplementation(() => ({
      load: jest.fn().mockResolvedValue(undefined),
    }))
  })

  describe("container forwarding to MedusaAppLoader", () => {
    it("passes the caller's container to MedusaAppLoader so QUERY is resolved from the same DI scope", async () => {
      const container = buildContainer()

      await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      // MedusaAppLoader must have been constructed with the same container
      expect(MedusaAppLoader).toHaveBeenCalledTimes(1)
      const [ctorOptions] = (MedusaAppLoader as jest.Mock).mock.calls[0]
      expect(ctorOptions).toHaveProperty("container", container)
    })

    it("does NOT create MedusaAppLoader with an undefined container", async () => {
      const container = buildContainer()

      await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      const [ctorOptions] = (MedusaAppLoader as jest.Mock).mock.calls[0]
      expect(ctorOptions.container).not.toBeUndefined()
    })

    it("allows migration scripts to resolve `query` from the forwarded container", async () => {
      const container = buildContainer()

      await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      // The container should be capable of resolving `query` without throwing
      expect(() =>
        (container as any).resolve(ContainerRegistrationKeys.QUERY)
      ).not.toThrow()

      const result = (container as any).resolve(ContainerRegistrationKeys.QUERY)
      expect(result).toBe(mockQuery)
    })
  })

  describe("happy path", () => {
    it("returns true when there are no pending migration scripts", async () => {
      const container = buildContainer()

      const result = await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      expect(result).toBe(true)
      expect(mockLogger.info).toHaveBeenCalledWith(
        "No pending migration scripts to execute"
      )
    })

    it("runs pending scripts and returns true", async () => {
      const container = buildContainer()

      const mockMigratorInstance = {
        ensureMigrationsTable: jest.fn().mockResolvedValue(undefined),
        getPendingMigrations: jest
          .fn()
          .mockResolvedValue(["script-001.ts", "script-002.ts"]),
        run: jest.fn().mockResolvedValue(undefined),
      }
      ;(MigrationScriptsMigrator as jest.Mock).mockImplementation(
        () => mockMigratorInstance
      )

      const result = await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      expect(result).toBe(true)
      expect(mockMigratorInstance.run).toHaveBeenCalledTimes(1)
    })

    it("calls onApplicationPrepareShutdown and onApplicationShutdown in finally block", async () => {
      const container = buildContainer()

      const onApplicationPrepareShutdown = jest.fn().mockResolvedValue(undefined)
      const onApplicationShutdown = jest.fn().mockResolvedValue(undefined)

      ;(MedusaAppLoader as jest.Mock).mockImplementation(() => ({
        load: jest.fn().mockResolvedValue({
          onApplicationPrepareShutdown,
          onApplicationShutdown,
          onApplicationStart: jest.fn().mockResolvedValue(undefined),
        }),
      }))

      await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      expect(onApplicationPrepareShutdown).toHaveBeenCalledTimes(1)
      expect(onApplicationShutdown).toHaveBeenCalledTimes(1)
    })
  })

  describe("MedusaModule cleanup", () => {
    it("clears module instances before loading resources", async () => {
      const container = buildContainer()

      await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      expect(MedusaModule.clearInstances).toHaveBeenCalledTimes(1)
    })
  })

  describe("WorkflowLoader", () => {
    it("instantiates WorkflowLoader with the resolved plugin workflow paths", async () => {
      const plugins = [
        { resolve: "/app" },
        { resolve: "/plugins/my-plugin" },
      ]
      ;(getResolvedPlugins as jest.Mock).mockResolvedValue(plugins)

      const container = buildContainer()

      await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      expect(WorkflowLoader).toHaveBeenCalledTimes(1)
      const [paths, resolvedContainer] = (WorkflowLoader as jest.Mock).mock
        .calls[0]
      expect(paths).toEqual(["/app/workflows", "/plugins/my-plugin/workflows"])
      expect(resolvedContainer).toBe(container)
    })

    it("calls WorkflowLoader.load() to register workflow hooks", async () => {
      const container = buildContainer()
      const mockLoad = jest.fn().mockResolvedValue(undefined)
      ;(WorkflowLoader as jest.Mock).mockImplementation(() => ({
        load: mockLoad,
      }))

      await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      expect(mockLoad).toHaveBeenCalledTimes(1)
    })

    it("loads WorkflowLoader after MedusaAppLoader so module registrations are available", async () => {
      const callOrder: string[] = []

      ;(MedusaAppLoader as jest.Mock).mockImplementation(() => ({
        load: jest.fn().mockImplementation(async () => {
          callOrder.push("MedusaAppLoader.load")
          return {
            onApplicationPrepareShutdown: jest.fn().mockResolvedValue(undefined),
            onApplicationShutdown: jest.fn().mockResolvedValue(undefined),
            onApplicationStart: jest.fn().mockImplementation(async () => {
              callOrder.push("onApplicationStart")
            }),
          }
        }),
      }))

      ;(WorkflowLoader as jest.Mock).mockImplementation(() => ({
        load: jest.fn().mockImplementation(async () => {
          callOrder.push("WorkflowLoader.load")
        }),
      }))

      const container = buildContainer()

      await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      const appStartIdx = callOrder.indexOf("onApplicationStart")
      const wfLoaderIdx = callOrder.indexOf("WorkflowLoader.load")
      expect(appStartIdx).toBeGreaterThanOrEqual(0)
      expect(wfLoaderIdx).toBeGreaterThan(appStartIdx)
    })

    it("produces no workflow paths when there are no plugins", async () => {
      ;(getResolvedPlugins as jest.Mock).mockResolvedValue([])

      const container = buildContainer()

      await runMigrationScripts({
        directory: "/app",
        container,
        logger: mockLogger as any,
      })

      expect(WorkflowLoader).toHaveBeenCalledTimes(1)
      const [paths] = (WorkflowLoader as jest.Mock).mock.calls[0]
      expect(paths).toEqual([])
    })
  })
})
