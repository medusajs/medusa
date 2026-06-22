import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IAuthModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import Scrypt from "scrypt-kdf"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    describe("POST /auth/emailpass", () => {
      let appContainer
      beforeAll(async () => {
        appContainer = getContainer()
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        await dbUtils.snapshot()
      })

      const password = "supersecret"
      const email = "test@test.com"

      it("should return a token on successful login", async () => {
        const passwordHash = (
          await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
        ).toString("base64")
        const authService: IAuthModuleService = appContainer.resolve(
          Modules.AUTH
        )

        await authService.createAuthIdentities({
          provider_identities: [
            {
              provider: "emailpass",
              entity_id: email,
              provider_metadata: {
                password: passwordHash,
              },
            },
          ],
        })

        const response = await api
          .post(`/auth/user/emailpass`, {
            email: email,
            password: password,
          })
          .catch((e) => e)

        expect(response.status).toEqual(200)
        expect(response.data).toEqual(
          expect.objectContaining({
            token: expect.any(String),
          })
        )
      })

      it("should throw an error upon incorrect password", async () => {
        const passwordHash = (
          await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
        ).toString("base64")
        const authService: IAuthModuleService = appContainer.resolve(
          Modules.AUTH
        )

        await authService.createAuthIdentities({
          provider_identities: [
            {
              provider: "emailpass",
              entity_id: email,
              provider_metadata: {
                password: passwordHash,
              },
            },
          ],
        })

        const error = await api
          .post(`/auth/user/emailpass`, {
            email: email,
            password: "incorrect-password",
          })
          .catch((e) => e)

        expect(error.response.status).toEqual(401)
        expect(error.response.data).toEqual({
          type: "unauthorized",
          message: "Invalid email or password",
        })
      })

      it.skip("should throw an error upon logging in with a non existing auth user", async () => {
        const passwordHash = (
          await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
        ).toString("base64")

        const error = await api
          .post(`/auth/user/emailpass`, {
            email: "should-not-exist",
            password: "should-not-exist",
          })
          .catch((e) => e)

        // TODO: This is creating a user with a scope of admin. The client consuming the auth service
        // should reject this if its not being created by an admin user
        expect(error.response.status).toEqual(401)
        expect(error.response.data).toEqual({
          type: "unauthorized",
          message: "Invalid email or password",
        })
      })
    })
  },
})
