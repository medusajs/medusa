import * as utils from "@medusajs/framework/utils"
import path from "path"
import * as instrumentationFixture from "../__fixtures__/instrumentation"
import * as instrumentationFailureFixture from "../__fixtures__/instrumentation-failure/instrumentation"
import { registerInstrumentation, tryFindExpressRoutePath } from "../start"

const logger = {
  info: jest.fn(),
  error: jest.fn(),
}

jest.mock("@medusajs/framework/config", () => {
  return {
    configManager: {
      config: {},
    },
    configLoader: jest.fn().mockImplementation(() => {
      return {
        logger,
      }
    }),
  }
})

describe("start", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.doMock("@medusajs/framework/utils", () => ({
      ...jest.requireActual("@medusajs/framework/utils"),
      createMedusaContainer: jest.fn(() => ({
        resolve: jest.fn(() => logger),
      })),
    }))
  })

  describe("tryFindExpressRoutePath", () => {
    const layer = {
      name: "bound dispatch",
      route: { path: "/:id" },
      handle: { stack: [] },
      match: jest.fn(),
    }

    it("leaves malformed URLs to Express and preserves matching routes", () => {
      layer.match.mockImplementationOnce(() => {
        throw new URIError()
      })
      expect(
        tryFindExpressRoutePath({ stack: [layer], url: "/%c0" })
      ).toBeUndefined()
      layer.match.mockReturnValueOnce(true)
      expect(tryFindExpressRoutePath({ stack: [layer], url: "/123" })).toBe(
        "/:id"
      )
      expect(
        tryFindExpressRoutePath({ stack: [], url: "/123" })
      ).toBeUndefined()
    })
  })

  describe("registerInstrumentation", () => {
    it("should not throw when registering the instrumentation if the file is not ", async () => {
      const fsSpy = jest.spyOn(
        utils.FileSystem.prototype,
        "exists",
        "" as never
      )

      await registerInstrumentation(__dirname)

      expect(fsSpy).toHaveBeenCalled()
      expect(fsSpy).toHaveBeenCalledWith(
        expect.stringContaining("instrumentation.js")
      )
    })

    it("should log an info message if the file is present but not register function is found", async () => {
      const fsSpy = jest.spyOn(
        utils.FileSystem.prototype,
        "exists",
        "" as never
      )
      const loggerSpy = jest.spyOn(logger, "info", "" as never)

      await registerInstrumentation(
        path.join(__dirname, "../__fixtures__/instrumentation-no-register")
      )

      expect(fsSpy).toHaveBeenCalled()
      expect(fsSpy).toHaveBeenCalledWith(
        expect.stringContaining("instrumentation.js")
      )

      expect(loggerSpy).toHaveBeenCalled()
      expect(loggerSpy).toHaveBeenCalledWith(
        "Skipping instrumentation registration. No register function found."
      )
    })

    it("should register the instrumentation if the file is present and exports a register function", async () => {
      const fsSpy = jest.spyOn(
        utils.FileSystem.prototype,
        "exists",
        "" as never
      )

      instrumentationFixture.registerMock.mockReturnValue(true)

      await registerInstrumentation(path.join(__dirname, "../__fixtures__"))

      expect(fsSpy).toHaveBeenCalled()
      expect(instrumentationFixture.registerMock).toHaveBeenCalled()

      expect(fsSpy).toHaveBeenCalledWith(
        expect.stringContaining("instrumentation.js")
      )
    })

    it("should throw if the instrumentation file exists but cannot be imported", async () => {
      const fsSpy = jest.spyOn(
        utils.FileSystem.prototype,
        "exists",
        "" as never
      )

      const err = await registerInstrumentation(
        path.join(__dirname, "../__fixtures__/instrumentation-failure")
      ).catch((e) => e)

      expect(fsSpy).toHaveBeenCalled()
      expect(instrumentationFailureFixture.registerMock).toHaveBeenCalled()

      expect(fsSpy).toHaveBeenCalledWith(
        expect.stringContaining("instrumentation.js")
      )

      expect(err).toBeInstanceOf(Error)
    })
  })
})
