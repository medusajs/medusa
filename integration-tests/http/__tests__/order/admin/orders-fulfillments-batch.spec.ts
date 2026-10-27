import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ProductStatus } from "@medusajs/framework/utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(100000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let container
    let skuCounter = 0

    beforeAll(async () => {
      container = getContainer()
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    // `createOrderSeeder`'s default product/inventory-item creation uses
    // hardcoded skus ("test-variant" for both the inventory item and the
    // product variant) when no overrides are passed, so calling it more
    // than once in the same test (to get multiple independent orders)
    // needs its own product/inventory item with a unique sku each time, or
    // the second call 400s on the sku collision.
    const createFulfillableOrder = async () => {
      const suffix = `batch-fulfill-order-${skuCounter++}`

      const inventoryItemOverride = (
        await api.post(
          `/admin/inventory-items`,
          { sku: `${suffix}-inventory` },
          adminHeaders
        )
      ).data.inventory_item

      const shippingProfileOverride = (
        await api.post(
          `/admin/shipping-profiles`,
          { name: `${suffix}-profile`, type: "default" },
          adminHeaders
        )
      ).data.shipping_profile

      const productOverride = (
        await api.post(
          "/admin/products",
          {
            title: `Test fixture ${suffix}`,
            status: ProductStatus.PUBLISHED,
            shipping_profile_id: shippingProfileOverride.id,
            options: [
              { title: "size", values: ["large", "small"] },
              { title: "color", values: ["green"] },
            ],
            variants: [
              {
                title: "Test variant",
                sku: `${suffix}-variant`,
                inventory_items: [
                  {
                    inventory_item_id: inventoryItemOverride.id,
                    required_quantity: 1,
                  },
                ],
                prices: [{ currency_code: "usd", amount: 100 }],
                options: { size: "large", color: "green" },
              },
            ],
          },
          adminHeaders
        )
      ).data.product

      return createOrderSeeder({
        api,
        container,
        productOverride,
        inventoryItemOverride,
        shippingProfileOverride,
      })
    }

    describe("POST /admin/orders/fulfillments/batch", () => {
      it("fulfills each order independently, one order's failure doesn't block the others", async () => {
        const seederA = await createFulfillableOrder()
        const orderA = seederA.order

        const seederB = await createFulfillableOrder()
        const orderB = seederB.order

        // Remove orderB's stock reservation so createOrderFulfillmentWorkflow
        // throws a real validation error for it ("No stock reservation
        // found...") - no fulfillment-provider integration (e.g. EasyPost)
        // is registered in this test environment, so this is the most
        // direct, environment-independent way to make a single order's
        // fulfillment attempt genuinely fail.
        const orderBItemId = orderB.items[0].id
        const orderBReservations = (
          await api.get(
            `/admin/reservations?line_item_id[]=${orderBItemId}`,
            adminHeaders
          )
        ).data.reservations
        for (const reservation of orderBReservations) {
          await api.delete(
            `/admin/reservations/${reservation.id}`,
            adminHeaders
          )
        }

        const response = await api.post(
          "/admin/orders/fulfillments/batch",
          { order_ids: [orderA.id, orderB.id] },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.succeeded).toEqual([orderA.id])
        expect(response.data.failed).toHaveLength(1)
        expect(response.data.failed[0].order_id).toEqual(orderB.id)
        expect(response.data.failed[0].error).toMatch(/stock reservation/i)

        const afterA = (
          await api.get(
            `/admin/orders/${orderA.id}?fields=id,*fulfillments`,
            adminHeaders
          )
        ).data.order
        const afterB = (
          await api.get(
            `/admin/orders/${orderB.id}?fields=id,*fulfillments`,
            adminHeaders
          )
        ).data.order

        expect(afterA.fulfillments).toHaveLength(1)
        expect(afterB.fulfillments ?? []).toHaveLength(0)
      })

      it("only fulfills an order's own remaining unfulfilled items when it's already partially fulfilled, in a batch with a fresh order", async () => {
        // Build an order with two distinct line items so one can be
        // fulfilled ahead of time (simulating a previously-shipped item)
        // while the other is left unfulfilled for the batch call to pick
        // up - the Review Focus scenario: a mix of orders where one is
        // already partially_fulfilled, and the batch must only touch its
        // own remaining items.
        const stockLocation = (
          await api.post(
            `/admin/stock-locations`,
            { name: "batch-fulfill test location" },
            adminHeaders
          )
        ).data.stock_location

        const shippingProfile = (
          await api.post(
            `/admin/shipping-profiles`,
            { name: `batch-fulfill-${stockLocation.id}`, type: "default" },
            adminHeaders
          )
        ).data.shipping_profile

        const inventoryItem1 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: `batch-fulfill-1-${stockLocation.id}` },
            adminHeaders
          )
        ).data.inventory_item

        const inventoryItem2 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: `batch-fulfill-2-${stockLocation.id}` },
            adminHeaders
          )
        ).data.inventory_item

        // `inventoryItem1` is passed to `createOrderSeeder` below as
        // `inventoryItemOverride`, which creates its own location-level for
        // it - only `inventoryItem2` (the `additionalProducts` item) needs
        // one created here, matching how the existing multi-product
        // fixture in order.spec.ts splits this responsibility.
        await api.post(
          `/admin/inventory-items/${inventoryItem2.id}/location-levels`,
          { location_id: stockLocation.id, stocked_quantity: 10 },
          adminHeaders
        )

        const product1 = (
          await api.post(
            "/admin/products",
            {
              title: `Batch fulfill product 1 ${stockLocation.id}`,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "size", values: ["large"] }],
              variants: [
                {
                  title: "Variant 1",
                  sku: `batch-fulfill-variant-1-${stockLocation.id}`,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItem1.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [{ currency_code: "usd", amount: 100 }],
                  options: { size: "large" },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const product2 = (
          await api.post(
            "/admin/products",
            {
              title: `Batch fulfill product 2 ${stockLocation.id}`,
              status: ProductStatus.PUBLISHED,
              shipping_profile_id: shippingProfile.id,
              options: [{ title: "size", values: ["large"] }],
              variants: [
                {
                  title: "Variant 2",
                  sku: `batch-fulfill-variant-2-${stockLocation.id}`,
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItem2.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [{ currency_code: "usd", amount: 100 }],
                  options: { size: "large" },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        const seederC = await createOrderSeeder({
          api,
          container,
          productOverride: product1,
          additionalProducts: [
            { variant_id: product2.variants[0].id, quantity: 1 },
          ],
          stockChannelOverride: stockLocation,
          inventoryItemOverride: inventoryItem1,
          shippingProfileOverride: shippingProfile,
        })
        const orderC = seederC.order
        const item1 = orderC.items.find(
          (item) => item.variant_id === product1.variants[0].id
        )
        const item2 = orderC.items.find(
          (item) => item.variant_id === product2.variants[0].id
        )

        // Fulfill item1 only, ahead of the batch call, so the order is
        // already partially_fulfilled when the batch runs.
        await api.post(
          `/admin/orders/${orderC.id}/fulfillments`,
          {
            shipping_option_id: seederC.shippingOption.id,
            location_id: stockLocation.id,
            items: [{ id: item1.id, quantity: 1 }],
          },
          adminHeaders
        )

        // `fulfillment_status` is computed from each item's own
        // `quantity` versus `detail.fulfilled_quantity` - both need to be
        // in the requested fields for the computation to see them, not
        // just `*items.detail` on its own.
        const beforeBatch = (
          await api.get(
            `/admin/orders/${orderC.id}?fields=id,fulfillment_status,*items,*items.detail`,
            adminHeaders
          )
        ).data.order
        expect(beforeBatch.fulfillment_status).toEqual("partially_fulfilled")

        // A fresh, fully fulfillable order alongside the partially
        // fulfilled one, to confirm the batch handles a genuine mix.
        const seederD = await createFulfillableOrder()
        const orderD = seederD.order

        const response = await api.post(
          "/admin/orders/fulfillments/batch",
          { order_ids: [orderC.id, orderD.id] },
          adminHeaders
        )

        expect(response.status).toEqual(200)
        expect(response.data.failed).toHaveLength(0)
        expect(response.data.succeeded).toEqual(
          expect.arrayContaining([orderC.id, orderD.id])
        )

        const afterC = (
          await api.get(
            `/admin/orders/${orderC.id}?fields=id,fulfillment_status,*items,*items.detail,*fulfillments.items`,
            adminHeaders
          )
        ).data.order

        expect(afterC.fulfillment_status).toEqual("fulfilled")

        const item1AfterBatch = afterC.items.find(
          (item) => item.id === item1.id
        )
        const item2AfterBatch = afterC.items.find(
          (item) => item.id === item2.id
        )
        expect(item1AfterBatch.detail.fulfilled_quantity).toEqual(1)
        expect(item2AfterBatch.detail.fulfilled_quantity).toEqual(1)

        // Exactly two fulfillments exist: the manual one for item1 and the
        // batch-created one for item2 - item1 was never re-fulfilled.
        expect(afterC.fulfillments).toHaveLength(2)
        const batchFulfillment = afterC.fulfillments.find(
          (fulfillment) =>
            !fulfillment.items.some((item) => item.line_item_id === item1.id)
        )
        expect(batchFulfillment).toBeDefined()
        expect(batchFulfillment.items).toHaveLength(1)
        expect(batchFulfillment.items[0].line_item_id).toEqual(item2.id)
      })

      it("rejects an empty order_ids array", async () => {
        const response = await api
          .post(
            "/admin/orders/fulfillments/batch",
            { order_ids: [] },
            adminHeaders
          )
          .catch((e) => e.response)

        expect(response.status).toEqual(400)
      })
    })
  },
})
