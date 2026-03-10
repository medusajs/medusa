import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

process.env.MEDUSA_FF_RBAC = "true"

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

        const signup = await api.post("/auth/user/emailpass/register", {
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

      it("should fail to accept an invite given an invalid token", async () => {
        expect.assertions(2)
        const signup = await api.post("/auth/user/emailpass/register", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        // Some malformed token
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
        const signup = await api.post("/auth/user/emailpass/register", {
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

        const signupAgain = await api.post("/auth/user/emailpass/register", {
          email: "another-test@medusa-commerce.com",
          password: "secret_password",
        })

        const error = await api
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
          .catch((e) => e.response)

        expect(error.status).toEqual(401)
        expect(error.data.message).toEqual("Unauthorized")
      })

      it("should fail to accept with an expired token", async () => {
        jest.useFakeTimers()

        const signup = await api.post("/auth/user/emailpass/register", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        // Advance time by 25 hours
        jest.advanceTimersByTime(25 * 60 * 60 * 1000)

        const error = await api
          .post(
            `/admin/invites/accept?token=${invite.token}`,
            {
              first_name: "Another Test",
              last_name: "User",
            },
            {
              headers: { authorization: `Bearer ${signup.data.token}` },
            }
          )
          .catch((e) => e.response)

        expect(error.status).toEqual(401)
        expect(error.data.message).toEqual("Unauthorized")

        jest.useRealTimers()
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

    describe("Admin invites with roles", () => {
      let viewerRole, editorRole, superAdminRole

      beforeEach(async () => {
        // Create test roles
        const viewerResponse = await api.post(
          "/admin/rbac/roles",
          {
            name: "Product Viewer",
            description: "Can view products",
          },
          adminHeaders
        )
        viewerRole = viewerResponse.data.role

        const editorResponse = await api.post(
          "/admin/rbac/roles",
          {
            name: "Product Editor",
            description: "Can edit products",
          },
          adminHeaders
        )
        editorRole = editorResponse.data.role

        // Get the super admin role created by migration
        const superAdminResponse = await api.get(
          "/admin/rbac/roles?id=role_super_admin",
          adminHeaders
        )
        superAdminRole = superAdminResponse.data.roles[0]
      })

      it("should create invite with roles and assign them to user on acceptance", async () => {
        // Create invite with multiple roles
        const createdInvite = (
          await api.post(
            "/admin/invites",
            {
              email: "role-test@medusa-commerce.com",
              roles: [viewerRole.id, editorRole.id],
            },
            adminHeaders
          )
        ).data.invite

        expect(createdInvite).toEqual(
          expect.objectContaining({
            email: "role-test@medusa-commerce.com",
          })
        )

        // Verify invite is linked to roles
        const container = getContainer()
        const {
          ContainerRegistrationKeys,
          Modules,
        } = require("@medusajs/framework/utils")
        const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

        const inviteLinkService = remoteLink.getLinkModule(
          Modules.USER,
          "invite_id",
          Modules.RBAC,
          "rbac_role_id"
        )

        const inviteRoles = await inviteLinkService.list({
          invite_id: createdInvite.id,
        })

        expect(inviteRoles).toHaveLength(2)
        expect(inviteRoles.map((link) => link.rbac_role_id)).toEqual(
          expect.arrayContaining([viewerRole.id, editorRole.id])
        )

        // Register and accept the invite
        const signup = await api.post("/auth/user/emailpass/register", {
          email: "role-test@medusa-commerce.com",
          password: "secret_password",
        })

        expect(signup.status).toEqual(200)

        const acceptedUser = (
          await api.post(
            `/admin/invites/accept?token=${createdInvite.token}`,
            {
              first_name: "Role",
              last_name: "Test",
            },
            { headers: { authorization: `Bearer ${signup.data.token}` } }
          )
        ).data.user

        expect(acceptedUser).toEqual(
          expect.objectContaining({
            email: "role-test@medusa-commerce.com",
            first_name: "Role",
            last_name: "Test",
          })
        )

        const userLinkService = remoteLink.getLinkModule(
          Modules.USER,
          "user_id",
          Modules.RBAC,
          "rbac_role_id"
        )

        // Verify user was assigned the roles
        const userRoles = await userLinkService.list({
          user_id: acceptedUser.id,
        })

        expect(userRoles).toHaveLength(2)
        expect(userRoles.map((link) => link.rbac_role_id)).toEqual(
          expect.arrayContaining([viewerRole.id, editorRole.id])
        )
      })

      it("should create invite with super admin role and assign it to user", async () => {
        // Create invite with super admin role
        const createdInvite = (
          await api.post(
            "/admin/invites",
            {
              email: "admin-test@medusa-commerce.com",
              roles: [superAdminRole.id],
            },
            adminHeaders
          )
        ).data.invite

        // Register and accept the invite
        const signup = await api.post("/auth/user/emailpass/register", {
          email: "admin-test@medusa-commerce.com",
          password: "secret_password",
        })

        const acceptedUser = (
          await api.post(
            `/admin/invites/accept?token=${createdInvite.token}`,
            {
              first_name: "Admin",
              last_name: "Test",
            },
            { headers: { authorization: `Bearer ${signup.data.token}` } }
          )
        ).data.user

        // Verify user was assigned the super admin role
        const container = getContainer()
        const {
          ContainerRegistrationKeys,
          Modules,
        } = require("@medusajs/framework/utils")
        const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

        const linkService = remoteLink.getLinkModule(
          Modules.USER,
          "user_id",
          Modules.RBAC,
          "rbac_role_id"
        )

        const userRoles = await linkService.list({
          user_id: acceptedUser.id,
        })

        expect(userRoles).toHaveLength(1)
        expect(userRoles[0].rbac_role_id).toEqual(superAdminRole.id)
      })

      it("should create invite without roles and work normally", async () => {
        // Create invite without roles (existing behavior)
        const createdInvite = (
          await api.post(
            "/admin/invites",
            {
              email: "no-roles-test@medusa-commerce.com",
            },
            adminHeaders
          )
        ).data.invite

        // Register and accept the invite
        const signup = await api.post("/auth/user/emailpass/register", {
          email: "no-roles-test@medusa-commerce.com",
          password: "secret_password",
        })

        const acceptedUser = (
          await api.post(
            `/admin/invites/accept?token=${createdInvite.token}`,
            {
              first_name: "No Roles",
              last_name: "Test",
            },
            { headers: { authorization: `Bearer ${signup.data.token}` } }
          )
        ).data.user

        // Verify user has no roles assigned
        const container = getContainer()
        const {
          ContainerRegistrationKeys,
          Modules,
        } = require("@medusajs/framework/utils")
        const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

        const linkService = remoteLink.getLinkModule(
          Modules.USER,
          "user_id",
          Modules.RBAC,
          "rbac_role_id"
        )

        const userRoles = await linkService.list({
          user_id: acceptedUser.id,
        })

        expect(userRoles).toHaveLength(0)
      })

      it("should handle invite with non-existent role gracefully", async () => {
        // Try to create invite with non-existent role
        const error = await api
          .post(
            "/admin/invites",
            {
              email: "invalid-role-test@medusa-commerce.com",
              roles: ["non_existent_role_id"],
            },
            adminHeaders
          )
          .catch((e) => e.response)

        expect(error.status).toEqual(400)
        expect(error.data.message).toContain("role")
      })
    })
  },
})
