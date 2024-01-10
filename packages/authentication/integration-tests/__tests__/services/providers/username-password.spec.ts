import { SqlEntityManager } from "@mikro-orm/postgresql"
import Scrypt from "scrypt-kdf"

import { MikroOrmWrapper } from "../../../utils"
import { initialize } from "../../../../src"
import { DB_URL } from "@medusajs/pricing/integration-tests/utils"
import { MedusaModule } from "@medusajs/modules-sdk"
import { IAuthenticationModuleService } from "@medusajs/types"
import { createAuthUsers } from "../../../__fixtures__/auth-user"
import { createAuthProviders } from "../../../__fixtures__/auth-provider"

jest.setTimeout(30000)
const seedDefaultData = async (testManager) => {
  await createAuthProviders(testManager)
  await createAuthUsers(testManager)
}

describe("AuthenticationModuleService - AuthProvider", () => {
  let service: IAuthenticationModuleService
  let testManager: SqlEntityManager

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
    testManager = MikroOrmWrapper.forkManager()

    service = await initialize({
      database: {
        clientUrl: DB_URL,
        schema: process.env.MEDUSA_PRICING_DB_SCHEMA,
      },
    })
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
          provider_metadata: {
            email,
            password_hash: passwordHash,
          },
        },
      ])

      const res = await service.authenticate("usernamePassword", {
        email: "test@test.com",
        password: password,
      })

      expect(res).toEqual({
        success: true,
        authUser: expect.objectContaining({
          provider_metadata: {
            email,
            password_hash: passwordHash,
          },
        }),
      })
    })

    it("fails when no password is given", async () => {
      const email = "test@test.com"

      await seedDefaultData(testManager)

      const res = await service.authenticate("usernamePassword", {
        email: "test@test.com",
      })

      expect(res).toEqual({
        success: false,
        error: "Password should be a string",
      })
    })

    it("fails when no email is given", async () => {
      await seedDefaultData(testManager)

      const res = await service.authenticate("usernamePassword", {
        password: "supersecret",
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
          provider_metadata: {
            email,
            password_hash: passwordHash,
          },
        },
      ])

      const res = await service.authenticate("usernamePassword", {
        email: "test@test.com",
        password: "password",
      })

      expect(res).toEqual({
        success: false,
        error: "Invalid email or password",
      })
    })
  })
})
