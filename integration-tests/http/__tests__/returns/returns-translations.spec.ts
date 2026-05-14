import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { MedusaContainer } from "@medusajs/types"
import { Modules, ProductStatus, RuleOperator } from "@medusajs/utils"
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
    describe("Return Translation API", () => {
      let appContainer: MedusaContainer
      let storeHeaders: { headers: { [key: string]: string } }
      let region: { id: string }
      let product: { id: string; variants: { id: string; title: string }[] }
      let salesChannel: { id: string }
      let shippingProfile: { id: string }
      let stockLocation: { id: string }
      let shippingOption: { id: string }
      let returnShippingOption: { id: string }
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
              prices: [{ currency_code: "usd", amount: 1000 }],
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

        const fullOrder = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        await api.post(
          `/admin/orders/${fullOrder.id}/fulfillments`,
          {
            location_id: stockLocation.id,
            items: [{ id: fullOrder.items[0].id, quantity: 1 }],
          },
          adminHeaders
        )

        return (await api.get(`/admin/orders/${fullOrder.id}`, adminHeaders))
          .data.order
      }

      describe("Return shipping method tax line translations", () => {
        it("should translate shipping method tax lines based on order locale", async () => {
          const order = await createOrderFromCart("fr-FR")

          const return_ = (
            await api.post(
              "/admin/returns",
              {
                order_id: order.id,
                description: "Test return",
              },
              adminHeaders
            )
          ).data.return

          await api.post(
            `/admin/returns/${return_.id}/request-items`,
            {
              items: [{ id: order.items[0].id, quantity: 1 }],
            },
            adminHeaders
          )

          await api.post(
            `/admin/returns/${return_.id}/shipping-method`,
            {
              shipping_option_id: returnShippingOption.id,
            },
            adminHeaders
          )

          await api.post(
            `/admin/returns/${return_.id}/request`,
            {},
            adminHeaders
          )

          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          const returnShippingMethod = updatedOrder.shipping_methods.find(
            (sm) => sm.shipping_option_id === returnShippingOption.id
          )

          expect(returnShippingMethod.tax_lines.length).toBeGreaterThan(0)
          const taxLine = returnShippingMethod.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(taxLine.description).toEqual("Taux par défaut CA")
        })

        it("should use original tax line description when order has no locale", async () => {
          const order = await createOrderFromCart()

          const return_ = (
            await api.post(
              "/admin/returns",
              {
                order_id: order.id,
                description: "Test return",
              },
              adminHeaders
            )
          ).data.return

          await api.post(
            `/admin/returns/${return_.id}/request-items`,
            {
              items: [{ id: order.items[0].id, quantity: 1 }],
            },
            adminHeaders
          )

          await api.post(
            `/admin/returns/${return_.id}/shipping-method`,
            {
              shipping_option_id: returnShippingOption.id,
            },
            adminHeaders
          )

          await api.post(
            `/admin/returns/${return_.id}/request`,
            {},
            adminHeaders
          )

          const updatedOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          const returnShippingMethod = updatedOrder.shipping_methods.find(
            (sm) => sm.shipping_option_id === returnShippingOption.id
          )

          expect(returnShippingMethod.tax_lines.length).toBeGreaterThan(0)
          const taxLine = returnShippingMethod.tax_lines.find(
            (tl) => tl.code === "CADEFAULT"
          )
          expect(taxLine.description).toEqual("CA Default Rate")
        })
      })
    })
  },
})
