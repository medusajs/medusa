import {
  assignRolesWorkflow,
  createRbacPoliciesWorkflow,
  createRbacRolesWorkflow,
} from "@medusajs/core-flows"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IRbacModuleService, MedusaContainer } from "@medusajs/types"
import { Modules } from "@medusajs/utils"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Workflows: RBAC", () => {
      let appContainer: MedusaContainer
      let rbacService: IRbacModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        rbacService = appContainer.resolve(Modules.RBAC) as IRbacModuleService
      })

      describe("assignRolesWorkflow", () => {
        it("rejects assigning a role the reference already holds", async () => {
          const role = await rbacService.createRbacRoles({ name: "Twice" })
          const assignment = {
            role_id: role.id,
            reference: "user",
            reference_id: "user_twice",
          }

          await assignRolesWorkflow(appContainer).run({
            input: { assignments: [assignment] },
          })
          const error = await assignRolesWorkflow(appContainer)
            .run({ input: { assignments: [assignment] } })
            .catch((e) => e)
          expect(error.message).toContain("already exists")

          const assignments = await rbacService.listRbacRoleAssignments({
            role_id: role.id,
          })
          expect(assignments).toHaveLength(1)
        })
      })

      describe("Role Policy Management", () => {
        it("should list only the policies assigned directly to a role", async () => {
          const policiesWorkflow = createRbacPoliciesWorkflow(appContainer)
          const { result: policies } = await policiesWorkflow.run({
            input: {
              policies: [
                {
                  key: "read:products",
                  resource: "product",
                  operation: "read",
                  name: "Read Products",
                },
                {
                  key: "write:products",
                  resource: "product",
                  operation: "write",
                  name: "Write Products",
                },
                {
                  key: "read:orders",
                  resource: "order",
                  operation: "read",
                  name: "Read Orders",
                },
              ],
            },
          })

          const rolesWorkflow = createRbacRolesWorkflow(appContainer)
          const { result: roles } = await rolesWorkflow.run({
            input: {
              roles: [
                {
                  name: "Product Editor",
                  policy_ids: [policies[0].id, policies[1].id],
                },
                {
                  name: "Order Viewer",
                  policy_ids: [policies[2].id],
                },
              ],
            },
          })
          const [productEditor, orderViewer] = roles

          const editorPolicies = await rbacService.listPoliciesForRole(
            productEditor.id
          )
          expect(editorPolicies.map((p) => p.key).sort()).toEqual([
            "read:products",
            "write:products",
          ])
          expect(editorPolicies[0]).not.toHaveProperty("role_id")

          const viewerPolicies = await rbacService.listPoliciesForRole(
            orderViewer.id
          )
          expect(viewerPolicies).toEqual([
            expect.objectContaining({
              id: policies[2].id,
              key: "read:orders",
              resource: "order",
              operation: "read",
            }),
          ])

          const listedRoles = await rbacService.listRbacRoles(
            { id: [productEditor.id, orderViewer.id] },
            { relations: ["policies"] }
          )
          const listedEditor = listedRoles.find(
            (role) => role.id === productEditor.id
          )
          expect(
            (listedEditor!.policies as { key: string }[])
              .map((p) => p.key)
              .sort()
          ).toEqual(["read:products", "write:products"])
        })

        it("should stop listing a policy once it is removed from the role", async () => {
          const policiesWorkflow = createRbacPoliciesWorkflow(appContainer)
          const { result: policies } = await policiesWorkflow.run({
            input: {
              policies: [
                {
                  key: "read:inventory",
                  resource: "inventory",
                  operation: "read",
                  name: "Read Inventory",
                },
                {
                  key: "write:inventory",
                  resource: "inventory",
                  operation: "write",
                  name: "Write Inventory",
                },
              ],
            },
          })

          const rolesWorkflow = createRbacRolesWorkflow(appContainer)
          const { result: roles } = await rolesWorkflow.run({
            input: {
              roles: [
                {
                  name: "Inventory Manager",
                  policy_ids: [policies[0].id, policies[1].id],
                },
              ],
            },
          })
          const role = roles[0]

          const [readAssociation] = await rbacService.listRbacRolePolicies({
            role_id: role.id,
            policy_id: policies[0].id,
          })
          await rbacService.deleteRbacRolePolicies([readAssociation.id])

          const remaining = await rbacService.listPoliciesForRole(role.id)
          expect(remaining.map((p) => p.key)).toEqual(["write:inventory"])
        })

        it("should handle a role with no policies", async () => {
          const rolesWorkflow = createRbacRolesWorkflow(appContainer)
          const { result: emptyRoles } = await rolesWorkflow.run({
            input: {
              roles: [
                {
                  name: "Empty Role",
                  description: "Role with no permissions",
                },
              ],
            },
          })

          const policies = await rbacService.listPoliciesForRole(
            emptyRoles[0].id
          )
          expect(policies).toHaveLength(0)
        })
      })

      describe("Permission Validation", () => {
        it("should prevent user without roles from creating roles with policies", async () => {
          const userModule = appContainer.resolve(Modules.USER)

          // Create a user with no roles
          const [user] = await userModule.createUsers([
            {
              email: "noroles@test.com",
              first_name: "No",
              last_name: "Roles",
            },
          ])

          // Create a policy
          const policiesWorkflow = createRbacPoliciesWorkflow(appContainer)
          const { result: policies } = await policiesWorkflow.run({
            input: {
              policies: [
                {
                  key: "read:test",
                  resource: "test",
                  operation: "read",
                  name: "Read Test",
                },
              ],
            },
          })

          // Try to create a role with this policy as a user with no roles
          const rolesWorkflow = createRbacRolesWorkflow(appContainer)

          let error: any
          try {
            await rolesWorkflow.run({
              input: {
                actor_id: user.id,
                roles: [
                  {
                    name: "Test Role",
                    policy_ids: [policies[0].id],
                  },
                ],
              },
            })
          } catch (e) {
            error = e
          }

          expect(error).toBeDefined()
          expect(error.message).toContain(
            "You do not have access to some of the policies you are trying to assign"
          )
        })

        it("should prevent user from assigning policies they don't have access to", async () => {
          const userModule = appContainer.resolve(Modules.USER)

          // Create policies
          const policiesWorkflow = createRbacPoliciesWorkflow(appContainer)
          const { result: policies } = await policiesWorkflow.run({
            input: {
              policies: [
                {
                  key: "read:products",
                  resource: "product",
                  operation: "read",
                  name: "Read Products",
                },
                {
                  key: "write:products",
                  resource: "product",
                  operation: "write",
                  name: "Write Products",
                },
                {
                  key: "delete:products",
                  resource: "product",
                  operation: "delete",
                  name: "Delete Products",
                },
              ],
            },
          })

          // Create a role with only read permission
          const rolesWorkflow = createRbacRolesWorkflow(appContainer)
          const { result: limitedRoles } = await rolesWorkflow.run({
            input: {
              roles: [
                {
                  name: "Limited Role",
                  policy_ids: [policies[0].id], // Only read:products
                },
              ],
            },
          })

          // Create a user and assign the limited role
          const [user] = await userModule.createUsers([
            {
              email: "limited@test.com",
              first_name: "Limited",
              last_name: "User",
            },
          ])

          await rbacService.createRbacRoleAssignments([
            {
              role_id: limitedRoles[0].id,
              reference: "user",
              reference_id: user.id,
            },
          ])

          // Try to create a role with write permission
          let error: any
          try {
            await rolesWorkflow.run({
              input: {
                actor_id: user.id,
                roles: [
                  {
                    name: "New Role",
                    policy_ids: [policies[1].id], // write:products - user doesn't have this
                  },
                ],
              },
            })
          } catch (e) {
            error = e
          }

          expect(error).toBeDefined()
          expect(error.message).toContain(
            "You do not have access to some of the policies you are trying to assign."
          )
        })

        it("should allow user to create roles with policies they have access to", async () => {
          const userModule = appContainer.resolve(Modules.USER)

          // Create policies
          const policiesWorkflow = createRbacPoliciesWorkflow(appContainer)
          const { result: policies } = await policiesWorkflow.run({
            input: {
              policies: [
                {
                  key: "read:orders",
                  resource: "order",
                  operation: "read",
                  name: "Read Orders",
                },
                {
                  key: "write:orders",
                  resource: "order",
                  operation: "write",
                  name: "Write Orders",
                },
              ],
            },
          })

          // Create an admin role with both permissions
          const rolesWorkflow = createRbacRolesWorkflow(appContainer)
          const { result: adminRoles } = await rolesWorkflow.run({
            input: {
              roles: [
                {
                  name: "Order Admin",
                  policy_ids: [policies[0].id, policies[1].id],
                },
              ],
            },
          })

          // Create a user and assign the admin role
          const [user] = await userModule.createUsers([
            {
              email: "admin@test.com",
              first_name: "Admin",
              last_name: "User",
            },
          ])

          await rbacService.createRbacRoleAssignments([
            {
              role_id: adminRoles[0].id,
              reference: "user",
              reference_id: user.id,
            },
          ])

          // User should be able to create a role with read permission (which they have)
          const { result: newRoles } = await rolesWorkflow.run({
            input: {
              actor_id: user.id,
              roles: [
                {
                  name: "Order Viewer",
                  policy_ids: [policies[0].id], // read:orders - user has this
                },
              ],
            },
          })

          expect(newRoles).toHaveLength(1)
          expect(newRoles[0].name).toBe("Order Viewer")

          // Verify the role was created with the correct policy
          const newRolePolicies = await rbacService.listPoliciesForRole(
            newRoles[0].id
          )
          expect(newRolePolicies).toHaveLength(1)
          expect(newRolePolicies[0].key).toBe("read:orders")
        })
      })
    })
  },
})
