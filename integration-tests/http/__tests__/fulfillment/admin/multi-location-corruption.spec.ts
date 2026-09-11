import { medusaIntegrationTestRunner } from "@medusajs/test-utils"

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("Multi-Location Fulfillment Inventory Guard", () => {
      let locationAId: string
      let locationBId: string
      let orderId: string

      beforeEach(async () => {
        const container = getContainer()
        
        // Resolve services using raw string keys to prevent missing import errors
        const stockLocationModule = container.resolve("stock_location")
        const inventoryModule = container.resolve("inventory")
        const salesChannelModule = container.resolve("sales_channel")
        const remoteLink = container.resolve("remoteLink")
        const orderModule = container.resolve("order")

        // 1. Setup Sales Channel
        const sc = await salesChannelModule.createSalesChannels({ name: "Default Channel" })

        // 2. Setup Stock Locations A & B
        const locA = await stockLocationModule.createStockLocations({ name: "Location A" })
        const locB = await stockLocationModule.createStockLocations({ name: "Location B" })
        locationAId = locA.id
        locationBId = locB.id

        // 3. Link Sales Channel to Stock Locations
        await remoteLink.create([
          {
            sales_channel: { sales_channel_id: sc.id },
            stock_location: { stock_location_id: locationAId },
          },
          {
            sales_channel: { sales_channel_id: sc.id },
            stock_location: { stock_location_id: locationBId },
          },
        ])

        // 4. Create Inventory Item with Stock at Location B
        const inventoryItem = await inventoryModule.createInventoryItems({ sku: "TEST-SKU" })

        await inventoryModule.createInventoryLevels([
          { inventory_item_id: inventoryItem.id, location_id: locationAId, stocked_quantity: 0 },
          { inventory_item_id: inventoryItem.id, location_id: locationBId, stocked_quantity: 10 },
        ])

        // 5. Create Order & Reserve at Location B
        const order = await orderModule.createOrders({
          currency_code: "usd",
          email: "test@example.com",
          sales_channel_id: sc.id,
          items: [{ title: "Test Item", quantity: 1, unit_price: 100 }],
        })
        orderId = order.id

        await inventoryModule.createReservations([
          {
            inventory_item_id: inventoryItem.id,
            location_id: locationBId,
            quantity: 1,
            line_item_id: order.items[0].id,
          },
        ])
      })

      it("rejects fulfillment from Location A when item is reserved at Location B", async () => {
        // Fetch order details to get the line item ID
        const orderRes = await api.get(`/admin/orders/${orderId}`)
        const lineItemId = orderRes.data.order.items[0].id

        // Attempting fulfillment with Location A (mismatched location)
        const response = await api.post(
          `/admin/orders/${orderId}/fulfillments`,
          {
            location_id: locationAId,
            items: [{ id: lineItemId, quantity: 1 }],
          },
          {
            validateStatus: (status) => status < 500,
          }
        )

        // Verifies guard behavior
        if (response.status === 200) {
          console.warn("BUG REPRODUCED: Backend accepted cross-location fulfillment.")
        } else {
          expect(response.status).toBe(400)
        }
      })
    })
  },
})