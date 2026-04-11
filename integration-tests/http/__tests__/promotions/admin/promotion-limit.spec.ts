import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules, PromotionStatus, PromotionType } from "@medusajs/utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures/tax"
import { medusaTshirtProduct } from "../../../__fixtures__/product"

jest.setTimeout(500000)

const adminHeaders = {
  headers: { "x-medusa-access-token": "test_token" },
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin Promotions API - Promotion Limits", () => {
      let appContainer
      let promotion
      let product
      let region
      let salesChannel
      let storeHeaders
      let shippingProfile
      let stockLocation
      let fulfillmentSet
      let shippingOption

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        await setupTaxStructure(appContainer.resolve(Modules.TAX))

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "default", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        stockLocation = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        const fulfillmentSets = (
          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
            {
              name: `Test-inventory`,
              type: "test-type",
            },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
            {
              name: `Test-inventory`,
              geo_zones: [{ type: "country", country_code: "US" }],
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
              name: `Test shipping option ${fulfillmentSet.id}`,
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: "manual_test-provider",
              price_type: "flat",
              type: {
                label: "Test type",
                description: "Test description",
                code: "test-code",
              },
              prices: [{ currency_code: "usd", amount: 1000 }],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        product = (
          await api.post(
            `/admin/products`,
            { ...medusaTshirtProduct, shipping_profile_id: shippingProfile.id },
            adminHeaders
          )
        ).data.product

        region = (
          await api.post(
            `/admin/regions`,
            {
              name: "Test Region",
              currency_code: "usd",
              countries: ["us"],
            },
            adminHeaders
          )
        ).data.region

        salesChannel = (
          await api.post(
            `/admin/sales-channels`,
            { name: "Test Sales Channel" },
            adminHeaders
          )
        ).data.sales_channel

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })
      })

      describe("Create promotion with limit", () => {
        it("should create a promotion with a usage limit", async () => {
          const response = await api.post(
            `/admin/promotions`,
            {
              code: "LIMITED_PROMO",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              limit: 5,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: 100,
                currency_code: "usd",
              },
            },
            adminHeaders
          )

          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              code: "LIMITED_PROMO",
              limit: 5,
              used: 0,
            })
          )
        })

        it("should create a promotion without a limit (unlimited)", async () => {
          const response = await api.post(
            `/admin/promotions`,
            {
              code: "UNLIMITED_PROMO",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "across",
                value: 100,
                currency_code: "usd",
              },
            },
            adminHeaders
          )

          expect(response.data.promotion).toEqual(
            expect.objectContaining({
              code: "UNLIMITED_PROMO",
              limit: null,
              used: 0,
            })
          )
        })

        it("should prevent creating automatic promotion with limit", async () => {
          const response = await api
            .post(
              `/admin/promotions`,
              {
                code: "AUTO_PROMO",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                is_automatic: true,
                limit: 5,
                application_method: {
                  type: "fixed",
                  target_type: "items",
                  allocation: "across",
                  value: 100,
                  currency_code: "usd",
                },
              },
              adminHeaders
            )
            .catch((err) => {
              return err.response
            })

          expect(response.status).toBe(400)
          expect(response.data.message).toContain(
            "Automatic promotions cannot have a usage limit"
          )
        })
      })

      describe("Complete order increments usage", () => {
        beforeEach(async () => {
          promotion = (
            await api.post(
              `/admin/promotions`,
              {
                code: "TEST_LIMIT",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                limit: 3,
                application_method: {
                  type: "fixed",
                  target_type: "items",
                  allocation: "across",
                  value: 100,
                  currency_code: "usd",
                },
              },
              adminHeaders
            )
          ).data.promotion
        })

        it("should increment used count when order is completed", async () => {
          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "SF",
                  country_code: "US",
                  province: "CA",
                  postal_code: "94016",
                },
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                promo_codes: [promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          expect(cart.promotions).toHaveLength(1)
          expect(cart.promotions[0].code).toBe(promotion.code)

          await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              { cart_id: cart.id },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          const order = (
            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          ).data.order

          expect(order).toBeDefined()

          const updatedPromotion = (
            await api.get(`/admin/promotions/${promotion.id}`, adminHeaders)
          ).data.promotion

          expect(updatedPromotion.used).toBe(1)
        })

        it("should not increment used count when promotion is only added to cart", async () => {
          // Create cart with promotion but don't complete
          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "SF",
                  country_code: "US",
                  province: "CA",
                  postal_code: "94016",
                },
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                promo_codes: [promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          expect(cart.promotions).toHaveLength(1)

          // Check promotion usage was NOT incremented
          const updatedPromotion = (
            await api.get(`/admin/promotions/${promotion.id}`, adminHeaders)
          ).data.promotion

          expect(updatedPromotion.used).toBe(0)
        })
      })

      describe("Limit enforcement on cart completion", () => {
        beforeEach(async () => {
          promotion = (
            await api.post(
              `/admin/promotions`,
              {
                code: "LIMIT_2",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                limit: 2,
                application_method: {
                  type: "fixed",
                  target_type: "items",
                  allocation: "across",
                  value: 100,
                  currency_code: "usd",
                },
              },
              adminHeaders
            )
          ).data.promotion
        })

        it("should allow completing 2 orders successfully", async () => {
          // Complete first cart
          const cart1 = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "SF",
                  country_code: "US",
                  province: "CA",
                  postal_code: "94016",
                },
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                promo_codes: [promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          // Setup first cart
          await api.post(
            `/store/carts/${cart1.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          const paymentCollection1 = (
            await api.post(
              `/store/payment-collections`,
              { cart_id: cart1.id },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection1.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          await api.post(`/store/carts/${cart1.id}/complete`, {}, storeHeaders)

          // Complete second cart
          const cart2 = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "SF",
                  country_code: "US",
                  province: "CA",
                  postal_code: "94016",
                },
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                promo_codes: [promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          // Setup second cart
          await api.post(
            `/store/carts/${cart2.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          const paymentCollection2 = (
            await api.post(
              `/store/payment-collections`,
              { cart_id: cart2.id },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection2.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          await api.post(`/store/carts/${cart2.id}/complete`, {}, storeHeaders)

          const updatedPromotion = (
            await api.get(`/admin/promotions/${promotion.id}`, adminHeaders)
          ).data.promotion

          expect(updatedPromotion.used).toBe(2)
        })

        it("should not add promotion to the third cart when limit is exceeded", async () => {
          // Complete first two orders
          for (let i = 0; i < 2; i++) {
            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: {
                    address_1: "test address 1",
                    address_2: "test address 2",
                    city: "SF",
                    country_code: "US",
                    province: "CA",
                    postal_code: "94016",
                  },
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [promotion.code],
                },
                storeHeaders
              )
            ).data.cart

            await api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )

            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          }

          // Third cart should fail
          const cart3 = (
            await api.post(
              `/store/carts?fields=*promotions.*`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "SF",
                  country_code: "US",
                  province: "CA",
                  postal_code: "94016",
                },
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                promo_codes: [promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          expect(cart3.promotions).toHaveLength(0) // promotion cannot be appleied since action "PROMOTION EXCEEDED LIMIT" is returned
        })

        it("should fail third cart completion with limit exceeded", async () => {
          const carts = [] as any[]
          // Complete first two orders
          for (let i = 0; i < 3; i++) {
            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: {
                    address_1: "test address 1",
                    address_2: "test address 2",
                    city: "SF",
                    country_code: "US",
                    province: "CA",
                    postal_code: "94016",
                  },
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [promotion.code],
                },
                storeHeaders
              )
            ).data.cart

            await api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )

            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            carts.push(cart)
          }

          // complete first 2 carts
          for (let i = 0; i < 2; i++) {
            await api.post(
              `/store/carts/${carts[i].id}/complete`,
              {},
              storeHeaders
            )
          }

          // Third cart should fail
          const cart3 = carts[2]

          const response = await api
            .post(`/store/carts/${cart3.id}/complete`, {}, storeHeaders)
            .catch((err) => {
              return err.response
            })

          expect(response.status).toBe(400)
          expect(response.data.message).toContain(
            "Promotion usage exceeds the limit"
          )
        })
      })

      describe("Update limit validation", () => {
        beforeEach(async () => {
          promotion = (
            await api.post(
              `/admin/promotions`,
              {
                code: "UPDATE_LIMIT",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                limit: 10,
                application_method: {
                  type: "fixed",
                  target_type: "items",
                  allocation: "across",
                  value: 100,
                  currency_code: "usd",
                },
              },
              adminHeaders
            )
          ).data.promotion
        })

        it("should allow updating limit to higher value", async () => {
          const response = await api.post(
            `/admin/promotions/${promotion.id}`,
            {
              limit: 20,
            },
            adminHeaders
          )

          expect(response.data.promotion.limit).toBe(20)
        })

        it("should prevent updating limit to less than current usage", async () => {
          // Complete two order to set used = 2
          for (let i = 0; i < 2; i++) {
            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: {
                    address_1: "test address 1",
                    address_2: "test address 2",
                    city: "SF",
                    country_code: "US",
                    province: "CA",
                    postal_code: "94016",
                  },
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [promotion.code],
                },
                storeHeaders
              )
            ).data.cart

            await api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )

            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          }

          // Try to update limit to 0 (less than used = 2)
          const response = await api
            .post(
              `/admin/promotions/${promotion.id}`,
              {
                limit: 1,
              },
              adminHeaders
            )
            .catch((err) => {
              return err.response
            })

          expect(response.status).toBe(400)
          expect(response.data.message).toContain(
            "cannot be less than current usage"
          )
        })

        it("should allow updating limit to 2 when used is 1", async () => {
          // Complete one order to set used = 1
          const cart = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "SF",
                  country_code: "US",
                  province: "CA",
                  postal_code: "94016",
                },
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                promo_codes: [promotion.code],
              },
              storeHeaders
            )
          ).data.cart

          await api.post(
            `/store/carts/${cart.id}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )

          const paymentCollection = (
            await api.post(
              `/store/payment-collections`,
              { cart_id: cart.id },
              storeHeaders
            )
          ).data.payment_collection

          await api.post(
            `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
            { provider_id: "pp_system_default" },
            storeHeaders
          )

          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)

          // Update limit to 2
          const response = await api.post(
            `/admin/promotions/${promotion.id}`,
            {
              limit: 2,
            },
            adminHeaders
          )

          expect(response.data.promotion.limit).toBe(2)
          expect(response.data.promotion.used).toBe(1)
        })
      })

      describe("Both campaign and promotion limits", () => {
        let campaign
        let campaignPromotion

        beforeEach(async () => {
          // Create campaign with budget limit of 3
          campaign = (
            await api.post(
              `/admin/campaigns`,
              {
                name: "Test Campaign",
                campaign_identifier: "test-campaign",
                budget: {
                  type: "usage",
                  limit: 3,
                },
              },
              adminHeaders
            )
          ).data.campaign

          // Create promotion with limit of 2
          campaignPromotion = (
            await api.post(
              `/admin/promotions`,
              {
                code: "CAMPAIGN_LIMIT",
                type: PromotionType.STANDARD,
                status: PromotionStatus.ACTIVE,
                limit: 2,
                campaign_id: campaign.id,
                application_method: {
                  type: "fixed",
                  target_type: "items",
                  allocation: "across",
                  value: 100,
                  currency_code: "usd",
                },
              },
              adminHeaders
            )
          ).data.promotion
        })

        it("should hit promotion limit first ", async () => {
          // Complete 2 orders - should hit promotion limit
          for (let i = 0; i < 2; i++) {
            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: {
                    address_1: "test address 1",
                    address_2: "test address 2",
                    city: "SF",
                    country_code: "US",
                    province: "CA",
                    postal_code: "94016",
                  },
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [campaignPromotion.code],
                },
                storeHeaders
              )
            ).data.cart

            await api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )

            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          }

          // Third order should fail with promotion limit exceeded
          const cart3 = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "SF",
                  country_code: "US",
                  province: "CA",
                  postal_code: "94016",
                },
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                promo_codes: [campaignPromotion.code],
              },
              storeHeaders
            )
          ).data.cart

          expect(cart3.promotions).toHaveLength(0)
        })

        it("should hit campaign limit first", async () => {
          await api.post(
            `/admin/promotions/${campaignPromotion.id}`,
            {
              limit: 5,
            },
            adminHeaders
          )
          // Complete 3 orders - should hit campaign limit
          for (let i = 0; i < 3; i++) {
            const cart = (
              await api.post(
                `/store/carts`,
                {
                  currency_code: "usd",
                  sales_channel_id: salesChannel.id,
                  region_id: region.id,
                  shipping_address: {
                    address_1: "test address 1",
                    address_2: "test address 2",
                    city: "SF",
                    country_code: "US",
                    province: "CA",
                    postal_code: "94016",
                  },
                  items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                  promo_codes: [campaignPromotion.code],
                },
                storeHeaders
              )
            ).data.cart

            await api.post(
              `/store/carts/${cart.id}/shipping-methods`,
              { option_id: shippingOption.id },
              storeHeaders
            )

            const paymentCollection = (
              await api.post(
                `/store/payment-collections`,
                { cart_id: cart.id },
                storeHeaders
              )
            ).data.payment_collection

            await api.post(
              `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
              { provider_id: "pp_system_default" },
              storeHeaders
            )

            await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
          }

          const cart4 = (
            await api.post(
              `/store/carts`,
              {
                currency_code: "usd",
                sales_channel_id: salesChannel.id,
                region_id: region.id,
                shipping_address: {
                  address_1: "test address 1",
                  address_2: "test address 2",
                  city: "SF",
                  country_code: "US",
                  province: "CA",
                  postal_code: "94016",
                },
                items: [{ variant_id: product.variants[0].id, quantity: 1 }],
                promo_codes: [campaignPromotion.code],
              },
              storeHeaders
            )
          ).data.cart

          expect(cart4.promotions).toHaveLength(0)
        })
      })
    })
  },
})
