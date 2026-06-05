import { Modules } from "@medusajs/framework/utils"
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

    // Headers for users holding different scoped roles.
    const productManagerHeaders = { headers: { ...adminHeaders.headers } }
    const universalReaderHeaders = { headers: { ...adminHeaders.headers } }
    const productReaderHeaders = { headers: { ...adminHeaders.headers } }
    const noRolesUserHeaders = { headers: { ...adminHeaders.headers } }

    // Policy IDs created in setup, used to compose roles below.
    let productReadId: string
    let customerCreateId: string

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const rbacModule = container.resolve(Modules.RBAC)

      // Look up an existing policy by key, or create it if absent.
      const ensurePolicy = async (params: {
        key: string
        resource: string
        operation: string
        name: string
      }) => {
        const [existing] = await rbacModule.listRbacPolicies({
          key: params.key,
        })
        if (existing) {
          return existing
        }
        const [created] = await rbacModule.createRbacPolicies([params])
        return created
      }

      // Concrete policies — these form the "universe" the endpoint expands
      // wildcard grants against.
      const productRead = await ensurePolicy({
        key: "product:read",
        resource: "product",
        operation: "read",
        name: "Read Products",
      })
      await ensurePolicy({
        key: "product:create",
        resource: "product",
        operation: "create",
        name: "Create Products",
      })
      await ensurePolicy({
        key: "product:update",
        resource: "product",
        operation: "update",
        name: "Update Products",
      })
      await ensurePolicy({
        key: "customer:read",
        resource: "customer",
        operation: "read",
        name: "Read Customers",
      })
      const customerCreate = await ensurePolicy({
        key: "customer:create",
        resource: "customer",
        operation: "create",
        name: "Create Customers",
      })

      productReadId = productRead.id
      customerCreateId = customerCreate.id

      // Wildcard grants attached to scoped roles below.
      const productWildcard = await ensurePolicy({
        key: "product:*",
        resource: "product",
        operation: "*",
        name: "Manage Products",
      })
      const universalRead = await ensurePolicy({
        key: "*:read",
        resource: "*",
        operation: "read",
        name: "Read Anything",
      })

      const productManagerRole = await rbacModule.createRbacRoles({
        name: "Product Manager",
      })
      const universalReaderRole = await rbacModule.createRbacRoles({
        name: "Universal Reader",
      })
      const productReaderRole = await rbacModule.createRbacRoles({
        name: "Product Reader",
      })

      await rbacModule.createRbacRolePolicies([
        { role_id: productManagerRole.id, policy_id: productWildcard.id },
        { role_id: universalReaderRole.id, policy_id: universalRead.id },
        { role_id: productReaderRole.id, policy_id: productReadId },
      ])

      await createAdminUser(dbConnection, productManagerHeaders, container, {
        email: "product-manager@medusa.js",
        roles: [productManagerRole.id],
      })
      await createAdminUser(dbConnection, universalReaderHeaders, container, {
        email: "universal-reader@medusa.js",
        roles: [universalReaderRole.id],
      })
      await createAdminUser(dbConnection, productReaderHeaders, container, {
        email: "product-reader@medusa.js",
        roles: [productReaderRole.id],
      })
      // User with no roles linked at all — `createAdminUser` honors an empty
      // `roles` array by skipping the rbac link step.
      await createAdminUser(dbConnection, noRolesUserHeaders, container, {
        email: "no-roles@medusa.js",
        roles: [],
      })
    })

    afterAll(async () => {
      delete process.env.MEDUSA_FF_RBAC
    })

    describe("GET /admin/rbac/me/permissions", () => {
      it("returns the full universe for a super-admin (`*:*`)", async () => {
        const response = await api.get(
          "/admin/rbac/me/permissions",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        // Super-admin should receive every concrete permission seeded above.
        expect(response.data.permissions).toEqual(
          expect.arrayContaining([
            "product:read",
            "product:create",
            "product:update",
            "customer:read",
            "customer:create",
          ])
        )
      })

      it("does not include wildcard-only entries in the response", async () => {
        const response = await api.get(
          "/admin/rbac/me/permissions",
          adminHeaders
        )

        // `*:*`, `*:read`, `product:*` are grants — the response only carries
        // concrete `resource:operation` entries.
        for (const entry of response.data.permissions) {
          expect(entry).not.toContain("*")
        }
      })

      it("returns sorted output for deterministic ordering", async () => {
        const response = await api.get(
          "/admin/rbac/me/permissions",
          adminHeaders
        )

        const sorted = [...response.data.permissions].sort()
        expect(response.data.permissions).toEqual(sorted)
      })

      it("expands `resource:*` to all ops on that resource only", async () => {
        const response = await api.get(
          "/admin/rbac/me/permissions",
          productManagerHeaders
        )

        expect(response.status).toEqual(200)
        // product:* should cover every product:op in the universe.
        expect(response.data.permissions).toEqual(
          expect.arrayContaining([
            "product:read",
            "product:create",
            "product:update",
          ])
        )
        // ...but never reach into a different resource.
        expect(response.data.permissions).not.toContain("customer:read")
        expect(response.data.permissions).not.toContain("customer:create")
      })

      it("expands `*:op` to that op on every resource in the universe", async () => {
        const response = await api.get(
          "/admin/rbac/me/permissions",
          universalReaderHeaders
        )

        expect(response.status).toEqual(200)
        // *:read should grant read on each resource that has a read entry.
        expect(response.data.permissions).toEqual(
          expect.arrayContaining(["product:read", "customer:read"])
        )
        // ...and nothing else.
        expect(response.data.permissions).not.toContain("product:create")
        expect(response.data.permissions).not.toContain("customer:create")
      })

      it("returns only the literal grant for an exact-match holder", async () => {
        const response = await api.get(
          "/admin/rbac/me/permissions",
          productReaderHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.permissions).toEqual(["product:read"])
      })

      it("returns an empty array when the actor has no roles", async () => {
        const response = await api.get(
          "/admin/rbac/me/permissions",
          noRolesUserHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.permissions).toEqual([])
      })

      it("includes resources persisted at runtime in the universe", async () => {
        // Simulate a plugin- or admin-created policy for a resource not known
        // at build time. A super-admin (`*:*`) should pick it up because the
        // route unions the global `Policy` registry with rbac_policy rows.
        const rbacModule = container.resolve(Modules.RBAC)
        const [existing] = await rbacModule.listRbacPolicies({
          key: "shipment:dispatch",
        })
        if (!existing) {
          await rbacModule.createRbacPolicies([
            {
              key: "shipment:dispatch",
              resource: "shipment",
              operation: "dispatch",
              name: "Dispatch Shipments",
            },
          ])
        }

        const response = await api.get(
          "/admin/rbac/me/permissions",
          adminHeaders
        )

        expect(response.data.permissions).toContain("shipment:dispatch")
      })

      it("aggregates grants when an actor holds multiple roles", async () => {
        const rbacModule = container.resolve(Modules.RBAC)

        // Two scoped roles: one grants product:read, the other customer:create.
        // The aggregation rule under test is that an actor holding both ends
        // up with the union of their grants in the response.
        const productReaderOnly = await rbacModule.createRbacRoles({
          name: "Product Reader Only",
        })
        const customerCreatorOnly = await rbacModule.createRbacRoles({
          name: "Customer Creator Only",
        })
        await rbacModule.createRbacRolePolicies([
          { role_id: productReaderOnly.id, policy_id: productReadId },
          { role_id: customerCreatorOnly.id, policy_id: customerCreateId },
        ])

        const multiRoleHeaders = { headers: { ...adminHeaders.headers } }
        await createAdminUser(dbConnection, multiRoleHeaders, container, {
          email: "multi-role@medusa.js",
          roles: [productReaderOnly.id, customerCreatorOnly.id],
        })

        const response = await api.get(
          "/admin/rbac/me/permissions",
          multiRoleHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.permissions).toEqual(
          expect.arrayContaining(["product:read", "customer:create"])
        )
        // No grants beyond what the two roles provide.
        expect(response.data.permissions).not.toContain("product:create")
        expect(response.data.permissions).not.toContain("customer:read")
      })
    })
  },
})
