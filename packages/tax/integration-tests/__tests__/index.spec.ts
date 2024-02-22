import { SuiteOptions, moduleIntegrationTestRunner } from "medusa-test-utils"
import { ITaxModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

jest.setTimeout(30000)

moduleIntegrationTestRunner({
  moduleName: Modules.TAX,
  testSuite: ({
    MikroOrmWrapper,
    service,
  }: SuiteOptions<ITaxModuleService>) => {
    describe("TaxModuleService", function () {
      it("should create a tax region", async () => {
        const [region] = await service.createTaxRegions([
          {
            country_code: "US",
            default_tax_rate: {
              name: "Test Rate",
              rate: 0.2,
            },
          },
        ])

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
              country_code: "US",
              province_code: null,
              parent_id: null,
            }),
            expect.objectContaining({
              id: provinceRegion.id,
              country_code: "US",
              province_code: "CA",
              parent_id: region.id,
            }),
          ])
        )

        const rates = await service.list()
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

        const rate = await service.create({
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

      it.only("applies default province rules when no specific product or product type rule matches", async () => {
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
    })
  },
})

const setupTaxStructure = async (service) => {
  // Setup for this specific test
  //
  // Using the following structure to setup tests.
  // US - default 2%
  // - Region: CA - default 5%
  //   - Override: Reduced rate (for 3 product ids): 3%
  //   - Override: Reduced rate (for product type): 1%
  // - Region: NY - default: 6%
  // - Region: FL - default: 4%
  //
  // Denmark - default 25%
  //
  // Germany - default 19%
  // - Override: Reduced Rate (for product type) - 7%
  //
  // Canada - default 5%
  // - Override: Reduced rate (for product id) - 3%
  // - Override: Reduced rate (for product type) - 3.5%
  // - Region: QC - default 2%
  //   - Override: Reduced rate (for same product type as country reduced rate): 1%
  // - Region: BC - default 2%
  //
  const [us, dk, de, ca] = await service.createTaxRegions([
    {
      country_code: "US",
      default_tax_rate: { name: "US Default Rate", rate: 2 },
    },
    {
      country_code: "DK",
      default_tax_rate: { name: "Denmark Default Rate", rate: 25 },
    },
    {
      country_code: "DE",
      default_tax_rate: {
        code: "DE19",
        name: "Germany Default Rate",
        rate: 19,
      },
    },
    {
      country_code: "CA",
      default_tax_rate: { name: "Canada Default Rate", rate: 5 },
    },
  ])

  // Create province regions within the US
  const [cal, ny, fl, qc, bc] = await service.createTaxRegions([
    {
      country_code: "US",
      province_code: "CA",
      parent_id: us.id,
      default_tax_rate: {
        rate: 5,
        name: "CA Default Rate",
        code: "CADEFAULT",
      },
    },
    {
      country_code: "US",
      province_code: "NY",
      parent_id: us.id,
      default_tax_rate: {
        rate: 6,
        name: "NY Default Rate",
        code: "NYDEFAULT",
      },
    },
    {
      country_code: "US",
      province_code: "FL",
      parent_id: us.id,
      default_tax_rate: {
        rate: 4,
        name: "FL Default Rate",
        code: "FLDEFAULT",
      },
    },
    {
      country_code: "CA",
      province_code: "QC",
      parent_id: ca.id,
      default_tax_rate: {
        rate: 2,
        name: "QC Default Rate",
        code: "QCDEFAULT",
      },
    },
    {
      country_code: "CA",
      province_code: "BC",
      parent_id: ca.id,
      default_tax_rate: {
        rate: 2,
        name: "BC Default Rate",
        code: "BCDEFAULT",
      },
    },
  ])

  const [calProd, calType, deType, canProd, canType, qcType] =
    await service.create([
      {
        tax_region_id: cal.id,
        name: "CA Reduced Rate for Products",
        rate: 3,
        code: "CAREDUCE_PROD",
      },
      {
        tax_region_id: cal.id,
        name: "CA Reduced Rate for Product Type",
        rate: 1,
        code: "CAREDUCE_TYPE",
      },
      {
        tax_region_id: de.id,
        name: "Germany Reduced Rate for Product Type",
        rate: 7,
        code: "DEREDUCE_TYPE",
      },
      {
        tax_region_id: ca.id,
        name: "Canada Reduced Rate for Product",
        rate: 3,
        code: "CAREDUCE_PROD_CA",
      },
      {
        tax_region_id: ca.id,
        name: "Canada Reduced Rate for Product Type",
        rate: 3.5,
        code: "CAREDUCE_TYPE_CA",
      },
      {
        tax_region_id: qc.id,
        name: "QC Reduced Rate for Product Type",
        rate: 1,
        code: "QCREDUCE_TYPE",
      },
    ])

  // Create tax rate rules for specific products and product types
  await service.createTaxRateRules([
    {
      reference: "product",
      reference_id: "product_id_1",
      tax_rate_id: calProd.id,
    },
    {
      reference: "product",
      reference_id: "product_id_2",
      tax_rate_id: calProd.id,
    },
    {
      reference: "product",
      reference_id: "product_id_3",
      tax_rate_id: calProd.id,
    },
    {
      reference: "product_type",
      reference_id: "product_type_id_1",
      tax_rate_id: calType.id,
    },
    {
      reference: "product_type",
      reference_id: "product_type_id_2",
      tax_rate_id: deType.id,
    },
    {
      reference: "product",
      reference_id: "product_id_4",
      tax_rate_id: canProd.id,
    },
    {
      reference: "product_type",
      reference_id: "product_type_id_3",
      tax_rate_id: canType.id,
    },
    {
      reference: "product_type",
      reference_id: "product_type_id_3",
      tax_rate_id: qcType.id,
    },
  ])

  return {
    us: {
      country: us,
      children: {
        cal: {
          province: cal,
          overrides: {
            calProd,
            calType,
          },
        },
        ny: {
          province: ny,
          overrides: {},
        },
        fl: {
          province: fl,
          overrides: {},
        },
      },
      overrides: {},
    },
    dk: {
      country: dk,
      children: {},
      overrides: {},
    },
    de: {
      country: de,
      children: {},
      overrides: {
        deType,
      },
    },
    ca: {
      country: ca,
      children: {
        qc: {
          province: qc,
          overrides: {
            qcType,
          },
        },
        bc: {
          province: bc,
          overrides: {},
        },
      },
      overrides: {
        canProd,
        canType,
      },
    },
  }
}
