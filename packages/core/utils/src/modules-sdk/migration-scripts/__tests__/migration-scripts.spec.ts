import { existsSync, mkdtempSync, rmSync } from "fs"
import { tmpdir } from "os"
import { join } from "path"
import { mikroOrmCreateConnection } from "../../../dal"
import { Migrations } from "../../../migrations"
import { buildRevertMigrationScript } from "../migration-down"
import { buildMigrationScript } from "../migration-up"

jest.mock("../../../dal", () => ({
  mikroOrmCreateConnection: jest.fn().mockResolvedValue({}),
}))
jest.mock("../../load-module-database-config", () => ({
  loadDatabaseConfig: jest.fn().mockReturnValue({ clientUrl: "postgres://" }),
}))
jest.mock("../../../migrations", () => ({
  Migrations: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    run: jest.fn().mockResolvedValue([]),
    revert: jest.fn().mockResolvedValue([]),
  })),
}))

const logger = { info: jest.fn(), error: jest.fn() } as any

describe("migration scripts", () => {
  let moduleDir: string

  beforeEach(() => {
    jest.clearAllMocks()
    moduleDir = mkdtempSync(join(tmpdir(), "medusa-module-"))
  })

  afterEach(() => {
    rmSync(moduleDir, { recursive: true, force: true })
  })

  describe.each([
    ["buildMigrationScript", buildMigrationScript],
    ["buildRevertMigrationScript", buildRevertMigrationScript],
  ])("%s", (_, build) => {
    it("should skip a module without a migrations folder and not create it", async () => {
      const pathToMigrations = join(moduleDir, "migrations")
      const script = build({ moduleName: "test", pathToMigrations })

      await script({ logger } as any)

      expect(mikroOrmCreateConnection).not.toHaveBeenCalled()
      expect(Migrations).not.toHaveBeenCalled()
      expect(existsSync(pathToMigrations)).toBe(false)
    })

    it("should run against an existing migrations folder", async () => {
      const script = build({ moduleName: "test", pathToMigrations: moduleDir })

      await script({ logger } as any)

      expect(mikroOrmCreateConnection).toHaveBeenCalledWith(
        expect.anything(),
        [],
        moduleDir
      )
      expect(Migrations).toHaveBeenCalledTimes(1)
    })
  })
})
