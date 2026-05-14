import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { IOrderModuleService, IPromotionModuleService } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
  PromotionStatus,
  PromotionType,
  RuleOperator,
} from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../modules/__tests__/fixtures/tax"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order, order2
    let returnShippingOption
    let outboundShippingOption
    let shippingProfile
    let fulfillmentSet
    let returnReason
    let inventoryItem
    let inventoryItemExtra
    let inventoryItemExtra2
    let location
    let productExtra
    let productExtra2
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
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
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
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "size", values: ["large", "small"] }],
            variants: [
              {
                title: "my variant",
                sku: "variant-sku",
                options: { size: "large" },
                prices: [
                  {
                    currency_code: "usd",
                    amount: 123456.1234657890123456789,
                  },
                ],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      productExtra2 = (
        await api.post(
          "/admin/products",
          {
            title: "Extra product 2, same price",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "size", values: ["large", "small"] }],
            variants: [
              {
                title: "my variant 2",
                sku: "variant-sku-2",
                options: { size: "large" },
                prices: [
                  {
                    currency_code: "usd",
                    amount: 25,
                  },
                ],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      returnReason = (
        await api.post(
          "/admin/return-reasons",
          {
            value: "return-reason-test",
            label: "Test return reason",
          },
          adminHeaders
        )
      ).data.return_reason

      const orderModule = container.resolve(Modules.ORDER)

      order = await orderModule.createOrders({
        region_id: region.id,
        email: "foo@bar.com",
        items: [
          {
            title: "Custom Item 2",
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
            tax_lines: [
              {
                description: "shipping Tax 1",
                tax_rate_id: "tax_usa_shipping",
                code: "code",
                rate: 10,
              },
            ],
          },
        ],
        currency_code: "usd",
        customer_id: customer.id,
      })

      order2 = await orderModule.createOrders({
        region_id: region.id,
        email: "foo@bar2.com",
        items: [
          {
            title: "Custom Iasdasd2",
            quantity: 1,
            unit_price: 20,
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

      inventoryItemExtra2 = (
        await api.get(`/admin/inventory-items?sku=variant-sku-2`, adminHeaders)
      ).data.inventory_items[0]

      await api.post(
        `/admin/inventory-items/${inventoryItemExtra.id}/location-levels`,
        {
          location_id: location.id,
          stocked_quantity: 4,
        },
        adminHeaders
      )

      await api.post(
        `/admin/inventory-items/${inventoryItemExtra2.id}/location-levels`,
        {
          location_id: location.id,
          stocked_quantity: 2,
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
        {
          [Modules.PRODUCT]: {
            variant_id: productExtra2.variants[0].id,
          },
          [Modules.INVENTORY]: {
            inventory_item_id: inventoryItemExtra2.id,
          },
        },
      ])

      // create reservation for inventory item that is initially on the order
      const inventoryModule = container.resolve(Modules.INVENTORY)
      await inventoryModule.createReservationItems([
        {
          inventory_item_id: inventoryItem.id,
          location_id: location.id,
          quantity: 2,
          line_item_id: order.items[0].id,
        },
      ])

      const shippingOptionPayload = {
        name: "Return shipping",
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
      }

      const outboundShippingOptionPayload = {
        name: "Oubound shipping",
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
            amount: 20,
          },
        ],
        rules: [
          {
            operator: RuleOperator.EQ,
            attribute: "is_return",
            value: "false",
          },
          {
            operator: RuleOperator.EQ,
            attribute: "enabled_in_store",
            value: "true",
          },
        ],
      }
      outboundShippingOption = (
        await api.post(
          "/admin/shipping-options",
          outboundShippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option

      returnShippingOption = (
        await api.post(
          "/admin/shipping-options",
          shippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option

      const item = order.items[0]

      await api.post(
        `/admin/orders/${order.id}/fulfillments`,
        {
          items: [
            {
              id: item.id,
              quantity: 2,
            },
          ],
        },
        adminHeaders
      )

      await api.post(
        `/admin/orders/${order2.id}/fulfillments`,
        {
          items: [
            {
              id: order2.items[0].id,
              quantity: 1,
            },
          ],
        },
        adminHeaders
      )

      await setupTaxStructure(container.resolve(Modules.TAX))
    })

    describe("Exchanges lifecycle", () => {
      it("test full exchange flow", async () => {
        const orderBefore = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        let result = await api.post(
          "/admin/exchanges",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        expect(result.data.exchange.created_by).toEqual(expect.any(String))

        const exchangeId = result.data.exchange.id

        const item = order.items[0]

        result = await api.post(
          `/admin/exchanges/${exchangeId}/inbound/items`,
          {
            items: [
              {
                id: item.id,
                reason_id: returnReason.id,
                quantity: 2,
              },
            ],
          },
          adminHeaders
        )

        // New Item
        result = await api.post(
          `/admin/exchanges/${exchangeId}/outbound/items`,
          {
            items: [
              {
                variant_id: productExtra2.variants[0].id,
                quantity: 2,
              },
            ],
          },
          adminHeaders
        )

        result = await api.post(
          `/admin/exchanges/${exchangeId}/request`,
          {},
          adminHeaders
        )
        const returnId = result.data.exchange.return_id

        result = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        expect(orderBefore.total).toBe(61)
        expect(result.total).toBe(112)

        // receive return
        await api.post(`/admin/returns/${returnId}/receive`, {}, adminHeaders)
        await api.post(
          `/admin/returns/${returnId}/receive-items`,
          {
            items: [
              {
                id: item.id,
                quantity: 2,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/returns/${returnId}/receive/confirm`,
          {},
          adminHeaders
        )

        result = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        expect(orderBefore.total).toBe(61)
        expect(result.total).toBe(62) // +1 is from taxes of the new item
      })

      it("Full flow with 2 orders", async () => {
        let result = await api.post(
          "/admin/exchanges",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        expect(result.data.exchange.created_by).toEqual(expect.any(String))

        const exchangeId = result.data.exchange.id

        let r2 = await api.post(
          "/admin/exchanges",
          {
            order_id: order2.id,
          },
          adminHeaders
        )

        const exchangeId2 = r2.data.exchange.id
        const item2 = order2.items[0]

        result = await api.post(
          `/admin/exchanges/${exchangeId2}/inbound/items`,
          {
            items: [
              {
                id: item2.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/exchanges/${exchangeId2}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        const { response } = await api
          .post(`/admin/exchanges/${exchangeId2}/request`, {}, adminHeaders)
          .catch((e) => e)

        expect(response.data).toEqual({
          type: "invalid_data",
          message:
            "Order exchange request should have at least 1 item inbound and 1 item outbound",
        })

        await api.post(
          `/admin/exchanges/${exchangeId2}/outbound/items`,
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

        await api.post(
          `/admin/exchanges/${exchangeId2}/request`,
          {},
          adminHeaders
        )

        const item = order.items[0]

        result = await api.post(
          `/admin/exchanges/${exchangeId}/inbound/items`,
          {
            items: [
              {
                id: item.id,
                reason_id: returnReason.id,
                quantity: 2,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/exchanges/${exchangeId}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        // updated the requested quantity
        const updateReturnItemActionId =
          result.data.order_preview.items[0].actions[0].id

        result = await api.post(
          `/admin/exchanges/${exchangeId}/inbound/items/${updateReturnItemActionId}`,
          {
            quantity: 1,
          },
          adminHeaders
        )

        // New Items
        result = await api.post(
          `/admin/exchanges/${exchangeId}/outbound/items`,
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

        result = await api.post(
          `/admin/exchanges/${exchangeId}/request`,
          {},
          adminHeaders
        )

        result = (
          await api.get(
            `/admin/exchanges?fields=+metadata,*additional_items`,
            adminHeaders
          )
        ).data.exchanges

        expect(result).toHaveLength(2)
        expect(result[0].additional_items).toHaveLength(1)
        expect(result[0].canceled_at).toBeNull()

        const return_ = (
          await api.get(
            `/admin/returns/${result[0].return_id}?fields=*fulfillments`,
            adminHeaders
          )
        ).data.return

        expect(return_.fulfillments).toHaveLength(1)
        expect(return_.fulfillments[0].canceled_at).toBeNull()

        // all exchange return fulfillments should be canceled before canceling the exchange
        await api.post(
          `/admin/fulfillments/${return_.fulfillments[0].id}/cancel`,
          {},
          adminHeaders
        )

        await api.post(
          `/admin/exchanges/${exchangeId}/cancel`,
          {},
          adminHeaders
        )

        result = (
          await api.get(
            `/admin/exchanges?fields=*additional_items`,
            adminHeaders
          )
        ).data.exchanges
        expect(result[0].canceled_at).toBeDefined()
      })

      describe("with inbound and outbound items", () => {
        let exchange
        let orderPreview

        beforeEach(async () => {
          exchange = (
            await api.post(
              "/admin/exchanges",
              {
                order_id: order.id,
                description: "Test",
              },
              adminHeaders
            )
          ).data.exchange

          const item = order.items[0]

          await api.post(
            `/admin/exchanges/${exchange.id}/inbound/items`,
            {
              items: [
                {
                  id: item.id,
                  reason_id: returnReason.id,
                  quantity: 2,
                },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/exchanges/${exchange.id}/inbound/shipping-method`,
            { shipping_option_id: returnShippingOption.id },
            adminHeaders
          )

          await api.post(
            `/admin/exchanges/${exchange.id}/outbound/items`,
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

          await api.post(
            `/admin/exchanges/${exchange.id}/outbound/shipping-method`,
            { shipping_option_id: outboundShippingOption.id },
            adminHeaders
          )

          orderPreview = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order
        })

        it("should remove outbound shipping method when outbound items are completely removed", async () => {
          orderPreview = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const exchangeItems = orderPreview.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "ITEM_ADD")
          )

          const exchangeShippingMethods = orderPreview.shipping_methods.filter(
            (item) =>
              !!item.actions?.find(
                (action) =>
                  action.action === "SHIPPING_ADD" && !action.return_id
              )
          )

          expect(exchangeItems).toHaveLength(1)
          expect(exchangeShippingMethods).toHaveLength(1)

          await api.delete(
            `/admin/exchanges/${exchange.id}/outbound/items/${exchangeItems[0].actions[0].id}`,
            adminHeaders
          )

          orderPreview = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const updatedExchangeItems = orderPreview.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "ITEM_ADD")
          )

          const updatedClaimShippingMethods =
            orderPreview.shipping_methods.filter(
              (item) =>
                !!item.actions?.find(
                  (action) =>
                    action.action === "SHIPPING_ADD" && !action.return_id
                )
            )

          expect(updatedExchangeItems).toHaveLength(0)
          expect(updatedClaimShippingMethods).toHaveLength(0)
        })

        it("should remove inbound shipping method when inbound items are completely removed", async () => {
          orderPreview = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const exchangeItems = orderPreview.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "RETURN_ITEM")
          )

          const exchangeShippingMethods = orderPreview.shipping_methods.filter(
            (item) =>
              !!item.actions?.find(
                (action) =>
                  action.action === "SHIPPING_ADD" && !!action.return_id
              )
          )

          expect(exchangeItems).toHaveLength(1)
          expect(exchangeShippingMethods).toHaveLength(1)

          await api.delete(
            `/admin/exchanges/${exchange.id}/inbound/items/${exchangeItems[0].actions[0].id}`,
            adminHeaders
          )

          orderPreview = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const updatedExchangeItems = orderPreview.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "RETURN_ITEM")
          )

          const updatedClaimShippingMethods =
            orderPreview.shipping_methods.filter(
              (item) =>
                !!item.actions?.find(
                  (action) =>
                    action.action === "SHIPPING_ADD" && !!action.return_id
                )
            )

          expect(updatedExchangeItems).toHaveLength(0)
          expect(updatedClaimShippingMethods).toHaveLength(0)
        })
      })

      describe("Exchange adjustments", () => {
        let appliedPromotion
        let promotionModule: IPromotionModuleService
        let orderModule: IOrderModuleService
        let remoteLink
        let orderWithPromotion
        let productForAdjustmentTest

        beforeEach(async () => {
          const container = getContainer()
          promotionModule = container.resolve(Modules.PROMOTION)
          orderModule = container.resolve(Modules.ORDER)
          remoteLink = container.resolve(ContainerRegistrationKeys.LINK)

          productForAdjustmentTest = (
            await api.post(
              "/admin/products",
              {
                title: "Product for adjustment test",
                status: ProductStatus.PUBLISHED,
                shipping_profile_id: shippingProfile.id,
                options: [{ title: "size", values: ["large", "small"] }],
                variants: [
                  {
                    title: "Test variant",
                    sku: "test-variant-adjustment",
                    manage_inventory: false,
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

          appliedPromotion = await promotionModule.createPromotions({
            code: "PROMOTION_APPLIED",
            type: PromotionType.STANDARD,
            status: PromotionStatus.ACTIVE,
            application_method: {
              type: "percentage",
              target_type: "order",
              allocation: "each",
              value: 10,
              max_quantity: 5,
              currency_code: "usd",
              target_rules: [],
            },
          })

          await remoteLink.create([
            {
              [Modules.SALES_CHANNEL]: {
                sales_channel_id: (
                  await api.get("/admin/sales-channels", adminHeaders)
                ).data.sales_channels[0].id,
              },
              [Modules.STOCK_LOCATION]: {
                stock_location_id: location.id,
              },
            },
          ])

          // @ts-ignore
          orderWithPromotion = await orderModule.createOrders({
            email: "foo@bar.com",
            region_id: (
              await api.get("/admin/regions", adminHeaders)
            ).data.regions[0].id,
            sales_channel_id: (
              await api.get("/admin/sales-channels", adminHeaders)
            ).data.sales_channels[0].id,
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

          await orderModule.createOrderLineItemTaxLines(orderWithPromotion.id, [
            {
              // @ts-ignore
              item_id: "item-1",
              code: "standard",
              rate: 10,
              description: "tax-1",
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
            [Modules.ORDER]: { order_id: orderWithPromotion.id },
            [Modules.PROMOTION]: { promotion_id: appliedPromotion.id },
          })
        })

        it("should update adjustments when adding an inbound and outbound item", async () => {
          // First item -> 10$ | 10% discount tax excl. | 10% tax
          // Second item -> 12$ | 10% discount tax excl. | 2% tax

          // fulfill item so it can be returned
          await api.post(
            `/admin/orders/${orderWithPromotion.id}/fulfillments`,
            {
              items: [
                {
                  id: orderWithPromotion.items[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          let result = await api.post(
            "/admin/exchanges",
            {
              order_id: orderWithPromotion.id,
              description: "Test",
            },
            adminHeaders
          )

          const exchangeId = result.data.exchange.id
          const orderId = result.data.exchange.order_id

          result = (await api.get(`/admin/orders/${orderId}`, adminHeaders))
            .data.order

          expect(result.original_total).toEqual(11) // $10 + 10% tax
          expect(result.total).toEqual(10 * 0.9 * 1.1) // ($10 - 10% discount) + 10% tax

          const orderChange = (
            await api.get(`/admin/orders/${orderId}/preview`, adminHeaders)
          ).data.order.order_change

          // opt in for carry over promotions
          await api.post(
            `/admin/order-changes/${orderChange.id}`,
            {
              carry_over_promotions: true,
            },
            adminHeaders
          )

          // Add outbound item with price $12, 10% discount and 10% tax
          result = (
            await api
              .post(
                `/admin/exchanges/${exchangeId}/outbound/items`,
                {
                  items: [
                    {
                      variant_id: productForAdjustmentTest.variants[0].id,
                      quantity: 1,
                    },
                  ],
                },
                adminHeaders
              )
              .catch((e) => console.log(e))
          ).data.order_preview

          expect(result.total).toEqual(20.916) // 10 * 0.9 * 1.1 + 12 * 0.9 * 1.02
          expect(result.original_total).toEqual(23.24) // 10 * 1.1 + 12 * 1.02

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

          let orderResult = (
            await api.get(`/admin/orders/${orderId}`, adminHeaders)
          ).data.order

          // confirm original order is not updated
          expect(orderResult.total).toEqual(9.9) //  initial item 10$ and 10% discount and 10% tax
          expect(orderResult.original_total).toEqual(11) // initial item 10$ + 10% tax

          const originalItemId = result.items[0].id

          // Request inbound item return
          result = (
            await api
              .post(
                `/admin/exchanges/${exchangeId}/inbound/items`,
                {
                  items: [
                    {
                      id: originalItemId,
                      reason_id: returnReason.id,
                      quantity: 1,
                    },
                  ],
                },
                adminHeaders
              )
              .catch((e) => console.log(e))
          ).data.order_preview

          const returnId = result.order_change.return_id

          await api.post(
            `/admin/exchanges/${exchangeId}/request`,
            {},
            adminHeaders
          )

          orderResult = (
            await api.get(`/admin/orders/${orderId}`, adminHeaders)
          ).data.order

          // after exchange request order contains both items and adjustments untill return is received
          expect(orderResult.total).toEqual(20.916) // 10 * 0.9 * 1.1 + 12 * 0.9 * 1.02
          expect(orderResult.original_total).toEqual(23.24) // 10 * 1.1 + 12 * 1.02

          await api.post(`/admin/returns/${returnId}/receive`, {}, adminHeaders)

          orderResult = (
            await api.get(`/admin/orders/${orderId}`, adminHeaders)
          ).data.order

          // still the same state while return receive process is pending
          expect(orderResult.total).toEqual(20.916) // 10 * 0.9 * 1.1 + 12 * 0.9 * 1.02
          expect(orderResult.original_total).toEqual(23.24) // 10 * 1.1 + 12 * 1.02

          await api.post(
            `/admin/returns/${returnId}/receive-items`,
            {
              items: [
                {
                  id: originalItemId,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          orderResult = (
            await api.get(`/admin/orders/${orderId}`, adminHeaders)
          ).data.order

          // still the same state while return receive process is pending
          expect(orderResult.total).toEqual(20.916) // 10 * 0.9 * 1.1 + 12 * 0.9 * 1.02
          expect(orderResult.original_total).toEqual(23.24) // 10 * 1.1 + 12 * 1.02

          await api.post(
            `/admin/returns/${returnId}/receive/confirm`,
            {},
            adminHeaders
          )

          const orderResult2 = (
            await api.get(`/admin/orders/${orderId}`, adminHeaders)
          ).data.order

          // after confirmation only first added item is active
          expect(orderResult2.total).toEqual(11.016)
          expect(orderResult2.original_total).toEqual(12.24)
        })

        it("should enable carry_over_promotions flag and apply promotions to outbound items (flag disabled before request)", async () => {
          // fulfill item so it can be returned
          await api.post(
            `/admin/orders/${orderWithPromotion.id}/fulfillments`,
            {
              items: [
                {
                  id: orderWithPromotion.items[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          let result = await api.post(
            "/admin/exchanges",
            {
              order_id: orderWithPromotion.id,
              description: "Test",
            },
            adminHeaders
          )

          const exchangeId = result.data.exchange.id

          // Query order change for the exchange
          const orderChange = (
            await api.get(
              `/admin/orders/${orderWithPromotion.id}/preview`,
              adminHeaders
            )
          ).data.order.order_change

          const orderChangeId = orderChange.id

          // return original item
          await api.post(
            `/admin/exchanges/${exchangeId}/inbound/items`,
            {
              items: [
                {
                  id: orderWithPromotion.items[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          // add outbound item
          await api.post(
            `/admin/exchanges/${exchangeId}/outbound/items`,
            {
              items: [
                {
                  variant_id: productForAdjustmentTest.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          // Initially, promotions should be disabled by default when adding outbound items
          let orderPreview = (
            await api.get(
              `/admin/orders/${orderWithPromotion.id}/preview`,
              adminHeaders
            )
          ).data.order

          expect(orderPreview.items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "item-1", // original item
                adjustments: [
                  expect.objectContaining({
                    amount: 1,
                  }),
                ],
              }),
              expect.objectContaining({
                variant_id: productForAdjustmentTest.variants[0].id,
                adjustments: [], // outbound item has no adjustments initially
              }),
            ])
          )

          // Enable carry_over_promotions
          await api.post(
            `/admin/order-changes/${orderChangeId}`,
            {
              carry_over_promotions: true,
            },
            adminHeaders
          )

          // Verify adjustments are added
          orderPreview = (
            await api.get(
              `/admin/orders/${orderWithPromotion.id}/preview`,
              adminHeaders
            )
          ).data.order

          expect(orderPreview.items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "item-1", // original item
                adjustments: [
                  expect.objectContaining({
                    amount: 1,
                  }),
                ],
              }),
              expect.objectContaining({
                variant_id: productForAdjustmentTest.variants[0].id,
                adjustments: [
                  // outbound item has adjustments after carry_over_promotions is enabled
                  expect.objectContaining({
                    amount: 1.2,
                  }),
                ],
              }),
            ])
          )

          // Disable carry_over_promotions
          await api.post(
            `/admin/order-changes/${orderChangeId}`,
            {
              carry_over_promotions: false,
            },
            adminHeaders
          )

          // Verify adjustments are removed again
          orderPreview = (
            await api.get(
              `/admin/orders/${orderWithPromotion.id}/preview`,
              adminHeaders
            )
          ).data.order

          expect(orderPreview.items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "item-1", // original item
                adjustments: [
                  expect.objectContaining({
                    amount: 1,
                  }),
                ],
              }),
              expect.objectContaining({
                variant_id: productForAdjustmentTest.variants[0].id,
                adjustments: [], // outbound item has no adjustments
              }),
            ])
          )

          await api.post(
            `/admin/exchanges/${exchangeId}/request`,
            {},
            adminHeaders
          )

          const finalOrder = (
            await api.get(
              `/admin/orders/${orderWithPromotion.id}`,
              adminHeaders
            )
          ).data.order

          // items adjustment state is equal to the last state of the order preview (flag disabled)
          expect(finalOrder.items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "item-1", // original item
                adjustments: [
                  expect.objectContaining({
                    amount: 1,
                  }),
                ],
              }),
              expect.objectContaining({
                variant_id: productForAdjustmentTest.variants[0].id,
                adjustments: [],
              }),
            ])
          )
        })

        it("should enable carry_over_promotions flag and apply promotions to outbound items (flag enabled before request)", async () => {
          // fulfill item so it can be returned
          await api.post(
            `/admin/orders/${orderWithPromotion.id}/fulfillments`,
            {
              items: [
                {
                  id: orderWithPromotion.items[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          const promotionModule = getContainer().resolve(Modules.PROMOTION)

          // check that adjustments are computed for promotions that exceeded usage limit (we ignore usage limits on edit flows)
          // @ts-ignore
          await promotionModule.updatePromotions({
            id: appliedPromotion.id,
            limit: 1,
            used: 1,
          })

          let result = await api.post(
            "/admin/exchanges",
            {
              order_id: orderWithPromotion.id,
              description: "Test",
            },
            adminHeaders
          )

          const exchangeId = result.data.exchange.id

          // Query order change for the exchange
          const orderChange = (
            await api.get(
              `/admin/orders/${orderWithPromotion.id}/preview`,
              adminHeaders
            )
          ).data.order.order_change

          const orderChangeId = orderChange.id

          // return original item
          await api.post(
            `/admin/exchanges/${exchangeId}/inbound/items`,
            {
              items: [
                {
                  id: orderWithPromotion.items[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          // add outbound item
          await api.post(
            `/admin/exchanges/${exchangeId}/outbound/items`,
            {
              items: [
                {
                  variant_id: productForAdjustmentTest.variants[0].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          let orderPreview = (
            await api.get(
              `/admin/orders/${orderWithPromotion.id}/preview`,
              adminHeaders
            )
          ).data.order

          expect(orderPreview.items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "item-1", // original item
                adjustments: [
                  expect.objectContaining({
                    amount: 1,
                  }),
                ],
              }),
              expect.objectContaining({
                variant_id: productForAdjustmentTest.variants[0].id,
                adjustments: [], // outbound item has no adjustments initially
              }),
            ])
          )

          // Enable carry_over_promotions
          await api.post(
            `/admin/order-changes/${orderChangeId}`,
            {
              carry_over_promotions: true,
            },
            adminHeaders
          )

          // Verify adjustments are added
          orderPreview = (
            await api.get(
              `/admin/orders/${orderWithPromotion.id}/preview`,
              adminHeaders
            )
          ).data.order

          expect(orderPreview.items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "item-1", // original item
                adjustments: [
                  expect.objectContaining({
                    amount: 1,
                  }),
                ],
              }),
              expect.objectContaining({
                variant_id: productForAdjustmentTest.variants[0].id,
                adjustments: [
                  // outbound item has adjustments after carry_over_promotions is enabled
                  expect.objectContaining({
                    amount: 1.2,
                  }),
                ],
              }),
            ])
          )

          await api.post(
            `/admin/exchanges/${exchangeId}/request`,
            {},
            adminHeaders
          )

          const finalOrder = (
            await api.get(
              `/admin/orders/${orderWithPromotion.id}`,
              adminHeaders
            )
          ).data.order

          // items adjustment state is equal to the last state of the order preview (flag enabled)
          expect(finalOrder.items).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: "item-1", // original item
                adjustments: [
                  expect.objectContaining({
                    amount: 1,
                  }),
                ],
              }),
              expect.objectContaining({
                variant_id: productForAdjustmentTest.variants[0].id,
                adjustments: [
                  expect.objectContaining({
                    amount: 1.2,
                  }),
                ],
              }),
            ])
          )
        })
      })
    })
  },
})
