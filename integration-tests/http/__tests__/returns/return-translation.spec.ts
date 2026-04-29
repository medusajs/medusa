import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules, RuleOperator } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(60000)

process.env.MEDUSA_FF_TRANSLATION = "true"

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order
    let returnShippingOption
    let shippingProfile
    let fulfillmentSet
    let inventoryItem
    let location
    let salesChannel
    let product

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const translationModule = container.resolve(Modules.TRANSLATION)
      await translationModule.__hooks?.onApplicationStart?.().catch(() => {})

      // Set up supported locales in the store
      const storeModule = container.resolve(Modules.STORE)
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

      salesChannel = (
        await api.post(
          "/admin/sales-channels",
          { name: "Webshop", description: "channel" },
          adminHeaders
        )
      ).data.sales_channel

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          {
            name: "Test",
            type: "default",
          },
          adminHeaders
        )
      ).data.shipping_profile

      location = (
        await api.post(
          `/admin/stock-locations`,
          {
            name: "Test location",
          },
          adminHeaders
        )
      ).data.stock_location

      inventoryItem = (
        await api.post(
          `/admin/inventory-items`,
          { sku: "inv-1234" },
          adminHeaders
        )
      ).data.inventory_item

      await api.post(
        `/admin/inventory-items/${inventoryItem.id}/location-levels`,
        {
          location_id: location.id,
          stocked_quantity: 2,
        },
        adminHeaders
      )

      await api.post(
        `/admin/stock-locations/${location.id}/sales-channels`,
        { add: [salesChannel.id] },
        adminHeaders
      )

      product = (
        await api.post(
          "/admin/products",
          {
            title: "Test product",
            options: [{ title: "size", values: ["x", "l"] }],
            shipping_profile_id: shippingProfile.id,
            variants: [
              {
                title: "Test variant",
                sku: "test-variant",
                options: { size: "l" },
                inventory_items: [
                  {
                    inventory_item_id: inventoryItem.id,
                    required_quantity: 1,
                  },
                ],
                prices: [
                  {
                    currency_code: "usd",
                    amount: 10,
                  },
                ],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      location = (
        await api.post(
          `/admin/stock-locations/${location.id}/fulfillment-sets?fields=*fulfillment_sets`,
          {
            name: "Test",
            type: "test-type",
          },
          adminHeaders
        )
      ).data.stock_location

      fulfillmentSet = (
        await api.post(
          `/admin/fulfillment-sets/${location.fulfillment_sets[0].id}/service-zones`,
          {
            name: "Test",
            geo_zones: [{ type: "country", country_code: "us" }],
          },
          adminHeaders
        )
      ).data.fulfillment_set

      await api.post(
        `/admin/stock-locations/${location.id}/fulfillment-providers`,
        { add: ["manual_test-provider"] },
        adminHeaders
      )

      returnShippingOption = (
        await api.post(
          "/admin/shipping-options",
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
            prices: [
              {
                currency_code: "usd",
                amount: 1000,
              },
            ],
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

      // Create translations for the return shipping option
      await api.post(
        "/admin/translations/batch",
        {
          create: [
            {
              reference_id: returnShippingOption.id,
              reference: "shipping_option",
              locale_code: "fr-FR",
              translations: {
                name: "Expédition de retour",
              },
            },
            {
              reference_id: returnShippingOption.id,
              reference: "shipping_option",
              locale_code: "de-DE",
              translations: {
                name: "Rückversand",
              },
            },
          ],
        },
        adminHeaders
      )
    })

    const createOrderWithLocale = async (locale?: string) => {
      const container = getContainer()
      const orderModule = container.resolve(Modules.ORDER)
      const inventoryModule = container.resolve(Modules.INVENTORY)

      const createdOrder = await orderModule.createOrders({
        region_id: "test_region_id",
        email: "foo@bar.com",
        locale,
        items: [
          {
            title: "Custom Item",
            variant_id: product.variants[0].id,
            quantity: 2,
            unit_price: 25,
          },
        ],
        sales_channel_id: salesChannel.id,
        shipping_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
          phone: "12345",
        },
        billing_address: {
          first_name: "Test",
          last_name: "Test",
          address_1: "Test",
          city: "Test",
          country_code: "US",
          postal_code: "12345",
        },
        shipping_methods: [
          {
            name: "Test shipping method",
            amount: 10,
            data: {},
          },
        ],
        currency_code: "usd",
        customer_id: "joe",
      })

      await inventoryModule.createReservationItems([
        {
          inventory_item_id: inventoryItem.id,
          location_id: location.id,
          quantity: 2,
          line_item_id: createdOrder.items![0].id,
        },
      ])

      // Fulfill the order
      await api.post(
        `/admin/orders/${createdOrder.id}/fulfillments`,
        {
          items: [
            {
              id: createdOrder.items![0].id,
              quantity: 2,
            },
          ],
        },
        adminHeaders
      )

      return createdOrder
    }

    describe("Return shipping method translation", () => {
      it("should translate return shipping method name using French locale", async () => {
        order = await createOrderWithLocale("fr-FR")

        const returnResult = await api.post(
          "/admin/returns",
          {
            order_id: order.id,
            location_id: location.id,
          },
          adminHeaders
        )

        const returnId = returnResult.data.return.id
        const item = order.items[0]

        await api.post(
          `/admin/returns/${returnId}/request-items`,
          {
            items: [
              {
                id: item.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        const shippingMethodResult = await api.post(
          `/admin/returns/${returnId}/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        const returnShippingMethod =
          shippingMethodResult.data.order_preview.shipping_methods.find(
            (sm: any) => sm.shipping_option_id === returnShippingOption.id
          )

        expect(returnShippingMethod).toEqual(
          expect.objectContaining({
            name: "Expédition de retour",
            shipping_option_id: returnShippingOption.id,
          })
        )
      })

      it("should use original shipping method name when order has no locale", async () => {
        order = await createOrderWithLocale()

        const returnResult = await api.post(
          "/admin/returns",
          {
            order_id: order.id,
            location_id: location.id,
          },
          adminHeaders
        )

        const returnId = returnResult.data.return.id
        const item = order.items[0]

        await api.post(
          `/admin/returns/${returnId}/request-items`,
          {
            items: [
              {
                id: item.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        const shippingMethodResult = await api.post(
          `/admin/returns/${returnId}/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        const returnShippingMethod =
          shippingMethodResult.data.order_preview.shipping_methods.find(
            (sm: any) => sm.shipping_option_id === returnShippingOption.id
          )

        expect(returnShippingMethod).toEqual(
          expect.objectContaining({
            name: "Return shipping",
            shipping_option_id: returnShippingOption.id,
          })
        )
      })

      it("should use original name when locale has no translation", async () => {
        order = await createOrderWithLocale("en-US")

        const returnResult = await api.post(
          "/admin/returns",
          {
            order_id: order.id,
            location_id: location.id,
          },
          adminHeaders
        )

        const returnId = returnResult.data.return.id
        const item = order.items[0]

        await api.post(
          `/admin/returns/${returnId}/request-items`,
          {
            items: [
              {
                id: item.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        const shippingMethodResult = await api.post(
          `/admin/returns/${returnId}/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        const returnShippingMethod =
          shippingMethodResult.data.order_preview.shipping_methods.find(
            (sm: any) => sm.shipping_option_id === returnShippingOption.id
          )

        expect(returnShippingMethod).toEqual(
          expect.objectContaining({
            name: "Return shipping",
            shipping_option_id: returnShippingOption.id,
          })
        )
      })

      it("should translate return shipping method with custom price", async () => {
        order = await createOrderWithLocale("fr-FR")

        const returnResult = await api.post(
          "/admin/returns",
          {
            order_id: order.id,
            location_id: location.id,
          },
          adminHeaders
        )

        const returnId = returnResult.data.return.id
        const item = order.items[0]

        await api.post(
          `/admin/returns/${returnId}/request-items`,
          {
            items: [
              {
                id: item.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        const shippingMethodResult = await api.post(
          `/admin/returns/${returnId}/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
            custom_amount: 500,
          },
          adminHeaders
        )

        const returnShippingMethod =
          shippingMethodResult.data.order_preview.shipping_methods.find(
            (sm: any) => sm.shipping_option_id === returnShippingOption.id
          )

        expect(returnShippingMethod).toEqual(
          expect.objectContaining({
            name: "Expédition de retour",
            shipping_option_id: returnShippingOption.id,
            amount: 500,
          })
        )
      })

      it("should keep translation after confirming return request", async () => {
        order = await createOrderWithLocale("fr-FR")

        const returnResult = await api.post(
          "/admin/returns",
          {
            order_id: order.id,
            location_id: location.id,
          },
          adminHeaders
        )

        const returnId = returnResult.data.return.id
        const item = order.items[0]

        await api.post(
          `/admin/returns/${returnId}/request-items`,
          {
            items: [
              {
                id: item.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/returns/${returnId}/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        await api.post(`/admin/returns/${returnId}/request`, {}, adminHeaders)

        const orderResult = await api.get(
          `/admin/orders/${order.id}`,
          adminHeaders
        )

        const returnShippingMethod =
          orderResult.data.order.shipping_methods.find(
            (sm: any) => sm.shipping_option_id === returnShippingOption.id
          )

        expect(returnShippingMethod).toEqual(
          expect.objectContaining({
            name: "Expédition de retour",
            shipping_option_id: returnShippingOption.id,
          })
        )
      })
    })
  },
})
