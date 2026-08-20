import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { HttpTypes } from "@medusajs/types"
import { ModuleRegistrationName, ProductStatus } from "@medusajs/utils"
import { fetchShippingOptionForDraftOrderWorkflow } from "@medusajs/core-flows"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"

jest.setTimeout(300000)

// The calculated fulfillment provider registered in integration-tests/http/medusa-config.js.
// Its identifier is "manual-calculated" and it is registered with id "test-provider-calculated",
// so the resolved provider id is "<identifier>_<id>". Its `calculatePrice` returns
// `sum(item quantities) * 1.5`.
const CALCULATED_PROVIDER_ID = "manual-calculated_test-provider-calculated"
const FLAT_PROVIDER_ID = "manual_test-provider"
const PRICE_PER_ITEM = 1.5

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let region: HttpTypes.AdminRegion
    let salesChannel: HttpTypes.AdminSalesChannel
    let stockLocation: HttpTypes.AdminStockLocation
    let testDraftOrder: HttpTypes.AdminDraftOrder
    let calculatedShippingOption: HttpTypes.AdminShippingOption
    let flatShippingOption: HttpTypes.AdminShippingOption
    let product: HttpTypes.AdminProduct
    let shippingProfile: HttpTypes.AdminShippingProfile
    let fulfillmentSet: any

    // Lets a single test observe the setPricingContext hook without leaking to
    // others; the registered hook is a no-op while this is undefined.
    let setPricingContextSpy: ((input: any) => any) | undefined

    fetchShippingOptionForDraftOrderWorkflow.hooks.setPricingContext(
      (input) => {
        if (setPricingContextSpy) {
          return setPricingContextSpy(input)
        }
      }
    )

    afterEach(() => {
      setPricingContextSpy = undefined
    })

    beforeEach(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)

      region = (
        await api.post(
          `/admin/regions`,
          { name: "USA", currency_code: "usd", countries: ["US"] },
          adminHeaders
        )
      ).data.region

      salesChannel = (
        await api.post("/admin/sales-channels", { name: "test" }, adminHeaders)
      ).data.sales_channel

      stockLocation = (
        await api.post(
          `/admin/stock-locations`,
          { name: "test location" },
          adminHeaders
        )
      ).data.stock_location

      shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "test shipping profile", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      const fulfillmentSets = (
        await api.post(
          `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
          { name: `Test-${shippingProfile.id}`, type: "test-type" },
          adminHeaders
        )
      ).data.stock_location.fulfillment_sets

      fulfillmentSet = (
        await api.post(
          `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
          {
            name: `Test-${shippingProfile.id}`,
            geo_zones: [{ type: "country", country_code: "us" }],
          },
          adminHeaders
        )
      ).data.fulfillment_set

      await api.post(
        `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
        { add: [FLAT_PROVIDER_ID, CALCULATED_PROVIDER_ID] },
        adminHeaders
      )

      await api.post(
        `/admin/stock-locations/${stockLocation.id}/sales-channels`,
        { add: [salesChannel.id] },
        adminHeaders
      )

      flatShippingOption = (
        await api.post(
          `/admin/shipping-options`,
          {
            name: "Flat shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: FLAT_PROVIDER_ID,
            price_type: "flat",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [{ currency_code: "usd", amount: 5 }],
            rules: [],
          },
          adminHeaders
        )
      ).data.shipping_option

      calculatedShippingOption = (
        await api.post(
          `/admin/shipping-options`,
          {
            name: "Calculated shipping option",
            service_zone_id: fulfillmentSet.service_zones[0].id,
            shipping_profile_id: shippingProfile.id,
            provider_id: CALCULATED_PROVIDER_ID,
            price_type: "calculated",
            type: {
              label: "Test type",
              description: "Test description",
              code: "test-code",
            },
            prices: [],
            rules: [],
          },
          adminHeaders
        )
      ).data.shipping_option

      const inventoryItem = (
        await api.post(`/admin/inventory-items`, { sku: "shirt" }, adminHeaders)
      ).data.inventory_item

      await api.post(
        `/admin/inventory-items/${inventoryItem.id}/location-levels`,
        { location_id: stockLocation.id, stocked_quantity: 100 },
        adminHeaders
      )

      product = (
        await api.post(
          "/admin/products",
          {
            title: "Shirt",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "size", values: ["large"] }],
            variants: [
              {
                title: "L shirt",
                options: { size: "large" },
                inventory_items: [
                  { inventory_item_id: inventoryItem.id, required_quantity: 1 },
                ],
                prices: [{ currency_code: "usd", amount: 10 }],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      testDraftOrder = (
        await api.post(
          "/admin/draft-orders",
          {
            email: "test@test.com",
            region_id: region.id,
            sales_channel_id: salesChannel.id,
            shipping_address: {
              address_1: "123 Main St",
              city: "Anytown",
              country_code: "US",
              postal_code: "12345",
              first_name: "John",
            },
          },
          adminHeaders
        )
      ).data.draft_order
    })

    const beginEdit = () =>
      api.post(
        `/admin/draft-orders/${testDraftOrder.id}/edit`,
        {},
        adminHeaders
      )

    const addItem = (quantity: number) =>
      api.post(
        `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
        { items: [{ variant_id: product.variants![0].id, quantity }] },
        adminHeaders
      )

    const addShippingMethod = (
      shipping_option_id: string,
      custom_amount?: number
    ) =>
      api.post(
        `/admin/draft-orders/${testDraftOrder.id}/edit/shipping-methods`,
        custom_amount === undefined
          ? { shipping_option_id }
          : { shipping_option_id, custom_amount },
        adminHeaders
      )

    const confirmEdit = () =>
      api.post(
        `/admin/draft-orders/${testDraftOrder.id}/edit/confirm`,
        {},
        adminHeaders
      )

    const getDraftOrder = async () =>
      (await api.get(`/admin/draft-orders/${testDraftOrder.id}`, adminHeaders))
        .data.draft_order

    describe("POST /draft-orders/:id/edit/shipping-methods (calculated)", () => {
      it("adds a calculated shipping option using the provider-calculated price", async () => {
        await beginEdit()
        await addItem(2)

        const response = await addShippingMethod(calculatedShippingOption.id)
        expect(response.status).toBe(200)

        await confirmEdit()

        const order = await getDraftOrder()
        expect(order.shipping_methods).toHaveLength(1)
        expect(order.shipping_methods[0]).toEqual(
          expect.objectContaining({
            shipping_option_id: calculatedShippingOption.id,
            amount: 2 * PRICE_PER_ITEM,
            is_custom_amount: false,
          })
        )
      })

      it("uses the custom amount when one is provided for a calculated option", async () => {
        await beginEdit()
        await addItem(2)
        await addShippingMethod(calculatedShippingOption.id, 99)
        await confirmEdit()

        const order = await getDraftOrder()
        expect(order.shipping_methods[0]).toEqual(
          expect.objectContaining({
            shipping_option_id: calculatedShippingOption.id,
            amount: 99,
            is_custom_amount: true,
          })
        )
      })

      it("adds a flat-rate shipping option", async () => {
        await beginEdit()
        await addItem(2)
        await addShippingMethod(flatShippingOption.id)
        await confirmEdit()

        const order = await getDraftOrder()
        expect(order.shipping_methods[0]).toEqual(
          expect.objectContaining({
            shipping_option_id: flatShippingOption.id,
            amount: 5,
          })
        )
      })

      it("refreshes the calculated shipping price when items are added", async () => {
        await beginEdit()
        await addItem(2)
        await addShippingMethod(calculatedShippingOption.id)

        // Adding more items should re-run the provider calculation against the
        // updated item count (2 + 3 = 5 items).
        await addItem(3)
        await confirmEdit()

        const order = await getDraftOrder()
        expect(order.shipping_methods[0]).toEqual(
          expect.objectContaining({
            shipping_option_id: calculatedShippingOption.id,
            amount: 5 * PRICE_PER_ITEM,
            is_custom_amount: false,
          })
        )
      })

      it("recalculates the calculated price when a custom amount is reset to null", async () => {
        await beginEdit()
        await addItem(2)

        const preview = (
          await addShippingMethod(calculatedShippingOption.id, 99)
        ).data.draft_order_preview

        const shippingMethod = preview.shipping_methods[0]
        const addAction = shippingMethod.actions?.find(
          (action: any) => action.action === "SHIPPING_ADD"
        )
        expect(addAction).toBeDefined()

        const response = await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/shipping-methods/${
            addAction!.id
          }`,
          {
            shipping_option_id: calculatedShippingOption.id,
            custom_amount: null,
          },
          adminHeaders
        )

        expect(response.status).toBe(200)
        const updatedMethod =
          response.data.draft_order_preview.shipping_methods[0]
        expect(updatedMethod).toEqual(
          expect.objectContaining({
            amount: 2 * PRICE_PER_ITEM,
            is_custom_amount: false,
          })
        )
      })

      it("refreshes an already-applied calculated method when a later edit changes items", async () => {
        // Edit 1: add item qty 2 + calculated shipping, confirm (amount = 3).
        await beginEdit()
        await addItem(2)
        await addShippingMethod(calculatedShippingOption.id)
        await confirmEdit()

        let order = await getDraftOrder()
        expect(order.shipping_methods[0].amount).toBe(2 * PRICE_PER_ITEM)

        // Edit 2: add more items (total qty 5), confirm WITHOUT touching shipping.
        await beginEdit()
        await addItem(3)
        await confirmEdit()

        order = await getDraftOrder()
        expect(order.shipping_methods).toHaveLength(1)
        expect(order.shipping_methods[0]).toEqual(
          expect.objectContaining({
            shipping_option_id: calculatedShippingOption.id,
            amount: 5 * PRICE_PER_ITEM,
            is_custom_amount: false,
          })
        )
      })

      it("refreshes the pending shipping method amount in the preview before confirm", async () => {
        await beginEdit()
        await addItem(2)

        const afterShipping = (
          await addShippingMethod(calculatedShippingOption.id)
        ).data.draft_order_preview
        expect(afterShipping.shipping_methods[0].amount).toBe(
          2 * PRICE_PER_ITEM
        )

        // Adding more items refreshes the pending action amount in the SAME
        // edit; the returned preview reflects it without confirming.
        const afterMoreItems = (await addItem(3)).data.draft_order_preview
        expect(afterMoreItems.shipping_methods[0].amount).toBe(
          5 * PRICE_PER_ITEM
        )
      })

      it("prices a calculated method using only items in its shipping profile", async () => {
        const profileB = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: "profile B", type: "heavy" },
            adminHeaders
          )
        ).data.shipping_profile

        const inventoryItemB = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "pants" },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemB.id}/location-levels`,
          { location_id: stockLocation.id, stocked_quantity: 100 },
          adminHeaders
        )

        const productB = (
          await api.post(
            "/admin/products",
            {
              title: "Pants",
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: profileB.id,
              options: [{ title: "size", values: ["large"] }],
              variants: [
                {
                  title: "L pants",
                  options: { size: "large" },
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemB.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [{ currency_code: "usd", amount: 10 }],
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        await beginEdit()
        // 2 items on the default profile (the calculated option's profile)...
        await addItem(2)
        // ...and 4 items on profile B, which the option must ignore.
        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          { items: [{ variant_id: productB.variants[0].id, quantity: 4 }] },
          adminHeaders
        )

        const preview = (await addShippingMethod(calculatedShippingOption.id))
          .data.draft_order_preview

        const method = preview.shipping_methods.find(
          (sm: any) => sm.shipping_option_id === calculatedShippingOption.id
        )
        // Only the 2 default-profile items count (2 * 1.5 = 3), not all 6.
        expect(method.amount).toBe(2 * PRICE_PER_ITEM)
      })
    })
  },
})
