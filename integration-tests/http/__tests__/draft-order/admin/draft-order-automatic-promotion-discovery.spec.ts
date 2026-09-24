import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { HttpTypes } from "@medusajs/types"
import {
  ModuleRegistrationName,
  ProductStatus,
  PromotionStatus,
  PromotionType,
} from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"

jest.setTimeout(300000)

// Regression test for https://github.com/medusajs/medusa/issues/16895:
// an eligible automatic promotion must be discovered when a draft order
// edit makes the order eligible for the first time, without the customer
// having to enter the promotion code.
medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let region: HttpTypes.AdminRegion
    let salesChannel: HttpTypes.AdminSalesChannel
    let stockLocation: HttpTypes.AdminStockLocation
    let testDraftOrder: HttpTypes.AdminDraftOrder
    let product: HttpTypes.AdminProduct

    beforeAll(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)

      region = (
        await api.post(
          `/admin/regions`,
          {
            name: "USA",
            currency_code: "usd",
            countries: ["US"],
          },
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

      const shippingProfile = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: "test shipping profile", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      const fulfillmentSets = (
        await api.post(
          `/admin/stock-locations/${stockLocation.id}/fulfillment-sets?fields=*fulfillment_sets`,
          {
            name: `Test-${shippingProfile.id}`,
            type: "test-type",
          },
          adminHeaders
        )
      ).data.stock_location.fulfillment_sets

      await api.post(
        `/admin/fulfillment-sets/${fulfillmentSets[0].id}/service-zones`,
        {
          name: `Test-${shippingProfile.id}`,
          geo_zones: [{ type: "country", country_code: "us" }],
        },
        adminHeaders
      )

      await api.post(
        `/admin/stock-locations/${stockLocation.id}/fulfillment-providers`,
        { add: ["manual_test-provider"] },
        adminHeaders
      )

      await api.post(
        `/admin/stock-locations/${stockLocation.id}/sales-channels`,
        { add: [salesChannel.id] },
        adminHeaders
      )

      product = (
        await api.post(
          "/admin/products",
          {
            title: "Auto promo product",
            status: ProductStatus.PUBLISHED,
            sales_channels: [{ id: salesChannel.id }],
            options: [{ title: "size", values: ["large"] }],
            variants: [
              {
                title: "L shirt",
                options: { size: "large" },
                manage_inventory: false,
                prices: [
                  {
                    currency_code: "usd",
                    amount: 1000,
                  },
                ],
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

      await dbUtils.snapshot()
    })

    describe("automatic promotion discovery on draft order edits", () => {
      it("discovers the first eligible automatic promotion when adding an item", async () => {
        const promotion = (
          await api.post(
            "/admin/promotions",
            {
              code: "auto-discovery-test",
              type: PromotionType.STANDARD,
              status: PromotionStatus.ACTIVE,
              is_automatic: true,
              is_tax_inclusive: true,
              application_method: {
                type: "fixed",
                target_type: "items",
                allocation: "each",
                currency_code: "usd",
                value: 100,
                max_quantity: 5,
              },
            },
            adminHeaders
          )
        ).data.promotion

        await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit`,
          {},
          adminHeaders
        )

        // No promo code is entered: the automatic promotion must be
        // discovered purely from eligibility.
        const response = await api.post(
          `/admin/draft-orders/${testDraftOrder.id}/edit/items`,
          {
            items: [{ variant_id: product.variants[0].id, quantity: 1 }],
          },
          adminHeaders
        )

        const preview = response.data.draft_order_preview
        const firstItem = preview.items.find(
          (item) => item.variant_id === product.variants[0].id
        )

        expect(preview.discount_total).toBe(100)
        expect(firstItem?.discount_total).toBe(100)
        expect(firstItem?.adjustments).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: promotion.code,
              amount: 100,
              promotion_id: promotion.id,
            }),
          ])
        )
      })
    })
  },
})
