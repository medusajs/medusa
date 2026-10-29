import { Modules, PolicyOperation } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.ENABLE_RBAC_MODULE = "true"

/**
 * `GET /admin/search` resolves its entities at request time, so it can't be
 * guarded by a static `authorize`: the entities the actor can't read are
 * dropped from the results instead.
 *
 * The Search Module is registered in this app with `customer` and `product`
 * indexes, so other entities go through the graph fallback.
 */
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    const productReaderHeaders = { headers: { ...adminHeaders.headers } }
    const priceListReaderHeaders = { headers: { ...adminHeaders.headers } }
    const apiKeyReaderHeaders = { headers: { ...adminHeaders.headers } }
    const noRolesHeaders = { headers: { ...adminHeaders.headers } }

    const ENTITIES_QUERY =
      "entity[]=order&entity[]=customer&entity[]=product&entity[]=price_list"
    const API_KEY_ENTITIES_QUERY =
      "entity[]=publishable_api_key&entity[]=secret_api_key&entity[]=product"

    const searchEntities = async (
      path: string,
      headers: typeof adminHeaders
    ) => {
      const response = await api.get(path, headers)
      expect(response.status).toEqual(200)
      return response.data.results.map((group) => group.entity)
    }

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const rbacModule = container.resolve(Modules.RBAC)

      const ensurePolicy = async (resource: string) => {
        const key = `${resource}:${PolicyOperation.read}`
        const [existing] = await rbacModule.listRbacPolicies({ key })
        if (existing) {
          return existing
        }
        const [created] = await rbacModule.createRbacPolicies([
          { key, resource, operation: PolicyOperation.read, name: key },
        ])
        return created
      }

      const readers: [string, typeof adminHeaders, string][] = [
        ["search-product-reader", productReaderHeaders, "product"],
        ["search-price-list-reader", priceListReaderHeaders, "price_list"],
        ["search-api-key-reader", apiKeyReaderHeaders, "api_key"],
      ]

      for (const [name, headers, resource] of readers) {
        const policy = await ensurePolicy(resource)
        const role = await rbacModule.createRbacRoles({ name })
        await rbacModule.createRbacRolePolicies([
          { role_id: role.id, policy_id: policy.id },
        ])
        await createAdminUser(dbConnection, headers, container, {
          email: `${name}@medusa.js`,
          roles: [role.id],
        })
      }

      await createAdminUser(dbConnection, noRolesHeaders, container, {
        email: "search-no-roles@medusa.js",
        roles: [],
      })

      await dbUtils.snapshot()
    })

    afterAll(async () => {
      delete process.env.ENABLE_RBAC_MODULE
    })

    describe("GET /admin/search", () => {
      it("returns result groups only for the indexed entities the actor can read", async () => {
        expect(
          await searchEntities("/admin/search?q=anything", productReaderHeaders)
        ).toEqual(["product"])
      })

      it("drops requested entities the actor can't read, indexed or not", async () => {
        expect(
          await searchEntities(
            `/admin/search?q=anything&${ENTITIES_QUERY}`,
            productReaderHeaders
          )
        ).toEqual(["product"])
      })

      it("keeps the graph fallback entities the actor can read", async () => {
        expect(
          await searchEntities(
            `/admin/search?q=anything&${ENTITIES_QUERY}`,
            priceListReaderHeaders
          )
        ).toEqual(["price_list"])
      })

      it("returns every requested entity group to a super admin", async () => {
        expect(
          await searchEntities(
            `/admin/search?q=anything&${ENTITIES_QUERY}`,
            adminHeaders
          )
        ).toEqual(["order", "customer", "product", "price_list"])
      })

      it("returns no result groups, rather than a 403, to an actor with no roles", async () => {
        expect(
          await searchEntities("/admin/search?q=anything", noRolesHeaders)
        ).toEqual([])
        expect(
          await searchEntities(
            `/admin/search?q=anything&${ENTITIES_QUERY}`,
            noRolesHeaders
          )
        ).toEqual([])
      })

      it("checks the api key search entities against the api_key policy", async () => {
        expect(
          await searchEntities(
            `/admin/search?q=anything&${API_KEY_ENTITIES_QUERY}`,
            apiKeyReaderHeaders
          )
        ).toEqual(["publishable_api_key", "secret_api_key"])

        expect(
          await searchEntities(
            `/admin/search?q=anything&${API_KEY_ENTITIES_QUERY}`,
            productReaderHeaders
          )
        ).toEqual(["product"])
      })
    })
  },
})
