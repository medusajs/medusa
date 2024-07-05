import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IUserModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("GET /admin/invites/:id", () => {
      let appContainer
      let userModuleService: IUserModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        userModuleService = appContainer.resolve(ModuleRegistrationName.USER)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("should fail to accept an invite with an invalid invite token", async () => {
        const authResponse = await api.post(`/auth/admin/emailpass`, {
          email: "potential_member@test.com",
          password: "supersecret",
        })

        expect(authResponse.status).toEqual(200)
        const token = authResponse.data.token

        const acceptResponse = await api
          .post(
            `/admin/invites/accept?token=${"non-existing-token"}`,
            {
              first_name: "John",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .catch((e) => e)

        expect(acceptResponse.response.status).toEqual(401)
        expect(acceptResponse.response.data.message).toEqual("Unauthorized")
      })

      it("should accept an invite", async () => {
        const invite = await userModuleService.createInvites({
          email: "potential_member@test.com",
        })

        const authResponse = await api.post(`/auth/admin/emailpass`, {
          email: "potential_member@test.com",
          password: "supersecret",
        })

        expect(authResponse.status).toEqual(200)
        const token = authResponse.data.token

        const acceptResponse = await api.post(
          `/admin/invites/accept?token=${invite.token}`,
          {
            first_name: "John",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        expect(acceptResponse.status).toEqual(200)
        expect(acceptResponse.data.user).toEqual(
          expect.objectContaining({
            email: "potential_member@test.com",
            first_name: "John",
          })
        )
      })

      it("should accept an invite with email different from invite", async () => {
        const invite = await userModuleService.createInvites({
          email: "potential_member@test.com",
        })

        const authResponse = await api.post(`/auth/admin/emailpass`, {
          email: "some-email@test.com",
          password: "supersecret",
        })

        expect(authResponse.status).toEqual(200)
        const token = authResponse.data.token

        const acceptResponse = await api.post(
          `/admin/invites/accept?token=${invite.token}`,
          {
            first_name: "John",
            email: "some-email@test.com",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        expect(acceptResponse.status).toEqual(200)
        expect(acceptResponse.data.user).toEqual(
          expect.objectContaining({
            email: "some-email@test.com",
            first_name: "John",
          })
        )
      })
    })
  },
})
