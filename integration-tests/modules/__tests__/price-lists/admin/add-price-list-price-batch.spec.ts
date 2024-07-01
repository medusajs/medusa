import { IPricingModuleService } from "@medusajs/types"
import { PriceListStatus, PriceListType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  simpleProductFactory,
  simpleRegionFactory,
} from "../../../../factories"
import { createAdminUser } from "../../../../helpers/create-admin-user"
import { createVariantPriceSet } from "../../../helpers/create-variant-price-set"

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
    describe.skip("POST /admin/price-lists/:id/prices/batch", () => {
      let appContainer
      let product
      let variant
      let pricingModuleService: IPricingModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        pricingModuleService = appContainer.resolve("pricingModuleService")
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        await simpleRegionFactory(dbConnection, {
          id: "test-region",
          name: "Test Region",
          currency_code: "usd",
          tax_rate: 0,
        })

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

      it("should update money amounts if variant id is present in prices", async () => {
        const [priceList] = await pricingModuleService.createPriceLists([
          {
            title: "test price list",
            description: "test",
            ends_at: new Date().toISOString(),
            starts_at: new Date().toISOString(),
            status: PriceListStatus.ACTIVE,
            type: PriceListType.OVERRIDE,
          },
        ])

        await createVariantPriceSet({
          container: appContainer,
          variantId: variant.id,
          prices: [
            {
              amount: 3000,
              currency_code: "usd",
            },
          ],
        })

        const data = {
          prices: [
            {
              variant_id: variant.id,
              amount: 5000,
              currency_code: "usd",
            },
            {
              amount: 6000,
              region_id: "test-region",
              variant_id: variant.id,
            },
          ],
        }

        await api.post(
          `admin/price-lists/${priceList.id}/prices/batch`,
          data,
          adminHeaders
        )

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
              expect.objectContaining({
                id: expect.any(String),
                created_at: expect.any(String),
                updated_at: expect.any(String),
                deleted_at: null,
                currency_code: "usd",
                amount: 6000,
                min_quantity: null,
                max_quantity: null,
                price_list_id: expect.any(String),
                region_id: "test-region",
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
          })
        )
      })
    })
  },
})
