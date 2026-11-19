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
 * The Search Module is registered in this app with the `product`, `customer`
 * and `customer_directory` (entity `customer`) indexes, so other entities go
 * through the graph fallback.
 */
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer, dbUtils }) => {
    const productReaderHeaders = { headers: { ...adminHeaders.headers } }
    const customerReaderHeaders = { headers: { ...adminHeaders.headers } }
    const priceListReaderHeaders = { headers: { ...adminHeaders.headers } }
    const apiKeyReaderHeaders = { headers: { ...adminHeaders.headers } }
    const noRolesHeaders = { headers: { ...adminHeaders.headers } }
    const searchIndexManagerHeaders = { headers: { ...adminHeaders.headers } }
    const searchIndexUpdaterHeaders = { headers: { ...adminHeaders.headers } }

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

      const ensurePolicy = async (
        resource: string,
        operation: string = PolicyOperation.read
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

      const readers: [string, typeof adminHeaders, string][] = [
        ["search-product-reader", productReaderHeaders, "product"],
        ["search-customer-reader", customerReaderHeaders, "customer"],
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

      const searchIndexManager = await rbacModule.createRbacRoles({
        name: "search-index-manager",
      })
      await rbacModule.createRbacRolePolicies(
        await Promise.all(
          [
            ["search_index", PolicyOperation.read],
            ["search_index", PolicyOperation.delete],
            ["search_index_sync", PolicyOperation.create],
          ].map(async ([resource, operation]) => ({
            role_id: searchIndexManager.id,
            policy_id: (await ensurePolicy(resource, operation)).id,
          }))
        )
      )
      await createAdminUser(
        dbConnection,
        searchIndexManagerHeaders,
        container,
        {
          email: "search-index-manager@medusa.js",
          roles: [searchIndexManager.id],
        }
      )

      const searchIndexUpdater = await rbacModule.createRbacRoles({
        name: "search-index-updater",
      })
      await rbacModule.createRbacRolePolicies([
        {
          role_id: searchIndexUpdater.id,
          policy_id: (
            await ensurePolicy("search_index", PolicyOperation.update)
          ).id,
        },
      ])
      await createAdminUser(
        dbConnection,
        searchIndexUpdaterHeaders,
        container,
        {
          email: "search-index-updater@medusa.js",
          roles: [searchIndexUpdater.id],
        }
      )

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

      it("checks an index against its entity rather than its name", async () => {
        const query = "/admin/search?q=anything&entity[]=customer_directory"

        expect(await searchEntities(query, customerReaderHeaders)).toEqual([
          "customer_directory",
        ])
        expect(await searchEntities(query, productReaderHeaders)).toEqual([])
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

    describe("/admin/search-indexes", () => {
      const statusOf = (request: Promise<{ status: number }>) =>
        request
          .then((response) => response.status)
          .catch((error) => error.response.status)

      const statuses = async (headers: typeof adminHeaders) => [
        await statusOf(api.get("/admin/search-indexes", headers)),
        await statusOf(
          api.post("/admin/search-indexes/nope/reindex", {}, headers)
        ),
        await statusOf(api.delete("/admin/search-indexes/nope", headers)),
      ]

      it("lets a role holding search_index:read/delete and search_index_sync:create list, delete and reindex", async () => {
        // Reindex and delete get past the policy check: the index isn't registered.
        expect(await statuses(searchIndexManagerHeaders)).toEqual([
          200, 404, 404,
        ])
      })

      it.each([
        ["a role without the search index policies", productReaderHeaders],
        ["a role holding only search_index:update", searchIndexUpdaterHeaders],
        ["an actor with no roles", noRolesHeaders],
      ])("returns a 403 to %s", async (_, headers) => {
        expect(await statuses(headers)).toEqual([403, 403, 403])
      })
    })
  },
})
