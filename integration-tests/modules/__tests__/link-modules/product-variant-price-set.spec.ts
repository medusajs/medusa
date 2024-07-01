import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import { IPricingModuleService, IProductModuleService } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    describe("ProductVariant Price Sets", () => {
      let appContainer
      let productModule: IProductModuleService
      let pricingModule: IPricingModuleService
      let remoteQuery
      let remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        productModule = appContainer.resolve(ModuleRegistrationName.PRODUCT)
        pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
        remoteQuery = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
        remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      })

      it("should query product variants and price set link with remote query", async () => {
        const [product] = await productModule.createProducts([
          {
            title: "Test product",
            variants: [
              {
                title: "Test variant",
              },
              {
                title: "Variant number 2",
              },
            ],
          },
        ])

        const [priceSet1, priceSet2] = await pricingModule.createPriceSets([
          {
            prices: [
              {
                amount: 3000,
                currency_code: "usd",
              },
              {
                amount: 5000,
                currency_code: "eur",
                rules: {
                  customer_group_id: "vip",
                },
              },
            ],
          },
          {
            prices: [
              {
                amount: 400,
                currency_code: "eur",
              },
              {
                amount: 500,
                currency_code: "usd",
              },
              {
                amount: 100,
                currency_code: "usd",
                rules: {
                  customer_group_id: "vip",
                },
              },
            ],
          },
        ])

        await remoteLink.create([
          {
            [Modules.PRODUCT]: {
              variant_id: product.variants[0].id,
            },
            [Modules.PRICING]: {
              price_set_id: priceSet1.id,
            },
          },
          {
            [Modules.PRODUCT]: {
              variant_id: product.variants[1].id,
            },
            [Modules.PRICING]: {
              price_set_id: priceSet2.id,
            },
          },
        ])

        const query = remoteQueryObjectFromString({
          entryPoint: "product",
          variables: {
            "variants.calculated_price": {
              context: {
                currency_code: "usd",
                customer_group_id: "vip",
              },
            },
          },
          fields: [
            "id",
            "title",
            "variants.title",
            "variants.prices.amount",
            "variants.prices.currency_code",
            "variants.calculated_price.calculated_amount",
            "variants.calculated_price.currency_code",
          ],
        })

        const link = await remoteQuery(query)

        expect(link).toHaveLength(1)
        expect(link).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              title: "Test product",
              variants: expect.arrayContaining([
                expect.objectContaining({
                  title: "Test variant",
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 5000,
                      currency_code: "eur",
                    }),
                    expect.objectContaining({
                      amount: 3000,
                      currency_code: "usd",
                    }),
                  ]),
                  calculated_price: {
                    calculated_amount: 3000,
                    currency_code: "usd",
                  },
                }),
                expect.objectContaining({
                  title: "Variant number 2",
                  prices: expect.arrayContaining([
                    expect.objectContaining({
                      amount: 400,
                      currency_code: "eur",
                    }),
                    expect.objectContaining({
                      amount: 500,
                      currency_code: "usd",
                    }),
                    expect.objectContaining({
                      amount: 100,
                      currency_code: "usd",
                    }),
                  ]),
                  calculated_price: {
                    calculated_amount: 100,
                    currency_code: "usd",
                  },
                }),
              ]),
            }),
          ])
        )
      })
    })
  },
})
