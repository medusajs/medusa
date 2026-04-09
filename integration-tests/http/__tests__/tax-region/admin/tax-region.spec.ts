import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { Modules } from "@medusajs/utils"
import { updateTaxRegionsWorkflow } from "@medusajs/core-flows"

jest.setTimeout(50000)

const env = {}
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container

    beforeAll(async () => {
      container = getContainer()
    })

    describe("/admin/tax-regions", () => {
      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, container)
      })

      describe("POST /admin/tax-regions/:id", () => {
        let taxRegion

        beforeEach(async () => {
          const parentRegion = await api.post(
            "/admin/tax-regions",
            {
              country_code: "us",
              provider_id: "tp_system",
            },
            adminHeaders
          )

          taxRegion = (
            await api.post(
              "/admin/tax-regions",
              {
                country_code: "us",
                province_code: "tx",
                parent_id: parentRegion.data.tax_region.id,
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

        it("should create a province tax region without a provider", async () => {
          const response = await api.post(
            `/admin/tax-regions`,
            {
              country_code: "us",
              parent_id: taxRegion.id,
              province_code: "ny",
            },
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.tax_region).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              country_code: "us",
              province_code: "ny",
              provider_id: null,
            })
          )
        })

        it("should fail to create a country tax region without a provider", async () => {
          const {
            response: { status, data },
          } = await api
            .post(
              `/admin/tax-regions`,
              {
                country_code: "uk",
              },
              adminHeaders
            )
            .catch((err) => err)

          expect(status).toEqual(400)
          expect(data).toEqual({
            message:
              "Invalid request: Provider is required when creating a non-province tax region.",
            type: "invalid_data",
          })
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

      describe("workflows", () => {
        it("updateTaxRegionsWorkflow - should not call listTaxRegions when data is empty", async () => {
          const taxService = container.resolve(Modules.TAX)
          const listTaxRegionsSpy = jest.spyOn(taxService, "listTaxRegions")

          const { result } = await updateTaxRegionsWorkflow(container).run({
            input: [],
          })

          expect(result).toEqual([])
          expect(listTaxRegionsSpy).not.toHaveBeenCalled()

          listTaxRegionsSpy.mockRestore()
        })
      })
    })
  },
})
