import { ClaimType, Modules, RuleOperator } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order
    let shippingProfile
    let fulfillmentSet
    let location
    let item
    let returnShippingOption
    const shippingProviderId = "manual_test-provider"

    beforeEach(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(Modules.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)
      const seeders = await createOrderSeeder({ api, container })
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

      const outboundShippingOption = (
        await api.post(
          "/admin/shipping-options",
          outboundShippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option

      item = order.items[0]
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
              difference_sum: 0,
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
              difference_sum: 0,
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
                variant_id: order.items[0].variant_id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/claims/${singleOutboundClaim.id}/request`,
          {},
          adminHeaders
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // After confirming a claim with an outbound item, the tax totals are not updated
        // I suspect this will be the same for promotions and discount totals
        // Additionally, the items during claim don't have taxes included in them.
        // TODO: this needs to be fixed
        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 206,
            subtotal: 200,
            tax_total: 6,
            summary: expect.objectContaining({
              paid_total: 0,
              difference_sum: 100,
              refunded_total: 0,
              transaction_total: 0,
              pending_difference: 200,
              // TODO: I think the current_order_total and original_order_total should include taxes and adjustments as well
              current_order_total: 200,
              original_order_total: 100,
            }),
          })
        )

        let pendingPaymentCollection = orderResult.payment_collections.find(
          (pc) => pc.status === "not_paid"
        )

        expect(pendingPaymentCollection).toEqual(
          expect.objectContaining({
            status: "not_paid",
            // TODO: The payment should also include taxes
            amount: 200,
          })
        )

        let paymentCollection = (
          await api.post(
            `/admin/payment-collections/${pendingPaymentCollection.id}/mark-as-paid`,
            { order_id: order.id },
            adminHeaders
          )
        ).data.payment_collection

        // TODO: The payment, payment sessions and collection should also include taxes
        expect(paymentCollection).toEqual(
          expect.objectContaining({
            amount: 200,
            // Q: Shouldn't this be paid?
            status: "authorized",
            payment_sessions: [
              expect.objectContaining({
                status: "authorized",
                amount: 200,
              }),
            ],
            payments: [
              expect.objectContaining({
                provider_id: "pp_system_default",
                amount: 200,
              }),
            ],
          })
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // Totals summary after payment has been marked as paid
        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 206,
            subtotal: 200,
            tax_total: 6,
            summary: expect.objectContaining({
              // TODO: Paid total should include taxes
              paid_total: 200,
              // TODO: difference_sum should include taxes
              difference_sum: 100,
              refunded_total: 0,
              // TODO: difference_sum should include taxes
              transaction_total: 200,
              pending_difference: 0,
              // TODO: difference_sum should include taxes
              current_order_total: 200,
              // TODO: difference_sum should include taxes
              original_order_total: 100,
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
        // TODO: This shouldn't be a surprise during fulfillment
        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 206,
            subtotal: 200,
            tax_total: 6,
            summary: expect.objectContaining({
              paid_total: 200,
              difference_sum: 0,
              refunded_total: 0,
              transaction_total: 200,
              pending_difference: 6,
              current_order_total: 206,
              original_order_total: 206,
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
            total: 206,
            subtotal: 200,
            tax_total: 6,
            summary: expect.objectContaining({
              paid_total: 200,
              difference_sum: 0,
              refunded_total: 0,
              transaction_total: 200,
              pending_difference: 6,
              current_order_total: 206,
              original_order_total: 206,
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
            total: 321.9,
            subtotal: 315,
            tax_total: 6.9,
            summary: expect.objectContaining({
              paid_total: 200,
              difference_sum: 15,
              refunded_total: 0,
              transaction_total: 200,
              // TODO: what happened to the previous pending difference of 6
              pending_difference: 15,
              current_order_total: 215,
              original_order_total: 200,
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
            total: 321.9,
            subtotal: 315,
            tax_total: 6.9,
            summary: expect.objectContaining({
              paid_total: 200,
              difference_sum: 15,
              refunded_total: 0,
              transaction_total: 200,
              pending_difference: 15,
              current_order_total: 215,
              original_order_total: 200,
            }),
          })
        )

        inboundItem = orderResult.items[0]

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
            total: 421.9,
            subtotal: 415,
            tax_total: 6.9,
            summary: expect.objectContaining({
              paid_total: 200,
              difference_sum: 0,
              refunded_total: 0,
              transaction_total: 200,
              // TODO: Tax totals seems to be added after every claim confirmation as well
              pending_difference: 115.9,
              current_order_total: 315.9,
              original_order_total: 315.9,
            }),
          })
        )

        pendingPaymentCollection = orderResult.payment_collections.find(
          (pc) => pc.status === "not_paid"
        )

        expect(pendingPaymentCollection).toEqual(
          expect.objectContaining({
            status: "not_paid",
            // TODO: The payment should also include taxes
            amount: 115.9,
          })
        )

        paymentCollection = (
          await api.post(
            `/admin/payment-collections/${pendingPaymentCollection.id}/mark-as-paid`,
            { order_id: order.id },
            adminHeaders
          )
        ).data.payment_collection

        // TODO: The payment, payment sessions and collection should also include taxes
        expect(paymentCollection).toEqual(
          expect.objectContaining({
            amount: 115.9,
            // Q: Shouldn't this be paid?
            status: "authorized",
            payment_sessions: [
              expect.objectContaining({
                status: "authorized",
                amount: 115.9,
              }),
            ],
            payments: [
              expect.objectContaining({
                provider_id: "pp_system_default",
                amount: 115.9,
              }),
            ],
          })
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // Totals summary after payment has been marked as paid
        // TODO: There is a discrepancy between total and paid_total
        expect(orderResult).toEqual(
          expect.objectContaining({
            total: 421.9,
            subtotal: 415,
            tax_total: 6.9,
            summary: expect.objectContaining({
              paid_total: 315.9,
              difference_sum: 0,
              refunded_total: 0,
              transaction_total: 315.9,
              pending_difference: 0,
              current_order_total: 315.9,
              original_order_total: 315.9,
            }),
          })
        )
      })
    })
  },
})
