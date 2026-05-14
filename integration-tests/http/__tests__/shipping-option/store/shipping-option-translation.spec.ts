import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { Modules, ProductStatus } from "@medusajs/utils"

jest.setTimeout(50000)

process.env.MEDUSA_FF_TRANSLATION = "true"

const env = {}
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store: Shipping Option API (with translations)", () => {
      let appContainer
      let salesChannel
      let region
      let product
      let stockLocation
      let shippingProfile
      let fulfillmentSet
      let shippingOption
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
      })

      afterAll(async () => {
        delete process.env.MEDUSA_FF_TRANSLATION
      })

      beforeEach(async () => {
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        await createAdminUser(dbConnection, adminHeaders, appContainer)

        const translationModule = appContainer.resolve(Modules.TRANSLATION)
        await translationModule.__hooks?.onApplicationStart?.().catch(() => {})

        // Set up store locales
        const storeModule = appContainer.resolve(Modules.STORE)
        const [defaultStore] = await storeModule.listStores(
          {},
          {
            select: ["id"],
            take: 1,
          }
        )
        await storeModule.updateStores(defaultStore.id, {
          supported_locales: [
            { locale_code: "en-US" },
            { locale_code: "fr-FR" },
            { locale_code: "de-DE" },
          ],
        })

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["US"] },
            adminHeaders
          )
        ).data.region

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "Test", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

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
              status: ProductStatus.PUBLISHED,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              shipping_profile_id: shippingProfile.id,
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

        stockLocation = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        const fulfillmentSets = (
          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
            {
              name: "Test",
              type: "test-type",
            },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
            {
              name: "Test",
              geo_zones: [
                { type: "country", country_code: "us" },
                { type: "country", country_code: "dk" },
              ],
            },
            adminHeaders
          )
        ).data.fulfillment_set

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
          { add: ["manual_test-provider"] },
          adminHeaders
        )

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

        // Create translations for shipping option
        await api.post(
          "/admin/translations/batch",
          {
            create: [
              {
                reference_id: shippingOption.id,
                reference: "shipping_option",
                locale_code: "fr-FR",
                translations: {
                  name: "Option d'expédition test",
                },
              },
              {
                reference_id: shippingOption.id,
                reference: "shipping_option",
                locale_code: "de-DE",
                translations: {
                  name: "Test-Versandoption",
                },
              },
            ],
          },
          adminHeaders
        )
      })

      describe("GET /store/shipping-options?cart_id=", () => {
        it("should return translated shipping options when cart has locale", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              currency_code: "usd",
              locale: "fr-FR",
              email: "test@admin.com",
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const shippingOptionsResponse = await api.get(
            `/store/shipping-options?cart_id=${cart.id}`,
            storeHeaders
          )

          expect(shippingOptionsResponse.status).toEqual(200)
          expect(shippingOptionsResponse.data.shipping_options).toHaveLength(1)
          expect(shippingOptionsResponse.data.shipping_options[0]).toEqual(
            expect.objectContaining({
              id: shippingOption.id,
              name: "Option d'expédition test",
            })
          )
        })

        it("should return translated shipping options when locale is changed", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              currency_code: "usd",
              locale: "fr-FR",
              email: "test@admin.com",
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          // Verify French translation
          let shippingOptionsResponse = await api.get(
            `/store/shipping-options?cart_id=${cart.id}`,
            storeHeaders
          )

          expect(shippingOptionsResponse.data.shipping_options[0].name).toEqual(
            "Option d'expédition test"
          )

          // Update cart locale to German
          await api.post(
            `/store/carts/${cart.id}`,
            {
              locale: "de-DE",
            },
            storeHeaders
          )

          // Verify German translation
          shippingOptionsResponse = await api.get(
            `/store/shipping-options?cart_id=${cart.id}`,
            storeHeaders
          )

          expect(shippingOptionsResponse.data.shipping_options[0].name).toEqual(
            "Test-Versandoption"
          )
        })

        it("should return original shipping option name when no translation exists", async () => {
          const cartResponse = await api.post(
            `/store/carts`,
            {
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              currency_code: "usd",
              locale: "ja-JP",
              email: "test@admin.com",
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            storeHeaders
          )

          const cart = cartResponse.data.cart

          const shippingOptionsResponse = await api.get(
            `/store/shipping-options?cart_id=${cart.id}`,
            storeHeaders
          )

          expect(shippingOptionsResponse.status).toEqual(200)
          expect(shippingOptionsResponse.data.shipping_options[0]).toEqual(
            expect.objectContaining({
              id: shippingOption.id,
              name: "Test shipping option",
            })
          )
        })
      })
    })
  },
})
