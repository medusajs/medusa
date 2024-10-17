import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("/admin/tax-regions", () => {
      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, getContainer())
      })

      describe("POST /admin/tax-regions/:id", () => {
        let taxRegion

        beforeEach(async () => {
          taxRegion = (
            await api.post(
              "/admin/tax-regions",
              {
                country_code: "us",
                province_code: "tx",
                metadata: { test: "created" },
              },
              adminHeaders
            )
          ).data.tax_region
        })

        it("should successfully update a tax region's fieleds", async () => {
          let taxRegionResponse = await api.post(
            `/admin/tax-regions/${taxRegion.id}`,
            {
              province_code: "ny",
              metadata: { test: "updated" },
            },
            adminHeaders
          )

          expect(taxRegionResponse.status).toEqual(200)
          expect(taxRegionResponse.data.tax_region).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              province_code: "ny",
              metadata: { test: "updated" },
            })
          )

          taxRegionResponse = await api.post(
            `/admin/tax-regions/${taxRegion.id}`,
            { metadata: { test: "updated 2" } },
            adminHeaders
          )

          expect(taxRegionResponse.status).toEqual(200)
          expect(taxRegionResponse.data.tax_region).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              province_code: "ny",
              metadata: { test: "updated 2" },
            })
          )

          taxRegionResponse = await api.post(
            `/admin/tax-regions/${taxRegion.id}`,
            { province_code: "ca" },
            adminHeaders
          )

          expect(taxRegionResponse.status).toEqual(200)
          expect(taxRegionResponse.data.tax_region).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              province_code: "ca",
              metadata: { test: "updated 2" },
            })
          )
        })

        it("should throw if tax region does not exist", async () => {
          const {
            response: { status, data },
          } = await api
            .post(
              `/admin/tax-regions/does-not-exist`,
              { province_code: "ny", metadata: { test: "updated" } },
              adminHeaders
            )
            .catch((err) => err)

          expect(status).toEqual(404)
          expect(data).toEqual({
            message: 'TaxRegion with id "does-not-exist" not found',
            type: "not_found",
          })
        })
      })
    })
  },
})
