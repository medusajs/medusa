import { IRbacModuleService } from "@medusajs/framework/types"
import { Module, Modules, Policy } from "@medusajs/framework/utils"
import {
  MockEventBusService,
  moduleIntegrationTestRunner,
} from "@medusajs/test-utils"
import { RbacModuleService } from "@services"

jest.setTimeout(30000)

moduleIntegrationTestRunner<IRbacModuleService>({
  moduleName: Modules.RBAC,
  debug: true,
  moduleOptions: {},
  injectedDependencies: {
    [Modules.EVENT_BUS]: new MockEventBusService(),
  },
  testSuite: ({ service }) => {
    it.skip(`should export the appropriate linkable configuration`, () => {
      const linkable = Module(Modules.RBAC, {
        service: RbacModuleService,
      }).linkable

      expect(Object.keys(linkable)).toEqual([
        "rbacRole",
        "rbacPolicy",
        "rbacRoleParent",
        "rbacRolePolicy",
      ])

      Object.keys(linkable).forEach((key) => {
        delete linkable[key].toJSON
      })

      expect(linkable).toEqual({
        rbacRole: {
          id: {
            linkable: "rbac_role_id",
            entity: "RbacRole",
            primaryKey: "id",
            serviceName: "rbac",
            field: "rbacRole",
          },
        },
        rbacPolicy: {
          id: {
            linkable: "rbac_policy_id",
            entity: "RbacPolicy",
            primaryKey: "id",
            serviceName: "rbac",
            field: "rbacPolicy",
          },
        },
        rbacRoleParent: {
          id: {
            linkable: "rbac_role_parent_id",
            entity: "RbacRoleParent",
            primaryKey: "id",
            serviceName: "rbac",
            field: "rbacRoleParent",
          },
        },
        rbacRolePolicy: {
          id: {
            linkable: "rbac_role_policy_id",
            entity: "RbacRolePolicy",
            primaryKey: "id",
            serviceName: "rbac",
            field: "rbacRolePolicy",
          },
        },
      })
    })

    describe("RBAC Module Service", () => {
      it("should create and manage roles and policies", async () => {
        // Create a custom policy
        const customPolicy = await service.createRbacPolicies({
          key: "read:product",
          resource: "product",
          operation: "read",
          name: "Read Products",
          description: "Permission to read products",
        })

        expect(customPolicy.id).toBeDefined()
        expect(customPolicy.key).toBe("read:product")
        expect(customPolicy.resource).toBe("product")
        expect(customPolicy.operation).toBe("read")

        // Create a custom role
        const customRole = await service.createRbacRoles({
          name: "Product Viewer",
          description: "Can view products",
        })

        expect(customRole.id).toBeDefined()
        expect(customRole.name).toBe("Product Viewer")

        // Link policy to role
        const rolePolicyLink = await service.createRbacRolePolicies({
          role_id: customRole.id,
          policy_id: customPolicy.id,
        })

        expect(rolePolicyLink.id).toBeDefined()
        expect(rolePolicyLink.role_id).toBe(customRole.id)
        expect(rolePolicyLink.policy_id).toBe(customPolicy.id)

        // Verify the link
        const roleWithPolicies = await service.listRbacRoles(
          {
            id: customRole.id,
          },
          { relations: ["policies"] }
        )

        expect(roleWithPolicies).toHaveLength(1)
        expect(roleWithPolicies[0].policies).toHaveLength(1)
        expect(roleWithPolicies[0].policies![0].key).toBe("read:product")
      })

      it("should list policies for role", async () => {
        // Create role and policy
        const role = await service.createRbacRoles({
          name: "Test Role",
          description: "Test role for listing policies",
        })

        const policy = await service.createRbacPolicies({
          key: "test:action",
          resource: "test",
          operation: "test",
          name: "Test Policy",
          description: "Test policy",
        })

        // Link them
        await service.createRbacRolePolicies({
          role_id: role.id,
          policy_id: policy.id,
        })

        // List policies for role
        const policies = await service.listPoliciesForRole(role.id)

        expect(policies).toHaveLength(1)
        expect(policies[0].key).toBe("test:action")
        expect(policies[0].resource).toBe("test")
        expect(policies[0].operation).toBe("test")
      })

      it("should handle soft delete and restore", async () => {
        // Create a role
        const role = await service.createRbacRoles({
          name: "Test Role",
          description: "Test role for soft delete",
        })

        // Soft delete the role
        await service.softDeleteRbacRoles(role.id)

        // Verify it's soft deleted
        const deletedRoles = await service.listRbacRoles(
          {
            id: role.id,
          },
          { withDeleted: true }
        )

        expect(deletedRoles).toHaveLength(1)
        expect(deletedRoles[0].deleted_at).toBeDefined()

        // Try to list without deleted - should not appear
        const activeRoles = await service.listRbacRoles({
          id: role.id,
        })

        expect(activeRoles).toHaveLength(0)

        // Restore the role
        await service.restoreRbacRoles(role.id)

        // Verify it's restored
        const restoredRoles = await service.listRbacRoles({
          id: role.id,
        })

        expect(restoredRoles).toHaveLength(1)
        expect(restoredRoles[0].deleted_at).toBeNull()
      })

      it("should prevent duplicate creation", async () => {
        // Create a role
        const role = await service.createRbacRoles({
          name: "Test Role",
          description: "Test role for duplicate prevention",
        })

        // Try to create another role with the same ID - should fail
        await expect(
          service.createRbacRoles({
            id: role.id,
            name: "Duplicate Role",
            description: "This should not be created",
          })
        ).rejects.toThrow()

        // Still only one role should exist
        const roles = await service.listRbacRoles({
          id: role.id,
        })

        expect(roles).toHaveLength(1)
        expect(roles[0].name).toBe("Test Role") // Original name preserved
      })

      it("should verify super admin role structure", async () => {
        // Check if the super admin role was created
        const existingSuperAdminRoles = await service.listRbacRoles()

        expect(existingSuperAdminRoles).toHaveLength(1)
        expect(existingSuperAdminRoles[0].name).toBe("Super Admin")
        expect(existingSuperAdminRoles[0].description).toBe(
          "Super admin role with full access to all resources and operations"
        )

        // Check if the wildcard policy was created
        const existingWildcardPolicies = await service.listRbacPolicies()

        expect(existingWildcardPolicies).toHaveLength(1)
        expect(existingWildcardPolicies[0].key).toBe("*:*")
        expect(existingWildcardPolicies[0].resource).toBe("*")
        expect(existingWildcardPolicies[0].operation).toBe("*")
        expect(existingWildcardPolicies[0].name).toBe("Super Admin")
        expect(existingWildcardPolicies[0].description).toBe(
          "Super admin policy with full access to all resources and operations"
        )

        // Check if the role-policy link was created
        const existingRolePolicyLinks = await service.listRbacRolePolicies()

        expect(existingRolePolicyLinks).toHaveLength(1)
        expect(existingRolePolicyLinks[0]).toEqual(
          expect.objectContaining({
            role_id: expect.any(String),
            policy_id: expect.any(String),
          })
        )

        // Verify the role has the wildcard policy
        const roleWithPolicies = await service.listRbacRoles(
          {
            id: "role_super_admin",
          },
          { relations: ["policies"] }
        )

        expect(roleWithPolicies).toHaveLength(1)
        expect(roleWithPolicies[0].policies).toHaveLength(1)
        expect(roleWithPolicies[0].policies![0].resource).toBe("*")
        expect(roleWithPolicies[0].policies![0].operation).toBe("*")
        expect(roleWithPolicies[0].policies![0].key).toBe("*:*")
      })

      it("should upsert roles correctly", async () => {
        // Create a new role
        const newRole = await service.createRbacRoles([
          {
            name: "Test Role",
            description: "Test role description",
          },
        ])

        expect(newRole[0].id).toBeDefined()
        expect(newRole[0].name).toBe("Test Role")
        expect(newRole[0].description).toBe("Test role description")

        // Update the same role
        const updatedRoles = await service.updateRbacRoles([
          {
            id: newRole[0].id,
            name: "Updated Test Role",
            description: "Updated test role description",
          },
        ])

        expect(updatedRoles[0].id).toBe(newRole[0].id)
        expect(updatedRoles[0].name).toBe("Updated Test Role")
        expect(updatedRoles[0].description).toBe(
          "Updated test role description"
        )

        // Verify only one role exists
        const roles = await service.listRbacRoles({
          id: newRole[0].id,
        })

        expect(roles).toHaveLength(1)
        expect(roles[0].name).toBe("Updated Test Role")
      })
    })

    describe("registered policy sync", () => {
      const VENDOR_READ = {
        name: "ReadVendors",
        resource: "vendor",
        operation: "read",
        description: "Read vendors",
      }

      const VENDOR_WRITE = {
        name: "WriteVendors",
        resource: "vendor",
        operation: "write",
        description: "Write vendors",
      }

      let registeredNames: string[] = []
      let warnSpy: jest.SpyInstance

      // The module resolves `logger` from the container, and the module test
      // runner injects `console` as the logger.
      beforeEach(() => {
        registeredNames = []
        warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {})
      })

      afterEach(() => {
        registeredNames.forEach((name) => delete Policy[name])
        warnSpy.mockRestore()
      })

      /**
       * Declares a policy the way `definePolicies` does, so the next sync sees
       * it as part of the running build.
       */
      const registerPolicy = ({
        name,
        ...policy
      }: typeof VENDOR_READ): void => {
        Policy[name] = policy
        registeredNames.push(name)
      }

      const restartApplication = async (): Promise<void> => {
        await (service as any).__hooks.onApplicationStart()
      }

      it("should keep a policy created through the API when the application restarts", async () => {
        const created = await service.createRbacPolicies({
          key: "vendor:read",
          resource: "vendor",
          operation: "read",
          name: "ReadVendors",
        })

        await restartApplication()

        const [policy] = await service.listRbacPolicies(
          { id: created.id },
          { withDeleted: true }
        )

        expect(policy.id).toBe(created.id)
        expect(policy.deleted_at).toBeNull()
        expect(policy.is_registered).toBe(false)
      })

      it("should not archive an API-created policy while archiving a code-declared one", async () => {
        const apiPolicy = await service.createRbacPolicies({
          key: "vendor:read",
          resource: "vendor",
          operation: "read",
          name: "ReadVendors",
        })

        registerPolicy(VENDOR_WRITE)
        await restartApplication()

        // Simulate a build that no longer declares the policy
        delete Policy[VENDOR_WRITE.name]
        await restartApplication()

        const [survivor] = await service.listRbacPolicies(
          { id: apiPolicy.id },
          { withDeleted: true }
        )
        const [archived] = await service.listRbacPolicies(
          { key: "vendor:write" },
          { withDeleted: true }
        )

        expect(survivor.deleted_at).toBeNull()
        expect(archived.deleted_at).not.toBeNull()
      })

      it("should archive, warn about, and revoke grants for policies missing from the current code build", async () => {
        registerPolicy(VENDOR_READ)
        await restartApplication()

        const [created] = await service.listRbacPolicies({ key: "vendor:read" })
        expect(created.is_registered).toBe(true)

        const role = await service.createRbacRoles({ name: "Vendor Manager" })
        const grant = await service.createRbacRolePolicies({
          role_id: role.id,
          policy_id: created.id,
        })

        // Simulate a build that no longer declares the policy
        delete Policy[VENDOR_READ.name]
        await restartApplication()

        const [afterRestart] = await service.listRbacPolicies(
          { key: "vendor:read" },
          { withDeleted: true }
        )
        expect(afterRestart.id).toBe(created.id)
        expect(afterRestart.deleted_at).not.toBeNull()

        // The archival is announced rather than silent
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining("vendor:read")
        )

        // The grant is archived alongside it, so the grant table cannot report
        // a permission that no longer resolves
        const [archivedGrant] = await service.listRbacRolePolicies(
          { id: grant.id },
          { withDeleted: true }
        )
        expect(archivedGrant.deleted_at).not.toBeNull()
        expect(await service.listPoliciesForRole(role.id)).toHaveLength(0)
      })

      it("should create registered policies and restore them once archived", async () => {
        registerPolicy(VENDOR_READ)
        await restartApplication()

        const [created] = await service.listRbacPolicies({ key: "vendor:read" })

        expect(created.name).toBe(VENDOR_READ.name)
        expect(created.description).toBe(VENDOR_READ.description)

        await service.softDeleteRbacPolicies([created.id])
        expect(
          await service.listRbacPolicies({ key: "vendor:read" })
        ).toHaveLength(0)

        await restartApplication()

        const [restored] = await service.listRbacPolicies({
          key: "vendor:read",
        })

        expect(restored.id).toBe(created.id)
        expect(restored.deleted_at).toBeNull()
      })

      it("should keep existing role grants resolvable across restarts", async () => {
        const role = await service.createRbacRoles({ name: "Vendor Manager" })
        const policy = await service.createRbacPolicies({
          key: "vendor:read",
          resource: "vendor",
          operation: "read",
          name: "ReadVendors",
        })

        await service.createRbacRolePolicies({
          role_id: role.id,
          policy_id: policy.id,
        })

        expect(await service.listPoliciesForRole(role.id)).toHaveLength(1)

        await restartApplication()

        const policies = await service.listPoliciesForRole(role.id)

        expect(policies).toHaveLength(1)
        expect(policies[0].key).toBe("vendor:read")
      })

      it("should archive and restore role grants along with the policy", async () => {
        const role = await service.createRbacRoles({ name: "Vendor Manager" })
        const policy = await service.createRbacPolicies({
          key: "vendor:read",
          resource: "vendor",
          operation: "read",
          name: "ReadVendors",
        })

        const grant = await service.createRbacRolePolicies({
          role_id: role.id,
          policy_id: policy.id,
        })

        await service.softDeleteRbacPolicies([policy.id])

        const [archivedGrant] = await service.listRbacRolePolicies(
          { id: grant.id },
          { withDeleted: true }
        )

        expect(archivedGrant.deleted_at).not.toBeNull()
        expect(await service.listPoliciesForRole(role.id)).toHaveLength(0)

        await service.restoreRbacPolicies([policy.id])

        const [restoredGrant] = await service.listRbacRolePolicies({
          id: grant.id,
        })

        expect(restoredGrant.deleted_at).toBeNull()
        expect(await service.listPoliciesForRole(role.id)).toHaveLength(1)
      })
    })
  },
})
