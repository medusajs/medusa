import { fetchPolicyResources, RBAC_CACHE_TTL } from "@medusajs/framework"
import {
  Modules,
  PolicyOperation,
  RBAC_CACHE_TAGS,
} from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.ENABLE_RBAC_MODULE = "true"
process.env.MEDUSA_FF_CACHING = "true"

/**
 * With caching enabled, each role's policies and the governed resource set are
 * cached. These cases warm the cache with a request that passes `authorize`,
 * change the underlying RBAC rows, and assert the very next request sees the
 * change: the RBAC module's events must invalidate the cached entries through
 * their tags.
 */
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    let container
    let rbacModule
    let readerRoleId: string
    let productReadId: string

    const readerHeaders = { headers: { ...adminHeaders.headers } }

    const listProducts = () =>
      api
        .get("/admin/products", readerHeaders)
        .then((response) => response.status)
        .catch((error) => error.response.status)

    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      rbacModule = container.resolve(Modules.RBAC)

      const key = `product:${PolicyOperation.read}`
      let [productRead] = await rbacModule.listRbacPolicies({ key })
      if (!productRead) {
        ;[productRead] = await rbacModule.createRbacPolicies([
          {
            key,
            resource: "product",
            operation: PolicyOperation.read,
            name: key,
          },
        ])
      }
      productReadId = productRead.id

      const readerRole = await rbacModule.createRbacRoles({
        name: "Cached Product Reader",
      })
      readerRoleId = readerRole.id

      await rbacModule.createRbacRolePolicies([
        { role_id: readerRoleId, policy_id: productReadId },
      ])

      await createAdminUser(dbConnection, readerHeaders, container, {
        email: "cached-reader@medusa.js",
        roles: [readerRoleId],
      })

      await dbUtils.snapshot()
    })

    // Restoring the database snapshot between tests emits no events, so drop
    // the entries a previous test cached to keep the tests independent. Every
    // RBAC entry carries at least one of the list tags.
    beforeEach(async () => {
      const cachingModule = container.resolve(Modules.CACHING)
      await cachingModule.clear({
        tags: [
          RBAC_CACHE_TAGS.ROLE_LIST,
          RBAC_CACHE_TAGS.POLICY_LIST,
          RBAC_CACHE_TAGS.ROLE_POLICY_LIST,
          RBAC_CACHE_TAGS.ROLE_ASSIGNMENT_LIST,
        ],
      })
    })

    afterAll(async () => {
      delete process.env.ENABLE_RBAC_MODULE
      delete process.env.MEDUSA_FF_CACHING
    })

    it("tags the cached role policies with the role, role policy and policy tags", async () => {
      const cachingModule = container.resolve(Modules.CACHING)
      const setSpy = jest.spyOn(cachingModule, "set")

      try {
        expect(await listProducts()).toEqual(200)

        const roleCall = setSpy.mock.calls.find(
          ([input]: any[]) =>
            input.key === `rbac-role-permissions:${readerRoleId}`
        )
        expect(roleCall).toBeDefined()
        expect((roleCall![0] as any).tags).toEqual(
          expect.arrayContaining([
            RBAC_CACHE_TAGS.role(readerRoleId),
            RBAC_CACHE_TAGS.ROLE_POLICY_LIST,
            RBAC_CACHE_TAGS.policy(productReadId),
          ])
        )
      } finally {
        setSpy.mockRestore()
      }
    })

    it("reflects a mutation made directly through the module service", async () => {
      expect(await listProducts()).toEqual(200)

      const [rolePolicy] = await rbacModule.listRbacRolePolicies({
        role_id: readerRoleId,
        policy_id: productReadId,
      })
      await rbacModule.deleteRbacRolePolicies([rolePolicy.id])

      expect(await listProducts()).toEqual(403)
    })

    it("reflects unassigning and re-assigning the role", async () => {
      expect(await listProducts()).toEqual(200)

      const [reader] = await container
        .resolve(Modules.USER)
        .listUsers({ email: "cached-reader@medusa.js" })
      const [assignment] = await rbacModule.listRbacRoleAssignments({
        role_id: readerRoleId,
        reference: "user",
        reference_id: reader.id,
      })
      await rbacModule.deleteRbacRoleAssignments([assignment.id])

      expect(await listProducts()).toEqual(403)

      await rbacModule.createRbacRoleAssignments([
        { role_id: readerRoleId, reference: "user", reference_id: reader.id },
      ])

      expect(await listProducts()).toEqual(200)
    })

    it("reflects detaching and re-attaching a policy", async () => {
      expect(await listProducts()).toEqual(200)

      await api.delete(
        `/rbac/roles/${readerRoleId}/policies/${productReadId}`,
        adminHeaders
      )
      expect(await listProducts()).toEqual(403)

      await api.post(
        `/rbac/roles/${readerRoleId}/policies`,
        { policies: [productReadId] },
        adminHeaders
      )
      expect(await listProducts()).toEqual(200)
    })

    it("reflects deleting the role", async () => {
      expect(await listProducts()).toEqual(200)

      await api.delete(`/rbac/roles/${readerRoleId}`, adminHeaders)

      expect(await listProducts()).toEqual(403)
    })

    it("reflects updating the policy itself", async () => {
      expect(await listProducts()).toEqual(200)

      await rbacModule.updateRbacPolicies({
        id: productReadId,
        operation: PolicyOperation.update,
      })
      expect(await listProducts()).toEqual(403)

      await rbacModule.updateRbacPolicies({
        id: productReadId,
        operation: PolicyOperation.read,
      })
      expect(await listProducts()).toEqual(200)
    })

    it("reflects a role's policies changing in the covered roles of the actor's permissions", async () => {
      const coveredRoles = () =>
        api
          .get("/rbac/me/permissions", readerHeaders)
          .then((response) => response.data.covered_roles as string[])

      const coveredRole = await rbacModule.createRbacRoles({
        name: "Cached Covered Role",
      })
      await rbacModule.createRbacRolePolicies([
        { role_id: coveredRole.id, policy_id: productReadId },
      ])

      expect(await coveredRoles()).toContain(coveredRole.name)

      const [productUpdate] = await rbacModule.listRbacPolicies({
        key: `product:${PolicyOperation.update}`,
      })
      await rbacModule.createRbacRolePolicies([
        { role_id: coveredRole.id, policy_id: productUpdate.id },
      ])

      expect(await coveredRoles()).not.toContain(coveredRole.name)
    })

    it("reflects a newly created policy in a super admin's permissions", async () => {
      const permissions = () =>
        api
          .get("/rbac/me/permissions", adminHeaders)
          .then((response) => response.data.permissions as string[])

      expect(await permissions()).not.toContain("gadget:read")

      await api.post(
        "/rbac/policies",
        { key: "gadget:read", resource: "gadget", operation: "read" },
        adminHeaders
      )

      expect(await permissions()).toContain("gadget:read")
    })

    it("reflects creating and deleting a policy on a new resource in the governed set", async () => {
      expect((await fetchPolicyResources(container)).has("widget")).toEqual(
        false
      )

      const [widgetRead] = await rbacModule.createRbacPolicies([
        {
          key: "widget:read",
          resource: "widget",
          operation: PolicyOperation.read,
          name: "Read Widgets",
        },
      ])
      expect((await fetchPolicyResources(container)).has("widget")).toEqual(
        true
      )

      await rbacModule.deleteRbacPolicies([widgetRead.id])
      expect((await fetchPolicyResources(container)).has("widget")).toEqual(
        false
      )
    })
  },
})
