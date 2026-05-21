import {
  assignUserRolesWorkflow,
  createRbacRolesWorkflow,
  createUsersWorkflow,
  removeUserRolesWorkflow,
  updateRbacRolesWorkflow,
} from "@medusajs/core-flows"
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

      describe("Role Policies - Wildcard Permissions", () => {
        const productManagerHeaders = { headers: { ...adminHeaders.headers } }
        const universalReaderHeaders = { headers: { ...adminHeaders.headers } }
        const productReaderHeaders = { headers: { ...adminHeaders.headers } }
        const noPolicyHeaders = { headers: { ...adminHeaders.headers } }

        let productReadPolicyId: string
        let productCreatePolicyId: string
        let productUpdatePolicyId: string
        let customerReadPolicyId: string
        let customerCreatePolicyId: string

        let emptyTargetRoleId: string

        beforeEach(async () => {
          const rbacModule = container.resolve(Modules.RBAC)

          const [productRead] = await rbacModule.createRbacPolicies([
            {
              key: "product:read",
              resource: "product",
              operation: "read",
              name: "Read Products",
            },
          ])
          const [productCreate] = await rbacModule.createRbacPolicies([
            {
              key: "product:create",
              resource: "product",
              operation: "create",
              name: "Create Products",
            },
          ])
          const [productUpdate] = await rbacModule.createRbacPolicies([
            {
              key: "product:update",
              resource: "product",
              operation: "update",
              name: "Update Products",
            },
          ])
          const [customerRead] = await rbacModule.createRbacPolicies([
            {
              key: "customer:read",
              resource: "customer",
              operation: "read",
              name: "Read Customers",
            },
          ])
          const [customerCreate] = await rbacModule.createRbacPolicies([
            {
              key: "customer:create",
              resource: "customer",
              operation: "create",
              name: "Create Customers",
            },
          ])
          const [productWildcard] = await rbacModule.createRbacPolicies([
            {
              key: "product:*",
              resource: "product",
              operation: "*",
              name: "Manage Products",
            },
          ])
          const [universalRead] = await rbacModule.createRbacPolicies([
            {
              key: "*:read",
              resource: "*",
              operation: "read",
              name: "Read Anything",
            },
          ])
          const [rbacRoleUpdate] = await rbacModule.createRbacPolicies([
            {
              key: "rbac_role:update",
              resource: "rbac_role",
              operation: "update",
              name: "Update Roles",
            },
          ])

          productReadPolicyId = productRead.id
          productCreatePolicyId = productCreate.id
          productUpdatePolicyId = productUpdate.id
          customerReadPolicyId = customerRead.id
          customerCreatePolicyId = customerCreate.id

          const productManagerRole = await rbacModule.createRbacRoles({
            name: "Product Manager",
            description: "Holds product:* wildcard",
          })
          const universalReaderRole = await rbacModule.createRbacRoles({
            name: "Universal Reader",
            description: "Holds *:read wildcard",
          })
          const productReaderRole = await rbacModule.createRbacRoles({
            name: "Product Reader",
            description: "Holds only product:read",
          })
          const noPolicyRole = await rbacModule.createRbacRoles({
            name: "No Grants Role",
            description: "Only rbac_role:update; no other grants",
          })

          await rbacModule.createRbacRolePolicies([
            { role_id: productManagerRole.id, policy_id: productWildcard.id },
            { role_id: productManagerRole.id, policy_id: rbacRoleUpdate.id },
            { role_id: universalReaderRole.id, policy_id: universalRead.id },
            { role_id: universalReaderRole.id, policy_id: rbacRoleUpdate.id },
            {
              role_id: productReaderRole.id,
              policy_id: productReadPolicyId,
            },
            { role_id: productReaderRole.id, policy_id: rbacRoleUpdate.id },
            { role_id: noPolicyRole.id, policy_id: rbacRoleUpdate.id },
          ])

          await createAdminUser(
            dbConnection,
            productManagerHeaders,
            container,
            {
              email: "product-manager@medusa.js",
              roles: [productManagerRole.id],
            }
          )
          await createAdminUser(
            dbConnection,
            universalReaderHeaders,
            container,
            {
              email: "universal-reader@medusa.js",
              roles: [universalReaderRole.id],
            }
          )
          await createAdminUser(dbConnection, productReaderHeaders, container, {
            email: "product-reader@medusa.js",
            roles: [productReaderRole.id],
          })
          await createAdminUser(dbConnection, noPolicyHeaders, container, {
            email: "no-policy@medusa.js",
            roles: [noPolicyRole.id],
          })

          // Empty role used as the grant target in each scenario.
          const emptyTargetRole = await rbacModule.createRbacRoles({
            name: "Grant Target",
            description: "Role used as the target for grant attempts",
          })
          emptyTargetRoleId = emptyTargetRole.id
        })

        describe("POST /admin/rbac/roles/:id/policies", () => {
          it("allows super-admin (`*:*`) to grant any policy", async () => {
            const response = await api.post(
              `/admin/rbac/roles/${emptyTargetRoleId}/policies`,
              {
                policies: [
                  productReadPolicyId,
                  productCreatePolicyId,
                  customerReadPolicyId,
                ],
              },
              adminHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.policies).toHaveLength(3)
          })

          it("allows `resource:*` holder to grant any operation on that resource", async () => {
            const response = await api.post(
              `/admin/rbac/roles/${emptyTargetRoleId}/policies`,
              {
                policies: [
                  productReadPolicyId,
                  productCreatePolicyId,
                  productUpdatePolicyId,
                ],
              },
              productManagerHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.policies).toHaveLength(3)
          })

          it("denies `resource:*` holder when granting a different resource", async () => {
            const error = await api
              .post(
                `/admin/rbac/roles/${emptyTargetRoleId}/policies`,
                { policies: [customerReadPolicyId] },
                productManagerHeaders
              )
              .catch((e) => e)

            expect(error.response.status).toEqual(403)
            expect(error.response.data).toMatchObject({
              type: "forbidden",
              message: "Forbidden",
            })
          })

          it("allows `*:op` holder to grant that operation on any resource", async () => {
            const response = await api.post(
              `/admin/rbac/roles/${emptyTargetRoleId}/policies`,
              {
                policies: [productReadPolicyId, customerReadPolicyId],
              },
              universalReaderHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.policies).toHaveLength(2)
          })

          it("denies `*:op` holder when granting a different operation", async () => {
            const error = await api
              .post(
                `/admin/rbac/roles/${emptyTargetRoleId}/policies`,
                { policies: [customerCreatePolicyId] },
                universalReaderHeaders
              )
              .catch((e) => e)

            expect(error.response.status).toEqual(403)
          })

          it("allows exact `resource:op` holder to grant that policy", async () => {
            const response = await api.post(
              `/admin/rbac/roles/${emptyTargetRoleId}/policies`,
              { policies: [productReadPolicyId] },
              productReaderHeaders
            )

            expect(response.status).toEqual(200)
            expect(response.data.policies).toHaveLength(1)
          })

          it("denies exact-match holder when granting any other policy", async () => {
            const error = await api
              .post(
                `/admin/rbac/roles/${emptyTargetRoleId}/policies`,
                {
                  policies: [productReadPolicyId, productCreatePolicyId],
                },
                productReaderHeaders
              )
              .catch((e) => e)

            expect(error.response.status).toEqual(403)
          })

          it("denies a user whose only policy does not cover the grant target", async () => {
            const error = await api
              .post(
                `/admin/rbac/roles/${emptyTargetRoleId}/policies`,
                { policies: [productReadPolicyId] },
                noPolicyHeaders
              )
              .catch((e) => e)

            expect(error.response.status).toEqual(403)
          })

          it("returns 404 when granting a non-existent policy id", async () => {
            const error = await api
              .post(
                `/admin/rbac/roles/${emptyTargetRoleId}/policies`,
                { policies: ["rpol_does_not_exist"] },
                adminHeaders
              )
              .catch((e) => e)

            expect(error.response.status).toEqual(404)
            expect(error.response.data.message).toContain(
              "do not exist: rpol_does_not_exist"
            )
          })
        })

        describe("workflows", () => {
          it("createRbacRolesWorkflow: super-admin can create a role with any policy_ids", async () => {
            const userModule = container.resolve(Modules.USER)
            const [superAdminUser] = await userModule.listUsers({
              email: "admin@medusa.js",
            })

            const { result } = await createRbacRolesWorkflow(container).run({
              input: {
                actor_id: superAdminUser.id,
                actor: "user",
                roles: [
                  {
                    name: "Mixed Bag",
                    policy_ids: [productReadPolicyId, customerCreatePolicyId],
                  },
                ],
              },
            })

            expect(result).toHaveLength(1)

            const rolePolicies = await container
              .resolve(Modules.RBAC)
              .listRbacRolePolicies({ role_id: result[0].id })
            expect(rolePolicies).toHaveLength(2)
          })

          it("createRbacRolesWorkflow: rejects when actor lacks a policy in the set", async () => {
            const userModule = container.resolve(Modules.USER)
            const [productReader] = await userModule.listUsers({
              email: "product-reader@medusa.js",
            })

            const error = await createRbacRolesWorkflow(container)
              .run({
                input: {
                  actor_id: productReader.id,
                  actor: "user",
                  roles: [
                    {
                      name: "Would Be Forbidden",
                      policy_ids: [productReadPolicyId, customerReadPolicyId],
                    },
                  ],
                },
              })
              .catch((e) => e)

            expect(error.message).toContain("Forbidden")
          })

          it("updateRbacRolesWorkflow: super-admin can update a role's policies", async () => {
            const userModule = container.resolve(Modules.USER)
            const [superAdminUser] = await userModule.listUsers({
              email: "admin@medusa.js",
            })

            const { result } = await updateRbacRolesWorkflow(container).run({
              input: {
                actor_id: superAdminUser.id,
                actor: "user",
                selector: { id: emptyTargetRoleId },
                update: {
                  policy_ids: [productCreatePolicyId, customerReadPolicyId],
                },
              },
            })

            expect(result).toHaveLength(1)
            expect(result[0].id).toEqual(emptyTargetRoleId)

            const rolePolicies = await container
              .resolve(Modules.RBAC)
              .listRbacRolePolicies({ role_id: emptyTargetRoleId })
            expect(rolePolicies.map((rp) => rp.policy_id)).toEqual(
              expect.arrayContaining([
                productCreatePolicyId,
                customerReadPolicyId,
              ])
            )
          })

          it("authorizes a scoped holder when policy_ids fall under their wildcard", async () => {
            const userModule = container.resolve(Modules.USER)
            const [productManager] = await userModule.listUsers({
              email: "product-manager@medusa.js",
            })

            const { result } = await createRbacRolesWorkflow(container)
              .run({
                input: {
                  actor_id: productManager.id,
                  actor: "user",
                  roles: [
                    {
                      name: "Product Editor",
                      policy_ids: [productUpdatePolicyId],
                    },
                  ],
                },
              })
              .catch((e) => e)

            expect(result).toHaveLength(1)
          })
        })

        describe("assignUserRolesWorkflow / removeUserRolesWorkflow", () => {
          // A role-with-policies fixture used as the target of assign/remove
          // operations. Built once per test from the shared policy IDs.
          let productReadRoleId: string
          let mixedRoleId: string
          let assigneeUserId: string

          beforeEach(async () => {
            const rbacModule = container.resolve(Modules.RBAC)
            const userModule = container.resolve(Modules.USER)

            const productReadRole = await rbacModule.createRbacRoles({
              name: "Assignable - Product Read",
            })
            const mixedRole = await rbacModule.createRbacRoles({
              name: "Assignable - Mixed",
            })

            await rbacModule.createRbacRolePolicies([
              {
                role_id: productReadRole.id,
                policy_id: productReadPolicyId,
              },
              { role_id: mixedRole.id, policy_id: productReadPolicyId },
              { role_id: mixedRole.id, policy_id: customerCreatePolicyId },
            ])

            productReadRoleId = productReadRole.id
            mixedRoleId = mixedRole.id

            const assignee = await userModule.createUsers({
              email: "assignee@medusa.js",
              first_name: "Assignee",
              last_name: "User",
            })
            assigneeUserId = assignee.id
          })

          it("super-admin (`*:*`) can assign a role with policies to a user", async () => {
            const userModule = container.resolve(Modules.USER)
            const [superAdminUser] = await userModule.listUsers({
              email: "admin@medusa.js",
            })

            const { result } = await assignUserRolesWorkflow(container).run({
              input: {
                actor_id: superAdminUser.id,
                actor: "user",
                user_id: assigneeUserId,
                role_ids: [mixedRoleId],
              },
            })

            expect(result).toBeUndefined()
          })

          it("`resource:*` holder can assign a role whose policies fall under that resource", async () => {
            // product-manager holds product:* and can assign a role whose only
            // policy is product:read.
            const userModule = container.resolve(Modules.USER)
            const [productManager] = await userModule.listUsers({
              email: "product-manager@medusa.js",
            })

            const { result } = await assignUserRolesWorkflow(container).run({
              input: {
                actor_id: productManager.id,
                actor: "user",
                user_id: assigneeUserId,
                role_ids: [productReadRoleId],
              },
            })

            expect(result).toBeUndefined()
          })

          it("denies a scoped holder when the role contains policies outside their grant", async () => {
            // product-manager holds product:* but the mixed role also has
            // customer:create, so the assignment must be rejected.
            const userModule = container.resolve(Modules.USER)
            const [productManager] = await userModule.listUsers({
              email: "product-manager@medusa.js",
            })

            const error = await assignUserRolesWorkflow(container)
              .run({
                input: {
                  actor_id: productManager.id,
                  actor: "user",
                  user_id: assigneeUserId,
                  role_ids: [mixedRoleId],
                },
              })
              .catch((e) => e)

            expect(error.message).toContain(
              "You do not have permission to assign these roles"
            )
          })

          it("denies an actor with no roles", async () => {
            const userModule = container.resolve(Modules.USER)
            const stray = await userModule.createUsers({
              email: "stray@medusa.js",
              first_name: "Stray",
              last_name: "User",
            })

            const error = await assignUserRolesWorkflow(container)
              .run({
                input: {
                  actor_id: stray.id,
                  actor: "user",
                  user_id: assigneeUserId,
                  role_ids: [productReadRoleId],
                },
              })
              .catch((e) => e)

            expect(error.message).toContain(
              "You do not have permission to assign these roles"
            )
          })

          it("removeUserRolesWorkflow: super-admin can remove a role with policies", async () => {
            const userModule = container.resolve(Modules.USER)
            const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
            const [superAdminUser] = await userModule.listUsers({
              email: "admin@medusa.js",
            })

            await remoteLink.create({
              [Modules.USER]: { user_id: assigneeUserId },
              [Modules.RBAC]: { rbac_role_id: mixedRoleId },
            })

            const { result } = await removeUserRolesWorkflow(container).run({
              input: {
                actor_id: superAdminUser.id,
                actor: "user",
                user_id: assigneeUserId,
                role_ids: [mixedRoleId],
              },
            })

            expect(result).toBeUndefined()
          })
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
