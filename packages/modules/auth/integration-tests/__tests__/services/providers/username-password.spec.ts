import { MedusaModule, Modules } from "@medusajs/modules-sdk"

import { IAuthModuleService } from "@medusajs/types"
import Scrypt from "scrypt-kdf"
import { createAuthIdentities } from "../../../__fixtures__/auth-identity"
import { moduleIntegrationTestRunner, SuiteOptions } from "medusa-test-utils"

jest.setTimeout(30000)
const seedDefaultData = async (manager) => {
  await createAuthIdentities(manager)
}

moduleIntegrationTestRunner({
  moduleName: Modules.AUTH,
  moduleOptions: {
    providers: [
      {
        name: "emailpass",
        scopes: {
          admin: {},
          store: {},
        },
      },
    ],
  },
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<IAuthModuleService>) => {
    describe("AuthModuleService - AuthProvider", () => {
      describe("authenticate", () => {
        it("authenticate validates that a provider is registered in container", async () => {
          const password = "supersecret"
          const email = "test@test.com"
          const passwordHash = (
            await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
          ).toString("base64")

          await seedDefaultData(MikroOrmWrapper.forkManager())
          await createAuthIdentities(MikroOrmWrapper.forkManager(), [
            // Add authenticated user
            {
              provider: "emailpass",
              entity_id: email,
              scope: "store",
              provider_metadata: {
                password: passwordHash,
              },
            },
          ])

          const res = await service.authenticate("emailpass", {
            body: {
              email: "test@test.com",
              password: password,
            },
            authScope: "store",
          } as any)

          expect(res).toEqual({
            success: true,
            authIdentity: expect.objectContaining({
              entity_id: email,
              provider_metadata: {},
            }),
          })
        })

        it("fails when no password is given", async () => {
          await seedDefaultData(MikroOrmWrapper.forkManager())

          const res = await service.authenticate("emailpass", {
            body: { email: "test@test.com" },
            authScope: "store",
          } as any)

          expect(res).toEqual({
            success: false,
            error: "Password should be a string",
          })
        })

        it("fails when no email is given", async () => {
          await seedDefaultData(MikroOrmWrapper.forkManager())

          const res = await service.authenticate("emailpass", {
            body: { password: "supersecret" },
            authScope: "store",
          } as any)

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

          await seedDefaultData(MikroOrmWrapper.forkManager())
          await createAuthIdentities(MikroOrmWrapper.forkManager(), [
            // Add authenticated user
            {
              provider: "emailpass",
              scope: "store",
              entity_id: email,
              provider_metadata: {
                password_hash: passwordHash,
              },
            },
          ])

          const res = await service.authenticate("emailpass", {
            body: {
              email: "test@test.com",
              password: "password",
            },
            authScope: "store",
          } as any)

          expect(res).toEqual({
            success: false,
            error: "Invalid email or password",
          })
        })
      })
    })
  },
})
