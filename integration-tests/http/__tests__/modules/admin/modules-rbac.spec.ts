import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.ENABLE_RBAC_MODULE = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    afterAll(() => {
      delete process.env.ENABLE_RBAC_MODULE
    })

    describe("GET /admin/modules with RBAC installed", () => {
      it("lists the RBAC module to a user without roles", async () => {
        const headers = { headers: { ...adminHeaders.headers } }
        await createAdminUser(dbConnection, headers, getContainer(), {
          email: "no-roles@medusa.js",
          roles: [],
        })

        const response = await api.get("/admin/modules", headers)

        expect(response.status).toEqual(200)
        expect(response.data.modules).toContainEqual({ key: "rbac" })
      })
    })
  },
})
