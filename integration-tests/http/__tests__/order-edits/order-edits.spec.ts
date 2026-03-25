import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IOrderModuleService, IPromotionModuleService } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  OrderChangeStatus,
  ProductStatus,
  PromotionStatus,
  PromotionType,
  RuleOperator,
} from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../helpers/create-admin-user"
import { medusaTshirtProduct } from "../../__fixtures__/product"

jest.setTimeout(300000)

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
    let locationTwo
    let productExtra
    let container
    let region
    let salesChannel
    let buyRuleProduct

    const shippingProviderId = "manual_test-provider"

    beforeEach(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      region = (
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
            provider_id: "tp_system",
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

      salesChannel = (
        await api.post(
          "/admin/sales-channels",
          {
            name: "Test channel",
          },
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

      const product = (
        await api.post(
          "/admin/products",
          {
            title: "Test product",
            status: ProductStatus.PUBLISHED,
            options: [{ title: "size", values: ["large", "small"] }],
            shipping_profile_id: shippingProfile.id,
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
            status: ProductStatus.PUBLISHED,
            options: [{ title: "size", values: ["large", "small"] }],
            shipping_profile_id: shippingProfile.id,
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

      buyRuleProduct = (
        await api.post(
          "/admin/products",
          {
            title: "Buy rule product",
            options: [{ title: "size", values: ["large", "small"] }],
            shipping_profile_id: shippingProfile.id,
            variants: [
              {
                title: "buy rule variant",
                manage_inventory: false,
                sku: "buy-rule-variant-sku",
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

        expect(result.summary.current_order_total).toEqual(86.4)
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

        expect(result.summary.current_order_total).toEqual(86.4)
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

        expect(result.summary.current_order_total).toEqual(111.4)
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

        expect(result.summary.current_order_total).toEqual(126.4)
        expect(result.summary.original_order_total).toEqual(60)

        const updatedItem = result.items.find((i) => i.id === item.id)
        expect(updatedItem.actions).toEqual([
          expect.objectContaining({
            details: expect.objectContaining({
              quantity: 2,
              unit_price: 25,
              quantity_diff: 0,
            }),
          }),
          expect.objectContaining({
            details: expect.objectContaining({
              quantity: 3,
              unit_price: 25,
              quantity_diff: 1,
            }),
          }),
          expect.objectContaining({
            details: expect.objectContaining({
              quantity: 3,
              unit_price: 30,
              quantity_diff: 1,
            }),
          }),
        ])

        // Update item with decimal quantity
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items/item/${item.id}`,
            {
              quantity: 2.5,
              unit_price: 30,
            },
            adminHeaders
          )
        ).data.order_preview

        expect(result.summary.current_order_total).toEqual(111.4)
        expect(result.summary.original_order_total).toEqual(60)

        const decimalUpdatedItem = result.items.find((i) => i.id === item.id)
        expect(decimalUpdatedItem.actions[3]).toEqual(
          expect.objectContaining({
            details: expect.objectContaining({
              quantity: 2.5,
              unit_price: 30,
              quantity_diff: 0.5,
            }),
          })
        )
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

        expect(result.summary.current_order_total).toEqual(36.4)
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
        expect(result.summary.current_order_total).toEqual(36.4)
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

        expect(result[0].actions).toHaveLength(6)
        expect(result[0].status).toEqual("confirmed")
        expect(result[0].confirmed_by).toEqual(expect.stringContaining("user_"))
      })
    })

    describe("Order Edit Inventory", () => {
      let product
      let inventoryItemLarge
      let inventoryItemMedium
      let inventoryItemSmall

      beforeEach(async () => {
        const container = getContainer()

        inventoryItemLarge = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "shirt-large" },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemMedium = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "shirt-medium" },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemSmall = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "shirt-small" },
            adminHeaders
          )
        ).data.inventory_item

        location = (
          await api.post(
            `/admin/stock-locations`,
            {
              name: "Test location",
            },
            adminHeaders
          )
        ).data.stock_location

        locationTwo = (
          await api.post(
            `/admin/stock-locations`,
            {
              name: "Test location two",
            },
            adminHeaders
          )
        ).data.stock_location

        await api.post(
          `/admin/inventory-items/${inventoryItemLarge.id}/location-levels`,
          {
            location_id: location.id,
            stocked_quantity: 0,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemLarge.id}/location-levels`,
          {
            location_id: locationTwo.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemMedium.id}/location-levels`,
          {
            location_id: location.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )
        await api.post(
          `/admin/inventory-items/${inventoryItemSmall.id}/location-levels`,
          {
            location_id: location.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        product = (
          await api.post(
            "/admin/products",
            {
              title: "Shirt",
              status: ProductStatus.PUBLISHED,
              options: [
                { title: "size", values: ["large", "medium", "small"] },
              ],
              variants: [
                {
                  title: "L shirt",
                  options: { size: "large" },
                  manage_inventory: true,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemLarge.id,
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
                {
                  title: "M shirt",
                  options: { size: "medium" },
                  manage_inventory: true,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemMedium.id,
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
                {
                  title: "S shirt",
                  options: { size: "small" },
                  manage_inventory: true,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemSmall.id,
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
              first_name: "joe2",
              email: "joe2@admin.com",
            },
            adminHeaders
          )
        ).data.customer

        const taxRegion = (
          await api.post(
            "/admin/tax-regions",
            {
              provider_id: "tp_system",
              country_code: "UK",
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

        const orderModule = container.resolve(Modules.ORDER)

        order = await orderModule.createOrders({
          region_id: region.id,
          email: "foo@bar.com",
          items: [
            {
              title: "Medusa T-shirt",
              subtitle: "L shirt",
              variant_id: product.variants.find((v) => v.title === "L shirt")
                .id,
              quantity: 2,
              unit_price: 25,
            },
            {
              title: "Medusa T-shirt",
              subtitle: "M shirt",
              variant_id: product.variants.find((v) => v.title === "M shirt")
                .id,
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

        const remoteLink = container.resolve(
          ContainerRegistrationKeys.REMOTE_LINK
        )

        await remoteLink.create([
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: salesChannel.id,
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: location.id,
            },
          },
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: salesChannel.id,
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: locationTwo.id,
            },
          },
        ])
      })

      it("should manage reservations on order edit", async () => {
        let edit = (
          await api.post(
            `/admin/order-edits`,
            { order_id: order.id },
            adminHeaders
          )
        ).data.order_change

        // Add item
        await api.post(
          `/admin/order-edits/${order.id}/items`,
          {
            items: [
              {
                variant_id: product.variants.find((v) => v.title === "S shirt")
                  .id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        // Remove item
        await api.post(
          `/admin/order-edits/${order.id}/items/item/${order.items.find((i) => i.subtitle === "M shirt").id
          }`,
          { quantity: 0 },
          adminHeaders
        )

        // Update item
        await api.post(
          `/admin/order-edits/${order.id}/items/item/${order.items.find((i) => i.subtitle === "L shirt").id
          }`,
          { quantity: 2 },
          adminHeaders
        )

        edit = (
          await api.post(
            `/admin/order-edits/${order.id}/request`,
            {},
            adminHeaders
          )
        ).data.order_change

        edit = (
          await api.post(
            `/admin/order-edits/${order.id}/confirm`,
            {},
            adminHeaders
          )
        ).data.order_change

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        expect(order.items.length).toBe(2)
        expect(order.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              subtitle: "L shirt",
              quantity: 2,
            }),
            expect.objectContaining({
              subtitle: "S shirt",
              quantity: 1,
            }),
          ])
        )
        let reservations = (await api.get(`/admin/reservations`, adminHeaders))
          .data.reservations

        expect(reservations.length).toBe(2)
        expect(reservations).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              inventory_item_id: inventoryItemLarge.id,
              quantity: 2,
            }),
            expect.objectContaining({
              inventory_item_id: inventoryItemSmall.id,
              quantity: 1,
            }),
          ])
        )
      })

      it("should manage inventory across locations in order edit", async () => {
        let edit = (
          await api.post(
            `/admin/order-edits`,
            { order_id: order.id },
            adminHeaders
          )
        ).data.order_change

        // Add item
        await api.post(
          `/admin/order-edits/${order.id}/items`,
          {
            items: [
              {
                variant_id: product.variants.find((v) => v.title === "L shirt")
                  .id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        edit = (
          await api.post(
            `/admin/order-edits/${order.id}/request`,
            {},
            adminHeaders
          )
        ).data.order_change

        edit = (
          await api.post(
            `/admin/order-edits/${order.id}/confirm`,
            {},
            adminHeaders
          )
        ).data.order_change

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        expect(order.items.length).toBe(3)
        expect(order.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              subtitle: "L shirt",
              quantity: 2,
            }),
          ])
        )
      })
    })

    describe("Order Edit Shipping Methods", () => {
      it("should add a shipping method through an order edit", async () => {
        await api.post(
          "/admin/order-edits",
          { order_id: order.id, description: "Test" },
          adminHeaders
        )

        const orderId = order.id

        const shippingMethodResponse = await api.post(
          `/admin/order-edits/${orderId}/shipping-method`,
          { shipping_option_id: shippingOption.id, custom_amount: 5 },
          adminHeaders
        )

        expect(
          shippingMethodResponse.data.order_preview.shipping_methods.length
        ).toEqual(2)
        expect(
          shippingMethodResponse.data.order_preview.shipping_methods
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              amount: 10,
            }),
            expect.objectContaining({
              amount: 5,
            }),
          ])
        )

        const requestResult = await api.post(
          `/admin/order-edits/${orderId}/request`,
          {},
          adminHeaders
        )

        expect(requestResult.data.order_preview.order_change.status).toEqual(
          OrderChangeStatus.REQUESTED
        )

        await api.post(
          `/admin/order-edits/${orderId}/confirm`,
          {},
          adminHeaders
        )

        const orderResult = await api.get(
          `/admin/orders/${orderId}`,
          adminHeaders
        )

        expect(orderResult.data.order.shipping_methods.length).toEqual(2)
        expect(orderResult.data.order.shipping_methods).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ amount: 10 }),
            expect.objectContaining({ amount: 5 }),
          ])
        )

        const orderChangesResult = await api.get(
          `/admin/orders/${orderId}/changes?change_type=edit`,
          adminHeaders
        )

        expect(orderChangesResult.data.order_changes.length).toEqual(1)
        expect(orderChangesResult.data.order_changes[0].status).toEqual(
          OrderChangeStatus.CONFIRMED
        )
      })
    })

    describe("Order Edit Payment Collection", () => {
      let appContainer
      let storeHeaders
      let region, product, salesChannel

      const shippingAddressData = {
        address_1: "test address 1",
        address_2: "test address 2",
        city: "SF",
        country_code: "US",
        province: "CA",
        postal_code: "94016",
      }

      beforeAll(async () => {
        appContainer = getContainer()
      })

      beforeEach(async () => {
        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        product = (
          await api.post(
            "/admin/products",
            { ...medusaTshirtProduct },
            adminHeaders
          )
        ).data.product

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "Webshop", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel
      })

      it("should add a create a new payment collection if the order has authorized payment collection", async () => {
        const cart = (
          await api.post(
            `/store/carts`,
            {
              currency_code: "usd",
              sales_channel_id: salesChannel.id,
              region_id: region.id,
              shipping_address: shippingAddressData,
              items: [{ variant_id: product.variants[0].id, quantity: 1 }],
            },
            storeHeaders
          )
        ).data.cart

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
          await api.post(
            `/store/carts/${cart.id}/complete`,
            { cart_id: cart.id },
            storeHeaders
          )
        ).data.order

        await api.post(
          `/admin/order-edits`,
          { order_id: order.id, description: "Test" },
          adminHeaders
        )

        await api.post(
          `/admin/order-edits/${order.id}/items`,
          {
            items: [
              {
                variant_id: product.variants[0].id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/order-edits/${order.id}/confirm`,
          {},
          adminHeaders
        )

        const orderResult = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        expect(orderResult.payment_collections).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: paymentCollection.id,
              status: "canceled",
            }),
            expect.objectContaining({
              id: expect.any(String),
              status: "not_paid",
              amount: orderResult.total,
            }),
          ])
        )
      })
    })

    describe("Order Edits promotions", () => {
      let appliedPromotion
      let promotionModule: IPromotionModuleService
      let orderModule: IOrderModuleService
      let remoteLink

      beforeEach(async () => {
        promotionModule = container.resolve(Modules.PROMOTION)
        remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

        appliedPromotion = await promotionModule.createPromotions({
          code: "PROMOTION_APPLIED",
          type: PromotionType.STANDARD,
          status: PromotionStatus.ACTIVE,
          application_method: {
            type: "percentage",
            target_type: "order",
            allocation: "across",
            value: 10,
            currency_code: "usd",
            target_rules: [],
          },
        })

        await remoteLink.create([
          {
            [Modules.SALES_CHANNEL]: {
              sales_channel_id: salesChannel.id,
            },
            [Modules.STOCK_LOCATION]: {
              stock_location_id: location.id,
            },
          },
        ])

        orderModule = container.resolve(Modules.ORDER)

        // @ts-ignore
        order = await orderModule.createOrders({
          email: "foo@bar.com",
          region_id: region.id,
          sales_channel_id: salesChannel.id,
          items: [
            {
              // @ts-ignore
              id: "item-1",
              title: "Custom Item",
              quantity: 1,
              unit_price: 10,
            },
          ],
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
          currency_code: "usd",
        })

        await orderModule.createOrderLineItemTaxLines(order.id, [
          {
            // TODO check why item_id is not in param
            // @ts-ignore
            item_id: "item-1",
            code: "tax-1",
            rate: 10,
            description: "tax-1",
            // @ts-ignore
            code: "standard",
            provider_id: "system",
            total: 1.2,
            subtotal: 1.2,
          },
        ])

        await orderModule.createOrderLineItemAdjustments([
          {
            version: 1,
            code: appliedPromotion.code!,
            amount: 1,
            item_id: "item-1",
            promotion_id: appliedPromotion.id,
          },
        ])

        await remoteLink.create({
          [Modules.ORDER]: { order_id: order.id },
          [Modules.PROMOTION]: { promotion_id: appliedPromotion.id },
        })
      })

      it("should update adjustments when adding a new item", async () => {
        let result = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        // allow carry over promotions flag on the edit
        const orderChangeId = result.data.order_change.id
        await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            carry_over_promotions: true,
          },
          adminHeaders
        )

        const orderId = result.data.order_change.order_id

        result = (await api.get(`/admin/orders/${orderId}`, adminHeaders)).data
          .order

        expect(result.original_total).toEqual(11) // $10 + 10% tax
        expect(result.total).toEqual(10 * 0.9 * 1.1) // ($10 - 10% discount) + 10% tax

        // Add item with price $12, 10% discount and 10% tax
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
        ).data.order_preview

        // two items of $12 and $10 and 10% discount -> subtotal is $22 - 10% discount = $19.8
        // Aside from this there is a tax rate of 10%, which adds (19.8 / 10 = $1.98)
        // Total is $19.8 + $1.98 = $21.78
        expect(result.total).toEqual(21.78)
        expect(result.original_total).toEqual(24.2) // $22 + 10% tax

        // Confirm that the adjustment values are correct
        const adjustments = result.items[0].adjustments
        const adjustments2 = result.items[1].adjustments
        expect(adjustments).toEqual([
          expect.objectContaining({
            amount: 1,
          }),
        ])
        expect(adjustments2).toEqual([
          expect.objectContaining({
            amount: 1.2,
          }),
        ])

        const orderResult = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order

        // confirm original order is not updated
        expect(orderResult.total).toEqual(9.9) //  initial item 10$ and 10% discount and 10% tax
        expect(orderResult.original_total).toEqual(11) // initial item 10$ + 10% tax

        await api.post(
          `/admin/order-edits/${orderId}/confirm`,
          {},
          adminHeaders
        )

        const orderResult2 = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order

        expect(orderResult2.total).toEqual(21.78)
        expect(orderResult2.original_total).toEqual(24.2)
      })

      it("should apply customer group and collection rules on new items", async () => {
        const customerGroup = (
          await api.post(
            "/admin/customer-groups",
            {
              name: "VIP Customers",
            },
            adminHeaders
          )
        ).data.customer_group

        const customer = (
          await api.post(
            "/admin/customers",
            {
              first_name: "Group",
              last_name: "Customer",
              email: "group.customer@admin.com",
            },
            adminHeaders
          )
        ).data.customer

        await api.post(
          `/admin/customer-groups/${customerGroup.id}/customers`,
          { add: [customer.id] },
          adminHeaders
        )

        const collection = (
          await api.post(
            "/admin/collections",
            {
              title: "Promo Collection",
            },
            adminHeaders
          )
        ).data.collection

        await api.post(
          `/admin/products/${productExtra.id}`,
          {
            collection_id: collection.id,
          },
          adminHeaders
        )

        const promotion = (
          await api.post(
            "/admin/promotions",
            {
              code: "GROUP_COLLECTION_RULE",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                value: 5,
                max_quantity: 10,
                currency_code: "usd",
                target_rules: [
                  {
                    attribute: "items.product.collection_id",
                    operator: RuleOperator.IN,
                    values: [collection.id],
                  },
                ],
              },
              rules: [
                {
                  attribute: "customer.groups.id",
                  operator: RuleOperator.IN,
                  values: [customerGroup.id],
                },
              ],
            },
            adminHeaders
          )
        ).data.promotion

        const orderForPromotion = await orderModule.createOrders({
          email: "group.customer@admin.com",
          region_id: region.id,
          sales_channel_id: salesChannel.id,
          items: [
            {
              variant_id: buyRuleProduct.variants[0].id,
              title: "original item",
              quantity: 1,
              unit_price: 10,
            },
          ],
          shipping_address: {
            first_name: "Group",
            last_name: "Customer",
            address_1: "Test",
            city: "Test",
            country_code: "US",
            postal_code: "12345",
          },
          billing_address: {
            first_name: "Group",
            last_name: "Customer",
            address_1: "Test",
            city: "Test",
            country_code: "US",
            postal_code: "12345",
          },
          currency_code: "usd",
          customer_id: customer.id,
        })

        await remoteLink.create({
          [Modules.ORDER]: { order_id: orderForPromotion.id },
          [Modules.PROMOTION]: { promotion_id: promotion.id },
        })

        let result = await api.post(
          "/admin/order-edits",
          {
            order_id: orderForPromotion.id,
            description: "Test",
          },
          adminHeaders
        )

        const orderChangeId = result.data.order_change.id
        await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            carry_over_promotions: true,
          },
          adminHeaders
        )

        result = (
          await api.post(
            `/admin/order-edits/${orderForPromotion.id}/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
        ).data.order_preview

        const collectionItem = result.items.find(
          (item) => item.variant_id === productExtra.variants[0].id
        )
        const nonCollectionItem = result.items.find(
          (item) => item.variant_id === buyRuleProduct.variants[0].id
        )

        expect(collectionItem.adjustments).toEqual([
          expect.objectContaining({
            amount: 5,
          }),
        ])
        expect(nonCollectionItem.adjustments).toEqual([])
      })

      it("should update adjustments when updating an item", async () => {
        let result = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const orderId = result.data.order_change.order_id

        // allow carry over promotions flag on the edit
        const orderChangeId = result.data.order_change.id
        await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            carry_over_promotions: true,
          },
          adminHeaders
        )

        const item = order.items[0]

        result = (await api.get(`/admin/orders/${orderId}`, adminHeaders)).data
          .order

        expect(result.original_total).toEqual(11) // $10 + 10% tax
        expect(result.total).toEqual(9.9) // ($10 - 10% discount) + 10% tax = 9 + 0.9 = 9.9

        let adjustments = result.items[0].adjustments

        expect(adjustments).toEqual([
          expect.objectContaining({
            amount: 1,
            item_id: item.id,
            version: 1,
          }),
        ])

        // Update item quantity
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items/item/${item.id}`,
            {
              quantity: 2,
            },
            adminHeaders
          )
        ).data.order_preview

        expect(result.original_total).toEqual(22) // $20 + 10% tax
        expect(result.total).toEqual(19.8) // ($20 - 10% discount) + 10% tax = 18 + 1.8 = 19.8

        adjustments = result.items[0].adjustments

        expect(adjustments).toEqual([
          expect.objectContaining({
            amount: 2,
            item_id: item.id,
            // version: 2,
          }),
        ])

        const orderResult = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order

        // confirm original order is not updated
        expect(orderResult.original_total).toEqual(11)
        expect(orderResult.total).toEqual(9.9)

        await api.post(
          `/admin/order-edits/${orderId}/confirm`,
          {},
          adminHeaders
        )

        const orderResult2 = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order

        expect(orderResult2.original_total).toEqual(22)
        expect(orderResult2.total).toEqual(19.8)
      })

      it("should update adjustments when removing an item", async () => {
        let result = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const orderId = result.data.order_change.order_id

        // allow carry over promotions flag on the edit
        const orderChangeId = result.data.order_change.id
        await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            carry_over_promotions: true,
          },
          adminHeaders
        )

        const item = order.items[0]

        result = (await api.get(`/admin/orders/${orderId}`, adminHeaders)).data
          .order

        expect(result.original_total).toEqual(11) // $10 + 10% tax
        expect(result.total).toEqual(9.9) // ($10 - 10% discount) + 10% tax = 9 + 0.9 = 9.9

        let adjustments = result.items[0].adjustments

        expect(adjustments).toEqual([
          expect.objectContaining({
            amount: 1,
            item_id: item.id,
          }),
        ])

        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
        ).data.order_preview

        const orderItems = result.items

        expect(orderItems).toEqual([
          expect.objectContaining({
            adjustments: [
              expect.objectContaining({
                amount: 1,
                item_id: item.id,
              }),
            ],
          }),
          expect.objectContaining({
            adjustments: [
              expect.objectContaining({
                amount: 1.2,
              }),
            ],
          }),
        ])

        const newItem = result.items.find(
          (item) => item.variant_id === productExtra.variants[0].id
        )

        const actionId = newItem.actions[0].id

        result = (
          await api.delete(
            `/admin/order-edits/${orderId}/items/${actionId}`,
            adminHeaders
          )
        ).data.order_preview

        adjustments = result.items[0].adjustments

        expect(adjustments).toEqual([
          expect.objectContaining({
            amount: 1,
            item_id: item.id,
          }),
        ])

        const orderResult = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order

        // confirm original order is not updated
        expect(orderResult.total).toEqual(9.9)
        expect(orderResult.original_total).toEqual(11)

        await api.post(
          `/admin/order-edits/${orderId}/confirm`,
          {},
          adminHeaders
        )

        const orderResult2 = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order

        expect(orderResult2.total).toEqual(9.9)
        expect(orderResult2.original_total).toEqual(11)
      })

      it("should update adjustments correctly when adding items in 2 consecutive order edits", async () => {
        // 1. Create the first order edit
        let response = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "First order edit",
          },
          adminHeaders
        )
        const orderChange1 = response.data.order_change

        // allow carry over promotions flag on the edit
        const orderChangeId = response.data.order_change.id
        await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            carry_over_promotions: true,
          },
          adminHeaders
        )

        // 2. Add a new item in the first edit
        response = await api.post(
          `/admin/order-edits/${orderChange1.order_id}/items`,
          {
            items: [
              {
                variant_id: productExtra.variants[0].id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )
        let orderEditPreview1 = response.data.order_preview

        const originalItem = orderEditPreview1.items.find(
          (i) => i.variant_id === order.items[0].variant_id
        )
        const addedItem1 = orderEditPreview1.items.find(
          (i) => i.variant_id === productExtra.variants[0].id
        )
        expect(addedItem1).toBeDefined()
        expect(addedItem1.quantity).toBe(1)
        expect(orderEditPreview1.items.length).toBe(2)

        // Validate adjustments for added item in edit 1
        expect(addedItem1.adjustments).toEqual([
          expect.objectContaining({
            item_id: addedItem1.id,
            amount: 1.2,
          }),
        ])

        // Validate total and original total after first edit
        // original: $10 (orig item) + $12 (added) = $22 → 10% tax = $2.2 → 24.2
        // promo: -$1 (orig item), -$1.2 (added) → subtotal $19.8, 10% = 1.98 → 21.78
        expect(orderEditPreview1.original_total).toBeCloseTo(24.2)
        expect(orderEditPreview1.total).toBeCloseTo(21.78)

        // 3. Confirm the first order edit
        response = await api.post(
          `/admin/order-edits/${orderChange1.order_id}/confirm`,
          {},
          adminHeaders
        )
        expect(response.status).toBe(200)

        // validate order
        let orderResult = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order
        expect(orderResult.original_total).toEqual(24.2)
        expect(orderResult.total).toEqual(21.78)

        expect(orderResult.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: originalItem.id,
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  item_id: originalItem.id,
                  amount: 1,
                  version: 2,
                }),
              ]),
            }),
            expect.objectContaining({
              id: addedItem1.id,
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  item_id: addedItem1.id,
                  amount: 1.2,
                  version: 2,
                }),
              ]),
            }),
          ])
        )

        // 4. Create the second order edit
        response = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Second order edit",
          },
          adminHeaders
        )
        const orderChange2 = response.data.order_change
        await api.post(
          `/admin/order-changes/${orderChange2.id}`,
          {
            carry_over_promotions: true,
          },
          adminHeaders
        )

        // 5. Add another productExtra item
        response = await api.post(
          `/admin/order-edits/${orderChange2.order_id}/items`,
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

        let orderEditPreview2 = response.data.order_preview

        // Adjustments should account for all quantity
        // The individual adjustment for this add: -$1.2 per quantity added (for second edit), but for a 3-quantity line, adjustment stack
        // We must find the two promo adjustments (from first and second edit): -$1.2 (from before, quantity 1), -$2.4 (from just now, quantity 2)
        // Check that at least two adjustments exist with matching amount
        expect(orderEditPreview2.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: originalItem.id,
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  item_id: originalItem.id,
                  amount: 1,
                  // version: 3,
                }),
              ]),
            }),
            // added in 1st edit
            expect.objectContaining({
              id: expect.any(String),
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  item_id: expect.any(String),
                  amount: 1.2,
                  // version: 3,
                }),
              ]),
            }),
            // added in 2nd edit
            expect.objectContaining({
              id: expect.any(String),
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  item_id: expect.any(String),
                  amount: 2.4,
                  // version: 3,
                }),
              ]),
            }),
          ])
        )
        // Validate totals after the second edit with explicit numbers
        // Original: $10 (orig) + $12*3 (added, 3 qty) = 10+36=46; 46*0.1=4.6 tax -> 50.6
        // Promos: -$1 (orig), -$1.2 (first add), -$2.4 (second add, 2 qty * 1.2)
        // subtotal after promos: 46 - 1 - 1.2 - 2.4 = 41.4; 41.4*0.1=4.14 tax -> total: 45.54
        expect(orderEditPreview2.original_total).toBeCloseTo(50.6)
        expect(orderEditPreview2.total).toBeCloseTo(45.54)

        // validate that order is in the same state as after the first edit before we confirm the second edit
        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order
        expect(orderResult.original_total).toEqual(24.2)
        expect(orderResult.total).toEqual(21.78)

        expect(orderResult.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: originalItem.id,
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  item_id: originalItem.id,
                  amount: 1,
                  version: 2,
                }),
              ]),
            }),
            expect.objectContaining({
              id: addedItem1.id,
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  item_id: addedItem1.id,
                  amount: 1.2,
                  version: 2,
                }),
              ]),
            }),
          ])
        )

        // 6. Confirm the second order edit
        response = await api.post(
          `/admin/order-edits/${orderChange2.order_id}/confirm`,
          {},
          adminHeaders
        )
        expect(response.status).toBe(200)

        // 7. Retrieve the final order and validate
        response = await api.get(`/admin/orders/${order.id}`, adminHeaders)
        const finalOrder = response.data.order

        // Adjustments in DB: two on added item
        expect(finalOrder.items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: originalItem.id,
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  item_id: originalItem.id,
                  amount: 1,
                  version: 3,
                }),
              ]),
            }),
            expect.objectContaining({
              id: addedItem1.id,
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  item_id: addedItem1.id,
                  amount: 1.2,
                  version: 3,
                }),
              ]),
            }),
            expect.objectContaining({
              id: expect.any(String),
              adjustments: expect.arrayContaining([
                expect.objectContaining({
                  item_id: expect.any(String),
                  amount: 2.4,
                  version: 3,
                }),
              ]),
            }),
          ])
        )

        // Totals should match previous calculation
        expect(finalOrder.original_total).toBeCloseTo(50.6)
        expect(finalOrder.total).toBeCloseTo(45.54)
      })

      it("should update adjustments correctly when 2 promotions are applied (one is fixed, one is percentage)", async () => {
        const publishableKey = await generatePublishableKey(container)
        const storeHeaders = generateStoreHeaders({ publishableKey })

        const product = (
          await api.post(
            "/admin/products",
            {
              title: "Prod 1",
              status: ProductStatus.PUBLISHED,
              sales_channels: [{ id: salesChannel.id }],

              options: [{ title: "size", values: ["large", "small"] }],
              shipping_profile_id: undefined,
              variants: [
                {
                  title: "Prod 1 variant",
                  manage_inventory: false,
                  sku: "prod-1-variant-123",
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

        // 1. Create two promotions: one fixed ($2 off), one 10% off
        const fixedPromotion = await api.post(
          "/admin/promotions",
          {
            code: "FIXED2",
            type: "standard",
            status: "active",
            application_method: {
              type: "fixed",
              currency_code: "usd",
              target_type: "items",
              allocation: "each",
              max_quantity: 5,
              value: 2,
            },
            is_automatic: false,
          },
          adminHeaders
        )

        const percentPromotion = await api.post(
          "/admin/promotions",
          {
            code: "PERCENT10",
            type: "standard",
            status: "active",
            application_method: {
              type: "percentage",
              currency_code: "usd",
              target_type: "items",
              allocation: "across",
              value: 10,
            },
            is_automatic: false,
          },
          adminHeaders
        )

        // 2. Create a fresh cart with a single item
        const freshCartRes = await api.post(
          "/store/carts",
          {
            sales_channel_id: salesChannel.id,
            currency_code: "usd",
            region_id: order.region_id,
            email: "multi-promo@example.com",
            items: [
              {
                variant_id: product.variants[0].id,
                quantity: 1,
              },
            ],
            // Apply both promotions to the cart
            promo_codes: ["FIXED2", "PERCENT10"],
          },
          storeHeaders
        )

        const freshCartId = freshCartRes.data.cart.id

        const paymentCollection = (
          await api.post(
            `/store/payment-collections`,
            { cart_id: freshCartId },
            storeHeaders
          )
        ).data.payment_collection

        await api.post(
          `/store/payment-collections/${paymentCollection.id}/payment-sessions`,
          {
            provider_id: "pp_system_default",
          },
          storeHeaders
        )

        const completeOrderRes = await api.post(
          `/store/carts/${freshCartId}/complete`,
          {},
          storeHeaders
        )

        const newOrderId = completeOrderRes.data.order.id
        let response = await api.get(
          `/admin/orders/${newOrderId}`,
          adminHeaders
        )
        let freshOrder = response.data.order
        const originalItem = freshOrder.items[0]

        // Check adjustments on item: should have both promos
        expect(originalItem.adjustments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              amount: 2, // fixed accross
              code: "FIXED2",
            }),
            expect.objectContaining({
              amount: 1, // 10% off
              code: "PERCENT10",
            }),
          ])
        )

        expect(freshOrder.original_total).toBe(10) // just 10$ item without tax
        expect(freshOrder.total).toBe(7) // 10$ - 2$ fixed - 10% = 7$

        const editRes = await api.post(
          "/admin/order-edits",
          {
            order_id: newOrderId,
          },
          adminHeaders
        )

        // allow carry over promotions flag on the edit
        const orderChangeId = editRes.data.order_change.id
        await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            carry_over_promotions: true,
          },
          adminHeaders
        )

        const editOrderId = editRes.data.order_change.order_id
        const extraVariantId = productExtra.variants[0].id

        const addedItemsResult = (
          await api.post(
            `/admin/order-edits/${editOrderId}/items`,
            {
              items: [
                {
                  variant_id: extraVariantId,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
        ).data.order_preview

        const addedItem = addedItemsResult.items.find(
          (i) => i.variant_id === extraVariantId
        )

        const initialItem = addedItemsResult.items.find(
          (i) => i.variant_id === product.variants[0].id
        )
        expect(addedItem).toBeDefined()

        // Should have both promo adjustments on new item as well
        expect(addedItem.adjustments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "FIXED2",
              amount: 2,
              version: 2,
            }),
            expect.objectContaining({
              code: "PERCENT10",
              amount: 1.2,
              version: 2,
            }),
          ])
        )

        expect(addedItemsResult.original_total).toBe(10 + 12)
        expect(addedItemsResult.total).toBe(15.8) // 22$ - 2$ - 2$ - 1.2$ - 1$

        expect(initialItem.adjustments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "FIXED2",
              amount: 2,
            }),
            expect.objectContaining({
              code: "PERCENT10",
              amount: 1,
            }),
          ])
        )

        const initialOrder = (
          await api.get(`/admin/orders/${newOrderId}`, adminHeaders)
        ).data.order

        // original order is still unchanged
        expect(initialOrder.original_total).toBe(10)
        expect(initialOrder.total).toBe(7)

        await api.post(
          `/admin/order-edits/${editOrderId}/confirm`,
          {},
          adminHeaders
        )

        const confirmedOrder = (
          await api.get(`/admin/orders/${newOrderId}`, adminHeaders)
        ).data.order

        expect(confirmedOrder.original_total).toBe(10 + 12)
        expect(confirmedOrder.total).toBe(15.8) // 22$ - 2$ - 2$ - 1.2$ - 1$
      })

      it("should update adjustments when adding then updating then removing the original item", async () => {
        // Create a new order edit
        let result = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const orderId = result.data.order_change.order_id
        const originalItem = order.items[0]

        // allow carry over promotions flag on the edit
        const orderChangeId = result.data.order_change.id
        await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            carry_over_promotions: true,
          },
          adminHeaders
        )

        // Add a new item
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
        ).data.order_preview

        const addedItem = result.items.find(
          (i) => i.variant_id === productExtra.variants[0].id
        )
        expect(addedItem).toBeDefined() // item is added
        expect(result.original_total).toEqual(24.2) // ($10 + $12) + 10% tax = 22 + 2.2 = 24.2
        expect(result.total).toEqual(21.78) // ($10 + $12 - $1 - $1.2) + 10% tax = 10 + 12 - 2.2 = 19.8 + 1.98 = 21.78

        let adjustments = addedItem.adjustments
        expect(adjustments).toEqual([
          expect.objectContaining({
            item_id: addedItem.id,
            amount: 1.2,
          }),
        ])

        // Update the quantity of the newly added item by updating the action
        const actionId = addedItem.actions.find(
          (a) => a.action === "ITEM_ADD"
        )?.id

        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items/${actionId}`,
            {
              quantity: 2,
            },
            adminHeaders
          )
        ).data.order_preview

        let updatedAddedItem = result.items.find((i) => i.id === addedItem.id)

        expect(result.original_total).toEqual(37.4) // $10 + $12*2 = 10+24=34 + 10% tax = 3.4 = 37.4
        expect(result.total).toEqual(33.66) // ($10 + $24 - $1 - $2.4) + 10% tax = 31.6 + 3.16 = 34.76

        adjustments = updatedAddedItem.adjustments
        expect(adjustments).toEqual([
          expect.objectContaining({
            item_id: updatedAddedItem.id,
            amount: 2.4,
          }),
        ])

        // Remove the original item by setting its quantity to 0
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items/item/${originalItem.id}`,
            {
              quantity: 0,
            },
            adminHeaders
          )
        ).data.order_preview

        // $12*2 + 10% tax = $24 + $2.4 = $26.4
        expect(result.original_total).toEqual(26.4)
        expect(result.total).toEqual(23.76) // ($24 - $2.4) + $2.16 = $21.6 + $2.16 = $23.76

        updatedAddedItem = result.items.find((i) => i.id === addedItem.id)
        adjustments = updatedAddedItem.adjustments
        expect(adjustments).toEqual([
          expect.objectContaining({
            item_id: updatedAddedItem.id,
            amount: 2.4,
          }),
        ])

        // Confirm that the original order is not updated
        const orderResult = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order
        expect(orderResult.original_total).toEqual(11)
        expect(orderResult.total).toEqual(9.9)

        // Confirm the order edit
        await api.post(
          `/admin/order-edits/${orderId}/confirm`,
          {},
          adminHeaders
        )

        // Final check after confirmation
        const orderResult2 = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order

        expect(orderResult2.original_total).toEqual(26.4)
        expect(orderResult2.total).toEqual(23.76)
      })

      it("should not create adjustments when adding a new item if promotion is disabled", async () => {
        let result = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        // allow carry over promotions flag on the edit
        const orderChangeId = result.data.order_change.id
        await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            carry_over_promotions: true,
          },
          adminHeaders
        )

        const orderId = result.data.order_change.order_id

        result = (await api.get(`/admin/orders/${orderId}`, adminHeaders)).data
          .order

        expect(result.original_total).toEqual(11) // $10 + 10% tax
        expect(result.total).toEqual(9.9) // initial item 10$ and 10% discount and 10% tax

        // promotion was active before so the item has an adjustment
        // only now we disable it

        await api.post(
          `/admin/promotions/${appliedPromotion.id}`,
          {
            status: "draft",
          },
          adminHeaders
        )

        // Add item with price $12 + $1.2 in taxes
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
        ).data.order_preview

        expect(result.total).toEqual(13.2 + 11) // since action is replace -> old adjustments are not recreated in this version
        expect(result.original_total).toEqual(13.2 + 11)

        // Confirm that the adjustment values are correct
        const adjustments = result.items[0].adjustments
        const adjustments2 = result.items[1].adjustments
        expect(adjustments).toEqual([])
        expect(adjustments2).toEqual([])

        const orderResult = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order

        // confirm original order is not updated
        expect(orderResult.total).toEqual(9.9) // but adjustments of the intial version are still there despite the promotion being disabled in the meantime
        expect(orderResult.original_total).toEqual(11)

        await api.post(
          `/admin/order-edits/${orderId}/confirm`,
          {},
          adminHeaders
        )

        const orderResult2 = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order

        // The promotion is disabled, so what happens is that promotions that were initially applied are removed
        expect(orderResult2.total).toEqual(24.2)
        expect(orderResult2.original_total).toEqual(24.2)
      })

      it("should add, remove, and add buy-get adjustment depending on the quantity of the buy rule product", async () => {
        promotionModule = container.resolve(Modules.PROMOTION)

        appliedPromotion = await promotionModule.createPromotions({
          code: "BUY_GET_PROMO",
          type: "buyget",
          status: "active",
          application_method: {
            allocation: "each",
            value: 100,
            max_quantity: 1,
            type: "percentage",
            target_type: "items",
            apply_to_quantity: 1,
            buy_rules_min_quantity: 2,
            target_rules: [
              {
                operator: "eq",
                attribute: "items.product.id",
                values: [productExtra.id],
              },
            ],
            buy_rules: [
              {
                operator: "eq",
                attribute: "items.product.id",
                values: [buyRuleProduct.id],
              },
            ],
          },
          is_tax_inclusive: false,
          is_automatic: true,
        })

        const orderModule: IOrderModuleService = container.resolve(
          Modules.ORDER
        )

        order = await orderModule.createOrders({
          email: "foo@bar.com",
          region_id: region.id,
          sales_channel_id: salesChannel.id,
          items: [
            {
              variant_id: buyRuleProduct.variants[0].id,
              quantity: 2,
              title: "Buy rule product",
              unit_price: 10,
              product_id: buyRuleProduct.id,
            },
            {
              variant_id: productExtra.variants[0].id,
              quantity: 1,
              title: "Extra product",
              unit_price: 10,
              product_id: productExtra.id,
              adjustments: [
                {
                  code: appliedPromotion.code!,
                  amount: 10,
                  promotion_id: appliedPromotion.id,
                },
              ],
            },
          ],
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
          currency_code: "usd",
        })

        await orderModule.createOrderLineItemAdjustments([
          {
            code: appliedPromotion.code!,
            amount: 1,
            item_id: "item-1",
            promotion_id: appliedPromotion.id,
          },
        ])

        const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

        await remoteLink.create({
          [Modules.ORDER]: { order_id: order.id },
          [Modules.PROMOTION]: { promotion_id: appliedPromotion.id },
        })

        // Initially, the buy-get adjustment should be added to the order
        let result = await api.post(
          "/admin/order-edits",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        // allow carry over promotions flag on the edit
        const orderChangeId = result.data.order_change.id
        await api.post(
          `/admin/order-changes/${orderChangeId}`,
          {
            carry_over_promotions: true,
          },
          adminHeaders
        )

        const orderId = result.data.order_change.order_id

        result = (await api.get(`/admin/orders/${orderId}`, adminHeaders)).data
          .order

        expect(result.original_total).toEqual(30)
        expect(result.total).toEqual(20)

        const buyRuleItem = result.items.find(
          (item) => item.product_id === buyRuleProduct.id
        )

        // Update buy rule product quantity to 1
        // This should remove the buy-get adjustment, as it is no longer valid
        result = (
          await api.post(
            `/admin/order-edits/${orderId}/items/item/${buyRuleItem.id}`,
            {
              quantity: 1,
            },
            adminHeaders
          )
        ).data.order_preview

        expect(result.total).toEqual(20)
        expect(result.original_total).toEqual(20)

        // Confirm that the original order is not updated
        result = (await api.get(`/admin/orders/${orderId}`, adminHeaders)).data
          .order

        expect(result.original_total).toEqual(30)
        expect(result.total).toEqual(20)

        await api.post(
          `/admin/order-edits/${orderId}/confirm`,
          {},
          adminHeaders
        )

        const orderResult2 = (
          await api.get(`/admin/orders/${orderId}`, adminHeaders)
        ).data.order

        expect(orderResult2.total).toEqual(20)
        expect(orderResult2.original_total).toEqual(20)
      })
    })
  },
})
