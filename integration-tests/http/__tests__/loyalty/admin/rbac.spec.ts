import { buildPolicies, Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60 * 1000)

process.env.ENABLE_RBAC_MODULE = "true"

// The test runner doesn't run migration scripts, so the plugin's is run here
// from the built plugin, like `db:migrate` would.
const runPolicyScript = async (container) => {
  const pluginRoot = path.dirname(
    require.resolve("@medusajs/loyalty-plugin/package.json")
  )
  const script = require(path.join(
    pluginRoot,
    ".medusa/server/src/migration-scripts/create-loyalty-rbac-policies.js"
  ))
  await script.default({ container })
}

const LOYALTY_POLICY_KEYS = buildPolicies({
  resource: ["gift_card", "store_credit_account"],
}).map((policy) => policy.key)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let container
    const readerHeaders = { headers: {} }
    const outsiderHeaders = { headers: {} }

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      await runPolicyScript(container)

      const rbacModule = container.resolve(Modules.RBAC)
      const [reader, outsider] = await rbacModule.createRbacRoles([
        { name: "Loyalty Reader" },
        { name: "Product Reader" },
      ])
      const policies = await rbacModule.listRbacPolicies({
        key: ["gift_card:read", "store_credit_account:read", "product:read"],
      })
      const policyId = (key: string) =>
        policies.find((policy) => policy.key === key)!.id

      await rbacModule.createRbacRolePolicies([
        { role_id: reader.id, policy_id: policyId("gift_card:read") },
        {
          role_id: reader.id,
          policy_id: policyId("store_credit_account:read"),
        },
        { role_id: outsider.id, policy_id: policyId("product:read") },
      ])

      await createAdminUser(dbConnection, readerHeaders, container, {
        email: "loyalty-reader@medusa.js",
        roles: [reader.id],
      })
      await createAdminUser(dbConnection, outsiderHeaders, container, {
        email: "product-reader@medusa.js",
        roles: [outsider.id],
      })
    })

    it("creates the loyalty policies once", async () => {
      await runPolicyScript(container)

      const policies = await container
        .resolve(Modules.RBAC)
        .listRbacPolicies({ key: LOYALTY_POLICY_KEYS })

      expect(policies.map((policy) => policy.key).sort()).toEqual(
        [...LOYALTY_POLICY_KEYS].sort()
      )
    })

    it("forbids the admin routes to an actor without loyalty policies", async () => {
      const attempts = [
        () => api.get(`/admin/gift-cards`, outsiderHeaders),
        () => api.get(`/admin/store-credit-accounts`, outsiderHeaders),
        () =>
          api.post(
            `/admin/store-credit-accounts`,
            { customer_id: "cus_123", currency_code: "usd" },
            outsiderHeaders
          ),
        () =>
          api.post(
            `/admin/store-credit-accounts/scacc_123/credit`,
            { amount: 100 },
            outsiderHeaders
          ),
      ]

      for (const attempt of attempts) {
        const error = await attempt().catch((e) => e)
        expect(error.response.status).toEqual(403)
      }
    })

    it("lets a reader list but not write", async () => {
      const giftCards = await api.get(`/admin/gift-cards`, readerHeaders)
      expect(giftCards.status).toEqual(200)

      const accounts = await api.get(
        `/admin/store-credit-accounts`,
        readerHeaders
      )
      expect(accounts.status).toEqual(200)

      const error = await api
        .post(
          `/admin/store-credit-accounts`,
          { customer_id: "cus_123", currency_code: "usd" },
          readerHeaders
        )
        .catch((e) => e)
      expect(error.response.status).toEqual(403)
      expect(error.response.data.message).toContain(
        "store_credit_account:create"
      )
    })

    it("lets a super admin create a store credit account", async () => {
      const response = await api.post(
        `/admin/store-credit-accounts`,
        { customer_id: "cus_123", currency_code: "usd" },
        adminHeaders
      )
      expect(response.status).toEqual(200)
    })
  },
})
