import { simpleProductFactory } from "../../../../factories"

import {
  IPricingModuleService,
  PriceListStatus,
  PriceListType,
} from "@medusajs/types"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"
import { medusaIntegrationTestRunner } from "medusa-test-utils/dist"

jest.setTimeout(50000)

const adminHeaders = {
  headers: {
    "x-medusa-access-token": "test_token",
  },
}

const env = {
  MEDUSA_FF_MEDUSA_V2: true,
}

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe.skip("GET /admin/price-lists", () => {
      let appContainer
      let product
      let variant
      let pricingModuleService: IPricingModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        pricingModuleService = appContainer.resolve("pricingModuleService")
      })

      beforeEach(async () => {
        await adminSeeder(dbConnection)

        product = await simpleProductFactory(dbConnection, {
          id: "test-product-with-variant",
          variants: [
            {
              options: [{ option_id: "test-product-option-1", value: "test" }],
            },
          ],
          options: [
            {
              id: "test-product-option-1",
              title: "Test option 1",
            },
          ],
        })

        variant = product.variants[0]
      })

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

        const [priceList] = await pricingModuleService.createPriceLists([
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
                  inventory_quantity: 10,
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
  },
})
