import { ModuleRegistrationName, Modules } from "@medusajs/modules-sdk"
import {
  IFulfillmentModuleService,
  IPricingModuleService,
} from "@medusajs/types"
import { ContainerRegistrationKeys } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    describe("Region and Payment Providers", () => {
      let appContainer
      let fulfillmentModule: IFulfillmentModuleService
      let pricingModule: IPricingModuleService
      let remoteQuery
      let remoteLink

      beforeAll(async () => {
        appContainer = getContainer()
        fulfillmentModule = appContainer.resolve(
          ModuleRegistrationName.FULFILLMENT
        )
        pricingModule = appContainer.resolve(ModuleRegistrationName.PRICING)
        remoteQuery = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
        remoteLink = appContainer.resolve(ContainerRegistrationKeys.REMOTE_LINK)
      })

      it("should query shipping option and price set link with remote query", async () => {
        const shippingProfile = await fulfillmentModule.createShippingProfiles({
          name: "Test",
          type: "default",
        })
        const fulfillmentSet = await fulfillmentModule.create({
          name: "Test",
          type: "test-type",
        })
        const serviceZone = await fulfillmentModule.createServiceZones({
          name: "Test",
          fulfillment_set_id: fulfillmentSet.id,
          geo_zones: [
            {
              type: "country",
              country_code: "us",
            },
          ],
        })

        const shippingOption = await fulfillmentModule.createShippingOptions({
          name: "Test shipping option",
          service_zone_id: serviceZone.id,
          shipping_profile_id: shippingProfile.id,
          provider_id: "manual_test-provider",
          price_type: "flat",
          type: {
            label: "Test type",
            description: "Test description",
            code: "test-code",
          },
        })

        const priceSet = await pricingModule.create({
          prices: [
            {
              amount: 3000,
              currency_code: "usd",
            },
            {
              amount: 5000,
              currency_code: "eur",
            },
          ],
        })

        await remoteLink.create([
          {
            [Modules.FULFILLMENT]: {
              shipping_option_id: shippingOption.id,
            },
            [Modules.PRICING]: {
              price_set_id: priceSet.id,
            },
          },
        ])

        const link = await remoteQuery({
          shipping_option: {
            fields: ["id"],
            price_set_link: {
              fields: ["id", "price_set_id", "shipping_option_id"],
            },
            prices: {
              fields: ["amount", "currency_code"],
            },
            calculated_price: {
              fields: ["calculated_amount", "currency_code"],
              __args: {
                context: {
                  currency_code: "eur",
                },
              },
            },
          },
        })

        expect(link).toHaveLength(1)
        expect(link).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: shippingOption.id,
              price_set_link: expect.objectContaining({
                price_set_id: priceSet.id,
                shipping_option_id: shippingOption.id,
              }),
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
              calculated_price: expect.objectContaining({
                calculated_amount: 5000,
                currency_code: "eur",
              }),
            }),
          ])
        )
      })
    })
  },
})
