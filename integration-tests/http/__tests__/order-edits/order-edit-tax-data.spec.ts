import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules, ProductStatus } from "@medusajs/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../helpers/create-admin-user"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api, dbUtils }) => {
    let container
    let region
    let product
    let productExtra
    let salesChannel

    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)

      const shippingProfile = (
        await api.post(
          "/admin/shipping-profiles",
          { name: "default", type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      const taxService = container.resolve(Modules.TAX)
      await taxService.createTaxRegions([
        {
          country_code: "GB",
          provider_id: "tp_tax-data-provider_data-provider",
          default_tax_rate: {
            name: "GB Standard Rate",
            rate: 20,
            code: "GB_STD",
          },
        },
      ])

      region = (
        await api.post(
          "/admin/regions",
          { name: "GB", currency_code: "gbp", countries: ["gb"] },
          adminHeaders
        )
      ).data.region

      product = (
        await api.post(
          "/admin/products",
          {
            title: "Base Product",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "Size", values: ["S"] }],
            variants: [
              {
                title: "S",
                manage_inventory: false,
                options: { Size: "S" },
                prices: [{ amount: 1000, currency_code: "gbp" }],
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
            title: "Extra Product",
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfile.id,
            options: [{ title: "Size", values: ["S"] }],
            variants: [
              {
                title: "S",
                manage_inventory: false,
                options: { Size: "S" },
                prices: [{ amount: 500, currency_code: "gbp" }],
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      salesChannel = (
        await api.post(
          "/admin/sales-channels",
          { name: "GB Webshop", description: "channel" },
          adminHeaders
        )
      ).data.sales_channel

      await dbUtils.snapshot()
    })

    describe("Order edit tax line data field", () => {
      it("should persist provider data on tax lines after order edit retax", async () => {
        const orderModule = container.resolve(Modules.ORDER)

        const order = await orderModule.createOrders({
          region_id: region.id,
          email: "customer@test.com",
          items: [
            {
              title: "Base item",
              variant_id: product.variants[0].id,
              quantity: 1,
              unit_price: 1000,
            },
          ],
          sales_channel_id: salesChannel.id,
          shipping_address: {
            first_name: "Test",
            last_name: "User",
            address_1: "1 Oxford Street",
            city: "London",
            country_code: "GB",
            postal_code: "W1D 1AN",
          },
          billing_address: {
            first_name: "Test",
            last_name: "User",
            address_1: "1 Oxford Street",
            city: "London",
            country_code: "GB",
            postal_code: "W1D 1AN",
          },
          shipping_methods: [
            {
              name: "Standard shipping",
              amount: 500,
            },
          ],
          currency_code: "gbp",
        })

        await api.post(
          "/admin/order-edits",
          { order_id: order.id, description: "Add item" },
          adminHeaders
        )

        await api.post(
          `/admin/order-edits/${order.id}/items`,
          {
            items: [
              {
                variant_id: productExtra.variants[0].id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        // request triggers setOrderTaxLinesForItemsStep (retax via data provider)
        const preview = (
          await api.post(
            `/admin/order-edits/${order.id}/request`,
            {},
            adminHeaders
          )
        ).data.order_preview

        const previewItem = preview.items.find(
          (i) => i.variant_id === productExtra.variants[0].id
        )

        expect(previewItem).toBeDefined()
        expect(previewItem.tax_lines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "GB_STD",
              rate: 20,
              provider_id: "tax-data-provider",
              data: { state_rate: 4.0, county_rate: 3.0, city_rate: 1.9 },
            }),
          ])
        )

        await api.post(
          `/admin/order-edits/${order.id}/confirm`,
          {},
          adminHeaders
        )

        const confirmedOrder = (
          await api.get(`/admin/orders/${order.id}`, adminHeaders)
        ).data.order

        const confirmedItem = confirmedOrder.items.find(
          (i) => i.variant_id === productExtra.variants[0].id
        )

        expect(confirmedItem).toBeDefined()
        expect(confirmedItem.tax_lines).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              code: "GB_STD",
              rate: 20,
              provider_id: "tax-data-provider",
              data: { state_rate: 4.0, county_rate: 3.0, city_rate: 1.9 },
            }),
          ])
        )
      })
    })
  },
})
