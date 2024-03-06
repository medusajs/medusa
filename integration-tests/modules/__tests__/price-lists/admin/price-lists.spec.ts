import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  ICustomerModuleService,
  IPricingModuleService,
  IProductModuleService,
  IRegionModuleService,
  PriceListStatus,
  PriceListType,
} from "@medusajs/types"
import path from "path"
import { startBootstrapApp } from "../../../../environment-helpers/bootstrap-app"
import { useApi } from "../../../../environment-helpers/use-api"
import { getContainer } from "../../../../environment-helpers/use-container"
import { initDb, useDb } from "../../../../environment-helpers/use-db"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

describe("Price Lists", () => {
  let dbConnection
  let appContainer
  let shutdownServer
  let product
  let variant
  let region
  let customerGroup
  let pricingModule: IPricingModuleService
  let productModule: IProductModuleService
  let customerModule: ICustomerModuleService
  let regionModule: IRegionModuleService

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
    dbConnection = await initDb({ cwd, env } as any)
    shutdownServer = await startBootstrapApp({ cwd, env })
    appContainer = getContainer()
    pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
    productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
    customerModule = appContainer.resolve(ModuleRegistrationName.CUSTOMER)
    regionModule = appContainer.resolve(ModuleRegistrationName.REGION)
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()
    await shutdownServer()
  })

  beforeEach(async () => {
    await adminSeeder(dbConnection)
    customerGroup = await customerModule.createCustomerGroup({ name: "VIP" })
    region = await regionModule.create({ name: "US", currency_code: "USD" })
    ;[product] = await productModule.create([{ title: "test product" }])

    await pricingModule.createRuleTypes([
      { name: "Customer Group ID", rule_attribute: "customer_group_id" },
      { name: "Region ID", rule_attribute: "region_id" },
    ])

    const [productOption] = await productModule.createOptions([
      { title: "Test option 1", product_id: product.id },
    ])

    ;[variant] = await productModule.createVariants([
      {
        product_id: product.id,
        title: "test product variant",
        options: [{ value: "test", option_id: productOption.id }],
      },
    ])
  })

  afterEach(async () => {
    const db = useDb()
    await db.teardown()
  })

  describe("GET /admin/price-lists", () => {
    it("should get price list and its money amounts with variants", async () => {
      const priceSet = await createVariantPriceSet({
        container: appContainer,
        variantId: variant.id,
        prices: [
          {
            amount: 3000,
            currency_code: "usd",
          },
        ],
      })

      await pricingModule.createPriceLists([
        {
          title: "test price list",
          description: "test",
          ends_at: new Date(),
          starts_at: new Date(),
          status: PriceListStatus.ACTIVE,
          type: PriceListType.OVERRIDE,
          prices: [
            { amount: 5000, currency_code: "usd", price_set_id: priceSet.id },
          ],
          rules: {
            customer_group_id: [customerGroup.id],
          },
        },
      ])

      const api = useApi() as any
      const response = await api.get(`/admin/price-lists`, adminHeaders)

      expect(response.status).toEqual(200)
      expect(response.data.count).toEqual(1)
      expect(response.data.price_lists).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
          name: "test price list",
          description: "test",
          type: "override",
          status: "active",
          starts_at: expect.any(String),
          ends_at: expect.any(String),
          customer_groups: [
            expect.objectContaining({
              id: customerGroup.id,
            }),
          ],
          prices: [
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              currency_code: "usd",
              amount: 5000,
              min_quantity: null,
              max_quantity: null,
              price_list_id: expect.any(String),
              region_id: null,
              variant: expect.objectContaining({
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                title: expect.any(String),
                product_id: expect.any(String),
                sku: null,
                barcode: null,
                ean: null,
                upc: null,
                variant_rank: 0,
                inventory_quantity: 100,
                allow_backorder: false,
                manage_inventory: true,
                hs_code: null,
                origin_country: null,
                mid_code: null,
                material: null,
                weight: null,
                length: null,
                height: null,
                width: null,
                metadata: null,
              }),
              variant_id: expect.any(String),
            }),
          ],
        }),
      ])
    })
  })

  describe("GET /admin/price-lists/:id", () => {
    it("should get price list and its money amounts with variants", async () => {
      const priceSet = await createVariantPriceSet({
        container: appContainer,
        variantId: variant.id,
        prices: [
          {
            amount: 3000,
            currency_code: "usd",
          },
        ],
        rules: [],
      })

      const [priceList] = await pricingModule.createPriceLists([
        {
          title: "test price list",
          description: "test",
          ends_at: new Date(),
          starts_at: new Date(),
          status: PriceListStatus.ACTIVE,
          type: PriceListType.OVERRIDE,
          prices: [
            {
              amount: 5000,
              currency_code: "usd",
              price_set_id: priceSet.id,
            },
          ],
        },
      ])

      await pricingModule.createPriceLists([
        {
          title: "test price list 1",
          description: "test 1",
          ends_at: new Date(),
          starts_at: new Date(),
          status: PriceListStatus.ACTIVE,
          type: PriceListType.OVERRIDE,
          prices: [
            {
              amount: 5000,
              currency_code: "usd",
              price_set_id: priceSet.id,
            },
          ],
        },
      ])

      const api = useApi() as any

      const response = await api.get(
        `/admin/price-lists/${priceList.id}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data.price_list).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          created_at: expect.any(String),
          updated_at: expect.any(String),
          deleted_at: null,
          name: "test price list",
          description: "test",
          type: "override",
          status: "active",
          starts_at: expect.any(String),
          ends_at: expect.any(String),
          customer_groups: [],
          prices: [
            expect.objectContaining({
              id: expect.any(String),
              created_at: expect.any(String),
              updated_at: expect.any(String),
              deleted_at: null,
              currency_code: "usd",
              amount: 5000,
              min_quantity: null,
              max_quantity: null,
              price_list_id: expect.any(String),
              region_id: null,
              variant: expect.objectContaining({
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                title: expect.any(String),
                product_id: expect.any(String),
                sku: null,
                barcode: null,
                ean: null,
                upc: null,
                variant_rank: 0,
                inventory_quantity: 100,
                allow_backorder: false,
                manage_inventory: true,
                hs_code: null,
                origin_country: null,
                mid_code: null,
                material: null,
                weight: null,
                length: null,
                height: null,
                width: null,
                metadata: null,
              }),
              variant_id: expect.any(String),
            }),
          ],
        })
      )
    })

    it("should throw an error when price list is not found", async () => {
      const api = useApi() as any

      const error = await api
        .get(`/admin/price-lists/does-not-exist`, adminHeaders)
        .catch((e) => e)

      expect(error.response.status).toBe(404)
      expect(error.response.data).toEqual({
        type: "not_found",
        message: "Price list with id: does-not-exist was not found",
      })
    })
  })
})
