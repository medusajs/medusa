import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  createAdminUser,
  generatePublishableKey,
  generateStoreHeaders,
} from "../../../../helpers/create-admin-user"
import { ProductStatus } from "@medusajs/utils"

jest.setTimeout(50000)

const env = {}
const adminHeaders = { headers: { "x-medusa-access-token": "test_token" } }
const adminTemplateName = "shipping-option-admin-template"

medusaIntegrationTestRunner({
  env,
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    beforeAll(async () => {
      await createAdminUser(dbConnection, adminHeaders, getContainer())
      await dbUtils.snapshot({ templateName: adminTemplateName })
    })

    describe("Store: Shipping Option API", () => {
      let appContainer
      let salesChannel
      let region
      let regionTwo
      let product
      let stockLocation
      let shippingProfile
      let fulfillmentSet
      let cart
      let shippingOption
      let storeHeaders

      beforeAll(async () => {
        appContainer = getContainer()

        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["US"] },
            adminHeaders
          )
        ).data.region

        regionTwo = (
          await api.post(
            "/admin/regions",
            {
              name: "Test region two",
              currency_code: "dkk",
              countries: ["DK"],
              is_tax_inclusive: true,
            },
            adminHeaders
          )
        ).data.region

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "Test", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "first channel", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        product = (
          await api.post(
            "/admin/products",
            {
              title: "Test fixture",
              status: ProductStatus.PUBLISHED,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              shipping_profile_id: shippingProfile.id,
              variants: [
                {
                  title: "Test variant",
                  manage_inventory: false,
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                    {
                      currency_code: "dkk",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "large",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        stockLocation = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        const fulfillmentSets = (
          await api.post(
            `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
            {
              name: "Test",
              type: "test-type",
            },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
            {
              name: "Test",
              geo_zones: [
                { type: "country", country_code: "us" },
                { type: "country", country_code: "dk" },
              ],
            },
            adminHeaders
          )
        ).data.fulfillment_set

        await api.post(
          `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
          { add: ["manual_test-provider"] },
          adminHeaders
        )

        shippingOption = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Test shipping option",
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
                {
                  region_id: region.id,
                  amount: 1100,
                },
                {
                  region_id: region.id,
                  amount: 0,
                  rules: [
                    {
                      operator: "gt",
                      attribute: "item_total",
                      value: 2000,
                    },
                  ],
                },
                {
                  region_id: regionTwo.id,
                  amount: 500,
                },
              ],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        await dbUtils.snapshot()
      })

      describe("GET /store/shipping-options?cart_id=", () => {
        it("should get shipping options for a cart successfully", async () => {
          cart = (
            await api.post(
              `/store/carts`,
              {
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                currency_code: "usd",
                email: "test@admin.com",
                items: [
                  {
                    variant_id: product.variants[0].id,
                    quantity: 1,
                  },
                ],
              },
              storeHeaders
            )
          ).data.cart

          const resp = await api.get(
            `/store/shipping-options?cart_id=${cart.id}`,
            storeHeaders
          )

          const shippingOptions = resp.data.shipping_options

          expect(shippingOptions).toHaveLength(1)
          expect(shippingOptions[0]).toEqual(
            expect.objectContaining({
              id: shippingOption.id,
              name: "Test shipping option",
              price_type: "flat",
              amount: 1100,
              calculated_price: expect.objectContaining({
                calculated_amount: 1100,
              }),
            })
          )

          cart = (
            await api.post(
              `/store/carts/${cart.id}`,
              {
                region_id: regionTwo.id,
              },
              storeHeaders
            )
          ).data.cart

          const secondResp = await api.get(
            `/store/shipping-options?cart_id=${cart.id}`,
            storeHeaders
          )

          expect(secondResp.data.shipping_options).toHaveLength(1)
          expect(secondResp.data.shipping_options[0]).toEqual(
            expect.objectContaining({
              id: shippingOption.id,
              name: "Test shipping option",
              amount: 500,
              is_tax_inclusive: true,
              calculated_price: expect.objectContaining({
                calculated_amount: 500,
                is_calculated_price_tax_inclusive: true,
              }),
              price_type: "flat",
            })
          )
        })

        it("should return prices based on cart total", async () => {
          cart = (
            await api.post(
              `/store/carts`,
              {
                region_id: region.id,
                sales_channel_id: salesChannel.id,
                currency_code: "usd",
                email: "test@admin.com",
                items: [
                  {
                    variant_id: product.variants[0].id,
                    // Adding a quantity of 100 to emulate total being greater than 2000
                    quantity: 100,
                  },
                ],
              },
              storeHeaders
            )
          ).data.cart

          const resp = await api.get(
            `/store/shipping-options?cart_id=${cart.id}`,
            storeHeaders
          )

          const shippingOptions = resp.data.shipping_options

          expect(shippingOptions).toHaveLength(1)
          expect(shippingOptions[0]).toEqual(
            expect.objectContaining({
              id: shippingOption.id,
              name: "Test shipping option",
              // Free shipping due to cart total being greater than 2000
              amount: 0,
              calculated_price: expect.objectContaining({
                calculated_amount: 0,
              }),
              price_type: "flat",
            })
          )
        })

        it("should throw error when cart_id is not passed as a parameter", async () => {
          const { response } = await api
            .get(`/store/shipping-options`, storeHeaders)
            .catch((e) => e)

          expect(response.data).toEqual({
            type: "invalid_data",
            message: "Invalid request: Field 'cart_id' is required",
          })
        })
      })
    })

    describe("with insufficient inventory", () => {
      let appContainer
      let salesChannel
      let region
      let product
      let stockLocation1
      let stockLocation2
      let stockLocation3
      let shippingProfile
      let fulfillmentSet
      let shippingOption1
      let shippingOption2
      let shippingOption3
      let storeHeaders

      beforeAll(async () => {
        await dbUtils.restore({ templateName: adminTemplateName })
        appContainer = getContainer()

        const publishableKey = await generatePublishableKey(appContainer)
        storeHeaders = generateStoreHeaders({ publishableKey })

        region = (
          await api.post(
            "/admin/regions",
            { name: "US", currency_code: "usd", countries: ["us"] },
            adminHeaders
          )
        ).data.region

        shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "Test", type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        salesChannel = (
          await api.post(
            "/admin/sales-channels",
            { name: "first channel", description: "channel" },
            adminHeaders
          )
        ).data.sales_channel

        stockLocation1 = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        const fulfillmentSets1 = (
          await api.post(
            `/admin/stock-locations/${stockLocation1.id}/fulfillment-sets?fields=*fulfillment_sets`,
            {
              name: "Test 1",
              type: "pickup",
            },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${fulfillmentSets1[0].id}/service-zones`,
            {
              name: "Test 1",
              geo_zones: [
                { type: "country", country_code: "us" },
                { type: "country", country_code: "dk" },
              ],
            },
            adminHeaders
          )
        ).data.fulfillment_set

        await api.post(
          `/admin/stock-locations/${stockLocation1.id}/fulfillment-providers`,
          { add: ["manual_test-provider"] },
          adminHeaders
        )

        shippingOption1 = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Pickup option 1",
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
                  amount: 0,
                },
                {
                  region_id: region.id,
                  amount: 0,
                },
              ],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        stockLocation2 = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        const fulfillmentSets2 = (
          await api.post(
            `/admin/stock-locations/${stockLocation2.id}/fulfillment-sets?fields=*fulfillment_sets`,
            {
              name: "Test 2",
              type: "pickup",
            },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${fulfillmentSets2[0].id}/service-zones`,
            {
              name: "Test 2",
              geo_zones: [
                { type: "country", country_code: "us" },
                { type: "country", country_code: "dk" },
              ],
            },
            adminHeaders
          )
        ).data.fulfillment_set

        await api.post(
          `/admin/stock-locations/${stockLocation2.id}/fulfillment-providers`,
          { add: ["manual_test-provider"] },
          adminHeaders
        )

        shippingOption2 = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Pickup option 2",
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
                  amount: 0,
                },
                {
                  region_id: region.id,
                  amount: 0,
                },
              ],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        stockLocation3 = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        const fulfillmentSets3 = (
          await api.post(
            `/admin/stock-locations/${stockLocation3.id}/fulfillment-sets?fields=*fulfillment_sets`,
            {
              name: "Test 3",
              type: "pickup",
            },
            adminHeaders
          )
        ).data.stock_location.fulfillment_sets

        fulfillmentSet = (
          await api.post(
            `/admin/fulfillment-sets/${fulfillmentSets3[0].id}/service-zones`,
            {
              name: "Test 3",
              geo_zones: [
                { type: "country", country_code: "us" },
                { type: "country", country_code: "dk" },
              ],
            },
            adminHeaders
          )
        ).data.fulfillment_set

        await api.post(
          `/admin/stock-locations/${stockLocation3.id}/fulfillment-providers`,
          { add: ["manual_test-provider"] },
          adminHeaders
        )

        shippingOption3 = (
          await api.post(
            `/admin/shipping-options`,
            {
              name: "Pickup option 3",
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
                  amount: 0,
                },
                {
                  region_id: region.id,
                  amount: 0,
                },
              ],
              rules: [],
            },
            adminHeaders
          )
        ).data.shipping_option

        const inventoryItem = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "inventory-item" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItem.id}/location-levels`,
          {
            location_id: stockLocation1.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItem.id}/location-levels`,
          {
            location_id: stockLocation2.id,
            stocked_quantity: 5,
          },
          adminHeaders
        )

        // STOCK LOCATION 3 doesn't have any inventory for that item

        await api.post(
          `/admin/stock-locations/${stockLocation1.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        await api.post(
          `/admin/stock-locations/${stockLocation2.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        await api.post(
          `/admin/stock-locations/${stockLocation3.id}/sales-channels`,
          { add: [salesChannel.id] },
          adminHeaders
        )

        product = (
          await api.post(
            "/admin/products",
            {
              title: "Test prod",
              status: ProductStatus.PUBLISHED,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              shipping_profile_id: shippingProfile.id,
              variants: [
                {
                  title: "Test variant",
                  manage_inventory: true,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItem.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                    {
                      currency_code: "dkk",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "large",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        await dbUtils.snapshot()
      })

      it("should get shipping options for a cart with insufficient inventory flag set correctly", async () => {
        const cart = (
          await api.post(
            `/store/carts`,
            {
              region_id: region.id,
              sales_channel_id: salesChannel.id,
              currency_code: "usd",
              email: "test@admin.com",
              items: [
                {
                  variant_id: product.variants[0].id,
                  quantity: 8,
                },
              ],
            },
            storeHeaders
          )
        ).data.cart

        const resp = await api.get(
          `/store/shipping-options?cart_id=${cart.id}`,
          storeHeaders
        )

        const shippingOptions = resp.data.shipping_options

        expect(shippingOptions.length).toBe(3)
        expect(shippingOptions).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: shippingOption1.id,
              name: "Pickup option 1",
              amount: 0,
              insufficient_inventory: false, // sufficient inventory at location
            }),
            expect.objectContaining({
              id: shippingOption2.id,
              name: "Pickup option 2",
              amount: 0,
              insufficient_inventory: true, // inventory item is at location 2 but not enough quantity
            }),
            expect.objectContaining({
              id: shippingOption3.id,
              name: "Pickup option 3",
              amount: 0,
              insufficient_inventory: true, // inventory item is not at location 3
            }),
          ])
        )
      })
    })
  },
})
