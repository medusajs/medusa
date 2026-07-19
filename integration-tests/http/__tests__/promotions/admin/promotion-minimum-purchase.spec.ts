import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ProductStatus } from "@medusajs/utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(50000)

const env = {}
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    describe("Promotions: minimum purchase requirement", () => {
      let appContainer
      let storeHeaders
      let region
      let salesChannel
      let shippingProfile
      let stockLocation
      let fulfillmentSet
      let shippingOption
      let product

      beforeAll(async () => {
        appContainer = getContainer()

        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        await createAdminUser(dbConnection, adminHeaders, appContainer)

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Webshop", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        shippingProfile = (
          await api.post(
            "/admin/shipping-profiles",
            { name: "Test", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        product = (
          await api.post(
            "/admin/products",
            {
              title: "Medusa T-Shirt",
              shipping_profile_id: shippingProfile.id,
              status: ProductStatus.PUBLISHED,
              options: [{ title: "size", values: ["one-size"] }],
              variants: [
                {
                  title: "One size",
                  manage_inventory: false,
                  prices: [{ currency_code: "usd", amount: 50 }],
                  options: { size: "one-size" },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        stockLocation = (
          await api.post(
            "/admin/stock-locations",
            { name: "Test location" },
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
            { name: "Test", type: "test-type" },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
            {
              name: "Test",
              geo_zones: [{ type: "country", country_code: "us" }],
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
            "/admin/shipping-options",
            {
              name: "Standard shipping",
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: "manual_test-provider",
              price_type: "flat",
              type: {
                label: "Standard",
                description: "Standard shipping",
                code: "standard",
              },
              prices: [{ currency_code: "usd", amount: 20 }],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        await dbUtils.snapshot()
      })

      const minPurchaseRule = {
        attribute: "item_subtotal",
        operator: "gte",
        values: "100",
      }

      const createCart = async (quantity: number, promoCodes?: string[]) => {
        return (
          await api.post(
            "/store/carts",
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              email: "test@medusajs.com",
              items: [{ variant_id: product.variants[0].id, quantity }],
              promo_codes: promoCodes,
            },
            storeHeaders
          )
        ).data.cart
      }

      const addItem = async (cartId: string, quantity: number) => {
        return (
          await api.post(
            `/store/carts/${cartId}/line-items`,
            { variant_id: product.variants[0].id, quantity },
            storeHeaders
          )
        ).data.cart
      }

      const addShippingMethod = async (cartId: string) => {
        return (
          await api.post(
            `/store/carts/${cartId}/shipping-methods`,
            { option_id: shippingOption.id },
            storeHeaders
          )
        ).data.cart
      }

      describe("rule configuration", () => {
        it("lists item_subtotal as a promotion rule attribute with numeric operators", async () => {
          const response = await api.get(
            "/admin/promotions/rule-attribute-options/rules",
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.attributes).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "item_subtotal",
                value: "item_subtotal",
                label: "Item Subtotal",
                field_type: "number",
                operators: expect.arrayContaining([
                  expect.objectContaining({ value: "gte" }),
                  expect.objectContaining({ value: "gt" }),
                  expect.objectContaining({ value: "eq" }),
                  expect.objectContaining({ value: "lte" }),
                  expect.objectContaining({ value: "lt" }),
                ]),
              }),
            ])
          )
        })

        it("returns an invalid data error for item_subtotal value options", async () => {
          const { response } = await api
            .get(
              "/admin/promotions/rule-value-options/rules/item_subtotal",
              adminHeaders
            )
            .catch((e) => e)

          expect(response.status).toEqual(400)
          expect(response.data).toEqual({
            type: "invalid_data",
            message:
              "Rule attribute - item_subtotal does not support value options",
          })
        })

        it("returns item_subtotal rules of a promotion with a scalar value", async () => {
          const promotion = (
            await api.post(
              "/admin/promotions",
              {
                code: "MIN_100_FIXED_10",
                type: "standard",
                status: "active",
                application_method: {
                  target_type: "order",
                  type: "fixed",
                  currency_code: "usd",
                  value: 10,
                },
                rules: [minPurchaseRule],
              },
              adminHeaders
            )
          ).data.promotion

          const response = await api.get(
            `/admin/promotions/${promotion.id}/rules`,
            adminHeaders
          )

          expect(response.status).toEqual(200)
          expect(response.data.rules).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                attribute: "item_subtotal",
                attribute_label: "Item Subtotal",
                operator: "gte",
                operator_label: "Greater than or equal to",
                field_type: "number",
                // Number rules return a scalar value, matching how the
                // dashboard renders number-based conditions.
                values: "100",
              }),
            ])
          )
        })
      })

      describe("fixed discount with minimum purchase", () => {
        it("applies a fixed 10 discount only when item subtotal reaches 100", async () => {
          await api.post(
            "/admin/promotions",
            {
              code: "SPEND_100_SAVE_10",
              type: "standard",
              status: "active",
              is_automatic: true,
              application_method: {
                target_type: "order",
                type: "fixed",
                currency_code: "usd",
                value: 10,
              },
              rules: [minPurchaseRule],
            },
            adminHeaders
          )

          // Item subtotal is 50 - below the minimum purchase requirement
          const cart = await createCart(1)

          expect(cart).toEqual(
            expect.objectContaining({
              item_subtotal: 50,
              discount_total: 0,
              promotions: [],
              items: [expect.objectContaining({ adjustments: [] })],
            })
          )

          // Item subtotal becomes 100 - the promotion should now kick in
          const updatedCart = await addItem(cart.id, 1)

          expect(updatedCart).toEqual(
            expect.objectContaining({
              item_subtotal: 100,
              discount_total: 10,
              total: 90,
              promotions: [
                expect.objectContaining({ code: "SPEND_100_SAVE_10" }),
              ],
              items: [
                expect.objectContaining({
                  adjustments: [
                    expect.objectContaining({
                      code: "SPEND_100_SAVE_10",
                      amount: 10,
                    }),
                  ],
                }),
              ],
            })
          )
        })
      })

      describe("percentage discount with minimum purchase", () => {
        it("applies a 5% discount only when item subtotal exceeds 100", async () => {
          await api.post(
            "/admin/promotions",
            {
              code: "SPEND_100_SAVE_5_PERCENT",
              type: "standard",
              status: "active",
              is_automatic: true,
              application_method: {
                target_type: "order",
                type: "percentage",
                currency_code: "usd",
                value: 5,
              },
              rules: [
                {
                  attribute: "item_subtotal",
                  operator: "gt",
                  values: "100",
                },
              ],
            },
            adminHeaders
          )

          // Item subtotal is 100, rule requires strictly greater than 100
          const cart = await createCart(2)

          expect(cart).toEqual(
            expect.objectContaining({
              item_subtotal: 100,
              discount_total: 0,
              promotions: [],
            })
          )

          // Item subtotal becomes 200 - 5% of 200 = 10
          const updatedCart = await addItem(cart.id, 2)

          expect(updatedCart).toEqual(
            expect.objectContaining({
              item_subtotal: 200,
              discount_total: 10,
              total: 190,
              promotions: [
                expect.objectContaining({ code: "SPEND_100_SAVE_5_PERCENT" }),
              ],
              items: [
                expect.objectContaining({
                  adjustments: [
                    expect.objectContaining({
                      code: "SPEND_100_SAVE_5_PERCENT",
                      amount: 10,
                    }),
                  ],
                }),
              ],
            })
          )
        })
      })

      describe("shipping discount with minimum purchase", () => {
        it("applies a fixed 10 shipping discount only when item subtotal reaches 100", async () => {
          await api.post(
            "/admin/promotions",
            {
              code: "SPEND_100_SHIP_10_OFF",
              type: "standard",
              status: "active",
              is_automatic: true,
              application_method: {
                target_type: "shipping_methods",
                type: "fixed",
                allocation: "each",
                max_quantity: 1,
                currency_code: "usd",
                value: 10,
              },
              rules: [minPurchaseRule],
            },
            adminHeaders
          )

          // Item subtotal is 50 - shipping stays at full price
          const cart = await createCart(1)
          const cartWithShipping = await addShippingMethod(cart.id)

          expect(cartWithShipping).toEqual(
            expect.objectContaining({
              item_subtotal: 50,
              shipping_subtotal: 20,
              shipping_total: 20,
              shipping_methods: [expect.objectContaining({ adjustments: [] })],
            })
          )

          // Item subtotal becomes 100 - shipping is discounted by 10
          const updatedCart = await addItem(cart.id, 1)

          expect(updatedCart).toEqual(
            expect.objectContaining({
              item_subtotal: 100,
              shipping_subtotal: 20,
              shipping_total: 10,
              shipping_methods: [
                expect.objectContaining({
                  adjustments: [
                    expect.objectContaining({
                      code: "SPEND_100_SHIP_10_OFF",
                      amount: 10,
                    }),
                  ],
                }),
              ],
            })
          )
        })
      })

      describe("free shipping with minimum purchase", () => {
        it("applies free shipping only when item subtotal reaches 100", async () => {
          await api.post(
            "/admin/promotions",
            {
              code: "SPEND_100_FREE_SHIPPING",
              type: "standard",
              status: "active",
              is_automatic: true,
              application_method: {
                target_type: "shipping_methods",
                type: "percentage",
                allocation: "each",
                max_quantity: 1,
                currency_code: "usd",
                value: 100,
              },
              rules: [minPurchaseRule],
            },
            adminHeaders
          )

          // Item subtotal is 50 - shipping stays at full price
          const cart = await createCart(1)
          const cartWithShipping = await addShippingMethod(cart.id)

          expect(cartWithShipping).toEqual(
            expect.objectContaining({
              item_subtotal: 50,
              shipping_total: 20,
              shipping_methods: [expect.objectContaining({ adjustments: [] })],
            })
          )

          // Item subtotal becomes 100 - shipping is fully discounted
          const updatedCart = await addItem(cart.id, 1)

          expect(updatedCart).toEqual(
            expect.objectContaining({
              item_subtotal: 100,
              shipping_total: 0,
              shipping_methods: [
                expect.objectContaining({
                  adjustments: [
                    expect.objectContaining({
                      code: "SPEND_100_FREE_SHIPPING",
                      amount: 20,
                    }),
                  ],
                }),
              ],
            })
          )
        })
      })

      describe("promo code application with minimum purchase", () => {
        it("does not apply a promo code while the requirement is unmet and applies it once met", async () => {
          await api.post(
            "/admin/promotions",
            {
              code: "MIN_PURCHASE_CODE",
              type: "standard",
              status: "active",
              application_method: {
                target_type: "order",
                type: "fixed",
                currency_code: "usd",
                value: 10,
              },
              rules: [minPurchaseRule],
            },
            adminHeaders
          )

          // Applying the code below the threshold is a no-op
          const cart = await createCart(1, ["MIN_PURCHASE_CODE"])

          expect(cart).toEqual(
            expect.objectContaining({
              item_subtotal: 50,
              discount_total: 0,
              promotions: [],
              items: [expect.objectContaining({ adjustments: [] })],
            })
          )

          // Crossing the threshold and re-applying the code activates it
          await addItem(cart.id, 1)

          const updatedCart = (
            await api.post(
              `/store/carts/${cart.id}/promotions`,
              { promo_codes: ["MIN_PURCHASE_CODE"] },
              storeHeaders
            )
          ).data.cart

          expect(updatedCart).toEqual(
            expect.objectContaining({
              item_subtotal: 100,
              discount_total: 10,
              promotions: [
                expect.objectContaining({ code: "MIN_PURCHASE_CODE" }),
              ],
              items: [
                expect.objectContaining({
                  adjustments: [
                    expect.objectContaining({
                      code: "MIN_PURCHASE_CODE",
                      amount: 10,
                    }),
                  ],
                }),
              ],
            })
          )
        })
      })
    })
  },
})
