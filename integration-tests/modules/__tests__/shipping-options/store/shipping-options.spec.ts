import { ModuleRegistrationName } from "@medusajs/modules-sdk"
import {
  IFulfillmentModuleService,
  IRegionModuleService,
} from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createAdminUser } from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = { MEDUSA_FF_MEDUSA_V2: true }
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store: Shipping Option API", () => {
      let appContainer
      let fulfillmentModule: IFulfillmentModuleService
      let regionService: IRegionModuleService

      let salesChannel
      let region
      let product
      let stockLocation
      let shippingProfile
      let fulfillmentSet
      let cart
      let shippingOption

      beforeAll(async () => {
        appContainer = getContainer()
        fulfillmentModule = appContainer.resolve(
          ModuleRegistrationName.FULFILLMENT
        )
        regionService = appContainer.resolve(ModuleRegistrationName.REGION)
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)
        const remoteLinkService = appContainer.resolve(
          ContainerRegistrationKeys.REMOTE_LINK
        )

        region = await regionService.createRegions({
          name: "Test region",
          countries: ["US"],
          currency_code: "usd",
        })

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "first channel", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        product = (
          await api.post(
            "/admin/products",
            {
              title: "Test fixture",
              tags: [{ value: "123" }, { value: "456" }],
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant",
                  manage_inventory: false,
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "large",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const stockLocation = (
          await api.post(
            `/admin/stock-locations`,
            {
              name: "test location",
            },
            adminHeaders
          )
        ).data.stock_location

        shippingProfile = await fulfillmentModule.createShippingProfiles({
          name: "Test",
          type: "default",
        })

        fulfillmentSet = await fulfillmentModule.createFulfillmentSets({
          name: "Test",
          type: "test-type",
          service_zones: [
            {
              name: "Test",
              geo_zones: [{ type: "country", country_code: "us" }],
            },
          ],
        })

        await remoteLinkService.create([
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: salesChannel.id,
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: stockLocation.id,
            },
          },
        ])

        await remoteLinkService.create([
          {
            [Modules.STOCK_LOCATION]: {
              stock_location_id: stockLocation.id,
            },
            [Modules.FULFILLMENT]: {
              fulfillment_set_id: fulfillmentSet.id,
            },
          },
        ])

        shippingOption = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Test shipping option",
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: "manual_test-provider",
              price_type: "flat",
              type: {
                label: "Test type",
                description: "Test description",
                code: "test-code",
              },
              prices: [
                {
                  currency_code: "usd",
                  amount: 1000,
                },
                {
                  region_id: region.id,
                  amount: 1100,
                },
              ],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        cart = (
          await api.post(`/store/carts`, {
            region_id: region.id,
            sales_channel_id: salesChannel.id,
            currency_code: "usd",
            email: "test@admin.com",
            items: [
              {
                variant_id: product.variants[0].id,
                quantity: 1,
              },
            ],
          })
        ).data.cart
      })

      describe("GET /admin/shipping-options?cart_id=", () => {
        it("should get all shipping options for a cart successfully", async () => {
          const resp = await api.get(
            `/store/shipping-options?cart_id=${cart.id}`
          )

          const shippingOptions = resp.data.shipping_options
          expect(shippingOptions).toHaveLength(1)
          expect(shippingOptions[0]).toEqual(
            expect.objectContaining({
              id: shippingOption.id,
              name: "Test shipping option",
              amount: 1000,
              price_type: "flat",
            })
          )
        })
      })
    })
  },
})
