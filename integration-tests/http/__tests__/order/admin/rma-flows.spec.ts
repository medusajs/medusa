import {
  ClaimType,
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  RuleOperator,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order
    let shippingProfile
    let fulfillmentSet
    let returnReason
    let returnShippingOption
    let outboundShippingOption
    let inventoryItem
    let inventoryItemExtra
    let location
    let product
    let productExtra
    let item
    const shippingProviderId = "manual_test-provider"

    beforeEach(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
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

      product = (
        await api.post(
          "/admin/products",
          {
            title: "Test product",
            variants: [
              {
                title: "Test variant",
                sku: "test-variant",
                prices: [
                  {
                    currency_code: "usd",
                    amount: 15,
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
            variants: [
              {
                title: "my variant",
                sku: "variant-sku",
                prices: [
                  {
                    currency_code: "usd",
                    amount: 35,
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

      const orderModule = container.resolve(ModuleRegistrationName.ORDER)

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
    })

    describe("RMA Flows", () => {
      it.only("should verify order summary at each level", async () => {
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

        await api.post(
          `/admin/claims/${singleOutboundClaim.id}/outbound/items`,
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
          `/admin/claims/${singleOutboundClaim.id}/request`,
          {},
          adminHeaders
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // Totals summary after all
        expect(orderResult.summary).toEqual(
          expect.objectContaining({
            paid_total: 61,
            difference_sum: 70,
            refunded_total: 0,
            transaction_total: 61,
            pending_difference: 70,
            current_order_total: 131,
            original_order_total: 61,
          })
        )

        let pendingPaymentCollection = orderResult.payment_collections.find(
          (pc) => pc.status === "not_paid"
        )

        expect(pendingPaymentCollection).toEqual(
          expect.objectContaining({
            status: "not_paid",
            amount: 70,
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
            amount: 70,
            // Q: Shouldn't this be paid?
            status: "authorized",
            payment_sessions: [
              expect.objectContaining({
                status: "authorized",
                amount: 70,
              }),
            ],
            payments: [
              expect.objectContaining({
                provider_id: "pp_system_default",
                amount: 70,
              }),
            ],
          })
        )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // Totals summary after payment has been marked as paid
        expect(orderResult.summary).toEqual(
          expect.objectContaining({
            paid_total: 131,
            difference_sum: 70,
            refunded_total: 0,
            transaction_total: 131,
            pending_difference: 0,
            current_order_total: 131,
            original_order_total: 61,
          })
        )

        /*
            Arbitrarily refund an amount back to the customer
          */

        // TODO: Potentially create a new endpoint on the order that
        // 1. creates a new payment collection
        // 2. marks payment collection as paid to balance the order for rogue refunds
        // await api.post(
        //   `/admin/payments/${paymentCollection.payments[0].id}/refund`,
        //   {
        //     amount: 10,
        //     note: "Do not like it",
        //   },
        //   adminHeaders
        // )

        // // Note: Now the order is out of balance due to the rogue refund that happened for Y reason.
        // // The CX now needs to mark this as paid to balance the order
        // await api.post(
        //   `/admin/payment-collections/${paymentCollection.id}/mark-as-paid`,
        //   { order_id: order.id },
        //   adminHeaders
        // )

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        // Totals summary after payment has been marked as paid
        expect(orderResult.summary).toEqual(
          expect.objectContaining({
            paid_total: 131,
            difference_sum: 70,
            refunded_total: 0,
            transaction_total: 131,
            // Q: Should the pending difference be changed here? Its been refunded, so nothing is pending per-ce
            pending_difference: 0,
            current_order_total: 131,
            original_order_total: 61,
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
        console.log("orderResult -- ", orderResult)
        // Totals summary after fulfillment is done
        expect(orderResult.summary).toEqual(
          expect.objectContaining({
            paid_total: 131,
            difference_sum: 0,
            refunded_total: 0,
            transaction_total: 131,
            pending_difference: 0,
            current_order_total: 131,
            // Note: When all items are fulfilled, the original_order_total goes to the new total
            original_order_total: 131,
          })
        )

        // /*
        //     We can see that fulfillment affects the totals, so lets create and confirm 2 claims
        //     and fulfill after
        //   */

        // let claimWithInboundAndOutbound = (
        //   await api.post(
        //     "/admin/claims",
        //     {
        //       order_id: order.id,
        //       type: ClaimType.REPLACE,
        //       description: "Base claim",
        //     },
        //     adminHeaders
        //   )
        // ).data.claim

        // orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
        //   .data.order

        // // Nothing changes from the previous expectation
        // expect(orderResult.summary).toEqual(
        //   expect.objectContaining({
        //     paid_total: 131,
        //     difference_sum: 0,
        //     refunded_total: 10,
        //     transaction_total: 121,
        //     pending_difference: 10,
        //     current_order_total: 131,
        //     original_order_total: 131,
        //   })
        // )

        // let inboundItem = orderResult.items[0]

        // await api.post(
        //   `/admin/claims/${claimWithInboundAndOutbound.id}/inbound/items`,
        //   { items: [{ id: inboundItem.id, quantity: 1 }] },
        //   adminHeaders
        // )

        // await api.post(
        //   `/admin/claims/${claimWithInboundAndOutbound.id}/outbound/items`,
        //   {
        //     items: [
        //       {
        //         variant_id: product.variants[0].id,
        //         quantity: 1,
        //       },
        //     ],
        //   },
        //   adminHeaders
        // )

        // await api.post(
        //   `/admin/claims/${claimWithInboundAndOutbound.id}/request`,
        //   {},
        //   adminHeaders
        // )

        // orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
        //   .data.order

        // // Totals summary after all
        // expect(orderResult.summary).toEqual(
        //   expect.objectContaining({
        //     paid_total: 131,
        //     difference_sum: -20,
        //     refunded_total: 10,
        //     transaction_total: 121,
        //     // TODO: This looks wrong
        //     pending_difference: -10,
        //     current_order_total: 111,
        //     original_order_total: 131,
        //   })
        // )

        // // Lets create one more claim without fulfilling the previous one
        // claimWithInboundAndOutbound = (
        //   await api.post(
        //     "/admin/claims",
        //     {
        //       order_id: order.id,
        //       type: ClaimType.REPLACE,
        //       description: "Base claim",
        //     },
        //     adminHeaders
        //   )
        // ).data.claim

        // orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
        //   .data.order

        // // Nothing changes from the previous expectation
        // expect(orderResult.summary).toEqual(
        //   expect.objectContaining({
        //     paid_total: 131,
        //     difference_sum: -20,
        //     refunded_total: 10,
        //     transaction_total: 121,
        //     pending_difference: -10,
        //     current_order_total: 111,
        //     original_order_total: 131,
        //   })
        // )

        // inboundItem = orderResult.items[0]

        // await api.post(
        //   `/admin/claims/${claimWithInboundAndOutbound.id}/inbound/items`,
        //   { items: [{ id: inboundItem.id, quantity: 1 }] },
        //   adminHeaders
        // )

        // await api.post(
        //   `/admin/claims/${claimWithInboundAndOutbound.id}/outbound/items`,
        //   {
        //     items: [
        //       {
        //         variant_id: product.variants[0].id,
        //         quantity: 1,
        //       },
        //     ],
        //   },
        //   adminHeaders
        // )

        // await api.post(
        //   `/admin/claims/${claimWithInboundAndOutbound.id}/request`,
        //   {},
        //   adminHeaders
        // )

        // orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
        //   .data.order

        // expect(orderResult.summary).toEqual(
        //   expect.objectContaining({
        //     paid_total: 131,
        //     // TODO: This looks wrong
        //     difference_sum: -10,
        //     refunded_total: 10,
        //     transaction_total: 121,
        //     // TODO: This looks wrong
        //     pending_difference: 15,
        //     // TODO: This looks wrong
        //     current_order_total: 136,
        //     // TODO: This looks wrong
        //     original_order_total: 146
        //   })
        // )

        // TODO: can't continue due to the irregularities above
        // After this fulfill one item
        // check totals
        // Receive item
        // check totals
        // Fulfill the other item
        // check totals
        // receive other item
        // check totals
        // Submit refund
        // check total
      })
    })
  },
})
