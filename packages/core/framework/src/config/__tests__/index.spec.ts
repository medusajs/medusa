import { configLoader } from "../loader"
import { join } from "path"
import { container } from "../../container"
import { ContainerRegistrationKeys } from "@medusajs/utils"

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
})
