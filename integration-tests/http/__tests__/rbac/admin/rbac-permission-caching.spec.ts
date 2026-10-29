import { fetchPolicyResources } from "@medusajs/framework"
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
    // the entries a previous test cached to keep the tests independent.
    beforeEach(async () => {
      const cachingModule = container.resolve(Modules.CACHING)
      await Promise.all(
        [readerRoleId, "rbac-policy-resources"].map((key) =>
          cachingModule.clear({ key })
        )
      )
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
          ([input]: any[]) => input.key === readerRoleId
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
