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

    const module1WithEnum = new FileSystem(
      join(
        __dirname,
        "..",
        "__fixtures__",
        "plugins-1-with-enum",
        "src",
        "modules",
        "module-1"
      )
    )
    await module1WithEnum.remove("migrations")
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
    it("should successfully generate migrations when model files export enums alongside entities", async () => {
      await main({
        directory: join(__dirname, "..", "__fixtures__", "plugins-1-with-enum"),
      })
      expect(logger.info).toHaveBeenNthCalledWith(1, "Generating migrations...")
      expect(logger.info).toHaveBeenNthCalledWith(
        2,
        "Generating migrations for module module1_with_enum..."
      )
      expect(logger.info).toHaveBeenNthCalledWith(
        3,
        expect.stringContaining("Migration created")
      )
      expect(logger.info).toHaveBeenNthCalledWith(4, "Migrations generated")
      expect(process.exit).toHaveBeenCalledWith()
    })
  })
})
