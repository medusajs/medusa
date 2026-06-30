import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IUserModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/utils"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    describe("GET /admin/invites/:id", () => {
      let appContainer
      let userModuleService: IUserModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        userModuleService = appContainer.resolve(Modules.USER)
      })

      beforeAll(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        await dbUtils.snapshot()
      })

      it("should fail to accept an invite with an invalid invite token", async () => {
        const authResponse = await api.post(`/auth/user/emailpass/register`, {
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

        const authResponse = await api.post(`/auth/user/emailpass/register`, {
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

      it("should reject an invite token that has been rotated by a resend", async () => {
        const invite = await userModuleService.createInvites({
          email: "rotated_invite@test.com",
        })
        const originalToken = invite.token

        const [refreshed] = await userModuleService.refreshInviteTokens([
          invite.id,
        ])
        expect(refreshed.token).not.toEqual(originalToken)

        const authResponse = await api.post(`/auth/user/emailpass/register`, {
          email: "rotated_invite@test.com",
          password: "supersecret",
        })
        const token = authResponse.data.token

        const replayAttempt = await api
          .post(
            `/admin/invites/accept?token=${originalToken}`,
            { first_name: "Attacker" },
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .catch((e) => e)

        expect(replayAttempt.response.status).toEqual(401)

        const legitAccept = await api.post(
          `/admin/invites/accept?token=${refreshed.token}`,
          { first_name: "John" },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        expect(legitAccept.status).toEqual(200)
        expect(legitAccept.data.user).toEqual(
          expect.objectContaining({
            email: "rotated_invite@test.com",
            first_name: "John",
          })
        )
      })

      it("should accept an invite with email different from invite", async () => {
        const invite = await userModuleService.createInvites({
          email: "potential_member@test.com",
        })

        const authResponse = await api.post(`/auth/user/emailpass/register`, {
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
