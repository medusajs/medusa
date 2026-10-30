import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(60000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    describe("GET /admin/modules", () => {
      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())
      })

      it("lists the installed modules without the disabled RBAC module", async () => {
        const response = await api.get("/admin/modules", adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data.modules).toEqual(
          expect.arrayContaining([{ key: "product" }, { key: "user" }])
        )
        expect(response.data.modules).not.toContainEqual({ key: "rbac" })
      })

      it("does not list link modules", async () => {
        const response = await api.get("/admin/modules", adminHeaders)

        expect(
          response.data.modules.some(({ key }) => key.endsWith("Link"))
        ).toBe(false)
      })

      it("requires authentication", async () => {
        const error = await api.get("/admin/modules").catch((e) => e)

        expect(error.response.status).toEqual(401)
      })
    })
  },
})
