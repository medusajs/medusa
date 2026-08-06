import { jest } from "@jest/globals"
import { MedusaContainer } from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import path from "path"
import { MigrationScriptsMigrator } from "../run-migration-scripts"

const mockPgConnection = {
  raw: jest.fn(),
}

const mockLockService = {
  acquire: jest.fn(),
  release: jest.fn(),
}

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
    // by default, the migration is successfully claimed
    mockPgConnection.raw.mockResolvedValue({ rows: [{ id: 1 }] } as never)
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

      expect(mockPgConnection.raw).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining(
          "INSERT INTO script_migrations (script_name) VALUES (?)"
        ),
        [path.basename(scriptPath)]
      )
      expect(mockPgConnection.raw).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining("UPDATE script_migrations"),
        [path.basename(scriptPath)]
      )
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
    })

    it("should skip a migration that has already been completed by another process", async () => {
      const scriptPath = "/path/to/migration.ts"

      jest
        .spyOn(migrator as any, "getPendingMigrations")
        .mockResolvedValue([scriptPath])
      jest
        .spyOn(migrator as any, "trackDuration")
        .mockReturnValue({ getSeconds: () => 1 })

      // the claim does not return a row, meaning the script is already finished
      mockPgConnection.raw.mockResolvedValue({ rows: [] } as never)

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
      expect(mockPgConnection.raw).not.toHaveBeenCalledWith(
        expect.stringContaining("SET finished_at"),
        expect.anything()
      )
    })

    it("should re-run a migration that was interrupted during a previous run", async () => {
      const scriptPath = "/path/to/interrupted-migration.ts"

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
