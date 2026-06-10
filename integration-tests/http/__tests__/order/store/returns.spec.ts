import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules, RuleOperator } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createAuthenticatedCustomer } from "../../../../modules/helpers/create-authenticated-customer"
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
    let storeHeadersWithCustomer, storeHeaders

    const shippingProviderId = "manual_test-provider"

    beforeAll(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(Modules.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)

      const publishableKey = await generatePublishableKey(container)
      storeHeaders = generateStoreHeaders({ publishableKey })
      const result = await createAuthenticatedCustomer(api, storeHeaders, {
        first_name: "tony",
        last_name: "stark",
        email: "tony@stark-industries.com",
      })
      storeHeadersWithCustomer = {
        headers: {
          ...storeHeaders.headers,
          authorization: `Bearer ${result.jwt}`,
        },
      }

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

      returnShippingOption = (
        await api.post(
          "/admin/shipping-options",
          shippingOptionPayload,
          adminHeaders
        )
      ).data.shipping_option

      item = order.items[0]

      await dbUtils.snapshot()
    })

    describe("POST /store/returns", () => {
      it("should request a return", async () => {
        let orderResult = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        const returnReason = (
          await api.post(
            "/admin/return-reasons",
            {
              value: "return-reason-test",
              label: "Test return reason",
            },
            adminHeaders
          )
        ).data.return_reason

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

        expect(fulfillableItem).toBeUndefined()

        orderResult = (await api.get(`/admin/orders/${order.id}`, adminHeaders))
          .data.order

        const returnPayload = {
          order_id: order.id,
          items: [
            {
              id: order.items[0].id,
              quantity: 1,
              reason_id: returnReason.id,
              note: "This is a test note",
            },
          ],
          return_shipping: {
            option_id: returnShippingOption.id,
            price: 100,
          },
        }

        const returnResponse = (
          await api.post(
            "/store/returns",
            returnPayload,
            storeHeadersWithCustomer
          )
        ).data.return

        expect(returnResponse).toEqual(
          expect.objectContaining({
            order_id: order.id,
            items: expect.arrayContaining([
              expect.objectContaining({
                quantity: 1,
                reason_id: returnReason.id,
                note: "This is a test note",
              }),
            ]),
            shipping_methods: [
              expect.objectContaining({
                shipping_option_id: returnShippingOption.id,
                amount: 100,
              }),
            ],
          })
        )
      })
    })
  },
})
