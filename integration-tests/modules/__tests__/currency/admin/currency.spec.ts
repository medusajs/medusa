import { createAdminUser } from "../../../helpers/create-admin-user"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, apiUtils, container }) => {
    describe("Currency - Admin", () => {
      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, container)
      })

      it("should correctly retrieve and list currencies", async () => {
        const api = apiUtils
        const listResp = await api.get("/admin/currencies", adminHeaders)

        expect(listResp.data.currencies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "aud",
            }),
            expect.objectContaining({
              code: "cad",
            }),
          ])
        )

        const retrieveResp = await api.get(
          `/admin/currencies/aud`,
          adminHeaders
        )
        expect(retrieveResp.data.currency).toEqual(
          listResp.data.currencies.find((c) => c.code === "aud")
        )
      })
    })
  },
})
