import {
  ClaimReason,
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
} from "../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order, order2
    let returnShippingOption
    let shippingProfile
    let fulfillmentSet
    let returnReason
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
            variants: [
              {
                title: "Test variant",
                sku: "test-variant",
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
            variants: [
              {
                title: "my variant",
                sku: "variant-sku",
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
    })

    describe("Returns lifecycle", () => {
      it.only("Full flow with 2 orders", async () => {
        let result = await api.post(
          "/admin/claims",
          {
            order_id: order.id,
            type: ClaimType.REPLACE,
            description: "Test",
          },
          adminHeaders
        )

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

        await api.post(
          `/admin/claims/${claimId2}/inbound/items`,
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
          `/admin/claims/${claimId2}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )
        await api.post(`/admin/claims/${claimId2}/request`, {}, adminHeaders)

        const claimId = result.data.claim.id

        const item = order.items[0]

        result = await api.post(
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
          {
            shipping_option_id: returnShippingOption.id,
          },
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

        console.log(JSON.stringify(result, null, 2))
      })

      // Simple lifecyle:
      // 1. Initiate return
      // 2. Request to claim items
      // 3. Add claim shipping
      // 4. Confirm return
      it("should initiate a claim", async () => {
        let result = await api.post(
          "/admin/claims",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const claimId = result.data.claim.id

        expect(result.data.claim).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            order_id: order.id,
            status: "requested",
          })
        )

        expect(result.data.order.order_change).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            claim_id: claimId,
            change_type: "return",
            description: "Test",
            status: "pending",
            order_id: order.id,
          })
        )

        const item = order.items[0]

        result = await api.post(
          `/admin/claims/${claimId}/inbound/items`,
          {
            items: [
              {
                id: item.id,
                quantity: 2,
                reason_id: returnReason.id,
              },
            ],
          },
          adminHeaders
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "Custom Item 2",
                unit_price: 25,
                quantity: 2,
                subtotal: 50,
                total: 50,
                fulfilled_total: 50,
                return_requested_total: 50,
                detail: expect.objectContaining({
                  quantity: 2,
                  return_requested_quantity: 2,
                }),
              }),
            ]),
          })
        )

        // Remove item claim requesta
        const returnItemActionId =
          result.data.order_preview.items[0].actions[0].id
        result = await api.delete(
          `/admin/claims/${claimId}/inbound/items/${returnItemActionId}`,
          adminHeaders
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                detail: expect.objectContaining({
                  return_requested_quantity: 0,
                }),
              }),
            ]),
          })
        )

        // Add item claim request again
        result = await api.post(
          `/admin/claims/${claimId}/inbound/items`,
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

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                detail: expect.objectContaining({
                  return_requested_quantity: 1,
                }),
              }),
            ]),
          })
        )

        // updated the requested quantitty
        const updateReturnItemActionId =
          result.data.order_preview.items[0].actions[0].id

        result = await api.post(
          `/admin/claims/${claimId}/inbound/items/${updateReturnItemActionId}`,
          {
            quantity: 2,
            internal_note: "Test internal note",
            reason_id: returnReason.id,
          },
          adminHeaders
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                detail: expect.objectContaining({
                  quantity: 2,
                  return_requested_quantity: 2,
                }),
              }),
            ]),
          })
        )

        result = await api.post(
          `/admin/claims/${claimId}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "Custom Item 2",
                unit_price: 25,
                quantity: 2,
                subtotal: 50,
                total: 50,
                fulfilled_total: 50,
                return_requested_total: 50,
                actions: expect.arrayContaining([
                  expect.objectContaining({
                    details: expect.objectContaining({
                      quantity: 2,
                    }),
                    internal_note: "Test internal note",
                  }),
                ]),
              }),
            ]),
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: "Return shipping",
                amount: 1000,
                subtotal: 1000,
                total: 1000,
              }),
            ]),
          })
        )

        let orderPreview = await api.get(
          `/admin/orders/${order.id}/preview`,
          adminHeaders
        )

        expect(orderPreview.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "Custom Item 2",
                unit_price: 25,
                quantity: 2,
                subtotal: 50,
                total: 50,
                fulfilled_total: 50,
                return_requested_total: 50,
              }),
            ]),
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: "Return shipping",
                amount: 1000,
                subtotal: 1000,
                total: 1000,
              }),
            ]),
          })
        )

        expect(result.data.order_preview.shipping_methods).toHaveLength(2)

        // remove shipping method
        const shippingActionId =
          result.data.order_preview.shipping_methods[1].actions[0].id
        result = await api.delete(
          `/admin/claims/${claimId}/inbound/shipping-method/${shippingActionId}`,
          adminHeaders
        )

        expect(result.data.order_preview.shipping_methods).toHaveLength(1)

        // recreate shipping
        result = await api.post(
          `/admin/claims/${claimId}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        // updates the shipping method price
        const updateShippingActionId =
          result.data.order_preview.shipping_methods[1].actions[0].id
        result = await api.post(
          `/admin/claims/${claimId}/inbound/shipping-method/${updateShippingActionId}`,
          {
            custom_price: 1002,
            internal_note: "cx agent note",
          },
          adminHeaders
        )

        expect(result.data.order_preview.shipping_methods).toHaveLength(2)
        expect(result.data.order_preview.shipping_methods[1]).toEqual(
          expect.objectContaining({
            id: expect.any(String),
            name: "Return shipping",
            amount: 1002,
            subtotal: 1002,
            total: 1002,
            actions: [
              expect.objectContaining({
                internal_note: "cx agent note",
              }),
            ],
          })
        )

        result = await api.post(
          `/admin/claims/${claimId}/request`,
          {},
          adminHeaders
        )

        expect(result.data.claim).toEqual(
          expect.objectContaining({
            items: [
              expect.objectContaining({
                reason: expect.objectContaining({
                  id: returnReason.id,
                  value: "return-reason-test",
                  label: "Test claim reason",
                  description: "This is the reason description!!!",
                }),
              }),
            ],
          })
        )

        expect(result.data.order_preview).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "Custom Item 2",
                unit_price: 25,
                quantity: 2,
                subtotal: 50,
                total: 50,
                fulfilled_total: 50,
                return_requested_total: 50,
              }),
            ]),
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: "Return shipping",
                amount: 1002,
                subtotal: 1002,
                total: 1002,
              }),
            ]),
          })
        )

        // The order preview endpoint should still claim the order in case the change has been completed
        orderPreview = await api.get(
          `/admin/orders/${order.id}/preview`,
          adminHeaders
        )

        expect(orderPreview.data.order).toEqual(
          expect.objectContaining({
            id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                title: "Custom Item 2",
                unit_price: 25,
                quantity: 2,
                subtotal: 50,
                total: 50,
                fulfilled_total: 50,
                return_requested_total: 50,
              }),
            ]),
            shipping_methods: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                name: "Return shipping",
                amount: 1002,
                subtotal: 1002,
                total: 1002,
              }),
            ]),
          })
        )
      })

      it("should cancel a claim request", async () => {
        let result = await api.post(
          "/admin/claims",
          {
            order_id: order.id,
            description: "Test",
          },
          adminHeaders
        )

        const claimId = result.data.claim.id

        const item = order.items[0]
        await api.post(
          `/admin/claims/${claimId}/inbound/items`,
          {
            items: [
              {
                id: item.id,
                quantity: 2,
                reason_id: returnReason.id,
              },
            ],
          },
          adminHeaders
        )

        await api.post(
          `/admin/claims/${claimId}/inbound/shipping-method`,
          {
            shipping_option_id: returnShippingOption.id,
          },
          adminHeaders
        )

        await api.delete(`/admin/claims/${claimId}/request`, adminHeaders)

        result = await api
          .post(`/admin/claims/${claimId}/request`, {}, adminHeaders)
          .catch((e) => e)

        expect(result.response.status).toEqual(404)
        expect(result.response.data.message).toEqual(
          `Return id not found: ${claimId}`
        )
      })

      describe("should request a claim and receive if", () => {
        let claimId
        beforeEach(async () => {
          let result = await api.post(
            "/admin/claims",
            {
              order_id: order.id,
              description: "Test",
              location_id: location.id,
            },
            adminHeaders
          )

          claimId = result.data.claim.id
          const item = order.items[0]
          await api.post(
            `/admin/claims/${claimId}/inbound/items`,
            {
              items: [
                {
                  id: item.id,
                  quantity: 2,
                  reason_id: returnReason.id,
                },
              ],
            },
            adminHeaders
          )
          await api.post(
            `/admin/claims/${claimId}/inbound/shipping-method`,
            {
              shipping_option_id: returnShippingOption.id,
            },
            adminHeaders
          )
          await api.post(`/admin/claims/${claimId}/request`, {}, adminHeaders)
        })

        it("should receive the return", async () => {
          let inventoryLevel = (
            await api.get(
              `/admin/inventory-items/${inventoryItem.id}/location-levels?location_id[]=${location.id}`,
              adminHeaders
            )
          ).data.inventory_levels
          expect(inventoryLevel[0].stocked_quantity).toEqual(2)

          let result = await api.post(
            `/admin/claims/${claimId}/receive`,
            {
              internal_note: "Test internal note",
            },
            adminHeaders
          )

          expect(result.data.order.order_change).toEqual(
            expect.objectContaining({
              claim_id: claimId,
              change_type: "return",
              status: "pending",
              internal_note: "Test internal note",
            })
          )

          const item = order.items[0]
          result = await api.post(
            `/admin/claims/${claimId}/receive-items`,
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

          expect(result.data.order_preview).toEqual(
            expect.objectContaining({
              id: order.id,
              items: expect.arrayContaining([
                expect.objectContaining({
                  detail: expect.objectContaining({
                    quantity: 2,
                    return_requested_quantity: 1,
                    return_received_quantity: 1,
                    return_dismissed_quantity: 0,
                    written_off_quantity: 0,
                  }),
                }),
              ]),
            })
          )

          result = await api.post(
            `/admin/claims/${claimId}/dismiss-items`,
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

          expect(result.data.order_preview).toEqual(
            expect.objectContaining({
              id: order.id,
              items: expect.arrayContaining([
                expect.objectContaining({
                  detail: expect.objectContaining({
                    quantity: 2,
                    return_requested_quantity: 0,
                    return_received_quantity: 1,
                    return_dismissed_quantity: 1,
                    written_off_quantity: 1,
                  }),
                }),
              ]),
            })
          )

          result = await api.post(
            `/admin/claims/${claimId}/receive/confirm`,
            {},
            adminHeaders
          )

          expect(result.data.claim).toEqual(
            expect.objectContaining({
              items: [
                expect.objectContaining({
                  received_quantity: 2,
                }),
              ],
            })
          )

          inventoryLevel = (
            await api.get(
              `/admin/inventory-items/${inventoryItem.id}/location-levels?location_id[]=${location.id}`,
              adminHeaders
            )
          ).data.inventory_levels
          expect(inventoryLevel[0].stocked_quantity).toEqual(3)
        })
      })
    })
  },
})
