import { moduleIntegrationTestRunner } from "medusa-test-utils"
import { ITaxModuleService } from "@medusajs/types"
import { setupTaxStructure } from "../utils/setup-tax-structure"
import { Module, Modules } from "@medusajs/utils"
import { TaxModuleService } from "@services"

jest.setTimeout(30000)

moduleIntegrationTestRunner<ITaxModuleService>({
  moduleName: Modules.TAX,
  testSuite: ({ service }) => {
    describe("TaxModuleService", function () {
      it.only(`should export the appropriate linkable configuration`, () => {
        const linkable = Module(Modules.TAX, {
          service: TaxModuleService,
        }).linkable

        expect(Object.keys(linkable)).toEqual([
          "taxProvider",
          "taxRateRule",
          "taxRate",
          "taxRegion",
        ])

        Object.keys(linkable).forEach((key) => {
          delete linkable[key].toJSON
        })

        expect(linkable).toEqual({
          taxProvider: {
            id: {
              linkable: "tax_provider_id",
              primaryKey: "id",
              serviceName: "tax",
              field: "taxProvider",
            },
          },
          taxRateRule: {
            id: {
              linkable: "tax_rate_rule_id",
              primaryKey: "id",
              serviceName: "tax",
              field: "taxRateRule",
            },
          },
          taxRate: {
            id: {
              linkable: "tax_rate_id",
              primaryKey: "id",
              serviceName: "tax",
              field: "taxRate",
            },
          },
          taxRegion: {
            id: {
              linkable: "tax_region_id",
              primaryKey: "id",
              serviceName: "tax",
              field: "taxRegion",
            },
          },
        })
      })

      it("should create tax rates and update them", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
          default_tax_rate: {
            name: "Test Rate",
            rate: 0.2,
          },
        })

        const rate = await service.createTaxRates({
          tax_region_id: region.id,
          name: "Shipping Rate",
          code: "test",
          rate: 8.23,
        })

        const updatedRate = await service.updateTaxRates(rate.id, {
          name: "Updated Rate",
          code: "TEST",
          rate: 8.25,
        })

        expect(updatedRate).toEqual(
          expect.objectContaining({
            tax_region_id: region.id,
            rate: 8.25,
            name: "Updated Rate",
            code: "TEST",
            is_default: false,
          })
        )

        const updatedDefaultRate = await service.updateTaxRates(
          { tax_region_id: region.id, is_default: true },
          { rate: 2 }
        )

        expect(updatedDefaultRate).toEqual([
          expect.objectContaining({
            tax_region_id: region.id,
            rate: 2,
            name: "Test Rate",
            code: null,
            is_default: true,
          }),
        ])

        const rates = await service.listTaxRates()
        expect(rates).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              tax_region_id: region.id,
              rate: 2,
              name: "Test Rate",
              is_default: true,
            }),
            expect.objectContaining({
              tax_region_id: region.id,
              rate: 8.25,
              name: "Updated Rate",
              code: "TEST",
              is_default: false,
            }),
          ])
        )
      })

      it("should update tax rates with rules", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
          default_tax_rate: {
            name: "Test Rate",
            rate: 0.2,
          },
        })

        const rate = await service.createTaxRates({
          tax_region_id: region.id,
          name: "Shipping Rate",
          code: "test",
          rate: 8.23,
        })

        await service.updateTaxRates(rate.id, {
          name: "Updated Rate",
          code: "TEST",
          rate: 8.25,
          rules: [
            { reference: "product", reference_id: "product_id_1" },
            { reference: "product_type", reference_id: "product_type_id" },
          ],
        })

        const rules = await service.listTaxRateRules({ tax_rate_id: rate.id })

        expect(rules).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              reference: "product",
              reference_id: "product_id_1",
            }),
            expect.objectContaining({
              reference: "product_type",
              reference_id: "product_type_id",
            }),
          ])
        )

        await service.updateTaxRates(rate.id, {
          rules: [
            { reference: "product", reference_id: "product_id_1" },
            { reference: "product", reference_id: "product_id_2" },
            { reference: "product_type", reference_id: "product_type_id_2" },
            { reference: "product_type", reference_id: "product_type_id_3" },
          ],
        })

        const rulesWithDeletes = await service.listTaxRateRules(
          { tax_rate_id: rate.id },
          { withDeleted: true }
        )

        expect(rulesWithDeletes).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              reference: "product",
              reference_id: "product_id_2",
            }),
            expect.objectContaining({
              reference: "product_type",
              reference_id: "product_type_id_2",
            }),
            expect.objectContaining({
              reference: "product_type",
              reference_id: "product_type_id_3",
            }),
            expect.objectContaining({
              reference: "product",
              reference_id: "product_id_1",
              deleted_at: expect.any(Date),
            }),
            expect.objectContaining({
              reference: "product_type",
              reference_id: "product_type_id",
              deleted_at: expect.any(Date),
            }),
          ])
        )
      })

      it("should create a tax region", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
          default_tax_rate: {
            name: "Test Rate",
            rate: 0.2,
          },
        })

        const [provinceRegion] = await service.createTaxRegions([
          {
            country_code: "US",
            province_code: "CA",
            parent_id: region.id,
            default_tax_rate: {
              name: "CA Rate",
              rate: 8.25,
            },
          },
        ])

        const listedRegions = await service.listTaxRegions()
        expect(listedRegions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: region.id,
              country_code: "us",
              province_code: null,
              parent_id: null,
            }),
            expect.objectContaining({
              id: provinceRegion.id,
              country_code: "us",
              province_code: "ca",
              parent_id: region.id,
            }),
          ])
        )

        const rates = await service.listTaxRates()
        expect(rates).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              tax_region_id: region.id,
              rate: 0.2,
              name: "Test Rate",
              is_default: true,
            }),
            expect.objectContaining({
              tax_region_id: provinceRegion.id,
              rate: 8.25,
              name: "CA Rate",
              is_default: true,
            }),
          ])
        )
      })

      it("should create a tax rate rule", async () => {
        const [region] = await service.createTaxRegions([
          {
            country_code: "US",
            default_tax_rate: {
              name: "Test Rate",
              rate: 0.2,
            },
          },
        ])

        const rate = await service.createTaxRates({
          tax_region_id: region.id,
          name: "Shipping Rate",
          rate: 8.23,
        })

        await service.createTaxRateRules([
          {
            tax_rate_id: rate.id,
            reference: "product",
            reference_id: "prod_1234",
          },
        ])

        const listedRules = await service.listTaxRateRules(
          {},
          {
            relations: ["tax_rate"],
          }
        )
        expect(listedRules).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              reference: "product",
              reference_id: "prod_1234",
              tax_rate: expect.objectContaining({
                tax_region_id: region.id,
                name: "Shipping Rate",
                rate: 8.23,
              }),
            }),
          ])
        )
      })

      it("applies specific product rules at the province level", async () => {
        await setupTaxStructure(service)
        const item = {
          id: "item_test",
          product_id: "product_id_1", // Matching the specific product rate for CA province
          quantity: 1,
        }
        const calculationContext = {
          address: {
            country_code: "US",
            province_code: "CA",
          },
        }

        const taxLines = await service.getTaxLines([item], calculationContext)

        expect(taxLines).toEqual([
          expect.objectContaining({
            rate_id: expect.any(String),
            rate: 3, // Expecting the reduced rate for specific products in CA
            code: "CAREDUCE_PROD",
            name: "CA Reduced Rate for Products",
          }),
        ])
      })

      it("applies specific product type rules at the province level", async () => {
        await setupTaxStructure(service)
        const item = {
          id: "item_test",
          product_id: "product_id_unknown", // This product does not have a specific rule
          product_type_id: "product_type_id_1", // Matching the specific product type rate for CA province
          quantity: 1,
        }
        const calculationContext = {
          address: {
            country_code: "US",
            province_code: "CA",
          },
        }

        const taxLines = await service.getTaxLines([item], calculationContext)

        expect(taxLines).toEqual([
          expect.objectContaining({
            rate_id: expect.any(String),
            rate: 1, // Expecting the reduced rate for specific product types in CA
            code: "CAREDUCE_TYPE",
            name: "CA Reduced Rate for Product Type",
          }),
        ])
      })

      it("applies specific product type rules at the province level", async () => {
        await setupTaxStructure(service)
        const item = {
          id: "item_test",
          product_id: "product_id_unknown", // This product does not have a specific rule
          product_type_id: "product_type_id_1", // Matching the specific product type rate for CA province
          quantity: 1,
        }
        const calculationContext = {
          address: {
            country_code: "US",
            province_code: "CA",
          },
        }

        const taxLines = await service.getTaxLines([item], calculationContext)

        expect(taxLines).toEqual([
          expect.objectContaining({
            rate_id: expect.any(String),
            rate: 1, // Expecting the reduced rate for specific product types in CA
            code: "CAREDUCE_TYPE",
            name: "CA Reduced Rate for Product Type",
          }),
        ])
      })

      it("applies default province rules when no specific product or product type rule matches", async () => {
        await setupTaxStructure(service)
        const item = {
          id: "item_test",
          product_id: "product_id_unknown",
          quantity: 1,
        }
        const calculationContext = {
          address: {
            country_code: "US",
            province_code: "NY", // Testing with NY to apply the default provincial rate
          },
        }

        const taxLines = await service.getTaxLines([item], calculationContext)

        expect(taxLines).toEqual([
          expect.objectContaining({
            rate_id: expect.any(String),
            rate: 6, // Expecting the default rate for NY province
            code: "NYDEFAULT",
            name: "NY Default Rate",
          }),
        ])
      })

      it("applies specific product rules at the country level when no province rate applies", async () => {
        await setupTaxStructure(service)
        const item = {
          id: "item_test",
          product_id: "product_id_4", // Assuming this ID now has a specific rule at the country level for Canada
          quantity: 1,
        }
        const calculationContext = {
          address: {
            country_code: "CA",
            province_code: "ON", // This province does not have a specific rule
          },
        }

        const taxLines = await service.getTaxLines([item], calculationContext)

        expect(taxLines).toEqual([
          expect.objectContaining({
            rate_id: expect.any(String),
            rate: 3, // Expecting the reduced rate for specific products in Canada
            code: "CAREDUCE_PROD_CA",
            name: "Canada Reduced Rate for Product",
          }),
        ])
      })

      it("applies default country rules when no specific product or product type rule matches", async () => {
        await setupTaxStructure(service)
        const item = {
          id: "item_test",
          product_id: "product_id_unknown",
          quantity: 1,
        }
        const calculationContext = {
          address: {
            country_code: "DE", // Testing with Germany to apply the default country rate
          },
        }

        const taxLines = await service.getTaxLines([item], calculationContext)

        expect(taxLines).toEqual([
          expect.objectContaining({
            rate_id: expect.any(String),
            rate: 19,
            code: "DE19",
            name: "Germany Default Rate",
          }),
        ])
      })

      it("prioritizes specific product rules over product type rules", async () => {
        await setupTaxStructure(service)

        const item = {
          id: "item_test",
          product_id: "product_id_1", // This product has a specific rule for product type and product
          product_type_id: "product_type_id_1", // This product type has a specific rule for product type
          quantity: 1,
        }
        const calculationContext = {
          address: {
            country_code: "US",
            province_code: "CA",
          },
        }

        const taxLines = await service.getTaxLines([item], calculationContext)

        expect(taxLines).toEqual([
          expect.objectContaining({
            rate_id: expect.any(String),
            rate: 3, // Expecting the reduced rate for specific products in CA
            code: "CAREDUCE_PROD",
            name: "CA Reduced Rate for Products",
          }),
        ])
      })

      it("should delete tax rate", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
        })

        const taxRate = await service.createTaxRates({
          tax_region_id: region.id,
          value: 10,
          code: "test",
          name: "test",
        })

        await service.deleteTaxRates(taxRate.id)

        const rates = await service.listTaxRates({ tax_region_id: region.id })

        expect(rates).toEqual([])
      })

      it("should soft delete tax rate", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
        })

        const taxRate = await service.createTaxRates({
          tax_region_id: region.id,
          value: 10,
          code: "test",
          name: "test",
        })

        await service.softDeleteTaxRates([taxRate.id])

        const rates = await service.listTaxRates(
          { tax_region_id: region.id },
          { withDeleted: true }
        )

        expect(rates).toEqual([
          expect.objectContaining({
            id: taxRate.id,
            deleted_at: expect.any(Date),
          }),
        ])
      })

      it("should delete a tax region and its rates", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
          default_tax_rate: {
            value: 2,
            code: "test",
            name: "default test",
          },
        })

        await service.createTaxRates({
          tax_region_id: region.id,
          value: 10,
          code: "test",
          name: "test",
        })

        await service.deleteTaxRegions(region.id)

        const taxRegions = await service.listTaxRegions()
        const rates = await service.listTaxRates()

        expect(taxRegions).toEqual([])
        expect(rates).toEqual([])
      })

      it("should soft delete a tax region and its rates", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
          default_tax_rate: {
            value: 2,
            code: "test",
            name: "default test",
          },
        })

        await service.createTaxRates({
          tax_region_id: region.id,
          value: 10,
          code: "test",
          name: "test",
        })

        await service.softDeleteTaxRegions([region.id])

        const taxRegions = await service.listTaxRegions(
          {},
          { withDeleted: true }
        )
        const rates = await service.listTaxRates({}, { withDeleted: true })

        expect(taxRegions).toEqual([
          expect.objectContaining({
            id: region.id,
            country_code: "us",
            deleted_at: expect.any(Date),
          }),
        ])
        expect(rates).toEqual([
          expect.objectContaining({
            deleted_at: expect.any(Date),
          }),
          expect.objectContaining({
            deleted_at: expect.any(Date),
          }),
        ])
      })

      it("should delete a tax rate and its rules", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
        })

        const rate = await service.createTaxRates({
          tax_region_id: region.id,
          value: 10,
          code: "test",
          name: "test",
          rules: [
            { reference: "product", reference_id: "product_id_1" },
            { reference: "product_type", reference_id: "product_type_id" },
          ],
        })

        await service.deleteTaxRates(rate.id)

        const taxRegions = await service.listTaxRegions()
        const rates = await service.listTaxRates()
        const rules = await service.listTaxRateRules()

        expect(taxRegions).toEqual([expect.objectContaining({ id: region.id })])
        expect(rates).toEqual([])
        expect(rules).toEqual([])
      })

      it("should soft delete a tax rate and its rules", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
        })

        const rate = await service.createTaxRates({
          tax_region_id: region.id,
          value: 10,
          code: "test",
          name: "test",
          rules: [
            { reference: "product", reference_id: "product_id_1" },
            { reference: "product_type", reference_id: "product_type_id" },
          ],
        })

        await service.softDeleteTaxRates(rate.id)

        const taxRegions = await service.listTaxRegions(
          {},
          { withDeleted: true }
        )
        const rates = await service.listTaxRates({}, { withDeleted: true })
        const rules = await service.listTaxRateRules({}, { withDeleted: true })

        expect(taxRegions).toEqual([
          expect.objectContaining({ id: region.id, deleted_at: null }),
        ])
        expect(rates).toEqual([
          expect.objectContaining({
            id: rate.id,
            deleted_at: expect.any(Date),
          }),
        ])
        expect(rules).toEqual([
          expect.objectContaining({
            tax_rate_id: rate.id,
            deleted_at: expect.any(Date),
          }),
          expect.objectContaining({
            tax_rate_id: rate.id,
            deleted_at: expect.any(Date),
          }),
        ])
      })

      it("should soft delete a tax rule", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
        })

        const rate = await service.createTaxRates({
          tax_region_id: region.id,
          value: 10,
          code: "test",
          name: "test",
        })

        const [ruleOne, ruleTwo] = await service.createTaxRateRules([
          {
            tax_rate_id: rate.id,
            reference: "product",
            reference_id: "product_id_1",
          },
          {
            tax_rate_id: rate.id,
            reference: "product_type",
            reference_id: "product_type_id",
          },
        ])

        await service.softDeleteTaxRateRules([ruleOne.id])

        const rules = await service.listTaxRateRules({}, { withDeleted: true })
        expect(rules).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: ruleOne.id,
              deleted_at: expect.any(Date),
            }),
            expect.objectContaining({
              id: ruleTwo.id,
              deleted_at: null,
            }),
          ])
        )

        const rateWithRules = await service.retrieveTaxRate(rate.id, {
          relations: ["rules"],
        })
        expect(rateWithRules.rules.length).toBe(1)

        // should be possible to add the rule back again
        await service.createTaxRateRules({
          tax_rate_id: rate.id,
          reference: ruleOne.reference,
          reference_id: ruleOne.reference_id,
        })

        const rateWithRulesAfterReAdd = await service.retrieveTaxRate(rate.id, {
          relations: ["rules"],
        })
        expect(rateWithRulesAfterReAdd.rules.length).toBe(2)
      })

      it("should fail on duplicate rules", async () => {
        const region = await service.createTaxRegions({
          country_code: "US",
        })

        await expect(
          service.createTaxRates({
            tax_region_id: region.id,
            value: 10,
            code: "test",
            name: "test",
            rules: [
              { reference: "product", reference_id: "product_id_1" },
              { reference: "product", reference_id: "product_id_1" },
            ],
          })
        ).rejects.toThrowError(
          /Tax rate rule with tax_rate_id: .*?, reference_id: product_id_1, already exists./
        )

        const rate = await service.createTaxRates({
          tax_region_id: region.id,
          value: 10,
          code: "test",
          name: "test",
          rules: [{ reference: "product", reference_id: "product_id_1" }],
        })

        await expect(
          service.createTaxRateRules({
            tax_rate_id: rate.id,
            reference: "product",
            reference_id: "product_id_1",
          })
        ).rejects.toThrowError(
          /Tax rate rule with tax_rate_id: .*?, reference_id: product_id_1, already exists./
        )
      })

      it("should fail to create province region belonging to a parent with non-matching country", async () => {
        const caRegion = await service.createTaxRegions({
          country_code: "CA",
        })
        await expect(
          service.createTaxRegions({
            country_code: "US", // This should be CA
            parent_id: caRegion.id,
            province_code: "QC",
          })
        ).rejects.toThrowError(
          `Province region must belong to a parent region with the same country code. You are trying to create a province region with (country: us, province: qc) but parent expects (country: ca)`
        )
      })

      it("should fail duplicate regions", async () => {
        await service.createTaxRegions({
          country_code: "CA",
        })

        await service.createTaxRegions({
          country_code: "CA",
          province_code: "QC",
        })

        await expect(
          service.createTaxRegions({
            country_code: "CA",
            province_code: "QC",
          })
        ).rejects.toThrowError(
          "Tax region with country_code: ca, province_code: qc, already exists."
        )
      })

      it("should fail to create region with non-existing parent", async () => {
        await expect(
          service.createTaxRegions({
            parent_id: "something random",
            country_code: "CA",
            province_code: "QC",
          })
        ).rejects.toThrowError(
          `Province region must belong to a parent region. You are trying to create a province region with (country: ca, province: qc) but parent does not exist`
        )
      })

      it("should fail to create two default tax rates", async () => {
        const rate = await service.createTaxRegions({
          country_code: "CA",
          default_tax_rate: {
            name: "Test Rate",
            rate: 0.2,
          },
        })

        await expect(
          service.createTaxRates({
            tax_region_id: rate.id,
            name: "Shipping Rate",
            rate: 8.23,
            is_default: true,
          })
        ).rejects.toThrowError(
          /Tax rate with tax_region_id: .*?, already exists./
        )
      })

      it("should delete all child regions when parent region is deleted", async () => {
        const region = await service.createTaxRegions({
          country_code: "CA",
        })
        const provinceRegion = await service.createTaxRegions({
          parent_id: region.id,
          country_code: "CA",
          province_code: "QC",
        })

        await service.deleteTaxRegions(region.id)

        const taxRegions = await service.listTaxRegions({
          id: provinceRegion.id,
        })

        expect(taxRegions).toEqual([])
      })

      it("should soft delete all child regions when parent region is deleted", async () => {
        const region = await service.createTaxRegions({
          country_code: "CA",
        })
        const provinceRegion = await service.createTaxRegions({
          parent_id: region.id,
          country_code: "CA",
          province_code: "QC",
        })

        await service.softDeleteTaxRegions([region.id])

        const taxRegions = await service.listTaxRegions(
          { id: provinceRegion.id },
          { withDeleted: true }
        )

        expect(taxRegions).toEqual([
          expect.objectContaining({
            id: provinceRegion.id,
            deleted_at: expect.any(Date),
          }),
        ])
      })
    })
  },
})
