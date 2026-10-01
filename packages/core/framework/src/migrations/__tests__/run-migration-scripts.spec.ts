import { jest } from "@jest/globals"
import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import path from "path"
import { logger } from "../../logger"
import { MigrationScriptsMigrator } from "../run-migration-scripts"

const mockConnection = {
  query: jest.fn(),
}

const mockClient = {
  acquireConnection: jest.fn(),
  releaseConnection: jest.fn(),
}

const mockPgConnection = {
  raw: jest.fn(),
  client: mockClient,
}

const mockLockService = {
  acquire: jest.fn(),
  release: jest.fn(),
}

/**
 * Programs the connection used to claim a migration.
 *
 * @param acquired - Whether the advisory lock is acquired. `false` means
 * another process is running the script.
 * @param existingRows - The existing record for the script. An empty array
 * means the script has never been run. A record with a `finished_at` means it
 * has already been executed.
 */
const mockClaim = ({
  acquired = true,
  existingRows = [],
}: {
  acquired?: boolean
  existingRows?: { finished_at: Date | null }[]
} = {}) => {
  mockConnection.query.mockImplementation((async (sql: string) => {
    if (sql.includes("pg_try_advisory_lock")) {
      return { rows: [{ acquired }] }
    }
    if (sql.includes("pg_advisory_unlock")) {
      return { rows: [{ pg_advisory_unlock: true }] }
    }
    if (sql.includes("SELECT finished_at")) {
      return { rows: existingRows }
    }
    return { rows: [] }
  }) as never)
}

/**
 * The SQL statements sent on the claim connection.
 */
const claimQueries = () =>
  mockConnection.query.mock.calls.map((call) => call[0] as string)

const mockContainer = {
  resolve: (key: string) => {
    if (key === ContainerRegistrationKeys.PG_CONNECTION) {
      return mockPgConnection
    }
    if (key === Modules.LOCKING) {
      return mockLockService
    }

    throw new Error(`Unknown key: ${key}`)
  },
} as unknown as MedusaContainer

describe("MigrationScriptsMigrator", () => {
  let migrator: MigrationScriptsMigrator

  beforeEach(() => {
    jest.clearAllMocks()
    mockPgConnection.raw.mockResolvedValue(undefined as never)
    mockClient.acquireConnection.mockResolvedValue(mockConnection as never)
    mockClient.releaseConnection.mockResolvedValue(undefined as never)
    // by default, the migration is successfully claimed
    mockClaim()
    migrator = new MigrationScriptsMigrator({ container: mockContainer })
    // @ts-ignore
    migrator.pgConnection = mockPgConnection
  })

  describe("run", () => {
    it("should successfully run migration scripts", async () => {
      const mockScript = jest.fn()
      const scriptPath = "/path/to/migration.ts"

      jest
        .spyOn(migrator as any, "getPendingMigrations")
        .mockResolvedValue([scriptPath])
      jest
        .spyOn(migrator as any, "trackDuration")
        .mockReturnValue({ getSeconds: () => 1 })

      jest.mock(
        scriptPath,
        () => ({
          default: mockScript,
        }),
        { virtual: true }
      )

      await migrator.run([scriptPath])

      expect(mockScript).toHaveBeenCalled()

      expect(claimQueries()[0]).toContain("pg_try_advisory_lock")
      expect(claimQueries()[2]).toContain(
        "INSERT INTO script_migrations (script_name) VALUES ($1)"
      )
      expect(mockPgConnection.raw).toHaveBeenCalledWith(
        expect.stringContaining("SET finished_at"),
        [path.basename(scriptPath)]
      )

      // the advisory lock is released and the connection returned to the pool
      expect(claimQueries()).toContain("SELECT pg_advisory_unlock($1)")
      expect(mockClient.releaseConnection).toHaveBeenCalledWith(mockConnection)
    })

    it("should not mark a failed migration as finished", async () => {
      const scriptPath = "/path/to/failing-migration.ts"
      const error = new Error("Migration failed")

      jest
        .spyOn(migrator as any, "getPendingMigrations")
        .mockResolvedValue([scriptPath])
      jest
        .spyOn(migrator as any, "trackDuration")
        .mockReturnValue({ getSeconds: () => 1 })

      const mockFailingScript = jest.fn().mockRejectedValue(error as never)
      jest.mock(
        scriptPath,
        () => ({
          default: mockFailingScript,
        }),
        { virtual: true }
      )

      await expect(migrator.run([scriptPath])).rejects.toThrow(
        "Migration failed"
      )

      expect(mockPgConnection.raw).not.toHaveBeenCalledWith(
        expect.stringContaining("SET finished_at"),
        expect.anything()
      )

      // the claim is still released, so the connection is not leaked
      expect(claimQueries()).toContain("SELECT pg_advisory_unlock($1)")
      expect(mockClient.releaseConnection).toHaveBeenCalledWith(mockConnection)
    })

    it("should skip a migration that another process is currently running", async () => {
      const scriptPath = "/path/to/migration.ts"

      jest
        .spyOn(migrator as any, "getPendingMigrations")
        .mockResolvedValue([scriptPath])
      jest
        .spyOn(migrator as any, "trackDuration")
        .mockReturnValue({ getSeconds: () => 1 })

      // the advisory lock is held by another process
      mockClaim({ acquired: false })

      const mockScript = jest.fn()
      jest.mock(
        scriptPath,
        () => ({
          default: mockScript,
        }),
        { virtual: true }
      )

      await migrator.run([scriptPath])

      expect(mockScript).not.toHaveBeenCalled()
      // the record is not touched, so the running process keeps its claim
      expect(
        claimQueries().some((sql) =>
          sql.includes("INSERT INTO script_migrations")
        )
      ).toBe(false)
      expect(mockPgConnection.raw).not.toHaveBeenCalledWith(
        expect.stringContaining("SET finished_at"),
        expect.anything()
      )
      expect(mockClient.releaseConnection).toHaveBeenCalledWith(mockConnection)
    })

    it("should skip a migration that has already been completed by another process", async () => {
      const scriptPath = "/path/to/migration.ts"

      jest
        .spyOn(migrator as any, "getPendingMigrations")
        .mockResolvedValue([scriptPath])
      jest
        .spyOn(migrator as any, "trackDuration")
        .mockReturnValue({ getSeconds: () => 1 })

      // the record already has a finished_at, so the script is done
      mockClaim({ existingRows: [{ finished_at: new Date() }] })

      const mockScript = jest.fn()
      jest.mock(
        scriptPath,
        () => ({
          default: mockScript,
        }),
        { virtual: true }
      )

      await migrator.run([scriptPath])

      expect(mockScript).not.toHaveBeenCalled()
      // the finished record is left untouched
      expect(
        claimQueries().some((sql) =>
          sql.includes("INSERT INTO script_migrations")
        )
      ).toBe(false)
      expect(mockPgConnection.raw).not.toHaveBeenCalledWith(
        expect.stringContaining("SET finished_at"),
        expect.anything()
      )
      expect(mockClient.releaseConnection).toHaveBeenCalledWith(mockConnection)
    })

    it("should re-run a migration that was interrupted during a previous run", async () => {
      const scriptPath = "/path/to/interrupted-migration.ts"
      const warn = jest.spyOn(logger, "warn").mockImplementation(() => logger)

      // the record was left behind by the interrupted run
      mockClaim({ existingRows: [{ finished_at: null }] })

      jest
        .spyOn(migrator as any, "getExecutedMigrations")
        .mockResolvedValue([
          { script_name: path.basename(scriptPath), finished_at: null },
        ])
      jest
        .spyOn(migrator as any, "loadMigrationFiles")
        .mockResolvedValue([scriptPath])
      jest
        .spyOn(migrator as any, "trackDuration")
        .mockReturnValue({ getSeconds: () => 1 })

      const mockScript = jest.fn()
      jest.mock(
        scriptPath,
        () => ({
          default: mockScript,
        }),
        { virtual: true }
      )

      await migrator.run([scriptPath])

      expect(mockScript).toHaveBeenCalled()
      expect(mockPgConnection.raw).toHaveBeenCalledWith(
        expect.stringContaining("SET finished_at"),
        [path.basename(scriptPath)]
      )

      /**
       * `getPendingMigrations` is also called ahead of the run by the
       * `db:migrate:scripts` command, so the warning is only emitted when the
       * script is actually re-claimed. Otherwise it shows up twice per run.
       */
      const warnings = warn.mock.calls.filter((call) =>
        String(call[0]).includes("did not complete during a previous run")
      )
      expect(warnings).toHaveLength(1)

      await migrator.getPendingMigrations([scriptPath])
      expect(
        warn.mock.calls.filter((call) =>
          String(call[0]).includes("did not complete during a previous run")
        )
      ).toHaveLength(1)
    })
  })

  describe("getPendingMigrations", () => {
    it("should return only non-executed migrations", async () => {
      const executedMigration = "executed.ts"
      const pendingMigration = "pending.ts"

      jest
        .spyOn(migrator as any, "getExecutedMigrations")
        .mockResolvedValue([
          { script_name: executedMigration, finished_at: new Date() },
        ])
      jest
        .spyOn(migrator as any, "loadMigrationFiles")
        .mockResolvedValue([
          `/path/to/${executedMigration}`,
          `/path/to/${pendingMigration}`,
        ])

      const result = await migrator.getPendingMigrations(["/path/to"])

      expect(result).toHaveLength(1)
      expect(result[0]).toContain(pendingMigration)
    })

    it("should return migrations that started but never finished", async () => {
      const unfinishedMigration = "unfinished.ts"
      const executedMigration = "executed.ts"

      jest.spyOn(migrator as any, "getExecutedMigrations").mockResolvedValue([
        { script_name: executedMigration, finished_at: new Date() },
        { script_name: unfinishedMigration, finished_at: null },
      ])
      jest
        .spyOn(migrator as any, "loadMigrationFiles")
        .mockResolvedValue([
          `/path/to/${executedMigration}`,
          `/path/to/${unfinishedMigration}`,
        ])

      const result = await migrator.getPendingMigrations(["/path/to"])

      expect(result).toHaveLength(1)
      expect(result[0]).toContain(unfinishedMigration)
    })
  })

  describe("createMigrationTable", () => {
    it("should create migration table if it doesn't exist", async () => {
      await (migrator as any).createMigrationTable()

      expect(mockPgConnection.raw).toHaveBeenCalledWith(
        expect.stringContaining("CREATE TABLE IF NOT EXISTS script_migrations")
      )
    })
  })

  describe("loadMigrationFiles", () => {
    it("should load migration files correctly", async () => {
      const result = await migrator.loadMigrationFiles([
        path.join(
          __dirname,
          "..",
          "__fixtures__",
          "project",
          "migration-scripts"
        ),
      ])
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(
        path.join(
          __dirname,
          "..",
          "__fixtures__",
          "project",
          "migration-scripts",
          "test.ts"
        )
      )
    })
  })
})
