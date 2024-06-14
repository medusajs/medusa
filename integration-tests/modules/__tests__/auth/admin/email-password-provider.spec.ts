import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IAuthModuleService, ICustomerModuleService } from "@medusajs/types"
import Scrypt from "scrypt-kdf"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("POST /auth/emailpass", () => {
      let appContainer
      let customerModuleService: ICustomerModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        customerModuleService = appContainer.resolve(
          ModuleRegistrationName.CUSTOMER
        )
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      const password = "supersecret"
      const email = "test@test.com"

      it("should return a token on successful login", async () => {
        const passwordHash = (
          await Scrypt.kdf(password, { logN: 15, r: 8, p: 1 })
        ).toString("base64")
        const authService: IAuthModuleService = appContainer.resolve(
          ModuleRegistrationName.AUTH
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
          ModuleRegistrationName.AUTH
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
