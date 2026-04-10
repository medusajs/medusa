import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { ProductStatus } from "@medusajs/utils"

jest.setTimeout(50000)

const env = {}
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Store: Shipping Option API", () => {
      let appContainer
      let salesChannel
      let region
      let regionTwo
      let product
      let stockLocation
      let shippingProfile
      let fulfillmentSet
      let cart
      let shippingOptionCalculated
      let shippingOptionFlat
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        await createAdminUser(dbConnection, adminHeaders, appContainer)

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["US"] },
            adminHeaders
          )
        ).data.region

        regionTwo = (
          await api.post(
            "/admin/regions",
            {
              name: "Test region two",
              currency_code: "dkk",
              countries: ["DK"],
              is_tax_inclusive: true,
            },
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
              shipping_profile_id: shippingProfile.id,
              status: ProductStatus.PUBLISHED,
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
                    {
                      currency_code: "dkk",
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
          {
            add: [
              "manual_test-provider",
              "manual-calculated_test-provider-calculated",
            ],
          },
          adminHeaders
        )

        shippingOptionCalculated = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Calculated shipping option",
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: "manual-calculated_test-provider-calculated",
              price_type: "calculated",
              type: {
                label: "Test type",
                description: "Test description",
                code: "test-code",
              },
              prices: [], // TODO: Update endpoint validator to not require prices if type is calculated
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        shippingOptionFlat = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Flat rate shipping option",
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
                {
                  region_id: region.id,
                  amount: 0,
                  rules: [
                    {
                      operator: "gt",
                      attribute: "item_total",
                      value: 2000,
                    },
                  ],
                },
                {
                  region_id: regionTwo.id,
                  amount: 500,
                },
              ],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option
      })

      describe("GET /store/shipping-options?cart_id=", () => {
        it("should get calculated and flat rate shipping options for a cart successfully", async () => {
          cart = (
            await api.post(
              `/store/carts`,
              {
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                currency_code: "usd",
                email: "test@admin.com",
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 2,
                  },
                ],
              },
              storeHeaders
            )
          ).data.cart

          const resp = await api.get(
            `/store/shipping-options?cart_id=${cart.id}`,
            storeHeaders
          )

          const shippingOptions = resp.data.shipping_options

          expect(shippingOptions).toHaveLength(2)
          expect(shippingOptions).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: shippingOptionFlat.id,
                name: "Flat rate shipping option",
                price_type: "flat",
                amount: 1100,
                is_tax_inclusive: false,
                provider_id: "manual_test-provider",
                calculated_price: expect.objectContaining({
                  calculated_amount: 1100,
                  is_calculated_price_tax_inclusive: false,
                }),
              }),
              expect.objectContaining({
                id: shippingOptionCalculated.id,
                name: "Calculated shipping option",
                price_type: "calculated",
                provider_id: "manual-calculated_test-provider-calculated",
                calculated_price: null,
                prices: [],
                // amount doesn't exist for calculated shipping options -> /calculate needs to be called
              }),
            ])
          )
        })

        it("should get fetch pricing for calculated shipping options", async () => {
          cart = (
            await api.post(
              `/store/carts`,
              {
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                currency_code: "usd",
                email: "test@admin.com",
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 2,
                  },
                ],
              },
              storeHeaders
            )
          ).data.cart

          const resp = await api.post(
            `/store/shipping-options/${shippingOptionCalculated.id}/calculate?fields=+provider_id`,
            { cart_id: cart.id, data: { pin_id: "test" } },
            storeHeaders
          )

          const shippingOption = resp.data.shipping_option

          expect(shippingOption).toEqual(
            expect.objectContaining({
              id: shippingOptionCalculated.id,
              name: "Calculated shipping option",
              price_type: "calculated",
              provider_id: "manual-calculated_test-provider-calculated",
              calculated_price: expect.objectContaining({
                calculated_amount: 3,
                is_calculated_price_tax_inclusive: false,
              }),
              amount: 3,
            })
          )
        })

        it("should add shipping method with calculated price to cart", async () => {
          cart = (
            await api.post(
              `/store/carts`,
              {
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                currency_code: "usd",
                email: "test@admin.com",
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 2,
                  },
                ],
              },
              storeHeaders
            )
          ).data.cart

          // Select shipping option and create shipping method

          let response = await api.post(
            `/store/carts/${cart.id}/shipping-methods?fields=*shipping_methods`,
            {
              option_id: shippingOptionCalculated.id,
              data: { pin_id: "test" },
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  shipping_option_id: shippingOptionCalculated.id,
                  amount: 3,
                  is_tax_inclusive: false,
                  data: { pin_id: "test" },
                }),
              ]),
              shipping_total: 3,
            })
          )

          // Update cart and refresh shipping methods

          response = await api.post(
            `/store/carts/${cart.id}/line-items?fields=*shipping_methods`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  shipping_option_id: shippingOptionCalculated.id,
                  amount: 4.5,
                  is_tax_inclusive: false,
                  data: { pin_id: "test" },
                }),
              ]),
              shipping_subtotal: 4.5,
            })
          )
        })

        it("should recompute shipping promotion adjustments after shipping price changes due to item update", async () => {
          // Create an automatic promotion targeting shipping_methods
          // 100% off shipping (percentage) when applied
          await api.post(
            `/admin/promotions`,
            {
              code: "FREE_SHIPPING",
              type: "standard",
              status: "active",
              is_automatic: true,
              application_method: {
                type: "percentage",
                target_type: "shipping_methods",
                allocation: "each",
                value: 100,
                max_quantity: 1,
                currency_code: "usd",
              },
            },
            adminHeaders
          )

          cart = (
            await api.post(
              `/store/carts`,
              {
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                currency_code: "usd",
                email: "test@admin.com",
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 2,
                  },
                ],
              },
              storeHeaders
            )
          ).data.cart

          // Add calculated shipping method to cart
          // With 2 items (quantity 2), price = 2 * 1.5 = 3
          let response = await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            {
              option_id: shippingOptionCalculated.id,
              data: { pin_id: "test" },
            },
            storeHeaders
          )

          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  shipping_option_id: shippingOptionCalculated.id,
                  amount: 3,
                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      code: "FREE_SHIPPING",
                      amount: 3,
                    }),
                  ]),
                }),
              ]),
              shipping_total: 0,
            })
          )

          // Now add more items to the cart, which changes item quantity to 3
          // New shipping price should be 3 * 1.5 = 4.5
          // The promotion should adjust to 4.5 (100% off the NEW shipping amount)
          response = await api.post(
            `/store/carts/${cart.id}/line-items`,
            {
              variant_id: product.variants[0].id,
              quantity: 1,
            },
            storeHeaders
          )

          expect(response.data.cart).toEqual(
            expect.objectContaining({
              id: cart.id,
              shipping_methods: expect.arrayContaining([
                expect.objectContaining({
                  shipping_option_id: shippingOptionCalculated.id,
                  amount: 4.5,
                  adjustments: expect.arrayContaining([
                    expect.objectContaining({
                      code: "FREE_SHIPPING",
                      amount: 4.5, // Must match the NEW shipping amount, not the old one (3)
                    }),
                  ]),
                }),
              ]),
              shipping_total: 0, // Still fully discounted
            })
          )
        })
      })
    })
  },
})
