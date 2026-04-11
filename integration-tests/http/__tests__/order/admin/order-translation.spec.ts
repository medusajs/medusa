import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { MedusaContainer } from "@medusajs/types"
import { Modules, ProductStatus, RuleOperator } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"

jest.setTimeout(300000)

process.env.MEDUSA_FF_TRANSLATION = "true"

const shippingAddressData = {
  address_1: "test address 1",
  address_2: "test address 2",
  city: "SF",
  country_code: "us",
  province: "CA",
  postal_code: "94016",
}

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    describe("Admin Order Translation API", () => {
      let appContainer: MedusaContainer
      let storeHeaders: { headers: { [key: string]: string } }
      let region: { id: string }
      let product: { id: string; variants: { id: string; title: string }[] }
      let salesChannel: { id: string }
      let shippingProfile: { id: string }
      let stockLocation: { id: string }
      let shippingOption: { id: string }
      let returnShippingOption: { id: string }
      let outboundShippingOption: { id: string }
      let inventoryItem: { id: string }
      let taxRate: { id: string; name: string }

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        const taxStructure = await setupTaxStructure(
          appContainer.resolve(Modules.TAX)
        )
        await createAdminUser(dbConnection, adminHeaders, appContainer)

        const translationModule = appContainer.resolve(Modules.TRANSLATION)
        await translationModule.__hooks?.onApplicationStart?.().catch(() => {})

        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Webshop", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        const storeModule = appContainer.resolve(Modules.STORE)
        const [defaultStore] = await storeModule.listStores(
          {},
          { select: ["id"], take: 1 }
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
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

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

        inventoryItem = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItem.id}/location-levels`,
          { location_id: stockLocation.id, stocked_quantity: 100 },
          adminHeaders
        )

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        // Create product with description for translation
        product = (
          await api.post(
            "/admin/products",
            {
              title: "Medusa T-Shirt",
              description: "A comfortable cotton t-shirt",
              handle: "t-shirt",
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "Size", values: ["S", "M"] }],
              variants: [
                {
                  title: "Small",
                  sku: "SHIRT-S",
                  options: { Size: "S" },
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItem.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [{ amount: 1500, currency_code: "usd" }],
                },
                {
                  title: "Medium",
                  sku: "SHIRT-M",
                  options: { Size: "M" },
                  manage_inventory: false,
                  prices: [{ amount: 1500, currency_code: "usd" }],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        // Maintain predictable variants order
        const variantSmall = product.variants.find((v) => v.title === "Small")
        const variantMedium = product.variants.find((v) => v.title === "Medium")
        product.variants = [variantSmall!, variantMedium!]

        // Setup fulfillment
        const fulfillmentSets = (
          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
            { name: "Test", type: "test-type" },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        const fulfillmentSet = (
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
              prices: [{ currency_code: "usd", amount: 1000 }],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        returnShippingOption = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Return shipping",
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: "manual_test-provider",
              price_type: "flat",
              type: {
                label: "Test type",
                description: "Test description",
                code: "test-code",
              },
              prices: [{ currency_code: "usd", amount: 500 }],
              rules: [
                {
                  operator: RuleOperator.EQ,
                  attribute: "is_return",
                  value: "true",
                },
              ],
            },
            adminHeaders
          )
        ).data.shipping_option

        outboundShippingOption = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Outbound shipping",
              service_zone_id: fulfillmentSet.service_zones[0].id,
              shipping_profile_id: shippingProfile.id,
              provider_id: "manual_test-provider",
              price_type: "flat",
              type: {
                label: "Test type",
                description: "Test description",
                code: "test-code",
              },
              prices: [{ currency_code: "usd", amount: 0 }],
              rules: [
                {
                  operator: RuleOperator.EQ,
                  attribute: "is_return",
                  value: "false",
                },
              ],
            },
            adminHeaders
          )
        ).data.shipping_option

        const taxRatesResponse = await api.get(
          `/admin/tax-rates?tax_region_id=${taxStructure.us.children.cal.province.id}`,
          adminHeaders
        )
        taxRate = taxRatesResponse.data.tax_rates.find(
          (rate: { is_default: boolean; code: string }) =>
            rate.is_default && rate.code === "CADEFAULT"
        )

        // Create translations for product and variants
        await api.post(
          "/admin/translations/batch",
          {
            create: [
              {
                reference_id: product.id,
                reference: "product",
                locale_code: "fr-FR",
                translations: {
                  title: "T-Shirt Medusa",
                  description: "Un t-shirt en coton confortable",
                },
              },
              {
                reference_id: product.id,
                reference: "product",
                locale_code: "de-DE",
                translations: {
                  title: "Medusa T-Shirt DE",
                  description: "Ein bequemes Baumwoll-T-Shirt",
                },
              },
              {
                reference_id: product.variants[0].id,
                reference: "product_variant",
                locale_code: "fr-FR",
                translations: { title: "Petit" },
              },
              {
                reference_id: product.variants[0].id,
                reference: "product_variant",
                locale_code: "de-DE",
                translations: { title: "Klein" },
              },
              {
                reference_id: product.variants[1].id,
                reference: "product_variant",
                locale_code: "fr-FR",
                translations: { title: "Moyen" },
              },
              {
                reference_id: product.variants[1].id,
                reference: "product_variant",
                locale_code: "de-DE",
                translations: { title: "Mittel" },
              },
              {
                reference_id: shippingOption.id,
                reference: "shipping_option",
                locale_code: "fr-FR",
                translations: {
                  name: "Option d'expédition de test",
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
              {
                reference_id: taxRate.id,
                reference: "tax_rate",
                locale_code: "fr-FR",
                translations: {
                  name: "Taux par défaut CA",
                },
              },
              {
                reference_id: taxRate.id,
                reference: "tax_rate",
                locale_code: "de-DE",
                translations: {
                  name: "CA Standardsteuersatz",
                },
              },
            ],
          },
          adminHeaders
        )
      })

      const createOrderFromCart = async (locale?: string) => {
        const cart = (
          await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              email: "test@example.com",
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              locale,
              shipping_address: shippingAddressData,
              billing_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
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

        const order = (
          await api.post(`/store/carts/${cart.id}/complete`, {}, storeHeaders)
        ).data.order

        return (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      }

      describe("Order creation from cart with locale", () => {
        it("should preserve locale and translated items when order is created from cart", async () => {
          const order = await createOrderFromCart("fr-FR")

          expect(order.items[0]).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              product_description: "Un t-shirt en coton confortable",
              variant_title: "Petit",
            })
          )
        })

        it("should have original values when order is created without locale", async () => {
          const order = await createOrderFromCart()

          expect(order.items[0]).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt",
              product_description: "A comfortable cotton t-shirt",
              variant_title: "Small",
            })
          )
        })

        it("should preserve translated shipping methods when order is created from cart with locale", async () => {
          const order = await createOrderFromCart("fr-FR")

          expect(order.shipping_methods).toHaveLength(1)
          expect(order.shipping_methods[0]).toEqual(
            expect.objectContaining({
              shipping_option_id: shippingOption.id,
              name: "Option d'expédition de test",
            })
          )
        })

        it("should have original shipping method name when order is created without locale", async () => {
          const order = await createOrderFromCart()

          expect(order.shipping_methods).toHaveLength(1)
          expect(order.shipping_methods[0]).toEqual(
            expect.objectContaining({
              shipping_option_id: shippingOption.id,
              name: "Test shipping option",
            })
          )
        })
      })

      describe("POST /admin/orders/:id (update order locale)", () => {
        it("should re-translate all items when locale is updated", async () => {
          const order = await createOrderFromCart("fr-FR")

          expect(order.items[0].variant_title).toEqual("Petit")

          await api.post(
            `/admin/orders/${order.id}`,
            { locale: "de-DE" },
            adminHeaders
          )

          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          expect(updatedOrder.items[0]).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt DE",
              product_description: "Ein bequemes Baumwoll-T-Shirt",
              variant_title: "Klein",
            })
          )
        })

        it("should re-translate shipping methods when locale is updated", async () => {
          const order = await createOrderFromCart("fr-FR")

          expect(order.shipping_methods[0].name).toEqual(
            "Option d'expédition de test"
          )

          await api.post(
            `/admin/orders/${order.id}`,
            { locale: "de-DE" },
            adminHeaders
          )

          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          expect(updatedOrder.shipping_methods).toHaveLength(1)
          expect(updatedOrder.shipping_methods[0]).toEqual(
            expect.objectContaining({
              shipping_option_id: shippingOption.id,
              name: "Test-Versandoption",
            })
          )
        })

        it("should not re-translate items when updating other fields", async () => {
          const order = await createOrderFromCart("fr-FR")

          await api.post(
            `/admin/orders/${order.id}`,
            { email: "updated@example.com" },
            adminHeaders
          )

          const updatedOrder = (
            await api.get(
              `/admin/orders/${order.id}?fields=+email`,
              adminHeaders
            )
          ).data.order

          expect(updatedOrder.email).toEqual("updated@example.com")
          expect(updatedOrder.items[0]).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              variant_title: "Petit",
            })
          )
        })

        it("should not re-translate shipping methods when updating other fields", async () => {
          const order = await createOrderFromCart("fr-FR")

          await api.post(
            `/admin/orders/${order.id}`,
            { email: "updated@example.com" },
            adminHeaders
          )

          const updatedOrder = (
            await api.get(
              `/admin/orders/${order.id}?fields=+email,+shipping_methods.name`,
              adminHeaders
            )
          ).data.order

          expect(updatedOrder.email).toEqual("updated@example.com")
          expect(updatedOrder.shipping_methods[0]).toEqual(
            expect.objectContaining({
              shipping_option_id: shippingOption.id,
              name: "Option d'expédition de test",
            })
          )
        })
      })

      describe("Tax line translations", () => {
        it("should translate tax line descriptions when order locale is updated", async () => {
          // Create order with French locale
          const order = await createOrderFromCart("fr-FR")

          // Verify tax lines exist and have French translation
          expect(order.items[0].tax_lines).toBeDefined()
          expect(order.items[0].tax_lines.length).toBe(1)
          expect(order.items[0].tax_lines[0]).toEqual(
            expect.objectContaining({
              description: "Taux par défaut CA",
              rate: 5,
              code: "CADEFAULT",
            })
          )

          // Update order locale to German
          await api.post(
            `/admin/orders/${order.id}`,
            { locale: "de-DE" },
            adminHeaders
          )

          // Fetch updated order
          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          // Verify tax lines are translated to German
          expect(updatedOrder.items[0].tax_lines.length).toBe(1)
          expect(updatedOrder.items[0].tax_lines[0]).toEqual(
            expect.objectContaining({
              description: "CA Standardsteuersatz",
              rate: 5,
              code: "CADEFAULT",
            })
          )
        })

        it("should preserve tax line translations when order is created with locale", async () => {
          // Create order with French locale
          const order = await createOrderFromCart("fr-FR")

          // Verify tax lines are translated from the start
          expect(order.items[0].tax_lines).toBeDefined()
          expect(order.items[0].tax_lines.length).toBeGreaterThan(0)
          expect(order.items[0].tax_lines[0]).toEqual(
            expect.objectContaining({
              description: "Taux par défaut CA",
              rate: 5,
              code: "CADEFAULT",
            })
          )
        })

        it("should use original tax line description when order has no locale", async () => {
          // Create order without locale
          const order = await createOrderFromCart()

          // Verify tax lines use original description
          expect(order.items[0].tax_lines).toBeDefined()
          expect(order.items[0].tax_lines.length).toBeGreaterThan(0)
          expect(order.items[0].tax_lines[0]).toEqual(
            expect.objectContaining({
              description: "CA Default Rate",
              rate: 5,
              code: "CADEFAULT",
            })
          )
        })

        it("should translate shipping method tax lines when order locale is updated", async () => {
          // Create order with French locale
          const order = await createOrderFromCart("fr-FR")

          // Verify shipping method tax lines exist and are translated
          expect(order.shipping_methods).toBeDefined()
          expect(order.shipping_methods.length).toBeGreaterThan(0)
          if (order.shipping_methods[0].tax_lines?.length > 0) {
            expect(order.shipping_methods[0].tax_lines[0]).toEqual(
              expect.objectContaining({
                description: "Taux par défaut CA",
                rate: 5,
                code: "CADEFAULT",
              })
            )

            // Update order locale to German
            await api.post(
              `/admin/orders/${order.id}`,
              { locale: "de-DE" },
              adminHeaders
            )

            // Fetch updated order
            const updatedOrder = (
              await api.get(`/admin/orders/${order.id}`, adminHeaders)
            ).data.order

            // Verify shipping method tax lines are translated
            if (updatedOrder.shipping_methods[0].tax_lines?.length > 0) {
              expect(updatedOrder.shipping_methods[0].tax_lines[0]).toEqual(
                expect.objectContaining({
                  description: "CA Standardsteuersatz",
                  rate: 5,
                  code: "CADEFAULT",
                })
              )
            }
          }
        })
      })
    })
  },
})
