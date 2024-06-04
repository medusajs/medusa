import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let invite
    beforeEach(async () => {
      const appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)

      invite = (
        await api.post(
          "/admin/invites",
          {
            email: "invite@medusa-commerce.com",
          },
          adminHeaders
        )
      ).data.invite
    })

    describe("Admin invites", () => {
      it("should create, list, retrieve, and accept (deleting) an invite", async () => {
        const createdInvite = (
          await api.post(
            "/admin/invites",
            {
              email: "test@medusa-commerce.com",
            },
            adminHeaders
          )
        ).data.invite

        expect(createdInvite).toEqual(
          expect.objectContaining({
            email: "test@medusa-commerce.com",
          })
        )

        const listInvites = (await api.get("/admin/invites", adminHeaders)).data
          .invites

        expect(listInvites).toEqual([
          expect.objectContaining({
            email: "invite@medusa-commerce.com",
          }),
          expect.objectContaining({
            email: "test@medusa-commerce.com",
          }),
        ])

        const getInvite = (
          await api.get(`/admin/invites/${createdInvite.id}`, adminHeaders)
        ).data.invite

        expect(getInvite).toEqual(
          expect.objectContaining({
            email: "test@medusa-commerce.com",
          })
        )

        const signup = await api.post("/auth/user/emailpass", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        expect(signup.status).toEqual(200)
        expect(signup.data).toEqual({ token: expect.any(String) })

        const acceptedInvite = (
          await api.post(
            `/admin/invites/accept?token=${createdInvite.token}`,
            {
              first_name: "Test",
              last_name: "User",
            },
            { headers: { authorization: `Bearer ${signup.data.token}` } }
          )
        ).data.user

        expect(acceptedInvite).toEqual(
          expect.objectContaining({
            email: "test@medusa-commerce.com",
          })
        )
      })

      it("should fail to accept an invite given an invalid token (unauthorized endpoint)", async () => {
        expect.assertions(2)
        const signup = await api.post("/auth/user/emailpass", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnZpdGVfaWQiOiJpbnZpdGVfMDFGSFFWNlpBOERRRlgySjM3UVo5SjZTOTAiLCJyb2xlIjoiYWRtaW4iLCJ1c2VyX2VtYWlsIjoic2ZAc2RmLmNvbSIsImlhdCI6MTYzMzk2NDAyMCwiZXhwIjoxNjM0NTY4ODIwfQ.ZsmDvunBxhRW1iRqvfEfWixJLZ1zZVzaEYST38Vbl00"

        await api
          .post(
            `/admin/invites/accept?token=${token}`,
            {
              first_name: "test",
              last_name: "testesen",
            },
            {
              headers: { authorization: `Bearer ${signup.data.token}` },
            }
          )
          .catch((err) => {
            expect(err.response.status).toEqual(401)
            expect(err.response.data.message).toEqual("Unauthorized")
          })
      })

      it("should fail to accept an already accepted invite ", async () => {
        const signup = await api.post("/auth/user/emailpass", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        await api.post(
          `/admin/invites/accept?token=${invite.token}`,
          {
            first_name: "Test",
            last_name: "User",
          },
          {
            headers: { authorization: `Bearer ${signup.data.token}` },
          }
        )

        const signupAgain = await api.post("/auth/user/emailpass", {
          email: "another-test@medusa-commerce.com",
          password: "secret_password",
        })

        await api
          .post(
            `/admin/invites/accept?token=${invite.token}`,
            {
              first_name: "Another Test",
              last_name: "User",
            },
            {
              headers: { authorization: `Bearer ${signupAgain.data.token}` },
            }
          )
          .catch((e) => {
            expect(e.response.status).toEqual(401)
            expect(e.response.data.message).toEqual("Unauthorized")
          })
      })
      it("should resend an invite", async () => {
        const resendResponse = (
          await api.post(`/admin/invites/${invite.id}/resend`, {}, adminHeaders)
        ).data.invite

        // Resending an invite regenerates the token
        expect(resendResponse.token).toBeDefined()
        expect(resendResponse.token).not.toEqual(invite.token)
      })
      it("should delete an invite", async () => {
        const deleteResponse = (
          await api.delete(`/admin/invites/${invite.id}`, adminHeaders)
        ).data

        expect(deleteResponse).toEqual({
          id: invite.id,
          object: "invite",
          deleted: true,
        })
      })
    })
  },
})
