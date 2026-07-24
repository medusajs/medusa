import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ClaimType, Modules, RuleOperator } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let order
    let shippingProfile
    let fulfillmentSet
    let location
    let item
    let returnShippingOption
    let outboundShippingOption
    const shippingProviderId = "manual_test-provider"

    beforeAll(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(Modules.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)

      const inventoryItemOverride = (
        await api.post(
          `/admin/inventory-items`,
          { sku: "test-variant", requires_shipping: false },
          adminHeaders
        )
      ).data.inventory_item

      const seeders = await createOrderSeeder({
        api,
        container,
        inventoryItemOverride,
        withoutShipping: true,
      })
      order = seeders.order

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "Test", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      location = (
        await api.post(
          `/admin/stock-locations`,
          { name: "Test location" },
          adminHeaders
        )
      ).data.stock_location

      location = (
        await api.post(
          `/admin/stock-locations/${location.id}/fulfillment-sets?fields=*fulfillment_sets`,
          { name: "Test", type: "test-type" },
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

      const inventoryItem = (
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

      await api.post(
        `/admin/stock-locations/${location.id}/fulfillment-providers`,
        { add: [shippingProviderId] },
        adminHeaders
      )

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
            amount: 0, // Free shipping
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

      await dbUtils.snapshot()
    })

    describe("RMA Flows", () => {
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

        // Fulfill any existing items
        let orderResult = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        let fulfillableItem = orderResult.items.find(
          (item) => item.detail.fulfilled_quantity < item.detail.quantity
        )

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            location_id: location.id,
            items: [
              {
                id: fulfillableItem.id,
                quantity: item.detail.quantity - item.detail.fulfilled_quantity,
              },
            ],
          },
          adminHeaders
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        fulfillableItem = orderResult.items.find(
          (item) => item.detail.fulfilled_quantity < item.detail.quantity
        )

        // Ensure that there are no more fulfillable items
        expect(fulfillableItem).toBeUndefined()

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 106,
            subtotal: 100,
            tax_total: 6,
            summary: expect.objectContaining({
              paid_total: 0,
              refunded_total: 0,
              transaction_total: 0,
              pending_difference: 106,
              current_order_total: 106,
              original_order_total: 106,
            }),
          })
        )

        /*
          Create a claim with a single outbound item
        */
        const singleOutboundClaim = (
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

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 106,
            subtotal: 100,
            tax_total: 6,
            summary: expect.objectContaining({
              paid_total: 0,
              refunded_total: 0,
              transaction_total: 0,
              pending_difference: 106,
              current_order_total: 106,
              original_order_total: 106,
            }),
          })
        )

        await api.post(
          `/admin/claims/${singleOutboundClaim.id}/outbound/items`,
          {
            items: [
              {
                title: "new ITEM",
                variant_id: order.items[0].variant_id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        // If claim has outbound items, we need to set the outbound shipping method for reservation to be created
        // TODO: change condition in confirm workfow to crate reservation depending on shipping since we can have
        // reservations for inventory items that don't require shipping
        await api.post(
          `/admin/claims/${singleOutboundClaim.id}/outbound/shipping-method`,
          { shipping_option_id: outboundShippingOption.id },
          adminHeaders
        )

        await api.post(
          `/admin/claims/${singleOutboundClaim.id}/request`,
          {},
          adminHeaders
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 212,
            subtotal: 200,
            tax_total: 12,
            summary: expect.objectContaining({
              paid_total: 0,
              refunded_total: 0,
              transaction_total: 0,
              pending_difference: 212,
              current_order_total: 212,
              original_order_total: 106,
            }),
          })
        )

        let pendingPaymentCollection = orderResult.payment_collections.find(
          (pc) => pc.status === "not_paid"
        )

        expect(pendingPaymentCollection).toEqual(
          expect.objectContaining({
            status: "not_paid",
            amount: 212,
          })
        )

        let paymentCollection = (
          await api.post(
            `/admin/payment-collections/${pendingPaymentCollection.id}/mark-as-paid`,
            { order_id: order.id },
            adminHeaders
          )
        ).data.payment_collection

        expect(paymentCollection).toEqual(
          expect.objectContaining({
            amount: 212,
            status: "completed",
            payment_sessions: [
              expect.objectContaining({
                status: "authorized",
                amount: 212,
              }),
            ],
            payments: [
              expect.objectContaining({
                provider_id: "pp_system_default",
                amount: 212,
              }),
            ],
          })
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // Totals summarked as paidy after payment has been mar
        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 212,
            subtotal: 200,
            tax_total: 12,
            summary: expect.objectContaining({
              paid_total: 212,
              refunded_total: 0,
              transaction_total: 212,
              pending_difference: 0,
              current_order_total: 212,
              original_order_total: 106,
            }),
          })
        )

        fulfillableItem = orderResult.items.find(
          (item) => item.detail.fulfilled_quantity < item.detail.quantity
        )

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            location_id: location.id,
            items: [
              {
                id: fulfillableItem.id,
                quantity: item.detail.quantity - item.detail.fulfilled_quantity,
              },
            ],
          },
          adminHeaders
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        fulfillableItem = orderResult.items.find(
          (item) => item.detail.fulfilled_quantity < item.detail.quantity
        )

        // Ensure that there are no more fulfillable items
        expect(fulfillableItem).toBeUndefined()

        // After fulfillment, the taxes seems to now be considered.
        // The case now is that you need to now request additional payment from
        // the customer
        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 212,
            subtotal: 200,
            tax_total: 12,
            summary: expect.objectContaining({
              paid_total: 212,
              refunded_total: 0,
              transaction_total: 212,
              pending_difference: 0,
              current_order_total: 212,
              original_order_total: 212,
            }),
          })
        )

        /*
            We can see that fulfillment affects the totals, so lets create and confirm 2 claims
            and fulfill after
          */

        let claimWithInboundAndOutbound = (
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

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // Nothing changes from the previous expectation
        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 212,
            subtotal: 200,
            tax_total: 12,
            summary: expect.objectContaining({
              paid_total: 212,
              refunded_total: 0,
              transaction_total: 212,
              pending_difference: 0,
              current_order_total: 212,
              original_order_total: 212,
            }),
          })
        )

        let inboundItem = orderResult.items[0]

        await api.post(
          `/admin/claims/${claimWithInboundAndOutbound.id}/inbound/items`,
          { items: [{ id: inboundItem.id, quantity: 1 }] },
          adminHeaders
        )

        await api.post(
          `/admin/claims/${claimWithInboundAndOutbound.id}/inbound/shipping-method`,
          { shipping_option_id: returnShippingOption.id },
          adminHeaders
        )

        await api.post(
          `/admin/claims/${claimWithInboundAndOutbound.id}/outbound/items`,
          {
            items: [
              {
                title: "Test item 2",
                variant_id: order.items[0].variant_id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/claims/${claimWithInboundAndOutbound.id}/request`,
          {},
          adminHeaders
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // Totals summary after all
        expect(orderResult).toEqual(
          expect.objectContaining({
            // This now adds a shipping_tax_total, but the item_tax_total hasn't been updated
            total: 333.9,
            subtotal: 315,
            tax_total: 18.9,
            summary: expect.objectContaining({
              paid_total: 212,
              refunded_total: 0,
              transaction_total: 212,
              pending_difference: 15.9,
              current_order_total: 333.9,
              original_order_total: 212,
            }),
          })
        )

        // Lets create one more claim without fulfilling the previous one
        claimWithInboundAndOutbound = (
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

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // Nothing changes from the previous expectation
        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 333.9,
            subtotal: 315,
            tax_total: 18.9,
            summary: expect.objectContaining({
              paid_total: 212,
              refunded_total: 0,
              transaction_total: 212,
              pending_difference: 15.9,
              current_order_total: 333.9,
              original_order_total: 212,
            }),
          })
        )

        inboundItem = orderResult.items[1]

        await api.post(
          `/admin/claims/${claimWithInboundAndOutbound.id}/inbound/items`,
          { items: [{ id: inboundItem.id, quantity: 1 }] },
          adminHeaders
        )

        await api.post(
          `/admin/claims/${claimWithInboundAndOutbound.id}/outbound/items`,
          {
            items: [
              {
                variant_id: order.items[0].variant_id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/claims/${claimWithInboundAndOutbound.id}/request`,
          {},
          adminHeaders
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 439.9,
            subtotal: 415,
            tax_total: 24.9,
            summary: expect.objectContaining({
              paid_total: 212,
              refunded_total: 0,
              transaction_total: 212,
              pending_difference: 15.9,
              current_order_total: 439.9,
              original_order_total: 333.9,
            }),
          })
        )

        pendingPaymentCollection = orderResult.payment_collections.find(
          (pc) => pc.status === "not_paid"
        )

        expect(pendingPaymentCollection).toEqual(
          expect.objectContaining({
            status: "not_paid",
            amount: 15.9,
          })
        )

        paymentCollection = (
          await api.post(
            `/admin/payment-collections/${pendingPaymentCollection.id}/mark-as-paid`,
            { order_id: order.id },
            adminHeaders
          )
        ).data.payment_collection

        expect(paymentCollection).toEqual(
          expect.objectContaining({
            amount: 15.9,
            status: "completed",
            payment_sessions: [
              expect.objectContaining({
                status: "authorized",
                amount: 15.9,
              }),
            ],
            payments: [
              expect.objectContaining({
                provider_id: "pp_system_default",
                amount: 15.9,
              }),
            ],
          })
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // Totals summary after payment has been marked as paid
        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 439.9,
            subtotal: 415,
            tax_total: 24.9,
            summary: expect.objectContaining({
              paid_total: 227.9,
              refunded_total: 0,
              transaction_total: 227.9,
              pending_difference: 0,
              current_order_total: 439.9,
              original_order_total: 333.9,
            }),
          })
        )
      })
    })
  },
})
