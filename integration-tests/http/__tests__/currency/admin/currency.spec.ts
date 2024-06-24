import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ dbConnection, getContainer, api }) => {
    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("GET /admin/currencies", () => {
      it("should retrieve the currencies", async () => {
        const response = await api.get(
          "/admin/currencies?order=code",
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.currencies).toHaveLength(120)
        expect(response.data.currencies).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "usd",
              name: "US Dollar",
            }),
          ])
        )
      })

      it("should retrieve the currencies filtered with q param", async () => {
        const response = await api.get(
          `/admin/currencies?q=us&order=code`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.currencies).toEqual([
          expect.objectContaining({
            code: "aud",
            name: "Australian Dollar",
          }),
          expect.objectContaining({
            code: "byn",
            name: "Belarusian Ruble",
          }),
          expect.objectContaining({
            code: "rub",
            name: "Russian Ruble",
          }),
          expect.objectContaining({
            code: "usd",
            name: "US Dollar",
          }),
        ])
      })
    })
  },

  // BREAKING: There was an "should update currency includes_tax" test that no longer applies in v2 (realted to MEDUSA_FF_TAX_INCLUSIVE_PRICING)
})
