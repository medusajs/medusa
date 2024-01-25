import { IAuthenticationModuleService } from "@medusajs/types"
import { MedusaModule, Modules } from "@medusajs/modules-sdk"
import { MikroOrmWrapper } from "../../../utils"
import Scrypt from "scrypt-kdf"
import { SqlEntityManager } from "@mikro-orm/postgresql"
import { createAuthProviders } from "../../../__fixtures__/auth-provider"
import { createAuthUsers } from "../../../__fixtures__/auth-user"
import { getInitModuleConfig } from "../../../utils/get-init-module-config"
import { initModules } from "medusa-test-utils"

jest.setTimeout(30000)
const seedDefaultData = async (testManager) => {
  await createAuthProviders(testManager)
  await createAuthUsers(testManager)
}

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

  afterAll(async () => {
    await shutdownFunc()
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

  describe("authenticate", () => {
    it("authenticate validates that a provider is registered in container", async () => {
      const password = "supersecret"
      const email = "test@test.com"
      const passwordHash = (
        await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
      ).toString("base64")

      await seedDefaultData(testManager)
      await createAuthUsers(testManager, [
        // Add authenticated user
        {
          provider: "usernamePassword",
          entity_id: email,
          provider_metadata: {
            password: passwordHash,
          },
        },
      ])

      const res = await service.authenticate("usernamePassword", {
        body: {
          email: "test@test.com",
          password: password,
        },
      })

      expect(res).toEqual({
        success: true,
        authUser: expect.objectContaining({
          entity_id: email,
          provider_metadata: {},
        }),
      })
    })

    it("fails when no password is given", async () => {
      const email = "test@test.com"

      await seedDefaultData(testManager)

      const res = await service.authenticate("usernamePassword", {
        body: { email: "test@test.com" },
      })

      expect(res).toEqual({
        success: false,
        error: "Password should be a string",
      })
    })

    it("fails when no email is given", async () => {
      await seedDefaultData(testManager)

      const res = await service.authenticate("usernamePassword", {
        body: { password: "supersecret" },
      })

      expect(res).toEqual({
        success: false,
        error: "Email should be a string",
      })
    })

    it("fails with an invalid password", async () => {
      const password = "supersecret"
      const email = "test@test.com"
      const passwordHash = (
        await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
      ).toString("base64")

      await seedDefaultData(testManager)
      await createAuthUsers(testManager, [
        // Add authenticated user
        {
          provider: "usernamePassword",
          entity_id: email,
          provider_metadata: {
            password_hash: passwordHash,
          },
        },
      ])

      const res = await service.authenticate("usernamePassword", {
        body: {
          email: "test@test.com",
          password: "password",
        },
      })

      expect(res).toEqual({
        success: false,
        error: "Invalid email or password",
      })
    })
  })
})
