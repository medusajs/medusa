import { registerInstrumentation } from "../start"
import * as utils from "@medusajs/framework/utils"
import * as logger from "@medusajs/framework/logger"
import * as instrumentationFixture from "../__fixtures__/instrumentation"
import * as instrumentationFailureFixture from "../__fixtures__/instrumentation-failure/instrumentation"
import path from "path"

describe("start", () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
      const loggerSpy = jest.spyOn(logger.logger, "info", "" as never)

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
