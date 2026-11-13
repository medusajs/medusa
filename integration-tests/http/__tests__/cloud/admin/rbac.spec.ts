import { Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import path from "path"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60 * 1000)

process.env.ENABLE_RBAC_MODULE = "true"

const CLOUD_API_URL = "http://cloud-api.test"
const CLOUD_POLICY_KEYS = [
  "cloud_announcement:read",
  "cloud_announcement:update",
]

// The test runner doesn't run migration scripts, so the plugin's is run here
// from the built plugin, like `db:migrate` would.
const runPolicyScript = async (container) => {
  const pluginRoot = path.dirname(
    require.resolve("@medusajs/cloud/package.json")
  )
  const script = require(
    path.join(
      pluginRoot,
      ".medusa/server/src/migration-scripts/create-cloud-rbac-policies.js"
    )
  )
  await script.default({ container })
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let container
    let fetchSpy: jest.SpyInstance
    const originalFetch = global.fetch
    const readerHeaders = { headers: {} }
    const outsiderHeaders = { headers: {} }

    beforeEach(async () => {
      fetchSpy = jest
        .spyOn(global, "fetch")
        .mockImplementation(async (input, init) => {
          return input.toString().startsWith(CLOUD_API_URL)
            ? new Response(JSON.stringify({ announcements: [] }), {
                status: 200,
                headers: { "content-type": "application/json" },
              })
            : originalFetch(input, init)
        })

      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
      await runPolicyScript(container)

      const rbacModule = container.resolve(Modules.RBAC)
      const [reader, outsider] = await rbacModule.createRbacRoles([
        { name: "Announcement Reader" },
        { name: "Product Reader" },
      ])
      const policies = await rbacModule.listRbacPolicies({
        key: ["cloud_announcement:read", "product:read"],
      })
      const policyId = (key: string) =>
        policies.find((policy) => policy.key === key)!.id

      await rbacModule.createRbacRolePolicies([
        { role_id: reader.id, policy_id: policyId("cloud_announcement:read") },
        { role_id: outsider.id, policy_id: policyId("product:read") },
      ])

      await createAdminUser(dbConnection, readerHeaders, container, {
        email: "announcement-reader@medusa.js",
        roles: [reader.id],
      })
      await createAdminUser(dbConnection, outsiderHeaders, container, {
        email: "product-reader@medusa.js",
        roles: [outsider.id],
      })
    })

    afterEach(() => {
      fetchSpy.mockRestore()
    })

    it("creates the cloud policies once", async () => {
      await runPolicyScript(container)

      const policies = await container
        .resolve(Modules.RBAC)
        .listRbacPolicies({ key: CLOUD_POLICY_KEYS })

      expect(policies.map((policy) => policy.key).sort()).toEqual(
        CLOUD_POLICY_KEYS
      )
    })

    it("forbids the admin routes to an actor without cloud policies", async () => {
      const attempts = [
        () => api.get(`/admin/cloud/announcements`, outsiderHeaders),
        () => api.get(`/admin/cloud/announcement-preferences`, outsiderHeaders),
        () =>
          api.post(
            `/admin/cloud/announcement-preferences`,
            { cloud: false },
            outsiderHeaders
          ),
      ]

      for (const attempt of attempts) {
        const error = await attempt().catch((e) => e)
        expect(error.response.status).toEqual(403)
      }
    })

    it("lets a reader read but not update the preferences", async () => {
      const announcements = await api.get(
        `/admin/cloud/announcements`,
        readerHeaders
      )
      expect(announcements.status).toEqual(200)

      const preferences = await api.get(
        `/admin/cloud/announcement-preferences`,
        readerHeaders
      )
      expect(preferences.status).toEqual(200)

      const error = await api
        .post(
          `/admin/cloud/announcement-preferences`,
          { cloud: false },
          readerHeaders
        )
        .catch((e) => e)
      expect(error.response.status).toEqual(403)
    })

    it("lets a super admin update the preferences", async () => {
      const response = await api.post(
        `/admin/cloud/announcement-preferences`,
        { cloud: false },
        adminHeaders
      )

      expect(response.status).toEqual(200)
    })
  },
})
