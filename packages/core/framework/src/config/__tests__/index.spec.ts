import { ContainerRegistrationKeys } from "@medusajs/utils"
import { join } from "path"
import { container } from "../../container"
import { logger } from "../../logger"
import { configLoader } from "../loader"

describe("configLoader", () => {
  const entryDirectory = join(__dirname, "../__fixtures__")

  it("should load the config properly", async () => {
    let configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    expect(configModule).toBeUndefined()

    await configLoader(entryDirectory, "medusa-config")

    configModule = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)

    expect(configModule).toBeDefined()
    expect(configModule.projectConfig.databaseName).toBeUndefined()

    await configLoader(entryDirectory, "medusa-config-2")

    configModule = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)

    expect(configModule).toBeDefined()
    expect(configModule.projectConfig.databaseName).toBe("foo")
    expect(configModule.projectConfig.workerMode).toBe("shared")

    process.env.MEDUSA_WORKER_MODE = "worker"

    await configLoader(entryDirectory, "medusa-config-2")

    configModule = container.resolve(ContainerRegistrationKeys.CONFIG_MODULE)

    expect(configModule).toBeDefined()
    expect(configModule.projectConfig.databaseName).toBe("foo")
    expect(configModule.projectConfig.workerMode).toBe("worker")
  })

  it("should load config without throwing errors when throwOnValidationError is false", async () => {
    await configLoader(entryDirectory, "medusa-config", {
      throwOnValidationError: false,
    })

    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    expect(configModule).toBeDefined()
    expect(configModule.projectConfig).toBeDefined()
  })

  it("should pass throwOnValidationError option through to buildHttpConfig", async () => {
    // When throwOnError is false, missing jwtSecret and cookieSecret should not cause errors
    await configLoader(entryDirectory, "medusa-config-2", {
      throwOnValidationError: false,
    })

    const configModule = container.resolve(
      ContainerRegistrationKeys.CONFIG_MODULE
    )

    expect(configModule).toBeDefined()
    expect(configModule.projectConfig.databaseName).toBe("foo")
    // http config should still be built with defaults even without throwing errors
    expect(configModule.projectConfig.http).toBeDefined()
    expect(configModule.projectConfig.http.jwtSecret).toBe("supersecret")
    expect(configModule.projectConfig.http.cookieSecret).toBe("supersecret")
  })

  it("should fail on config file errors", async () => {
    const errorSpy = jest.spyOn(logger, "error").mockImplementation(() => {})
    const exitSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit(1)")
    })

    await expect(
      configLoader(entryDirectory, "medusa-config-throwing")
    ).rejects.toThrow("process.exit(1)")

    expect(exitSpy).toHaveBeenCalledWith(1)

    const logged = errorSpy.mock.calls.flat().map(String).join(" ")
    expect(logged).toContain("Error in loading config:")
    expect(logged).toContain("Uncaught error in medusa-config-throwing.js")

    errorSpy.mockRestore()
    exitSpy.mockRestore()
  })
})
