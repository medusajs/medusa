import { IAuthenticationModuleService } from "@medusajs/types"
import { MedusaModule, Modules } from "@medusajs/modules-sdk"
import { MikroOrmWrapper } from "../../../utils"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { createAuthProviders } from "../../../__fixtures__/auth-provider"
import { getInitModuleConfig } from "../../../utils/get-init-module-config"
import { initModules } from "medusa-test-utils/dist"

jest.setTimeout(30000)

describe("AuthenticationModuleService - AuthProvider", () => {
  let service: IAuthenticationModuleService
  let testManager: SqlEntityManager
  let shutdownFunc: () => Promise<void>

  beforeAll(async () => {
    const initModulesConfig = getInitModuleConfig()

    const { medusaApp, shutdown } = await initModules(initModulesConfig)

    service = medusaApp.modules[Modules.AUTHENTICATION]

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

  describe("listAuthProviders", () => {
    it("should list default AuthProviders registered by loaders", async () => {
      const authProviders = await service.listAuthProviders()
      const serialized = JSON.parse(JSON.stringify(authProviders))

      expect(serialized).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            provider: "usernamePassword",
            name: "Username/Password Authentication",
          }),
          expect.objectContaining({
            provider: "google",
            name: "Google Authentication",
          }),
        ])
      )
    })
  })

  describe("authenticate", () => {
    it("authenticate validates that a provider is registered in container", async () => {
      await createAuthProviders(testManager, [
        {
          provider: "notRegistered",
          name: "test",
        },
      ])

      const { success, error } = await service.authenticate("notRegistered", {})

      expect(success).toBe(false)
      expect(error).toEqual(
        "AuthenticationProvider with for provider: notRegistered wasn't registered in the module. Have you configured your options correctly?"
      )
    })
  })
})
