import { MedusaModule, Modules } from "@medusajs/modules-sdk"

import { IAuthModuleService } from "@medusajs/types"
import { MikroOrmWrapper } from "../../../utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { getInitModuleConfig } from "../../../utils/get-init-module-config"
import { initModules } from "medusa-test-utils"

jest.setTimeout(30000)

describe("AuthModuleService - AuthProvider", () => {
  let service: IAuthModuleService
  let testManager: SqlEntityManager
  let shutdownFunc: () => Promise<void>

  beforeAll(async () => {
    const initModulesConfig = getInitModuleConfig()

    const { medusaApp, shutdown } = await initModules(initModulesConfig)

    service = medusaApp.modules[Modules.AUTH]

    shutdownFunc = shutdown
  })

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    testManager = MikroOrmWrapper.forkManager()

    if (service.__hooks?.onApplicationStart) {
      await service.__hooks.onApplicationStart()
    }
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
    MedusaModule.clearInstances()
  })

  afterAll(async () => {
    await shutdownFunc()
  })

  describe("authenticate", () => {
    it("authenticate validates that a provider is registered in container", async () => {
      const { success, error } = await service.authenticate(
        "notRegistered",
        {} as any
      )

      expect(success).toBe(false)
      expect(error).toEqual(
        "AuthenticationProvider: notRegistered wasn't registered in the module. Have you configured your options correctly?"
      )
    })

    it("fails to authenticate using a valid provider with an invalid scope", async () => {
      const { success, error } = await service.authenticate("emailpass", {
        authScope: "non-existing",
      } as any)

      expect(success).toBe(false)
      expect(error).toEqual(
        `Scope "non-existing" is not valid for provider emailpass`
      )
    })
  })
})
