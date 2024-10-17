import {
  ContainerRegistrationKeys,
  Modules,
  OrderChangeStatus,
  RuleOperator,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order
    let taxLine
    let shippingOption
    let shippingProfile
    let fulfillmentSet
    let inventoryItem
    let inventoryItemExtra
    let location
    let productExtra
    const shippingProviderId = "manual_test-provider"

    beforeEach(async () => {
      const container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const region = (
        await api.post(
          "/admin/regions",
          {
            name: "test-region",
            currency_code: "usd",
          },
          adminHeaders
        )
      ).data.region

      const customer = (
        await api.post(
          "/admin/customers",
          {
            first_name: "joe",
            email: "joe@admin.com",
          },
          adminHeaders
        )
      ).data.customer

      const taxRegion = (
        await api.post(
          "/admin/tax-regions",
          {
            country_code: "US",
          },
          adminHeaders
        )
      ).data.tax_region

      taxLine = (
        await api.post(
          "/admin/tax-rates",
          {
            rate: 10,
            code: "standard",
            name: "Taxation is theft",
            is_default: true,
            tax_region_id: taxRegion.id,
          },
          adminHeaders
        )
      ).data.tax_rate

      const salesChannel = (
        await api.post(
          "/admin/sales-channels",
          {
            name: "Test channel",
          },
          adminHeaders
        )
      ).data.sales_channel

      const product = (
        await api.post(
          "/admin/products",
          {
            title: "Test product",
            options: [{ title: "size", values: ["large", "small"] }],
            variants: [
              {
                title: "Test variant",
                sku: "test-variant",
                options: { size: "large" },
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

      productExtra = (
        await api.post(
          "/admin/products",
          {
            title: "Extra product",
            options: [{ title: "size", values: ["large", "small"] }],
            variants: [
              {
                title: "my variant",
                sku: "variant-sku",
                options: { size: "large" },
                prices: [
                  {
                    currency_code: "usd",
                    amount: 12,
                  },
                ],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      const orderModule = container.resolve(Modules.ORDER)

      order = await orderModule.createOrders({
        region_id: region.id,
        email: "foo@bar.com",
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
          },
        ],
        currency_code: "usd",
        customer_id: customer.id,
      })

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

      inventoryItemExtra = (
        await api.get(`/admin/inventory-items?sku=variant-sku`, adminHeaders)
      ).data.inventory_items[0]

      await api.post(
        `/admin/inventory-items/${inventoryItemExtra.id}/location-levels`,
        {
          location_id: location.id,
          stocked_quantity: 4,
        },
        adminHeaders
      )

      const remoteLink = container.resolve(
        ContainerRegistrationKeys.REMOTE_LINK
      )

      await remoteLink.create([
        {
          [Modules.STOCK_LOCATION]: {
            stock_location_id: location.id,
          },
          [Modules.FULFILLMENT]: {
            fulfillment_provider_id: shippingProviderId,
          },
        },
        {
          [Modules.STOCK_LOCATION]: {
            stock_location_id: location.id,
          },
          [Modules.FULFILLMENT]: {
            fulfillment_set_id: fulfillmentSet.id,
          },
        },
        {
          [Modules.SALES_CHANNEL]: {
            sales_channel_id: salesChannel.id,
          },
          [Modules.STOCK_LOCATION]: {
            stock_location_id: location.id,
          },
        },
        {
          [Modules.PRODUCT]: {
            variant_id: product.variants[0].id,
          },
          [Modules.INVENTORY]: {
            inventory_item_id: inventoryItem.id,
          },
        },
        {
          [Modules.PRODUCT]: {
            variant_id: productExtra.variants[0].id,
          },
          [Modules.INVENTORY]: {
            inventory_item_id: inventoryItemExtra.id,
          },
        },
      ])

      const shippingOptionPayload = {
        name: "Shipping",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        provider_id: shippingProviderId,
        price_type: "flat",
        type: {
          label: "Test type",
          description: "Test description",
          code: "test-code",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
        ],
        rules: [
          {
            operator: RuleOperator.EQ,
            attribute: "is_return",
            value: "true",
          },
        ],
      }

      shippingOption = (
        await api.post(
          "/admin/shipping-options",
          shippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option
    })

    describe("Order Edits lifecycle", () => {
      it("Full flow test", async () => {
        let result = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const orderId = result.data.order_change.order_id

        const item = order.items[0]

        result = (await api.get(`/admin/orders/${orderId}`, adminHeaders)).data
          .order

        expect(result.summary.current_order_total).toEqual(60)
        expect(result.summary.original_order_total).toEqual(60)

        // New Items ($12 each)
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 2,
                },
              ],
            },
            adminHeaders
          )
        ).data.order_preview

        expect(result.summary.current_order_total).toEqual(84)
        expect(result.summary.original_order_total).toEqual(60)

        // Update item quantity and unit_price with the same amount as we have originally should not change totals
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items/item/${item.id}`,
            {
              quantity: 2,
              unit_price: 25,
            },
            adminHeaders
          )
        ).data.order_preview

        expect(result.summary.current_order_total).toEqual(84)
        expect(result.summary.original_order_total).toEqual(60)

        // Update item quantity, but keep the price as it was originally, should add + 25 to previous amount
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items/item/${item.id}`,
            {
              quantity: 3,
              unit_price: 25,
            },
            adminHeaders
          )
        ).data.order_preview

        expect(result.summary.current_order_total).toEqual(109)
        expect(result.summary.original_order_total).toEqual(60)

        // Update item quantity, with a new price
        // 30 * 3 = 90 (new item)
        // 12 * 2 = 24 (custom item)
        // 10 * 1 = 10 (shipping item)
        // total = 124
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items/item/${item.id}`,
            {
              quantity: 3,
              unit_price: 30,
            },
            adminHeaders
          )
        ).data.order_preview

        expect(result.summary.current_order_total).toEqual(124)
        expect(result.summary.original_order_total).toEqual(60)

        // Remove the item by setting the quantity to 0
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items/item/${item.id}`,
            {
              quantity: 0,
            },
            adminHeaders
          )
        ).data.order_preview

        expect(result.summary.current_order_total).toEqual(34)
        expect(result.summary.original_order_total).toEqual(60)
        expect(result.items.length).toEqual(2)

        result = (
          await api.post(
            `/admin/order-edits/${orderId}/request`,
            {},
            adminHeaders
          )
        ).data.order_preview

        expect(result.order_change.status).toEqual(OrderChangeStatus.REQUESTED)
        expect(result.summary.current_order_total).toEqual(34)
        expect(result.summary.original_order_total).toEqual(60)
        expect(result.items.length).toEqual(2)

        const newItem = result.items.find(
          (i) => i.variant_id === productExtra.variants[0].id
        )
        expect(newItem.tax_lines[0].tax_rate_id).toEqual(taxLine.id)
        expect(newItem.tax_lines[0].rate).toEqual(10)

        result = (
          await api.post(
            `/admin/order-edits/${orderId}/confirm`,
            {},
            adminHeaders
          )
        ).data.order_preview

        result = (await api.get(`/admin/orders/${orderId}`, adminHeaders)).data
          .order

        expect(result.total).toEqual(36.4)
        expect(result.items.length).toEqual(1)

        result = (
          await api.get(
            `/admin/orders/${orderId}/changes?change_type=edit`,
            adminHeaders
          )
        ).data.order_changes

        expect(result[0].actions).toHaveLength(5)
        expect(result[0].status).toEqual("confirmed")
        expect(result[0].confirmed_by).toEqual(expect.stringContaining("user_"))
      })
    })
  },
})
