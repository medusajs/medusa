import { ITaxModuleService } from "@medusajs/types"

/**
 * Setup for this specific test
 *
 * Using the following structure to setup tests.
 * US - default 2%
 * - Region: CA - default 5%
 *   - Override: Reduced rate (for 3 product ids): 3%
 *   - Override: Reduced rate (for product type): 1%
 * - Region: NY - default: 6%
 * - Region: FL - default: 4%
 *
 * Denmark - default 25%
 *
 * Germany - default 19%
 * - Override: Reduced Rate (for product type) - 7%
 *
 * Canada - default 5%
 * - Override: Reduced rate (for product id) - 3%
 * - Override: Reduced rate (for product type) - 3.5%
 * - Region: QC - default 2%
 *   - Override: Reduced rate (for same product type as country reduced rate): 1%
 * - Region: BC - default 2%
 */
export const setupTaxStructure = async (service: ITaxModuleService) => {
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
    await service.createTaxRates([
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
