import { jest } from "@jest/globals"
import { MedusaContainer } from "@zjedene-medusa/types"
import { ContainerRegistrationKeys, Modules } from "@zjedene-medusa/utils"
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

    it("should handle failed migrations by cleaning up", async () => {
      const scriptPath = "/path/to/failing-migration.ts"
      const error = new Error("Migration failed")

      jest
        .spyOn(migrator as any, "getPendingMigrations")
        .mockResolvedValue([scriptPath])
      jest
        .spyOn(migrator as any, "insertMigration")
        .mockResolvedValue(undefined)
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

      expect(mockPgConnection.raw).toHaveBeenCalledWith(
        expect.stringContaining("DELETE FROM script_migrations"),
        [path.basename(scriptPath)]
      )
    })

    it("should skip migration when unique constraint error occurs", async () => {
      const scriptPath = "/path/to/migration.ts"
      const uniqueError = new Error("Unique constraint violation")
      ;(uniqueError as any).constraint = "idx_script_name_unique"

      jest
        .spyOn(migrator as any, "getPendingMigrations")
        .mockResolvedValue([scriptPath])
      jest
        .spyOn(migrator as any, "insertMigration")
        .mockRejectedValue(uniqueError)
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

      expect(mockScript).not.toHaveBeenCalled()
      expect(mockPgConnection.raw).not.toHaveBeenCalledWith(
        expect.stringContaining("UPDATE script_migrations")
      )
    })
  })

  describe("getPendingMigrations", () => {
    it("should return only non-executed migrations", async () => {
      const executedMigration = "executed.ts"
      const pendingMigration = "pending.ts"

      jest
        .spyOn(migrator as any, "getExecutedMigrations")
        .mockResolvedValue([{ script_name: executedMigration }])
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
