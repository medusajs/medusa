import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  ClaimReason,
  ClaimType,
  ContainerRegistrationKeys,
  Modules,
  RuleOperator,
} from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../modules/__tests__/fixtures"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let baseClaim
    let order, order2
    let returnShippingOption
    let outboundShippingOption
    let shippingProfile
    let fulfillmentSet
    let returnReason
    let inventoryItem
    let inventoryItemExtra
    let location
    let productExtra
    let item
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
                    amount: 50.25,
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
        transactions: [
          {
            amount: 61,
            currency_code: "usd",
          },
        ],
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
        await api.get(`/admin/inventory-items?sku=test-variant`, adminHeaders)
      ).data.inventory_items[0]

      await api.post(
        `/admin/inventory-items/${inventoryItem.id}/location-levels`,
        {
          location_id: location.id,
          stocked_quantity: 10,
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
          stocked_quantity: 10,
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
            amount: 15,
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

      returnShippingOption = (
        await api.post(
          "/admin/shipping-options",
          shippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option

      outboundShippingOption = (
        await api.post(
          "/admin/shipping-options",
          outboundShippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option

      item = order.items[0]

      await setupTaxStructure(container.resolve(Modules.TAX))
    })

    describe("Claims lifecycle", () => {
      let claimId

      describe("with accurate order summary", () => {
        it("should verify order summary at each level", async () => {
          /* Case:
            Purchased:
              items: {
                unit_price: 25,
                qty: 2
                tax_total: 0
                total: 50
              }
              shipping_methods: {
                unit_price: 10,
                qty: 1
                tax_total: 1
                total: 11
              }
          */
          const orderResult = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          expect(orderResult.summary).toEqual(
            expect.objectContaining({
              paid_total: 61,
              difference_sum: 0,
              refunded_total: 0,
              transaction_total: 61,
              pending_difference: 0,
              current_order_total: 61,
              original_order_total: 61,
            })
          )

          /* TODO: Check summary after each of these events in order
            - Add payment collection + payment + capture
            - Fulfill items
            - Submit inbound claim
            - Fulfill claim items
            - Make payment
            - Submit outbound claim
            - Make payment
            - Fulfill claim items
          */
        })
      })

      describe("with inbound and outbound items", () => {
        beforeEach(async () => {
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

          baseClaim = (
            await api.post(
              "/admin/claims",
              {
                order_id: order.id,
                type: ClaimType.REPLACE,
                description: "Base claim",
              },
              adminHeaders
            )
          ).data.claim

          let r2 = await api.post(
            "/admin/claims",
            {
              order_id: order2.id,
              type: ClaimType.REFUND,
            },
            adminHeaders
          )

          const claimId2 = r2.data.claim.id
          const item2 = order2.items[0]

          const {
            data: {
              order_preview: {
                items: [previewItem],
              },
            },
          } = await api.post(
            `/admin/claims/${claimId2}/inbound/items`,
            { items: [{ id: item2.id, quantity: 1 }] },
            adminHeaders
          )

          // Delete & recreate again to ensure it works for both delete and create
          await api.delete(
            `/admin/claims/${claimId2}/inbound/items/${previewItem.actions[0].id}`,
            adminHeaders
          )

          const {
            data: { return: returnData },
          } = await api.post(
            `/admin/claims/${claimId2}/inbound/items`,
            { items: [{ id: item2.id, quantity: 1 }] },
            adminHeaders
          )

          await api.post(
            `/admin/returns/${returnData.id}`,
            {
              location_id: location.id,
              no_notification: true,
            },
            adminHeaders
          )

          const {
            data: {
              order_preview: { shipping_methods: inboundShippingMethods },
            },
          } = await api.post(
            `/admin/claims/${claimId2}/inbound/shipping-method`,
            { shipping_option_id: returnShippingOption.id },
            adminHeaders
          )
          const inboundShippingMethod = inboundShippingMethods.find(
            (m) => m.shipping_option_id == returnShippingOption.id
          )

          // Delete & recreate again to ensure it works for both delete and create
          await api.delete(
            `/admin/claims/${claimId2}/inbound/shipping-method/${inboundShippingMethod.actions[0].id}`,
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claimId2}/inbound/shipping-method`,
            { shipping_option_id: returnShippingOption.id },
            adminHeaders
          )

          const testRes = await api.post(
            `/admin/claims/${claimId2}/request`,
            {},
            adminHeaders
          )

          claimId = baseClaim.id
          item = order.items[0]

          let result = await api.post(
            `/admin/claims/${claimId}/inbound/items`,
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
            `/admin/claims/${claimId}/inbound/shipping-method`,
            { shipping_option_id: returnShippingOption.id },
            adminHeaders
          )

          // shipping Options w/ custom price
          const {
            data: {
              order_preview: { shipping_methods: outboundShippingMethods },
            },
          } = await api.post(
            `/admin/claims/${claimId}/outbound/shipping-method`,
            {
              shipping_option_id: outboundShippingOption.id,
              custom_amount: 12.5,
            },
            adminHeaders
          )

          const outboundShippingMethod = outboundShippingMethods.find(
            (m) => m.shipping_option_id == outboundShippingOption.id
          )

          expect(outboundShippingMethod.subtotal).toBe(12.5)
          expect(outboundShippingMethod.is_custom_amount).toBe(true)

          // Reset shipping custom price
          const {
            data: {
              order_preview: { shipping_methods: outboundShippingMethods2 },
            },
          } = await api.post(
            `/admin/claims/${claimId}/outbound/shipping-method/${outboundShippingMethod.actions[0].id}`,
            {
              custom_amount: null,
            },
            adminHeaders
          )

          const outboundShippingMethodReset = outboundShippingMethods2.find(
            (m) => m.shipping_option_id == outboundShippingOption.id
          )

          expect(outboundShippingMethodReset.subtotal).toBe(20)
          expect(outboundShippingMethodReset.is_custom_amount).toBe(false)

          // Delete & recreate again to ensure it works for both delete and create
          await api.delete(
            `/admin/claims/${claimId}/outbound/shipping-method/${outboundShippingMethodReset.actions[0].id}`,
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claimId}/outbound/shipping-method`,
            { shipping_option_id: outboundShippingOption.id },
            adminHeaders
          )

          // updated the requested quantity
          const updateReturnItemActionId =
            result.data.order_preview.items[0].actions[0].id

          result = await api.post(
            `/admin/claims/${claimId}/inbound/items/${updateReturnItemActionId}`,
            {
              quantity: 1,
            },
            adminHeaders
          )

          // New Items
          await api.post(
            `/admin/claims/${claimId}/outbound/items`,
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

          // Claim Items
          await api.post(
            `/admin/claims/${claimId}/claim-items`,
            {
              items: [
                {
                  id: item.id,
                  reason: ClaimReason.PRODUCTION_FAILURE,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          result = await api.post(
            `/admin/claims/${claimId}/request`,
            {},
            adminHeaders
          )

          result = (
            await api.get(
              `/admin/claims?fields=*claim_items,*additional_items`,
              adminHeaders
            )
          ).data.claims

          expect(result).toHaveLength(2)
          expect(result[0].additional_items).toHaveLength(1)
          expect(result[0].claim_items).toHaveLength(1)
          expect(result[0].canceled_at).toBeNull()

          const reservationsResponse = (
            await api.get(
              `/admin/reservations?location_id[]=${location.id}`,
              adminHeaders
            )
          ).data

          expect(reservationsResponse.reservations).toHaveLength(1)
        })

        it("should complete flow with fulfilled items successfully", async () => {
          const fulfillOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          const paymentCollections = fulfillOrder.payment_collections

          expect(paymentCollections).toHaveLength(1)
          expect(paymentCollections[0]).toEqual(
            expect.objectContaining({
              status: "not_paid",
              amount: 109.5,
              currency_code: "usd",
            })
          )

          const fulfillableItem = fulfillOrder.items.find(
            (item) => item.detail.fulfilled_quantity === 0
          )

          await api.post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              location_id: location.id,
              items: [{ id: fulfillableItem.id, quantity: 1 }],
            },
            adminHeaders
          )
        })

        it("should go through cancel flow successfully", async () => {
          await api.post(`/admin/claims/${claimId}/cancel`, {}, adminHeaders)

          const [claim] = (
            await api.get(
              `/admin/claims?fields=*claim_items,*additional_items`,
              adminHeaders
            )
          ).data.claims

          expect(claim.canceled_at).toBeDefined()

          const reservationsResponseAfterCanceling = (
            await api.get(
              `/admin/reservations?location_id[]=${location.id}`,
              adminHeaders
            )
          ).data

          expect(reservationsResponseAfterCanceling.reservations).toHaveLength(
            0
          )
        })

        it("should create a payment collection successfully & mark as paid", async () => {
          const paymentDelta = 109.5
          const orderForPayment = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          const paymentCollections = orderForPayment.payment_collections

          expect(paymentCollections).toHaveLength(1)
          expect(paymentCollections[0]).toEqual(
            expect.objectContaining({
              status: "not_paid",
              amount: paymentDelta,
              currency_code: "usd",
            })
          )

          const createdPaymentCollection = (
            await api.post(
              `/admin/payment-collections`,
              { order_id: order.id, amount: 100 },
              adminHeaders
            )
          ).data.payment_collection

          expect(createdPaymentCollection).toEqual(
            expect.objectContaining({
              currency_code: "usd",
              amount: 100,
              status: "not_paid",
            })
          )

          const deleted = (
            await api.delete(
              `/admin/payment-collections/${createdPaymentCollection.id}`,
              adminHeaders
            )
          ).data

          expect(deleted).toEqual({
            id: createdPaymentCollection.id,
            object: "payment-collection",
            deleted: true,
          })

          const finalPaymentCollection = (
            await api.post(
              `/admin/payment-collections/${paymentCollections[0].id}/mark-as-paid`,
              { order_id: order.id },
              adminHeaders
            )
          ).data.payment_collection

          expect(finalPaymentCollection).toEqual(
            expect.objectContaining({
              currency_code: "usd",
              amount: paymentDelta,
              status: "authorized",
              authorized_amount: paymentDelta,
              captured_amount: paymentDelta,
              refunded_amount: 0,
            })
          )
        })
      })

      describe("with only outbound items", () => {
        let orderResult

        beforeEach(async () => {
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

          baseClaim = (
            await api.post(
              "/admin/claims",
              {
                order_id: order.id,
                type: ClaimType.REPLACE,
                description: "Base claim",
              },
              adminHeaders
            )
          ).data.claim

          claimId = baseClaim.id
          item = order.items[0]

          const {
            data: {
              order_preview: { shipping_methods: outboundShippingMethods },
            },
          } = await api.post(
            `/admin/claims/${claimId}/outbound/shipping-method`,
            { shipping_option_id: outboundShippingOption.id },
            adminHeaders
          )

          const outboundShippingMethod = outboundShippingMethods.find(
            (m) => m.shipping_option_id == outboundShippingOption.id
          )

          // Delete & recreate again to ensure it works for both delete and create
          await api.delete(
            `/admin/claims/${claimId}/outbound/shipping-method/${outboundShippingMethod.actions[0].id}`,
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claimId}/outbound/shipping-method`,
            { shipping_option_id: outboundShippingOption.id },
            adminHeaders
          )

          const { data } = await api.post(
            `/admin/claims/${claimId}/outbound/items`,
            {
              items: [
                {
                  variant_id: productExtra.variants[0].id,
                  quantity: 3,
                },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claimId}/claim-items`,
            {
              items: [
                {
                  id: item.id,
                  reason: ClaimReason.PRODUCTION_FAILURE,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
        })

        it("should complete flow with fulfilled items successfully", async () => {
          await api.post(`/admin/claims/${claimId}/request`, {}, adminHeaders)

          const claim = (
            await api.get(
              `/admin/claims/${claimId}?fields=*claim_items,*additional_items`,
              adminHeaders
            )
          ).data.claim

          expect(claim.additional_items).toHaveLength(1)
          expect(claim.claim_items).toHaveLength(1)
          expect(claim.canceled_at).toBeNull()

          const fulfillOrder = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          const fulfillableItem = fulfillOrder.items.filter(
            (item) => item.detail.fulfilled_quantity === 0
          )

          await api.post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              location_id: location.id,
              items: [{ id: fulfillableItem[0].id, quantity: 1 }],
            },
            adminHeaders
          )

          orderResult = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          expect(orderResult.fulfillment_status).toEqual("partially_fulfilled")

          await api.post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              location_id: location.id,
              items: [{ id: fulfillableItem[0].id, quantity: 2 }],
            },
            adminHeaders
          )

          orderResult = (
            await api.get(
              `/admin/orders/${order.id}?fields=*fulfillments,*fulfillments.items`,
              adminHeaders
            )
          ).data.order

          expect(orderResult.fulfillment_status).toEqual("fulfilled")

          await api.post(
            `admin/orders/${order.id}/fulfillments/${orderResult.fulfillments[0].id}/shipments`,
            {
              items: orderResult.fulfillments[0]?.items?.map((i) => ({
                id: i.line_item_id,
                quantity: i.quantity,
              })),
            },
            adminHeaders
          )

          orderResult = (
            await api.get(
              `/admin/orders/${order.id}?fields=*fulfillments,*fulfillments.items`,
              adminHeaders
            )
          ).data.order

          expect(orderResult.fulfillment_status).toEqual("partially_shipped")

          await api.post(
            `admin/orders/${order.id}/fulfillments/${orderResult.fulfillments[1].id}/shipments`,
            {
              items: orderResult.fulfillments[1]?.items?.map((i) => ({
                id: i.line_item_id,
                quantity: i.quantity,
              })),
            },
            adminHeaders
          )

          await api.post(
            `admin/orders/${order.id}/fulfillments/${orderResult.fulfillments[2].id}/shipments`,
            {
              items: orderResult.fulfillments[2]?.items?.map((i) => ({
                id: i.line_item_id,
                quantity: i.quantity,
              })),
            },
            adminHeaders
          )

          orderResult = (
            await api.get(
              `/admin/orders/${order.id}?fields=*fulfillments`,
              adminHeaders
            )
          ).data.order

          expect(orderResult.fulfillment_status).toEqual("shipped")
        })

        it("should remove outbound shipping method when outbound items are completely removed", async () => {
          orderResult = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const claimItems = orderResult.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "ITEM_ADD")
          )

          const claimShippingMethods = orderResult.shipping_methods.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "SHIPPING_ADD")
          )

          expect(claimItems).toHaveLength(1)
          expect(claimShippingMethods).toHaveLength(1)

          await api.delete(
            `/admin/claims/${claimId}/outbound/items/${claimItems[0].actions[0].id}`,
            adminHeaders
          )

          orderResult = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const updatedClaimItems = orderResult.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "ITEM_ADD")
          )

          const updatedClaimShippingMethods =
            orderResult.shipping_methods.filter(
              (item) =>
                !!item.actions?.find(
                  (action) => action.action === "SHIPPING_ADD"
                )
            )

          expect(updatedClaimItems).toHaveLength(0)
          expect(updatedClaimShippingMethods).toHaveLength(0)
        })
      })

      describe("with only inbound items", () => {
        let orderResult

        beforeEach(async () => {
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

          baseClaim = (
            await api.post(
              "/admin/claims",
              {
                order_id: order.id,
                type: ClaimType.REPLACE,
                description: "Base claim",
              },
              adminHeaders
            )
          ).data.claim

          claimId = baseClaim.id
          item = order.items[0]

          await api.post(
            `/admin/claims/${claimId}/inbound/items`,
            {
              items: [
                {
                  id: item.id,
                  reason_id: returnReason.id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          await api.post(
            `/admin/claims/${claimId}/inbound/shipping-method`,
            { shipping_option_id: returnShippingOption.id },
            adminHeaders
          )
        })

        it("test inbound only", async () => {
          // Claim Items
          await api.post(
            `/admin/claims/${claimId}/claim-items`,
            {
              items: [
                {
                  id: item.id,
                  reason: ClaimReason.PRODUCTION_FAILURE,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )

          await api.post(`/admin/claims/${claimId}/request`, {}, adminHeaders)

          const claims = (
            await api.get(
              `/admin/claims?fields=*claim_items,*additional_items`,
              adminHeaders
            )
          ).data.claims

          expect(claims).toHaveLength(1)
          expect(claims[0].additional_items).toHaveLength(0)
          expect(claims[0].claim_items).toHaveLength(1)
          expect(claims[0].canceled_at).toBeNull()

          const orderCheck = (
            await api.get(`/admin/orders/${order.id}`, adminHeaders)
          ).data.order

          expect(orderCheck.summary).toEqual(
            expect.objectContaining({
              pending_difference: -11,
              current_order_total: 50,
              original_order_total: 60,
            })
          )

          expect(true).toBe(true)
        })

        it("should remove inbound shipping method when inbound items are completely removed", async () => {
          orderResult = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const returnItems = orderResult.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "RETURN_ITEM")
          )
          const returnShippingMethods = orderResult.shipping_methods.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "SHIPPING_ADD")
          )

          expect(returnItems).toHaveLength(1)
          expect(returnShippingMethods).toHaveLength(1)

          await api.delete(
            `/admin/claims/${claimId}/inbound/items/${returnItems[0].actions[0].id}`,
            adminHeaders
          )

          orderResult = (
            await api.get(`/admin/orders/${order.id}/preview`, adminHeaders)
          ).data.order

          const updatedReturnItems = orderResult.items.filter(
            (item) =>
              !!item.actions?.find((action) => action.action === "RETURN_ITEM")
          )

          const updatedReturnShippingMethods =
            orderResult.shipping_methods.filter(
              (item) =>
                !!item.actions?.find(
                  (action) => action.action === "SHIPPING_ADD"
                )
            )

          expect(updatedReturnItems).toHaveLength(0)
          expect(updatedReturnShippingMethods).toHaveLength(0)
        })
      })
    })

    describe("GET /admin/claims/:id", () => {
      beforeEach(async () => {
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

        baseClaim = (
          await api.post(
            "/admin/claims",
            {
              order_id: order.id,
              type: ClaimType.REPLACE,
              description: "Base claim",
            },
            adminHeaders
          )
        ).data.claim

        expect(baseClaim.created_by).toEqual(expect.any(String))

        await api.post(
          `/admin/claims/${baseClaim.id}/inbound/items`,
          {
            items: [
              {
                id: item.id,
                reason_id: returnReason.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )
        await api.post(
          `/admin/claims/${baseClaim.id}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )
        // Claim Items
        await api.post(
          `/admin/claims/${baseClaim.id}/claim-items`,
          {
            items: [
              {
                id: item.id,
                reason: ClaimReason.PRODUCTION_FAILURE,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        const { response } = await api.post(
          `/admin/claims/${baseClaim.id}/request`,
          {},
          adminHeaders
        )
      })

      it("should get an existing claim for given id", async () => {
        let res = await api.get(`/admin/claims/${baseClaim.id}`, adminHeaders)
        expect(res.status).toEqual(200)
        expect(res.data.claim.id).toEqual(baseClaim.id)

        let errorRes = await api
          .get(`/admin/claims/invalid-claim-id`, adminHeaders)
          .catch((e) => e)
        expect(errorRes.response.status).toEqual(404)
        expect(errorRes.response.data.message).toEqual(
          "Claim with id: invalid-claim-id was not found"
        )
      })

      it("should get an existing claim for given id", async () => {
        let res = await api.get(`/admin/claims/${baseClaim.id}`, adminHeaders)
        const keysInResponse = Object.keys(res.data.claim)

        expect(res.status).toEqual(200)
        expect(keysInResponse).toEqual(
          expect.arrayContaining([
            "id",
            "created_at",
            "updated_at",
            "canceled_at",
            "type",
            "order_id",
            "return_id",
            "display_id",
            "order_version",
            "refund_amount",
            "additional_items",
            "claim_items",
          ])
        )
      })

      it("should get claim with claim items", async () => {
        let res = await api.get(
          `/admin/claims/${baseClaim.id}?fields=id,*claim_items`,
          adminHeaders
        )
        expect(res.status).toEqual(200)
        expect(res.data.claim.id).toEqual(baseClaim.id)
        expect(res.data.claim.claim_items).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              item_id: item.id,
              reason: ClaimReason.PRODUCTION_FAILURE,
            }),
          ])
        )
        // additional items is one of the props that should be undefined
        expect(res.data.claim.additional_items).toBeUndefined()

        const resLineItems = await api.get(
          `/admin/orders/${order.id}/line-items`,
          adminHeaders
        )

        expect(resLineItems.data).toEqual(
          expect.objectContaining({
            order_items: [
              expect.objectContaining({
                order_id: order.id,
                item_id: item.id,
                version: 3,
                item: expect.objectContaining({
                  title: "Custom Item 2",
                  unit_price: 25,
                }),
                history: {
                  version: {
                    from: 1,
                    to: 3,
                  },
                },
              }),
            ],
          })
        )
      })
    })
  },
})
