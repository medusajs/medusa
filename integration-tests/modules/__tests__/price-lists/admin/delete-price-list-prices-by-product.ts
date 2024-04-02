import {
  simpleProductFactory,
  simpleRegionFactory,
} from "../../../../factories"

import { IPricingModuleService } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import adminSeeder from "../../../../helpers/admin-seeder"
import { createDefaultRuleTypes } from "../../../helpers/create-default-rule-types"
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
    describe.skip("DELETE /admin/price-lists/:id/products/:productId/batch", () => {
      let appContainer
      let product
      let variant1
      let priceSet
      let priceListId
      let pricingModuleService: IPricingModuleService

      beforeAll(async () => {
        appContainer = getContainer()
        pricingModuleService = appContainer.resolve("pricingModuleService")
      })

      beforeEach(async () => {
        await adminSeeder(dbConnection)
        await createDefaultRuleTypes(appContainer)

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

        variant1 = product.variants[0]

        priceSet = await createVariantPriceSet({
          container: appContainer,
          variantId: variant1.id,
          prices: [
            {
              amount: 3000,
              currency_code: "usd",
            },
          ],
        })

        const data = {
          name: "test price list",
          description: "test",
          type: "override",
          customer_groups: [],
          status: "active",
          prices: [
            {
              amount: 400,
              variant_id: variant1.id,
              currency_code: "usd",
            },
          ],
        }

        const priceListResult = await api.post(
          `admin/price-lists`,
          data,
          adminHeaders
        )
        priceListId = priceListResult.data.price_list.id
      })

      it("should delete prices in batch based on product ids", async () => {
        let prices = await pricingModuleService.listPrices({
          price_set_id: [priceSet.id],
        })
        expect(prices.length).toEqual(2)

        const deleteRes = await api.delete(
          `/admin/price-lists/${priceListId}/products/prices/batch`,
          {
            headers: adminHeaders.headers,
            data: {
              product_ids: [product.id],
            },
          }
        )
        expect(deleteRes.status).toEqual(200)

        prices = await pricingModuleService.listPrices({
          price_set_id: [priceSet.id],
        })

        expect(prices.length).toEqual(1)
        expect(prices).toEqual([
          expect.objectContaining({
            price_list: null,
          }),
        ])
      })

      it("should delete prices based on single product id", async () => {
        let prices = await pricingModuleService.listPrices({
          price_set_id: [priceSet.id],
        })
        expect(prices.length).toEqual(2)

        const deleteRes = await api.delete(
          `/admin/price-lists/${priceListId}/products/${product.id}/prices`,
          adminHeaders
        )
        expect(deleteRes.status).toEqual(200)

        prices = await pricingModuleService.listPrices({
          price_set_id: [priceSet.id],
        })

        expect(prices.length).toEqual(1)
        expect(prices).toEqual([
          expect.objectContaining({
            price_list: null,
          }),
        ])
      })
    })
  },
})
