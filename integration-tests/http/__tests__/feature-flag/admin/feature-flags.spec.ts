import { medusaIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("GET /admin/feature-flags", () => {
      it("should return feature flags when unauthenticated", async () => {
        const response = await api.get("/admin/feature-flags")

        expect(response.status).toEqual(200)
        expect(response.data).toHaveProperty("feature_flags")
        expect(response.data.feature_flags).toEqual(
          expect.objectContaining({
            view_configurations: false,
          })
        )
      })

      it("should return feature flags when authenticated as admin", async () => {
        const container = getContainer()
        await createAdminUser(dbConnection, adminHeaders, container)

        const response = await api.get("/admin/feature-flags", adminHeaders)

        expect(response.status).toEqual(200)
        expect(response.data).toHaveProperty("feature_flags")
        expect(response.data.feature_flags).toEqual(
          expect.objectContaining({
            view_configurations: false,
          })
        )
      })
    })
  },
})
