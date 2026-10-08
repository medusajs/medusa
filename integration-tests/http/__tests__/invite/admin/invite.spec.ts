import { Modules } from "@medusajs/framework/utils"
import { createInvitesWorkflow } from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

process.env.MEDUSA_FF_RBAC = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    let invite
    beforeAll(async () => {
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

      await dbUtils.snapshot()
    })

    afterEach(() => {
      jest.useRealTimers()
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
        const signup = await api.post("/auth/user/emailpass/register", {
          email: "test@medusa-commerce.com",
          password: "secret_password",
        })

        await dbConnection.raw(
          `UPDATE "invite" SET expires_at = NOW() - INTERVAL '1 day' WHERE id = ?`,
          [invite.id]
        )

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
          "/rbac/roles",
          {
            name: "Product Viewer",
            description: "Can view products",
          },
          adminHeaders
        )
        viewerRole = viewerResponse.data.role

        const editorResponse = await api.post(
          "/rbac/roles",
          {
            name: "Product Editor",
            description: "Can edit products",
          },
          adminHeaders
        )
        editorRole = editorResponse.data.role

        // Get the super admin role created by migration
        const superAdminResponse = await api.get(
          "/rbac/roles?id=role_super_admin",
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
              roles: [{ role_id: viewerRole.id }, { role_id: editorRole.id }],
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
        const { Modules } = require("@medusajs/framework/utils")
        const rbacModule = container.resolve(Modules.RBAC)

        const inviteRoles = await rbacModule.listRbacRoleAssignments({
          reference: "invite",
          reference_id: createdInvite.id,
        })

        expect(inviteRoles).toHaveLength(2)
        expect(inviteRoles.map((assignment) => assignment.role_id)).toEqual(
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

        // Verify user was assigned the roles
        const userRoles = await rbacModule.listRbacRoleAssignments({
          reference: "user",
          reference_id: acceptedUser.id,
        })

        expect(userRoles).toHaveLength(2)
        expect(userRoles.map((assignment) => assignment.role_id)).toEqual(
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
              roles: [{ role_id: superAdminRole.id }],
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
        const { Modules } = require("@medusajs/framework/utils")
        const rbacModule = container.resolve(Modules.RBAC)

        const userRoles = await rbacModule.listRbacRoleAssignments({
          reference: "user",
          reference_id: acceptedUser.id,
        })

        expect(userRoles).toHaveLength(1)
        expect(userRoles[0].role_id).toEqual(superAdminRole.id)
      })

      it("should create invite with scoped roles and transfer the scopes to the user on acceptance", async () => {
        const createdInvite = (
          await api.post(
            "/admin/invites",
            {
              email: "scoped-role-test@medusa-commerce.com",
              roles: [
                {
                  role_id: viewerRole.id,
                  scopes: [
                    { type: "organization", id: "org_1" },
                    { type: "organization", id: "org_2" },
                  ],
                },
                // Unscoped role, alongside the scoped one
                { role_id: editorRole.id },
              ],
            },
            adminHeaders
          )
        ).data.invite

        const container = getContainer()
        const { Modules } = require("@medusajs/framework/utils")
        const rbacModule = container.resolve(Modules.RBAC)

        // One assignment per scope, plus one for the unscoped role
        const inviteRoles = await rbacModule.listRbacRoleAssignments({
          reference: "invite",
          reference_id: createdInvite.id,
        })

        expect(inviteRoles).toHaveLength(3)
        expect(inviteRoles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              role_id: viewerRole.id,
              scope: "organization",
              scope_id: "org_1",
            }),
            expect.objectContaining({
              role_id: viewerRole.id,
              scope: "organization",
              scope_id: "org_2",
            }),
            expect.objectContaining({
              role_id: editorRole.id,
              scope: null,
              scope_id: null,
            }),
          ])
        )

        const signup = await api.post("/auth/user/emailpass/register", {
          email: "scoped-role-test@medusa-commerce.com",
          password: "secret_password",
        })

        const acceptedUser = (
          await api.post(
            `/admin/invites/accept?token=${createdInvite.token}`,
            {
              first_name: "Scoped",
              last_name: "Test",
            },
            { headers: { authorization: `Bearer ${signup.data.token}` } }
          )
        ).data.user

        // The scopes are carried over to the user's assignments
        const userRoles = await rbacModule.listRbacRoleAssignments({
          reference: "user",
          reference_id: acceptedUser.id,
        })

        expect(userRoles).toHaveLength(3)
        expect(userRoles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              role_id: viewerRole.id,
              scope: "organization",
              scope_id: "org_1",
            }),
            expect.objectContaining({
              role_id: viewerRole.id,
              scope: "organization",
              scope_id: "org_2",
            }),
            expect.objectContaining({
              role_id: editorRole.id,
              scope: null,
              scope_id: null,
            }),
          ])
        )

        // The invite's own assignments are removed once transferred
        const remainingInviteRoles = await rbacModule.listRbacRoleAssignments({
          reference: "invite",
          reference_id: createdInvite.id,
        })

        expect(remainingInviteRoles).toHaveLength(0)
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
        const { Modules } = require("@medusajs/framework/utils")
        const rbacModule = container.resolve(Modules.RBAC)

        const userRoles = await rbacModule.listRbacRoleAssignments({
          reference: "user",
          reference_id: acceptedUser.id,
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
              roles: [{ role_id: "non_existent_role_id" }],
            },
            adminHeaders
          )
          .catch((e) => e.response)

        expect(error.status).toEqual(400)
        expect(error.data.message).toContain("role")
      })

      describe("granting actor role validation", () => {
        const limitedHeaders = { headers: { ...adminHeaders.headers } }
        let productReaderRoleId: string
        let mixedRoleId: string

        const ensurePolicy = async (
          rbacModule,
          resource: string,
          operation: string
        ) => {
          const key = `${resource}:${operation}`
          const [existing] = await rbacModule.listRbacPolicies({ key })

          if (existing) {
            return existing
          }

          const [created] = await rbacModule.createRbacPolicies([
            { key, resource, operation, name: key },
          ])
          return created
        }

        beforeEach(async () => {
          const container = getContainer()
          const rbacModule = container.resolve(Modules.RBAC)

          const inviteCreate = await ensurePolicy(
            rbacModule,
            "invite",
            "create"
          )
          const productRead = await ensurePolicy(rbacModule, "product", "read")
          const customerCreate = await ensurePolicy(
            rbacModule,
            "customer",
            "create"
          )

          // The inviter: can create invites and holds product:read only.
          const inviterRole = await rbacModule.createRbacRoles({
            name: "Inviter",
            description: "invite:create and product:read",
          })
          // Roles being offered through the invite.
          const productReaderRole = await rbacModule.createRbacRoles({
            name: "Product Reader",
            description: "product:read",
          })
          const mixedRole = await rbacModule.createRbacRoles({
            name: "Mixed",
            description: "product:read and customer:create",
          })

          await rbacModule.createRbacRolePolicies([
            { role_id: inviterRole.id, policy_id: inviteCreate.id },
            { role_id: inviterRole.id, policy_id: productRead.id },
            { role_id: productReaderRole.id, policy_id: productRead.id },
            { role_id: mixedRole.id, policy_id: productRead.id },
            { role_id: mixedRole.id, policy_id: customerCreate.id },
          ])

          await createAdminUser(dbConnection, limitedHeaders, container, {
            email: "inviter@medusa.js",
            roles: [inviterRole.id],
          })

          productReaderRoleId = productReaderRole.id
          mixedRoleId = mixedRole.id
        })

        it("should allow inviting to a role whose policies the actor holds", async () => {
          const response = await api.post(
            "/admin/invites",
            {
              email: "allowed-invite@medusa-commerce.com",
              roles: [{ role_id: productReaderRoleId }],
            },
            limitedHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.invite.email).toEqual(
            "allowed-invite@medusa-commerce.com"
          )
        })

        it("should allow inviting to a scoped role whose policies the actor holds", async () => {
          const response = await api.post(
            "/admin/invites",
            {
              email: "allowed-scoped-invite@medusa-commerce.com",
              roles: [
                {
                  role_id: productReaderRoleId,
                  scopes: [{ type: "organization", id: "org_1" }],
                },
              ],
            },
            limitedHeaders
          )

          expect(response.status).toEqual(200)
        })

        it("should reject inviting to a role with policies the actor does not hold", async () => {
          const error = await api
            .post(
              "/admin/invites",
              {
                email: "denied-invite@medusa-commerce.com",
                roles: [{ role_id: mixedRoleId }],
              },
              limitedHeaders
            )
            .catch((e) => e.response)

          expect(error.status).toEqual(403)
          expect(error.data.message).toContain(
            "You do not have permission to assign these roles"
          )

          const { data } = await api.get(
            "/admin/invites?email=denied-invite@medusa-commerce.com",
            adminHeaders
          )
          expect(data.invites).toHaveLength(0)
        })

        it("should reject when any role among several is not grantable", async () => {
          const error = await api
            .post(
              "/admin/invites",
              {
                email: "denied-multi-invite@medusa-commerce.com",
                roles: [
                  { role_id: productReaderRoleId },
                  { role_id: mixedRoleId },
                ],
              },
              limitedHeaders
            )
            .catch((e) => e.response)

          expect(error.status).toEqual(403)
        })

        it("should reject a scoped invite to a role the actor cannot grant", async () => {
          const error = await api
            .post(
              "/admin/invites",
              {
                email: "denied-scoped-invite@medusa-commerce.com",
                roles: [
                  {
                    role_id: mixedRoleId,
                    scopes: [{ type: "organization", id: "org_1" }],
                  },
                ],
              },
              limitedHeaders
            )
            .catch((e) => e.response)

          expect(error.status).toEqual(403)
        })

        it("should only allow a scoped inviter to invite to roles within the scope they act in", async () => {
          const container = getContainer()
          const rbacModule = container.resolve(Modules.RBAC)
          const userModule = container.resolve(Modules.USER)
          const orgA = { type: "organization", id: "org_A" }
          const orgB = { type: "organization", id: "org_B" }

          const scopedInviter = await userModule.createUsers({
            email: "scoped-inviter@medusa.js",
          })
          // Holds product:read (via the product reader role) only within org_A.
          await rbacModule.createRbacRoleAssignments([
            {
              role_id: productReaderRoleId,
              reference: "user",
              reference_id: scopedInviter.id,
              scope: orgA.type,
              scope_id: orgA.id,
            },
          ])

          const invite = (email: string, scope?: typeof orgA) =>
            createInvitesWorkflow(container).run({
              input: {
                invites: [
                  {
                    email,
                    roles: [
                      {
                        role_id: productReaderRoleId,
                        scopes: scope ? [scope] : undefined,
                      },
                    ],
                  },
                ],
                rbac_context: { actor_id: scopedInviter.id, scope: orgA },
              },
            })

          const { result } = await invite("scoped-a@medusa-commerce.com", orgA)
          expect(result).toHaveLength(1)

          for (const [email, scope] of [
            ["scoped-b@medusa-commerce.com", orgB],
            ["scoped-global@medusa-commerce.com", undefined],
          ] as const) {
            const error = await invite(email, scope).catch((e) => e)
            expect(error.message).toContain(
              "You do not have permission to assign these roles"
            )
          }
        })

        it("should still allow a super admin to invite to any role", async () => {
          const response = await api.post(
            "/admin/invites",
            {
              email: "super-admin-invite@medusa-commerce.com",
              roles: [{ role_id: mixedRoleId }],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
        })
      })
    })
  },
})
