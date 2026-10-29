import { Modules } from "@medusajs/framework/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(120000)

process.env.MEDUSA_FF_RBAC = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    const regionReaderHeaders = { headers: { ...adminHeaders.headers } }

    const entitiesOf = (data: any) =>
      data.results.map((group: any) => group.entity)

    beforeAll(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const rbacModule = container.resolve(Modules.RBAC)

      const [regionRead] = await rbacModule.createRbacPolicies([
        {
          key: "search-test:region:read",
          resource: "region",
          operation: "read",
          name: "Read Regions",
        },
      ])
      const regionReaderRole = await rbacModule.createRbacRoles({
        name: "Region Reader",
      })
      await rbacModule.createRbacRolePolicies([
        { role_id: regionReaderRole.id, policy_id: regionRead.id },
      ])

      await createAdminUser(dbConnection, regionReaderHeaders, container, {
        email: "region-reader@medusa.js",
        roles: [regionReaderRole.id],
      })

      await api.post(
        "/admin/customers",
        { email: "hidden-customer@example.test", first_name: "Hidden" },
        adminHeaders
      )
      await api.post(
        "/admin/regions",
        { name: "Visible Region", currency_code: "usd" },
        adminHeaders
      )

      await container.resolve(Modules.SEARCH).reindex()
    })

    afterAll(async () => {
      delete process.env.MEDUSA_FF_RBAC
    })

    describe("GET /admin/search with RBAC", () => {
      it("should only return requested entities the user can read", async () => {
        const forbidden = await api
          .get("/admin/customers", regionReaderHeaders)
          .catch((e) => e.response)
        expect(forbidden.status).toEqual(403)

        const response = await api.get(
          "/admin/search?entity=customer,order,user,region",
          regionReaderHeaders
        )

        expect(response.status).toEqual(200)
        expect(entitiesOf(response.data)).toEqual(["region"])
        expect(response.data.results[0].data).toEqual([
          expect.objectContaining({ name: "Visible Region" }),
        ])
        expect(JSON.stringify(response.data)).not.toContain(
          "hidden-customer@example.test"
        )
      })

      it("should skip indexes the user can't read when no entity is requested", async () => {
        const response = await api.get("/admin/search", regionReaderHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.results).toEqual([])
      })

      it("should return no results when none of the requested entities are readable", async () => {
        const response = await api.get(
          "/admin/search?entity=customer,user",
          regionReaderHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.results).toEqual([])
      })

      it("should still search every requested entity for a super admin", async () => {
        const response = await api.get(
          "/admin/search?entity=customer,region",
          adminHeaders
        )

        expect(entitiesOf(response.data)).toEqual(["customer", "region"])
        expect(response.data.results[0].data).toEqual([
          expect.objectContaining({ email: "hidden-customer@example.test" }),
        ])
      })
    })
  },
})
