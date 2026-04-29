import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { MedusaContainer } from "@medusajs/types"
import { Modules, ProductStatus } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../modules/__tests__/fixtures"

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
    describe("Order Edit Translation API", () => {
      let appContainer: MedusaContainer
      let storeHeaders: { headers: { [key: string]: string } }
      let region: { id: string }
      let product: { id: string; variants: { id: string; title: string }[] }
      let salesChannel: { id: string }
      let shippingProfile: { id: string }
      let stockLocation: { id: string }
      let shippingOption: { id: string }
      let additionalShippingOption: { id: string }
      let inventoryItem: { id: string }
      let taxRate: { id: string }

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

        const variantSmall = product.variants.find((v) => v.title === "Small")
        const variantMedium = product.variants.find((v) => v.title === "Medium")
        product.variants = [variantSmall!, variantMedium!]

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

        additionalShippingOption = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Additional shipping option",
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
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option
        const taxRatesResponse = await api.get(
          `/admin/tax-rates?tax_region_id=${taxStructure.us.children.cal.province.id}`,
          adminHeaders
        )
        taxRate = taxRatesResponse.data.tax_rates.find(
          (rate: { code: string }) => rate.code === "CADEFAULT"
        )

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
                reference_id: additionalShippingOption.id,
                reference: "shipping_option",
                locale_code: "fr-FR",
                translations: {
                  name: "Option d'expédition supplémentaire",
                },
              },
              {
                reference_id: additionalShippingOption.id,
                reference: "shipping_option",
                locale_code: "de-DE",
                translations: {
                  name: "Zusätzliche Versandoption",
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

      describe("POST /admin/order-edits/:id/items (add items during order edit)", () => {
        it("should translate new items added during order edit using order locale", async () => {
          const order = await createOrderFromCart("fr-FR")

          await api.post(
            "/admin/order-edits",
            { order_id: order.id },
            adminHeaders
          )

          await api.post(
            `/admin/order-edits/${order.id}/items`,
            {
              items: [{ variant_id: product.variants[1].id, quantity: 1 }],
            },
            adminHeaders
          )

          await api.post(
            `/admin/order-edits/${order.id}/confirm`,
            {},
            adminHeaders
          )

          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          const newItem = updatedOrder.items.find(
            (item) => item.variant_id === product.variants[1].id
          )

          expect(newItem).toEqual(
            expect.objectContaining({
              product_title: "T-Shirt Medusa",
              variant_title: "Moyen",
            })
          )

          expect(newItem.tax_lines.length).toBeGreaterThan(0)
          const taxLine = newItem.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(taxLine.description).toEqual("Taux par défaut CA")
        })

        it("should have original values when order has no locale", async () => {
          const order = await createOrderFromCart()

          await api.post(
            "/admin/order-edits",
            { order_id: order.id },
            adminHeaders
          )

          await api.post(
            `/admin/order-edits/${order.id}/items`,
            {
              items: [{ variant_id: product.variants[1].id, quantity: 1 }],
            },
            adminHeaders
          )

          await api.post(
            `/admin/order-edits/${order.id}/confirm`,
            {},
            adminHeaders
          )

          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          const newItem = updatedOrder.items.find(
            (item) => item.variant_id === product.variants[1].id
          )

          expect(newItem).toEqual(
            expect.objectContaining({
              product_title: "Medusa T-Shirt",
              product_description: "A comfortable cotton t-shirt",
              variant_title: "Medium",
            })
          )

          expect(newItem.tax_lines.length).toBeGreaterThan(0)
          const taxLine = newItem.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(taxLine.description).toEqual("CA Default Rate")
        })
      })

      describe("POST /admin/order-edits/:id/shipping-method (add shipping method during order edit)", () => {
        it("should translate shipping method added during order edit using order locale", async () => {
          const order = await createOrderFromCart("fr-FR")

          await api.post(
            "/admin/order-edits",
            { order_id: order.id },
            adminHeaders
          )

          const previewResponse = await api.post(
            `/admin/order-edits/${order.id}/shipping-method`,
            { shipping_option_id: additionalShippingOption.id },
            adminHeaders
          )

          expect(previewResponse.data.order_preview.shipping_methods).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                shipping_option_id: additionalShippingOption.id,
                name: "Option d'expédition supplémentaire",
              }),
            ])
          )

          await api.post(
            `/admin/order-edits/${order.id}/confirm`,
            {},
            adminHeaders
          )

          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          expect(updatedOrder.shipping_methods).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                shipping_option_id: additionalShippingOption.id,
                name: "Option d'expédition supplémentaire",
              }),
            ])
          )
        })

        it("should have original shipping method name when order has no locale", async () => {
          const order = await createOrderFromCart()

          await api.post(
            "/admin/order-edits",
            { order_id: order.id },
            adminHeaders
          )

          const previewResponse = await api.post(
            `/admin/order-edits/${order.id}/shipping-method`,
            { shipping_option_id: additionalShippingOption.id },
            adminHeaders
          )

          expect(previewResponse.data.order_preview.shipping_methods).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                shipping_option_id: additionalShippingOption.id,
                name: "Additional shipping option",
              }),
            ])
          )

          await api.post(
            `/admin/order-edits/${order.id}/confirm`,
            {},
            adminHeaders
          )

          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          expect(updatedOrder.shipping_methods).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                shipping_option_id: additionalShippingOption.id,
                name: "Additional shipping option",
              }),
            ])
          )
        })

        it("should translate shipping method tax lines when adding to order edit with locale", async () => {
          const order = await createOrderFromCart("fr-FR")

          await api.post(
            "/admin/order-edits",
            { order_id: order.id },
            adminHeaders
          )

          await api.post(
            `/admin/order-edits/${order.id}/shipping-method`,
            { shipping_option_id: shippingOption.id },
            adminHeaders
          )

          await api.post(
            `/admin/order-edits/${order.id}/confirm`,
            {},
            adminHeaders
          )

          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          const newShippingMethod = updatedOrder.shipping_methods.find(
            (sm) => sm.shipping_option_id === shippingOption.id
          )

          expect(newShippingMethod.tax_lines.length).toBeGreaterThan(0)
          const taxLine = newShippingMethod.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(taxLine.description).toEqual("Taux par défaut CA")
        })

        it("should use original tax line description when order has no locale", async () => {
          const order = await createOrderFromCart()

          await api.post(
            "/admin/order-edits",
            { order_id: order.id },
            adminHeaders
          )

          await api.post(
            `/admin/order-edits/${order.id}/shipping-method`,
            { shipping_option_id: shippingOption.id },
            adminHeaders
          )

          await api.post(
            `/admin/order-edits/${order.id}/confirm`,
            {},
            adminHeaders
          )

          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          const newShippingMethod = updatedOrder.shipping_methods.find(
            (sm) => sm.shipping_option_id === shippingOption.id
          )

          expect(newShippingMethod.tax_lines.length).toBeGreaterThan(0)
          const taxLine = newShippingMethod.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(taxLine.description).toEqual("CA Default Rate")
        })
      })
    })
  },
})
