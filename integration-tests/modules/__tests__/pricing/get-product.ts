import { simpleCartFactory, simpleRegionFactory } from "../../../factories"

import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { createDefaultRuleTypes } from "../../helpers/create-default-rule-types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../helpers/create-admin-user"

jest.setTimeout(5000000)

const DB_HOST = process.env.DB_HOST
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_TEMP_NAME
const DB_URL = `postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`

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
    describe.skip("Link Modules", () => {
      let medusaContainer

      beforeAll(async () => {
        medusaContainer = getContainer()
      })
      beforeEach(async () => {
        await createDefaultRuleTypes(medusaContainer)
        await createAdminUser(dbConnection, adminHeaders, medusaContainer)
        await simpleRegionFactory(dbConnection, {
          id: "region-1",
          currency_code: "usd",
        })
      })

      describe("get product price", () => {
        let ruleType
        let priceSet
        let productId
        const cartId = "test-cart"
        beforeEach(async () => {
          const pricingModuleService = medusaContainer.resolve(
            ModuleRegistrationName.PRICING
          )

          await simpleCartFactory(dbConnection, {
            id: cartId,
            region: "region-1",
          })

          const payload = {
            title: "Test",
            description: "test-product-description",
            images: ["test-image.png", "test-image-2.png"],
            variants: [
              {
                title: "Test variant",
                prices: [],
                options: [],
              },
            ],
          }

          const response = await api.post(
            "/admin/products",
            payload,
            adminHeaders
          )

          productId = response.data.product.id
          const variant = response.data.product.variants[0]

          ruleType = await pricingModuleService.createRuleTypes([
            { name: "region_id", rule_attribute: "region_id" },
          ])

          priceSet = await pricingModuleService.create({
            rules: [{ rule_attribute: "region_id" }],
            prices: [
              {
                amount: 1000,
                currency_code: "usd",
                rules: { region_id: "region-1" },
              },
              {
                amount: 900,
                currency_code: "usd",
                rules: { region_id: "region-2" },
              },
            ],
          })

          const remoteLink = medusaContainer.resolve("remoteLink") as any

          await remoteLink.create({
            productService: {
              variant_id: variant.id,
            },
            pricingService: {
              price_set_id: priceSet.id,
            },
          })
        })

        it("Should get prices declared in pricing module", async () => {
          const response = await api.get(
            `/store/products/${productId}?cart_id=${cartId}`
          )

          expect(response.data.product.variants[0].prices).toEqual([
            expect.objectContaining({
              amount: 1000,
              currency_code: "usd",
            }),
          ])
        })
      })
    })
  },
})
