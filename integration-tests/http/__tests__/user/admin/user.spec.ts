import { createUsersWorkflow } from "@medusajs/core-flows"
import { IWorkflowEngineService } from "@medusajs/framework/types"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IAuthModuleService } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  generateJwtToken,
  Modules,
} from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

process.env.MEDUSA_FF_RBAC = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let user, container, authIdentity

    beforeEach(async () => {
      container = getContainer()
      const { user: adminUser, authIdentity: authId } = await createAdminUser(
        dbConnection,
        adminHeaders,
        container
      )

      user = adminUser
      authIdentity = authId
    })

    describe("GET /admin/users/:id", () => {
      it("should return user by id", async () => {
        const response = await api.get(`/admin/users/${user.id}`, adminHeaders)

        const v2Response = {
          id: user.id,
          email: "admin@medusa.js",
          created_at: expect.any(String),
          updated_at: expect.any(String),
        }

        // BREAKING: V2 users do not have role + api_token
        expect(response.status).toEqual(200)
        expect(response.data.user).toEqual(expect.objectContaining(v2Response))
      })
    })

    describe("GET /admin/users", () => {
      it("should list users", async () => {
        const response = await api.get("/admin/users", adminHeaders)

        expect(response.status).toEqual(200)

        const v2Response = [
          expect.objectContaining({
            id: user.id,
            email: "admin@medusa.js",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ]

        expect(response.data.users).toEqual(v2Response)
      })

      it("should list users that match the free text search", async () => {
        const emptyResponse = await api.get(
          "/admin/users?q=member",
          adminHeaders
        )

        expect(emptyResponse.status).toEqual(200)
        expect(emptyResponse.data.users.length).toEqual(0)

        const response = await api.get("/admin/users?q=user", adminHeaders)

        expect(response.data.users.length).toEqual(1)
        expect(response.data.users).toEqual([
          expect.objectContaining({
            id: user.id,
            email: "admin@medusa.js",
            created_at: expect.any(String),
            updated_at: expect.any(String),
          }),
        ])
      })
    })

    describe("POST /admin/users/:id", () => {
      it("should update a user", async () => {
        const updateResponse = (
          await api.post(
            `/admin/users/${user.id}`,
            { first_name: "John", last_name: "Doe" },
            adminHeaders
          )
        ).data.user

        expect(updateResponse).toEqual(
          expect.objectContaining({
            id: user.id,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            first_name: "John",
            last_name: "Doe",
          })
        )
      })
    })

    describe("DELETE /admin/users", () => {
      it("Deletes a user and updates associated auth identity", async () => {
        const userTwoAdminHeaders = {
          headers: { "x-medusa-access-token": "test_token" },
        }

        const { user: userTwo, authIdentity: userTwoAuthIdentity } =
          await createAdminUser(dbConnection, userTwoAdminHeaders, container, {
            email: "test@test.com",
          })

        const response = await api.delete(
          `/admin/users/${userTwo.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: userTwo.id,
          object: "user",
          deleted: true,
        })

        const authModule: IAuthModuleService = container.resolve(Modules.AUTH)

        const updatedAuthIdentity = await authModule.retrieveAuthIdentity(
          userTwoAuthIdentity.id
        )

        // Ensure the auth identity has been updated to not contain the user's id
        expect(updatedAuthIdentity).toEqual(
          expect.objectContaining({
            id: userTwoAuthIdentity.id,
            app_metadata: expect.not.objectContaining({
              user_id: userTwo.id,
            }),
          })
        )

        // Authentication should still succeed
        const authenticateToken = (
          await api.post(`/auth/user/emailpass`, {
            email: userTwo.email,
            password: "somepassword",
          })
        ).data.token

        expect(authenticateToken).toEqual(expect.any(String))

        // However, it should not be possible to access routes any longer
        const meResponse = await api
          .get(`/admin/users/me`, {
            headers: {
              authorization: `Bearer ${authenticateToken}`,
            },
          })
          .catch((e) => e)

        expect(meResponse.response.status).toEqual(401)
      })

      it("throws if you attempt to delete your own user", async () => {
        const error = await api
          .delete(`/admin/users/${user.id}`, adminHeaders)
          .catch((e) => e)

        expect(error.response.status).toEqual(400)
        expect(error.response.data.message).toEqual(
          "A user cannot delete itself"
        )
      })

      // TODO: Migrate when analytics config is implemented in 2.0
      it.skip("Deletes a user and their analytics config", async () => {
        const userId = "member-user"

        // await simpleAnalyticsConfigFactory(dbConnection, {
        //   user_id: userId,
        // })

        const response = await api.delete(
          `/admin/users/${userId}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          id: userId,
          object: "user",
          deleted: true,
        })

        const configs = await dbConnection.manager.query(
          `SELECT * FROM public.analytics_config WHERE user_id = '${userId}'`
        )

        expect(configs).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              created_at: expect.any(Date),
              updated_at: expect.any(Date),
              deleted_at: expect.any(Date),
              id: expect.any(String),
              user_id: userId,
              opt_out: false,
              anonymize: false,
            }),
          ])
        )
      })
    })

    // TODO: Migrate when implemented in 2.0
    describe.skip("POST /admin/users/reset-password + POST /admin/users/password-token", () => {
      let user
      beforeEach(async () => {
        const response = await api
          .post(
            "/admin/users",
            {
              email: "test@forgottenPassword.com",
              role: "member",
              password: "test123453",
            },
            adminHeaders
          )
          .catch((err) => console.log(err))

        user = response.data.user
      })

      it("Doesn't fail to fetch user when resetting password for an unknown email (unauthorized endpoint)", async () => {
        const resp = await api.post("/admin/users/password-token", {
          email: "test-doesnt-exist@test.com",
        })

        expect(resp.status).toEqual(204)
      })

      it("Doesn't fail when generating password reset token (unauthorized endpoint)", async () => {
        const resp = await api
          .post("/admin/users/password-token", {
            email: user.email,
          })
          .catch((err) => {
            console.log(err)
          })

        expect(resp.data).toEqual("")
        expect(resp.status).toEqual(204)
      })

      it("Resets the password given a valid token (unauthorized endpoint)", async () => {
        const expiry = Math.floor(Date.now() / 1000) + 60 * 15
        const dbUser = await dbConnection.manager.query(
          `SELECT * FROM public.user WHERE email = '${user.email}'`
        )

        const token_payload = {
          user_id: user.id,
          email: user.email,
          exp: expiry,
        }
        const token = jwt.sign(token_payload, dbUser[0].password_hash)

        const result = await api
          .post("/admin/users/reset-password", {
            token,
            email: "test@forgottenpassword.com",
            password: "new password",
          })
          .catch((err) => console.log(err))

        const loginResult = await api.post("admin/auth", {
          email: "test@forgottenpassword.com",
          password: "new password",
        })

        expect(result.status).toEqual(200)
        expect(result.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
        expect(result.data.user.password_hash).toEqual(undefined)

        expect(loginResult.status).toEqual(200)
        expect(loginResult.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
      })

      it("Resets the password given a valid token without including email(unauthorized endpoint)", async () => {
        const expiry = Math.floor(Date.now() / 1000) + 60 * 15
        const dbUser = await dbConnection.manager.query(
          `SELECT * FROM public.user WHERE email = '${user.email}'`
        )

        const token_payload = {
          user_id: user.id,
          email: user.email,
          exp: expiry,
        }
        const token = jwt.sign(token_payload, dbUser[0].password_hash)

        const result = await api
          .post("/admin/users/reset-password", {
            token,
            password: "new password",
          })
          .catch((err) => console.log(err.response.data.message))

        const loginResult = await api.post("admin/auth", {
          email: user.email,
          password: "new password",
        })

        expect(result.status).toEqual(200)
        expect(result.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
        expect(result.data.user.password_hash).toEqual(undefined)

        expect(loginResult.status).toEqual(200)
        expect(loginResult.data.user).toEqual(
          expect.objectContaining({
            email: user.email,
            role: user.role,
          })
        )
      })

      it("Fails to Reset the password given an invalid token (unauthorized endpoint)", async () => {
        expect.assertions(2)

        const token = "test.test.test"

        await api
          .post("/admin/users/reset-password", {
            token,
            email: "test@forgottenpassword.com",
            password: "new password",
          })
          .catch((err) => {
            expect(err.response.status).toEqual(400)
            expect(err.response.data.message).toEqual("invalid token")
          })
      })
    })

    describe("User creation with roles", () => {
      it("should fail to create user with non-existent role", async () => {
        const workflowService: IWorkflowEngineService = container.resolve(
          Modules.WORKFLOW_ENGINE
        )

        const error = await workflowService
          .run("create-users-workflow", {
            input: {
              users: [
                {
                  email: "test-role@medusa.js",
                  roles: ["non_existent_role_id"],
                },
              ],
            },
          })
          .catch((e) => e)

        expect(error.message).toContain("non_existent_role_id")
      })

      it("should create user with valid role", async () => {
        const workflowService: IWorkflowEngineService = container.resolve(
          Modules.WORKFLOW_ENGINE
        )

        // Get the super admin role created by the RBAC module loader
        const rbacService = container.resolve(Modules.RBAC)
        const superAdminRoles = await rbacService.listRbacRoles({
          id: "role_super_admin",
        })

        expect(superAdminRoles.length).toBeGreaterThan(0)

        const { result: users } = await workflowService.run(
          "create-users-workflow",
          {
            input: {
              users: [
                {
                  email: "test-with-role@medusa.js",
                  roles: [superAdminRoles[0].id],
                },
              ],
            },
          }
        )

        expect(users).toHaveLength(1)
        expect(users[0].email).toEqual("test-with-role@medusa.js")
      })
    })

    describe("User Roles Management", () => {
      let testUser
      let viewerRole
      let editorRole
      let adminRole
      let policies

      beforeEach(async () => {
        const rbacModule = container.resolve(Modules.RBAC)
        const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

        // Create policies
        const policy1 = await api.post(
          "/admin/rbac/policies",
          {
            key: "read:products",
            resource: "product",
            operation: "read",
            name: "Read Products",
          },
          adminHeaders
        )

        const policy2 = await api.post(
          "/admin/rbac/policies",
          {
            key: "write:products",
            resource: "product",
            operation: "write",
            name: "Write Products",
          },
          adminHeaders
        )

        const policy3 = await api.post(
          "/admin/rbac/policies",
          {
            key: "delete:products",
            resource: "product",
            operation: "delete",
            name: "Delete Products",
          },
          adminHeaders
        )

        policies = [
          policy1.data.policy,
          policy2.data.policy,
          policy3.data.policy,
        ]

        // Create roles with different policies
        const viewerRoleResponse = await api.post(
          "/admin/rbac/roles",
          {
            name: "Product Viewer",
            description: "Can view products",
          },
          adminHeaders
        )
        viewerRole = viewerRoleResponse.data.role

        const editorRoleResponse = await api.post(
          "/admin/rbac/roles",
          {
            name: "Product Editor",
            description: "Can edit products",
          },
          adminHeaders
        )
        editorRole = editorRoleResponse.data.role

        const adminRoleResponse = await api.post(
          "/admin/rbac/roles",
          {
            name: "Product Admin",
            description: "Full product access",
          },
          adminHeaders
        )
        adminRole = adminRoleResponse.data.role

        // Assign policies to roles
        await rbacModule.createRbacRolePolicies([
          { role_id: viewerRole.id, policy_id: policies[0].id },
        ])
        await rbacModule.createRbacRolePolicies([
          { role_id: editorRole.id, policy_id: policies[0].id },
          { role_id: editorRole.id, policy_id: policies[1].id },
        ])
        await rbacModule.createRbacRolePolicies([
          { role_id: adminRole.id, policy_id: policies[0].id },
          { role_id: adminRole.id, policy_id: policies[1].id },
          { role_id: adminRole.id, policy_id: policies[2].id },
        ])

        // Link the admin user to the admin role (so they have all policies)
        await remoteLink.create({
          [Modules.USER]: { user_id: user.id },
          [Modules.RBAC]: { rbac_role_id: adminRole.id },
        })

        // Create a test user
        const { result: users } = await createUsersWorkflow(container).run({
          input: {
            users: [
              {
                email: "testuser@example.com",
                first_name: "Test",
                last_name: "User",
              },
            ],
          },
        })
        testUser = users[0]
      })

      describe("GET /admin/users/:id/roles", () => {
        it("should list roles for a user", async () => {
          const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

          // Assign roles to test user
          await remoteLink.create([
            {
              [Modules.USER]: { user_id: testUser.id },
              [Modules.RBAC]: { rbac_role_id: viewerRole.id },
            },
            {
              [Modules.USER]: { user_id: testUser.id },
              [Modules.RBAC]: { rbac_role_id: editorRole.id },
            },
          ])

          const response = await api.get(
            `/admin/users/${testUser.id}/roles`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.roles).toHaveLength(2)
          expect(response.data.roles).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: viewerRole.id }),
              expect.objectContaining({ id: editorRole.id }),
            ])
          )
        })

        it("should return empty array for user with no roles", async () => {
          const response = await api.get(
            `/admin/users/${testUser.id}/roles`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(0)
          expect(response.data.roles).toHaveLength(0)
        })
      })

      describe("POST /admin/users/:id/roles", () => {
        it("should assign roles to a user when actor has all required policies", async () => {
          const response = await api.post(
            `/admin/users/${testUser.id}/roles`,
            { roles: [viewerRole.id, editorRole.id] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.roles).toHaveLength(2)
          expect(response.data.roles).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: viewerRole.id }),
              expect.objectContaining({ id: editorRole.id }),
            ])
          )
        })

        it("should fail to assign roles when actor lacks required policies", async () => {
          const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

          // Create a limited user with only viewer role
          const { result: limitedUsers } = await createUsersWorkflow(
            container
          ).run({
            input: {
              users: [
                {
                  email: "limited@example.com",
                  first_name: "Limited",
                  last_name: "User",
                },
              ],
            },
          })
          const limitedUser = limitedUsers[0]

          // Assign only viewer role to limited user
          await remoteLink.create({
            [Modules.USER]: { user_id: limitedUser.id },
            [Modules.RBAC]: { rbac_role_id: viewerRole.id },
          })

          // Create auth identity and generate JWT for limited user
          const authModule: IAuthModuleService = container.resolve(Modules.AUTH)
          const limitedAuthIdentity = await authModule.createAuthIdentities({
            provider_identities: [
              {
                provider: "emailpass",
                entity_id: limitedUser.email,
              },
            ],
            app_metadata: { user_id: limitedUser.id },
          })

          const config = container.resolve(
            ContainerRegistrationKeys.CONFIG_MODULE
          )
          const { projectConfig } = config
          const { jwtSecret, jwtOptions } = projectConfig.http
          const limitedToken = generateJwtToken(
            {
              actor_id: limitedUser.id,
              actor_type: "user",
              auth_identity_id: limitedAuthIdentity.id,
              app_metadata: {
                user_id: limitedUser.id,
                roles: [viewerRole.id],
              },
            },
            {
              secret: jwtSecret,
              expiresIn: "1d",
              jwtOptions,
            }
          )

          const limitedHeaders = {
            headers: { authorization: `Bearer ${limitedToken}` },
          }

          // Try to assign admin role (which has policies the limited user doesn't have)
          const error = await api
            .post(
              `/admin/users/${testUser.id}/roles`,
              { roles: [adminRole.id] },
              limitedHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(403)
        })

        it("should return 404 for non-existent user", async () => {
          const error = await api
            .post(
              `/admin/users/non_existent_id/roles`,
              { roles: [viewerRole.id] },
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(404)
        })
      })

      describe("DELETE /admin/users/:id/roles/:role_id", () => {
        it("should remove a role from a user", async () => {
          const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

          // First assign a role
          await remoteLink.create({
            [Modules.USER]: { user_id: testUser.id },
            [Modules.RBAC]: { rbac_role_id: viewerRole.id },
          })

          // Verify role was assigned
          const beforeResponse = await api.get(
            `/admin/users/${testUser.id}/roles`,
            adminHeaders
          )
          expect(beforeResponse.data.count).toEqual(1)

          // Remove the role
          const deleteResponse = await api.delete(
            `/admin/users/${testUser.id}/roles/${viewerRole.id}`,
            adminHeaders
          )

          expect(deleteResponse.status).toEqual(200)
          expect(deleteResponse.data).toEqual({
            id: viewerRole.id,
            object: "user_role",
            deleted: true,
          })

          // Verify role was removed
          const afterResponse = await api.get(
            `/admin/users/${testUser.id}/roles`,
            adminHeaders
          )
          expect(afterResponse.data.count).toEqual(0)
        })
      })

      describe("DELETE /admin/users/:id/roles (batch)", () => {
        it("should remove multiple roles from a user", async () => {
          const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

          // Assign multiple roles to test user
          await remoteLink.create([
            {
              [Modules.USER]: { user_id: testUser.id },
              [Modules.RBAC]: { rbac_role_id: viewerRole.id },
            },
            {
              [Modules.USER]: { user_id: testUser.id },
              [Modules.RBAC]: { rbac_role_id: editorRole.id },
            },
          ])

          // Verify roles were assigned
          const beforeResponse = await api.get(
            `/admin/users/${testUser.id}/roles`,
            adminHeaders
          )
          expect(beforeResponse.data.count).toEqual(2)

          // Remove multiple roles
          const deleteResponse = await api.delete(
            `/admin/users/${testUser.id}/roles`,
            {
              ...adminHeaders,
              data: { roles: [viewerRole.id, editorRole.id] },
            }
          )

          expect(deleteResponse.status).toEqual(200)
          expect(deleteResponse.data).toEqual({
            ids: [viewerRole.id, editorRole.id],
            object: "user_role",
            deleted: true,
          })

          // Verify roles were removed
          const afterResponse = await api.get(
            `/admin/users/${testUser.id}/roles`,
            adminHeaders
          )
          expect(afterResponse.data.count).toEqual(0)
        })

        it("should fail to remove a role when actor lacks required policies", async () => {
          const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

          // Assign admin role to test user (has policies A, B, C)
          await remoteLink.create({
            [Modules.USER]: { user_id: testUser.id },
            [Modules.RBAC]: { rbac_role_id: adminRole.id },
          })

          // Create a limited user with only viewer role (has policy A only)
          const { result: limitedUsers } = await createUsersWorkflow(
            container
          ).run({
            input: {
              users: [
                {
                  email: "limited-delete@example.com",
                  first_name: "Limited",
                  last_name: "Deleter",
                },
              ],
            },
          })
          const limitedUser = limitedUsers[0]

          // Assign only viewer role to limited user
          await remoteLink.create({
            [Modules.USER]: { user_id: limitedUser.id },
            [Modules.RBAC]: { rbac_role_id: viewerRole.id },
          })

          // Create auth identity and generate JWT for limited user
          const authModule: IAuthModuleService = container.resolve(Modules.AUTH)
          const limitedAuthIdentity = await authModule.createAuthIdentities({
            provider_identities: [
              {
                provider: "emailpass",
                entity_id: limitedUser.email,
              },
            ],
            app_metadata: { user_id: limitedUser.id },
          })

          const config = container.resolve(
            ContainerRegistrationKeys.CONFIG_MODULE
          )
          const { projectConfig } = config
          const { jwtSecret, jwtOptions } = projectConfig.http
          const limitedToken = generateJwtToken(
            {
              actor_id: limitedUser.id,
              actor_type: "user",
              auth_identity_id: limitedAuthIdentity.id,
              app_metadata: {
                user_id: limitedUser.id,
                roles: [viewerRole.id],
              },
            },
            {
              secret: jwtSecret,
              expiresIn: "1d",
              jwtOptions,
            }
          )

          const limitedHeaders = {
            headers: { authorization: `Bearer ${limitedToken}` },
          }

          // Try to remove admin role (which has policies the limited user doesn't have)
          const error = await api
            .delete(
              `/admin/users/${testUser.id}/roles/${adminRole.id}`,
              limitedHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(403)
        })
      })
    })
  },
})
