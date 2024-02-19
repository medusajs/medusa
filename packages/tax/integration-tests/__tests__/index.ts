import { initModules } from "medusa-test-utils"
import { ITaxModuleService } from "@medusajs/types"
import { Modules } from "@medusajs/modules-sdk"

import { MikroOrmWrapper } from "../utils"
import { getInitModuleConfig } from "../utils/get-init-module-config"

jest.setTimeout(30000)

describe("TaxModuleService", function () {
  let service: ITaxModuleService
  let shutdownFunc: () => Promise<void>

  beforeAll(async () => {
    const initModulesConfig = getInitModuleConfig()

    const { medusaApp, shutdown } = await initModules(initModulesConfig)

    service = medusaApp.modules[Modules.TAX]

    shutdownFunc = shutdown
  })

  afterAll(async () => {
    await shutdownFunc()
  })

  beforeEach(async () => {
    await MikroOrmWrapper.setupDatabase()
  })

  afterEach(async () => {
    await MikroOrmWrapper.clearDatabase()
  })

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

  it("should create a shipping tax rate", async () => {
    const [region] = await service.createTaxRegions([
      {
        country_code: "US",
        default_tax_rate: {
          name: "Test Rate",
          rate: 0.2,
        },
      },
    ])

    await service.createShippingTaxRates([
      {
        shipping_option_id: "test",
        tax_rate: {
          tax_region_id: region.id,
          name: "Shipping Rate",
          rate: 8.23,
        },
      },
    ])

    const listedRates = await service.listShippingTaxRates(
      {},
      {
        relations: ["tax_rate"],
      }
    )
    expect(listedRates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          shipping_option_id: "test",
          tax_rate: expect.objectContaining({
            tax_region_id: region.id,
            name: "Shipping Rate",
            rate: 8.23,
          }),
        }),
      ])
    )
  })

  it("should create a product tax rate", async () => {
    const [region] = await service.createTaxRegions([
      {
        country_code: "US",
        default_tax_rate: {
          name: "Test Rate",
          rate: 0.2,
        },
      },
    ])

    await service.createProductTaxRates([
      {
        product_id: "test",
        tax_rate: {
          tax_region_id: region.id,
          name: "Product Rate",
          rate: 8.23,
        },
      },
    ])

    const listedRates = await service.listProductTaxRates(
      {},
      { relations: ["tax_rate"] }
    )
    expect(listedRates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product_id: "test",
          tax_rate: expect.objectContaining({
            tax_region_id: region.id,
            name: "Product Rate",
            rate: 8.23,
          }),
        }),
      ])
    )
  })

  it("should create a product type tax rate", async () => {
    const [region] = await service.createTaxRegions([
      {
        country_code: "US",
        default_tax_rate: {
          name: "Test Rate",
          rate: 0.2,
        },
      },
    ])

    await service.createProductTypeTaxRates([
      {
        product_type_id: "test",
        tax_rate: {
          tax_region_id: region.id,
          name: "Product Rate",
          rate: 8.23,
        },
      },
    ])

    const listedRates = await service.listProductTypeTaxRates(
      {},
      { relations: ["tax_rate"] }
    )
    expect(listedRates).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          product_type_id: "test",
          tax_rate: expect.objectContaining({
            tax_region_id: region.id,
            name: "Product Rate",
            rate: 8.23,
          }),
        }),
      ])
    )
  })
})
