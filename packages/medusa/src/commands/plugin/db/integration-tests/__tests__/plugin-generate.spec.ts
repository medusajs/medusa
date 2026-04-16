import { logger } from "@medusajs/framework"
import { FileSystem } from "@medusajs/framework/utils"
import { join } from "path"
import main from "../../generate"

jest.mock("@medusajs/framework/logger")

describe("plugin-generate", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest
      .spyOn(process, "exit")
      .mockImplementation((code?: string | number | null) => {
        return code as never
      })
  })

  afterEach(async () => {
    // Clean up plugins-1 migrations
    const module1 = new FileSystem(
      join(
        __dirname,
        "..",
        "__fixtures__",
        "plugins-1",
        "src",
        "modules",
        "module-1"
      )
    )
    await module1.remove("migrations")

    // Clean up plugins-multi migrations
    const multiModule1 = new FileSystem(
      join(
        __dirname,
        "..",
        "__fixtures__",
        "plugins-multi",
        "src",
        "modules",
        "module-1"
      )
    )
    await multiModule1.remove("migrations")

    const multiModule2 = new FileSystem(
      join(
        __dirname,
        "..",
        "__fixtures__",
        "plugins-multi",
        "src",
        "modules",
        "module-2"
      )
    )
    await multiModule2.remove("migrations")

    // Clean up plugins-no-entities migrations
    const emptyModule = new FileSystem(
      join(
        __dirname,
        "..",
        "__fixtures__",
        "plugins-no-entities",
        "src",
        "modules",
        "module-empty"
      )
    )
    await emptyModule.remove("migrations")
  })

  describe("main function", () => {
    it("should successfully generate migrations when valid modules are found", async () => {
      await main({
        directory: join(__dirname, "..", "__fixtures__", "plugins-1"),
      })

      expect(logger.info).toHaveBeenNthCalledWith(1, "Generating migrations...")
      expect(logger.info).toHaveBeenNthCalledWith(
        2,
        "Generating migrations for module module1..."
      )
      expect(logger.info).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("Migration created")
      )
      expect(logger.info).toHaveBeenNthCalledWith(4, "Migrations generated")
      expect(process.exit).toHaveBeenCalledWith()
    })

    it("should handle case when no migrations are needed", async () => {
      await main({
        directory: join(__dirname, "..", "__fixtures__", "plugins-1"),
      })

      jest.clearAllMocks()

      await main({
        directory: join(__dirname, "..", "__fixtures__", "plugins-1"),
      })

      expect(logger.info).toHaveBeenNthCalledWith(1, "Generating migrations...")
      expect(logger.info).toHaveBeenNthCalledWith(
        2,
        "Generating migrations for module module1..."
      )
      expect(logger.info).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("No migration created")
      )
      expect(logger.info).toHaveBeenNthCalledWith(4, "Migrations generated")
      expect(process.exit).toHaveBeenCalledWith()
    })

    it("should handle error when module has no default export", async () => {
      await main({
        directory: join(
          __dirname,
          "..",
          "__fixtures__",
          "plugins-1-no-default"
        ),
      })
      expect(logger.error).toHaveBeenCalledWith(
        "The module should default export the `Module()`",
        new Error("The module should default export the `Module()`")
      )

      expect(process.exit).toHaveBeenCalledWith(1)
    })

    it("should generate migrations for multiple modules with unique timestamps", async () => {
      await main({
        directory: join(__dirname, "..", "__fixtures__", "plugins-multi"),
      })

      expect(logger.info).toHaveBeenNthCalledWith(1, "Generating migrations...")
      
      // Check that migrations are generated for both modules (order not guaranteed)
      expect(logger.info).toHaveBeenCalledWith(
        "Generating migrations for module module1..."
      )
      expect(logger.info).toHaveBeenCalledWith(
        "Generating migrations for module module2..."
      )
      
      // Check final message
      expect(logger.info).toHaveBeenCalledWith("Migrations generated")
      expect(process.exit).toHaveBeenCalledWith()

      // VERIFY BUG FIX #14410: Each module should have unique migration timestamps
      // Extract migration filenames from logger calls
      const migrationCreatedCalls = (logger.info as jest.Mock).mock.calls
        .filter((call: string[]) => call[0]?.includes("Migration created"))
        .map((call: string[]) => call[0])

      // Should have 2 migration created messages
      expect(migrationCreatedCalls.length).toBe(2)

      // Extract timestamps from filenames (format: MigrationYYYYMMDDHHmmss)
      const timestamps = migrationCreatedCalls.map((msg: string) => {
        const match = msg.match(/Migration(\d{14})/)
        return match ? match[1] : null
      })

      // Both timestamps should exist and be DIFFERENT (bug fix verification)
      expect(timestamps[0]).not.toBeNull()
      expect(timestamps[1]).not.toBeNull()
      expect(timestamps[0]).not.toBe(timestamps[1])
    })

    it("should skip module with no entities", async () => {
      await main({
        directory: join(__dirname, "..", "__fixtures__", "plugins-no-entities"),
      })

      expect(logger.info).toHaveBeenNthCalledWith(1, "Generating migrations...")
      expect(logger.info).toHaveBeenNthCalledWith(
        2,
        "Generating migrations for module moduleEmpty..."
      )
      expect(logger.info).toHaveBeenNthCalledWith(
        3,
        "No entities found for module moduleEmpty, skipping..."
      )
      expect(logger.info).toHaveBeenNthCalledWith(4, "Migrations generated")
      expect(process.exit).toHaveBeenCalledWith()
    })
  })
})
