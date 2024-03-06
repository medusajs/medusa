import { ITaxModuleService } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/modules-sdk"

import { createAdminUser } from "../../../helpers/create-admin-user"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Taxes - Admin", () => {
      let appContainer
      let service: ITaxModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        service = appContainer.resolve(ModuleRegistrationName.TAX)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
      })

      it("can retrieve a tax rate", async () => {
        const region = await service.createTaxRegions({
          country_code: "us",
        })
        const rate = await service.create({
          tax_region_id: region.id,
          code: "test",
          rate: 2.5,
          name: "Test Rate",
        })

        const response = await api.get(
          `/admin/tax-rates/${rate.id}`,
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data).toEqual({
          tax_rate: {
            id: rate.id,
            code: "test",
            rate: 2.5,
            name: "Test Rate",
            metadata: null,
            tax_region_id: region.id,
            is_default: false,
            is_combinable: false,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            created_by: null,
          },
        })
      })

      it("can create a tax region with rates and rules", async () => {
        const regionRes = await api.post(
          `/admin/tax-regions`,
          {
            country_code: "us",
            default_tax_rate: {
              code: "default",
              rate: 2,
              name: "default rate",
            },
          },
          adminHeaders
        )

        const usRegionId = regionRes.data.tax_region.id

        expect(regionRes.status).toEqual(200)
        expect(regionRes.data).toEqual({
          tax_region: {
            id: expect.any(String),
            country_code: "us",
            parent_id: null,
            province_code: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            created_by: "admin_user",
            provider_id: null,
            metadata: null,
          },
        })

        const rateRes = await api.post(
          `/admin/tax-rates`,
          {
            tax_region_id: usRegionId,
            code: "RATE2",
            name: "another rate",
            rate: 10,
            rules: [{ reference: "product", reference_id: "prod_1234" }],
          },
          adminHeaders
        )

        expect(rateRes.status).toEqual(200)
        expect(rateRes.data).toEqual({
          tax_rate: {
            id: expect.any(String),
            code: "RATE2",
            rate: 10,
            name: "another rate",
            is_default: false,
            metadata: null,
            tax_region_id: usRegionId,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            created_by: "admin_user",
            is_combinable: false,
          },
        })

        const provRegRes = await api.post(
          `/admin/tax-regions`,
          {
            country_code: "US",
            parent_id: usRegionId,
            province_code: "cA",
          },
          adminHeaders
        )

        expect(provRegRes.status).toEqual(200)
        expect(provRegRes.data).toEqual({
          tax_region: {
            id: expect.any(String),
            country_code: "us",
            parent_id: usRegionId,
            province_code: "ca",
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            created_by: "admin_user",
            metadata: null,
            provider_id: null,
          },
        })

        const defRes = await api.post(
          `/admin/tax-rates`,
          {
            tax_region_id: provRegRes.data.tax_region.id,
            code: "DEFAULT",
            name: "DEFAULT",
            rate: 10,
            is_default: true,
          },
          adminHeaders
        )

        const listRes = await api.get(`/admin/tax-rates`, adminHeaders)

        expect(listRes.status).toEqual(200)
        expect(listRes.data.tax_rates).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: rateRes.data.tax_rate.id,
              code: "RATE2",
              rate: 10,
              name: "another rate",
              is_default: false,
              metadata: null,
              tax_region_id: usRegionId,
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              created_by: "admin_user",
            }),
            expect.objectContaining({ id: defRes.data.tax_rate.id }),
            expect.objectContaining({
              tax_region_id: usRegionId,
              is_default: true,
              rate: 2,
            }),
          ])
        )
      })

      it("can create a tax rate and update it", async () => {
        const regionRes = await api.post(
          `/admin/tax-regions`,
          {
            country_code: "us",
            default_tax_rate: {
              code: "default",
              rate: 2,
              name: "default rate",
            },
          },
          adminHeaders
        )

        const usRegionId = regionRes.data.tax_region.id

        expect(regionRes.status).toEqual(200)
        expect(regionRes.data).toEqual({
          tax_region: {
            id: expect.any(String),
            country_code: "us",
            parent_id: null,
            province_code: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            created_by: "admin_user",
            provider_id: null,
            metadata: null,
          },
        })

        const rateRes = await api.post(
          `/admin/tax-rates`,
          {
            tax_region_id: usRegionId,
            code: "RATE2",
            name: "another rate",
            rate: 10,
            rules: [{ reference: "product", reference_id: "prod_1234" }],
          },
          adminHeaders
        )

        expect(rateRes.status).toEqual(200)
        expect(rateRes.data).toEqual({
          tax_rate: {
            id: expect.any(String),
            code: "RATE2",
            rate: 10,
            name: "another rate",
            is_default: false,
            metadata: null,
            tax_region_id: usRegionId,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            deleted_at: null,
            created_by: "admin_user",
            is_combinable: false,
          },
        })

        const updateRes = await api.post(
          `/admin/tax-rates/${rateRes.data.tax_rate.id}`,
          {
            code: "updatedcode",
            rate: 12,
            is_combinable: true,
            name: "Another Name",
            metadata: { you: "know it" },
          },
          adminHeaders
        )

        expect(updateRes.status).toEqual(200)
        expect(updateRes.data).toEqual({
          tax_rate: {
            id: expect.any(String),
            code: "updatedcode",
            rate: 12,
            name: "Another Name",
            is_default: false,
            metadata: { you: "know it" },
            tax_region_id: usRegionId,
            deleted_at: null,
            created_at: expect.any(String),
            updated_at: expect.any(String),
            created_by: "admin_user",
            is_combinable: true,
          },
        })
      })

      it("can create a tax rate and delete it", async () => {
        const regionRes = await api.post(
          `/admin/tax-regions`,
          {
            country_code: "us",
            default_tax_rate: {
              code: "default",
              rate: 2,
              name: "default rate",
            },
          },
          adminHeaders
        )

        const usRegionId = regionRes.data.tax_region.id

        const rateRes = await api.post(
          `/admin/tax-rates`,
          {
            tax_region_id: usRegionId,
            code: "RATE2",
            name: "another rate",
            rate: 10,
            rules: [{ reference: "product", reference_id: "prod_1234" }],
          },
          adminHeaders
        )

        const deleteRes = await api.delete(
          `/admin/tax-rates/${rateRes.data.tax_rate.id}`,
          adminHeaders
        )

        expect(deleteRes.status).toEqual(200)
        expect(deleteRes.data).toEqual({
          id: rateRes.data.tax_rate.id,
          object: "tax_rate",
          deleted: true,
        })

        const rates = await service.list(
          { id: rateRes.data.tax_rate.id },
          { withDeleted: true }
        )
        expect(rates.length).toEqual(1)
        expect(rates[0].deleted_at).not.toBeNull()
      })

      it("can create a tax region and delete it", async () => {
        const regionRes = await api.post(
          `/admin/tax-regions`,
          {
            country_code: "us",
            default_tax_rate: {
              code: "default",
              rate: 2,
              name: "default rate",
            },
          },
          adminHeaders
        )

        const usRegionId = regionRes.data.tax_region.id

        const deleteRes = await api.delete(
          `/admin/tax-regions/${usRegionId}`,
          adminHeaders
        )

        expect(deleteRes.status).toEqual(200)
        expect(deleteRes.data).toEqual({
          id: usRegionId,
          object: "tax_region",
          deleted: true,
        })

        const rates = await service.listTaxRegions(
          { id: usRegionId },
          { withDeleted: true }
        )
        expect(rates.length).toEqual(1)
        expect(rates[0].deleted_at).not.toBeNull()
      })

      it("can create a tax rate add rules and remove them", async () => {
        const regionRes = await api.post(
          `/admin/tax-regions`,
          {
            country_code: "us",
            default_tax_rate: {
              code: "default",
              rate: 2,
              name: "default rate",
            },
          },
          adminHeaders
        )

        const usRegionId = regionRes.data.tax_region.id
        const rateRes = await api.post(
          `/admin/tax-rates`,
          {
            tax_region_id: usRegionId,
            code: "RATE2",
            name: "another rate",
            rate: 10,
            rules: [{ reference: "product", reference_id: "prod_1234" }],
          },
          adminHeaders
        )
        const rateId = rateRes.data.tax_rate.id
        let rules = await service.listTaxRateRules({ tax_rate_id: rateId })

        expect(rules).toEqual([
          {
            id: expect.any(String),
            tax_rate_id: rateId,
            reference: "product",
            reference_id: "prod_1234",
            created_by: "admin_user",
            created_at: expect.any(Date),
            updated_at: expect.any(Date),
            deleted_at: null,
            tax_rate: { id: rateId },
            metadata: null,
          },
        ])

        await api.post(
          `/admin/tax-rates/${rateId}/rules`,
          {
            reference: "product",
            reference_id: "prod_1111",
          },
          adminHeaders
        )

        await api.post(
          `/admin/tax-rates/${rateId}/rules`,
          {
            reference: "product",
            reference_id: "prod_2222",
          },
          adminHeaders
        )
        rules = await service.listTaxRateRules({ tax_rate_id: rateId })
        expect(rules).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              tax_rate_id: rateId,
              reference: "product",
              reference_id: "prod_1234",
              created_by: "admin_user",
            }),
            expect.objectContaining({
              tax_rate_id: rateId,
              reference: "product",
              reference_id: "prod_1111",
              created_by: "admin_user",
            }),
            expect.objectContaining({
              tax_rate_id: rateId,
              reference: "product",
              reference_id: "prod_2222",
              created_by: "admin_user",
            }),
          ])
        )

        const toDeleteId = rules.find((r) => r.reference_id === "prod_1111")!.id
        await api.delete(
          `/admin/tax-rates/${rateId}/rules/${toDeleteId}`,
          adminHeaders
        )

        rules = await service.listTaxRateRules({ tax_rate_id: rateId })
        expect(rules.length).toEqual(2)

        await api.post(
          `/admin/tax-rates/${rateId}`,
          {
            rules: [
              { reference: "product", reference_id: "prod_3333" },
              { reference: "product", reference_id: "prod_4444" },
              { reference: "product", reference_id: "prod_5555" },
              { reference: "product", reference_id: "prod_6666" },
            ],
          },
          adminHeaders
        )
        rules = await service.listTaxRateRules({ tax_rate_id: rateId })
        expect(rules.length).toEqual(4)
        expect(rules).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              tax_rate_id: rateId,
              reference: "product",
              reference_id: "prod_3333",
              created_by: "admin_user",
            }),
            expect.objectContaining({
              tax_rate_id: rateId,
              reference: "product",
              reference_id: "prod_4444",
              created_by: "admin_user",
            }),
            expect.objectContaining({
              tax_rate_id: rateId,
              reference: "product",
              reference_id: "prod_5555",
              created_by: "admin_user",
            }),
            expect.objectContaining({
              tax_rate_id: rateId,
              reference: "product",
              reference_id: "prod_6666",
              created_by: "admin_user",
            }),
          ])
        )
      })
    })
  },
})
