import { createUsersWorkflow } from "@medusajs/core-flows"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.MEDUSA_FF_RBAC = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let container

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    afterAll(async () => {
      delete process.env.MEDUSA_FF_RBAC
    })

    describe("RBAC Roles - Admin API", () => {
      describe("POST /admin/rbac/roles", () => {
        it("should create a role", async () => {
          const response = await api.post(
            "/admin/rbac/roles",
            {
              name: "Viewer",
              description: "Can view resources",
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.role).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "Viewer",
              description: "Can view resources",
            })
          )
        })

        it("should create a role with metadata", async () => {
          const response = await api.post(
            "/admin/rbac/roles",
            {
              name: "Editor",
              description: "Can edit resources",
              metadata: { department: "sales" },
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.role).toEqual(
            expect.objectContaining({
              name: "Editor",
              metadata: { department: "sales" },
            })
          )
        })
      })

      describe("GET /admin/rbac/roles", () => {
        beforeEach(async () => {
          await api.post(
            "/admin/rbac/roles",
            {
              name: "Viewer",
              description: "Can view resources",
            },
            adminHeaders
          )

          await api.post(
            "/admin/rbac/roles",
            {
              name: "Editor",
              description: "Can edit resources",
            },
            adminHeaders
          )

          await api.post(
            "/admin/rbac/roles",
            {
              name: "Admin",
              description: "Full access",
            },
            adminHeaders
          )
        })

        it("should list all roles", async () => {
          const response = await api.get("/admin/rbac/roles", adminHeaders)

          expect(response.status).toEqual(200)
          // 4 roles: Super Admin  + 3 created in beforeEach
          expect(response.data.count).toEqual(4)
          expect(response.data.roles).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "role_super_admin",
                name: "Super Admin",
              }),
              expect.objectContaining({
                name: "Viewer",
                description: "Can view resources",
              }),
              expect.objectContaining({
                name: "Editor",
                description: "Can edit resources",
              }),
              expect.objectContaining({
                name: "Admin",
                description: "Full access",
              }),
            ])
          )
        })

        it("should filter roles by name", async () => {
          const response = await api.get(
            "/admin/rbac/roles?name=Viewer",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.roles[0]).toEqual(
            expect.objectContaining({
              name: "Viewer",
            })
          )
        })
      })

      describe("GET /admin/rbac/roles/:id", () => {
        it("should retrieve a role by id", async () => {
          const createResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Manager",
              description: "Can manage resources",
            },
            adminHeaders
          )

          const roleId = createResponse.data.role.id

          const response = await api.get(
            `/admin/rbac/roles/${roleId}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.role).toEqual(
            expect.objectContaining({
              id: roleId,
              name: "Manager",
              description: "Can manage resources",
            })
          )
        })
      })

      describe("POST /admin/rbac/roles/:id", () => {
        it("should update a role", async () => {
          const createResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Support",
              description: "Support team",
            },
            adminHeaders
          )

          const roleId = createResponse.data.role.id

          const response = await api.post(
            `/admin/rbac/roles/${roleId}`,
            {
              name: "Customer Support",
              description: "Customer support team with limited access",
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.role).toEqual(
            expect.objectContaining({
              id: roleId,
              name: "Customer Support",
              description: "Customer support team with limited access",
            })
          )
        })
      })

      describe("DELETE /admin/rbac/roles/:id", () => {
        it("should delete a role", async () => {
          const createResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Temporary",
              description: "Temporary role",
            },
            adminHeaders
          )

          const roleId = createResponse.data.role.id

          const deleteResponse = await api.delete(
            `/admin/rbac/roles/${roleId}`,
            adminHeaders
          )

          expect(deleteResponse.status).toEqual(200)
          expect(deleteResponse.data).toEqual({
            id: roleId,
            object: "rbac_role",
            deleted: true,
          })

          const listResponse = await api.get("/admin/rbac/roles", adminHeaders)
          expect(
            listResponse.data.roles.find((r) => r.id === roleId)
          ).toBeUndefined()
        })
      })

      describe("Role Policies", () => {
        let policies
        let viewerRole
        let editorRole
        let adminUser

        beforeEach(async () => {
          const userModule = container.resolve(Modules.USER)
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

          // Create an admin role with all policies
          const adminRoleResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Admin Role",
              description: "Has all permissions",
            },
            adminHeaders
          )
          const adminRole = adminRoleResponse.data.role

          // Associate all policies with the admin role using the module directly
          const rbacModule = container.resolve(Modules.RBAC)
          await rbacModule.createRbacRolePolicies([
            { role_id: adminRole.id, policy_id: policies[0].id },
            { role_id: adminRole.id, policy_id: policies[1].id },
            { role_id: adminRole.id, policy_id: policies[2].id },
          ])

          // Get the admin user
          const users = await userModule.listUsers({ email: "admin@medusa.js" })
          adminUser = users[0]

          // Link the admin user to the admin role
          await remoteLink.create({
            [Modules.USER]: {
              user_id: adminUser.id,
            },
            [Modules.RBAC]: {
              rbac_role_id: adminRole.id,
            },
          })

          // Create viewer and editor roles for the tests
          const viewer = await api.post(
            "/admin/rbac/roles",
            {
              name: "Product Viewer",
              description: "Can view products",
            },
            adminHeaders
          )
          viewerRole = viewer.data.role

          const editor = await api.post(
            "/admin/rbac/roles",
            {
              name: "Product Editor",
              description: "Can edit products",
            },
            adminHeaders
          )
          editorRole = editor.data.role
        })

        it("should create a user with roles using workflow", async () => {
          // Create a user with roles using the workflow
          const { result } = await createUsersWorkflow(container).run({
            input: {
              users: [
                {
                  email: "test-user@example.com",
                  first_name: "Test",
                  last_name: "User",
                  roles: [viewerRole.id, editorRole.id],
                },
              ],
            },
          })

          expect(result).toHaveLength(1)
          const createdUser = result[0]
          expect(createdUser.email).toEqual("test-user@example.com")
          expect(createdUser.first_name).toEqual("Test")
          expect(createdUser.last_name).toEqual("User")

          const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
          const linkService = remoteLink.getLinkModule(
            Modules.USER,
            "user_id",
            Modules.RBAC,
            "rbac_role_id"
          )

          const userRoles = await linkService.list({
            user_id: createdUser.id,
          })

          expect(userRoles).toHaveLength(2)
          expect(userRoles.map((link) => link.rbac_role_id)).toEqual(
            expect.arrayContaining([viewerRole.id, editorRole.id])
          )

          const userModule = container.resolve(Modules.USER)
          const retrievedUser = await userModule.retrieveUser(createdUser.id)
          expect(retrievedUser.email).toEqual("test-user@example.com")
        })

        it("should add policies to a role", async () => {
          const response = await api.post(
            `/admin/rbac/roles/${viewerRole.id}/policies`,
            {
              policies: [policies[0].id],
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)

          expect(response.data.policies).toHaveLength(1)
          expect(response.data.policies[0]).toMatchObject({
            role_id: viewerRole.id,
            policy_id: policies[0].id,
          })
        })

        it("should list role-policies for a specific role", async () => {
          // Add multiple policies to the role
          await api.post(
            `/admin/rbac/roles/${viewerRole.id}/policies`,
            {
              policies: [policies[0].id, policies[1].id],
            },
            adminHeaders
          )

          // List the role to get its policies
          const response = await api.get(
            `/admin/rbac/roles/${viewerRole.id}/?fields=policies`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(Array.isArray(response.data.role.policies)).toBe(true)
          expect(response.data.role.policies).toHaveLength(2)
          expect(response.data.role.policies).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: policies[0].id,
              }),
              expect.objectContaining({
                id: policies[1].id,
              }),
            ])
          )
        })

        it("should remove a policy from a role", async () => {
          // First add a policy to the role
          await api.post(
            `/admin/rbac/roles/${editorRole.id}/policies`,
            {
              policies: [policies[2].id],
            },
            adminHeaders
          )

          // Verify the policy was added
          const initialResponse = await api.get(
            `/admin/rbac/roles/${editorRole.id}?fields=policies`,
            adminHeaders
          )
          expect(initialResponse.data.role.policies).toHaveLength(1)

          // Remove the policy from the role
          const deleteResponse = await api.delete(
            `/admin/rbac/roles/${editorRole.id}/policies/${policies[2].id}`,
            adminHeaders
          )

          expect(deleteResponse.status).toEqual(200)
          expect(deleteResponse.data).toEqual({
            id: expect.stringContaining("rlpl_"),
            object: "rbac_role_policy",
            deleted: true,
          })

          // Verify the policy was removed
          const finalResponse = await api.get(
            `/admin/rbac/roles/${editorRole.id}?fields=policies`,
            adminHeaders
          )
          expect(finalResponse.data.role.policies).toHaveLength(0)
        })
      })

      describe("GET /admin/rbac/roles/:id/users", () => {
        let testRole
        let testUser1
        let testUser2

        beforeEach(async () => {
          const userModule = container.resolve(Modules.USER)
          const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

          // Create a role for testing
          const roleResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Test Role",
              description: "Role for testing users endpoint",
            },
            adminHeaders
          )
          testRole = roleResponse.data.role

          // Create test users using the workflow
          const { result: users } = await createUsersWorkflow(container).run({
            input: {
              users: [
                {
                  email: "user1@example.com",
                  first_name: "User",
                  last_name: "One",
                },
                {
                  email: "user2@example.com",
                  first_name: "User",
                  last_name: "Two",
                },
              ],
            },
          })

          testUser1 = users[0]
          testUser2 = users[1]

          // Link users to the role
          await remoteLink.create([
            {
              [Modules.USER]: { user_id: testUser1.id },
              [Modules.RBAC]: { rbac_role_id: testRole.id },
            },
            {
              [Modules.USER]: { user_id: testUser2.id },
              [Modules.RBAC]: { rbac_role_id: testRole.id },
            },
          ])
        })

        it("should list users for a role", async () => {
          const response = await api.get(
            `/admin/rbac/roles/${testRole.id}/users`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.users).toHaveLength(2)
          expect(response.data.users).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: testUser1.id,
                email: "user1@example.com",
              }),
              expect.objectContaining({
                id: testUser2.id,
                email: "user2@example.com",
              }),
            ])
          )
        })

        it("should filter users by user_id", async () => {
          const response = await api.get(
            `/admin/rbac/roles/${testRole.id}/users?user_id=${testUser1.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(1)
          expect(response.data.users).toHaveLength(1)
          expect(response.data.users[0]).toEqual(
            expect.objectContaining({
              id: testUser1.id,
              email: "user1@example.com",
            })
          )
        })

        it("should filter users by multiple user_ids", async () => {
          const response = await api.get(
            `/admin/rbac/roles/${testRole.id}/users?user_id[]=${testUser1.id}&user_id[]=${testUser2.id}`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.users).toHaveLength(2)
        })

        it("should paginate users", async () => {
          const response = await api.get(
            `/admin/rbac/roles/${testRole.id}/users?limit=1&offset=0`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(2)
          expect(response.data.users).toHaveLength(1)
          expect(response.data.limit).toEqual(1)
          expect(response.data.offset).toEqual(0)
        })

        it("should return empty array for role with no users", async () => {
          const emptyRoleResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Empty Role",
              description: "Role with no users",
            },
            adminHeaders
          )
          const emptyRole = emptyRoleResponse.data.role

          const response = await api.get(
            `/admin/rbac/roles/${emptyRole.id}/users`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.count).toEqual(0)
          expect(response.data.users).toHaveLength(0)
        })
      })

      describe("POST /admin/rbac/roles/:id/users", () => {
        it("should assign multiple users to a role", async () => {
          const userModule = container.resolve(Modules.USER)

          // Create test users
          const testUser1 = await userModule.createUsers({
            email: "testuser1@example.com",
            first_name: "Test",
            last_name: "User1",
          })
          const testUser2 = await userModule.createUsers({
            email: "testuser2@example.com",
            first_name: "Test",
            last_name: "User2",
          })

          // Create a role
          const roleResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Batch Test Role",
              description: "Role for batch user assignment",
            },
            adminHeaders
          )
          const testRole = roleResponse.data.role

          // Assign multiple users to the role
          const response = await api.post(
            `/admin/rbac/roles/${testRole.id}/users`,
            { users: [testUser1.id, testUser2.id] },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.users).toHaveLength(2)
          expect(response.data.users).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ id: testUser1.id }),
              expect.objectContaining({ id: testUser2.id }),
            ])
          )

          // Verify users were assigned
          const verifyResponse = await api.get(
            `/admin/rbac/roles/${testRole.id}/users`,
            adminHeaders
          )
          expect(verifyResponse.data.count).toEqual(2)
        })

        it("should return 404 for non-existent role", async () => {
          const error = await api
            .post(
              `/admin/rbac/roles/non_existent_id/users`,
              { users: ["user_123"] },
              adminHeaders
            )
            .catch((e) => e)

          expect(error.response.status).toEqual(404)
        })
      })

      describe("DELETE /admin/rbac/roles/:id/users", () => {
        it("should remove multiple users from a role", async () => {
          const userModule = container.resolve(Modules.USER)
          const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

          // Create test users
          const testUser1 = await userModule.createUsers({
            email: "removeuser1@example.com",
            first_name: "Remove",
            last_name: "User1",
          })
          const testUser2 = await userModule.createUsers({
            email: "removeuser2@example.com",
            first_name: "Remove",
            last_name: "User2",
          })

          // Create a role
          const roleResponse = await api.post(
            "/admin/rbac/roles",
            {
              name: "Batch Remove Test Role",
              description: "Role for batch user removal",
            },
            adminHeaders
          )
          const testRole = roleResponse.data.role

          // Assign users to the role
          await remoteLink.create([
            {
              [Modules.USER]: { user_id: testUser1.id },
              [Modules.RBAC]: { rbac_role_id: testRole.id },
            },
            {
              [Modules.USER]: { user_id: testUser2.id },
              [Modules.RBAC]: { rbac_role_id: testRole.id },
            },
          ])

          // Verify users were assigned
          const beforeResponse = await api.get(
            `/admin/rbac/roles/${testRole.id}/users`,
            adminHeaders
          )
          expect(beforeResponse.data.count).toEqual(2)

          // Remove multiple users from the role
          const deleteResponse = await api.delete(
            `/admin/rbac/roles/${testRole.id}/users`,
            {
              ...adminHeaders,
              data: { users: [testUser1.id, testUser2.id] },
            }
          )

          expect(deleteResponse.status).toEqual(200)
          expect(deleteResponse.data).toEqual({
            ids: [testUser1.id, testUser2.id],
            object: "role_user",
            deleted: true,
          })

          // Verify users were removed
          const afterResponse = await api.get(
            `/admin/rbac/roles/${testRole.id}/users`,
            adminHeaders
          )
          expect(afterResponse.data.count).toEqual(0)
        })

        it("should return 404 for non-existent role", async () => {
          const error = await api
            .delete(`/admin/rbac/roles/non_existent_id/users`, {
              ...adminHeaders,
              data: { users: ["user_123"] },
            })
            .catch((e) => e)

          expect(error.response.status).toEqual(404)
        })
      })
    })
  },
})
