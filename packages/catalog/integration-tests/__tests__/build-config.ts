import { joinerConfig } from "../__fixtures__/joiner-config"
import { MedusaApp } from "@medusajs/modules-sdk"
import modulesConfig from "../__fixtures__/modules-config"
import { ContainerRegistrationKeys, ModulesSdkUtils } from "@medusajs/utils"
import { DB_URL } from "../utils"

describe("buildConfig", function () {
  beforeAll(async function () {
    const pgConnection = ModulesSdkUtils.createPgConnection({
      clientUrl: DB_URL,
      schema: "public",
    })

    const injectedDependencies = {
      [ContainerRegistrationKeys.PG_CONNECTION]: pgConnection,
    }

    await MedusaApp({
      modulesConfig,
      servicesConfig: joinerConfig,
      injectedDependencies,
    })
  })
})
