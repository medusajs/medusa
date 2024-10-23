import { ModuleRegistrationName } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"
import { setupTaxStructure } from "../../../../modules/__tests__/fixtures"
import { createOrderSeeder } from "../../fixtures/order"

jest.setTimeout(300000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, getContainer, api }) => {
    let order, seeder, inventoryItemOverride3, productOverride3

    beforeEach(async () => {
      const container = getContainer()

      await setupTaxStructure(container.resolve(ModuleRegistrationName.TAX))
      await createAdminUser(dbConnection, adminHeaders, container)
    })

    describe("POST /orders/:id/fulfillments", () => {
      beforeEach(async () => {
        const stockChannelOverride = (
          await api.post(
            `/admin/stock-locations`,
            { name: "test location" },
            adminHeaders
          )
        ).data.stock_location

        const inventoryItemOverride = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant", requires_shipping: true },
            adminHeaders
          )
        ).data.inventory_item

        const productOverride = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture`,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant",
                  sku: "test-variant",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemOverride.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
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

        const inventoryItemOverride2 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant-2", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        inventoryItemOverride3 = (
          await api.post(
            `/admin/inventory-items`,
            { sku: "test-variant-3", requires_shipping: false },
            adminHeaders
          )
        ).data.inventory_item

        await api.post(
          `/admin/inventory-items/${inventoryItemOverride2.id}/location-levels`,
          {
            location_id: stockChannelOverride.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        await api.post(
          `/admin/inventory-items/${inventoryItemOverride3.id}/location-levels`,
          {
            location_id: stockChannelOverride.id,
            stocked_quantity: 10,
          },
          adminHeaders
        )

        const productOverride2 = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture 2`,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant 2",
                  sku: "test-variant-2",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemOverride2.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
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

        productOverride3 = (
          await api.post(
            "/admin/products",
            {
              title: `Test fixture 3`,
              options: [
                { title: "size", values: ["large", "small"] },
                { title: "color", values: ["green"] },
              ],
              variants: [
                {
                  title: "Test variant 3",
                  sku: "test-variant-3",
                  inventory_items: [
                    {
                      inventory_item_id: inventoryItemOverride3.id,
                      required_quantity: 1,
                    },
                  ],
                  prices: [
                    {
                      currency_code: "usd",
                      amount: 100,
                    },
                  ],
                  options: {
                    size: "small",
                    color: "green",
                  },
                },
              ],
            },
            adminHeaders
          )
        ).data.product

        seeder = await createOrderSeeder({
          api,
          container: getContainer(),
          productOverride,
          additionalProducts: [
            { variant_id: productOverride2.variants[0].id, quantity: 1 },
            { variant_id: productOverride3.variants[0].id, quantity: 3 },
          ],
          stockChannelOverride,
          inventoryItemOverride,
        })
        order = seeder.order
        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      })

      it("should find the order querying it by number", async () => {
        const userEmail = "tony@stark-industries.com"

        const response = (
          await api.get(`/admin/orders/?q=non-existing`, adminHeaders)
        ).data

        expect(response.orders).toHaveLength(0)

        const response2 = (
          await api.get(`/admin/orders/?fields=+email&q=@stark`, adminHeaders)
        ).data

        expect(response2.orders).toHaveLength(1)
        expect(response2.orders[0].email).toEqual(userEmail)
      })

      it("should update stock levels correctly when creating partial fulfillment on an order", async () => {
        const orderItemId = order.items.find(
          (i) => i.variant_id === productOverride3.variants[0].id
        ).id

        let iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(10)
        expect(iitem.reserved_quantity).toBe(3)

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            location_id: seeder.stockLocation.id,
            items: [{ id: orderItemId, quantity: 1 }],
          },
          adminHeaders
        )

        iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(9)
        expect(iitem.reserved_quantity).toBe(2)

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            location_id: seeder.stockLocation.id,
            items: [{ id: orderItemId, quantity: 1 }],
          },
          adminHeaders
        )

        iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(8)
        expect(iitem.reserved_quantity).toBe(1)

        const {
          data: { order: fulfillableOrder },
        } = await api.post(
          `/admin/orders/${order.id}/fulfillments?fields=fulfillments.id`,
          {
            location_id: seeder.stockLocation.id,
            items: [{ id: orderItemId, quantity: 1 }],
          },
          adminHeaders
        )

        expect(fulfillableOrder.fulfillments).toHaveLength(3)

        iitem = (
          await api.get(
            `/admin/inventory-items/${inventoryItemOverride3.id}?fields=stocked_quantity,reserved_quantity`,
            adminHeaders
          )
        ).data.inventory_item

        expect(iitem.stocked_quantity).toBe(7)
        expect(iitem.reserved_quantity).toBe(0)
      })

      it("should only create fulfillments grouped by shipping requirement", async () => {
        const {
          response: { data },
        } = await api
          .post(
            `/admin/orders/${order.id}/fulfillments`,
            {
              location_id: seeder.stockLocation.id,
              items: [
                {
                  id: order.items[0].id,
                  quantity: 1,
                },
                {
                  id: order.items[1].id,
                  quantity: 1,
                },
              ],
            },
            adminHeaders
          )
          .catch((e) => e)

        expect(data).toEqual({
          type: "invalid_data",
          message: `Fulfillment can only be created entirely with items with shipping or items without shipping. Split this request into 2 fulfillments.`,
        })

        const {
          data: { order: fulfillableOrder },
        } = await api.post(
          `/admin/orders/${order.id}/fulfillments?fields=+fulfillments.id,fulfillments.requires_shipping`,
          {
            location_id: seeder.stockLocation.id,
            items: [{ id: order.items[0].id, quantity: 1 }],
          },
          adminHeaders
        )

        expect(fulfillableOrder.fulfillments).toHaveLength(1)

        const {
          data: { order: fulfillableOrder2 },
        } = await api.post(
          `/admin/orders/${order.id}/fulfillments?fields=+fulfillments.id,fulfillments.requires_shipping`,
          {
            location_id: seeder.stockLocation.id,
            items: [{ id: order.items[1].id, quantity: 1 }],
          },
          adminHeaders
        )

        expect(fulfillableOrder2.fulfillments).toHaveLength(2)
      })
    })

    describe("POST /orders/:id/fulfillments/:id/mark-as-delivered", () => {
      beforeEach(async () => {
        seeder = await createOrderSeeder({ api, container: getContainer() })
        order = seeder.order
        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order
      })

      it("should mark fulfillable item as delivered", async () => {
        let fulfillableItem = order.items.find(
          (item) => item.detail.fulfilled_quantity < item.detail.quantity
        )

        await api.post(
          `/admin/orders/${order.id}/fulfillments`,
          {
            location_id: seeder.stockLocation.id,
            items: [
              {
                id: fulfillableItem.id,
                quantity: 1,
              },
            ],
          },
          adminHeaders
        )

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        expect(order.items[0].detail).toEqual(
          expect.objectContaining({
            fulfilled_quantity: 1,
            delivered_quantity: 0,
          })
        )

        await api.post(
          `/admin/orders/${order.id}/fulfillments/${order.fulfillments[0].id}/mark-as-delivered`,
          {},
          adminHeaders
        )

        order = (await api.get(`/admin/orders/${order.id}`, adminHeaders)).data
          .order

        expect(order.items[0].detail).toEqual(
          expect.objectContaining({
            fulfilled_quantity: 1,
            delivered_quantity: 1,
          })
        )

        const { response } = await api
          .post(
            `/admin/orders/${order.id}/fulfillments/${order.fulfillments[0].id}/mark-as-delivered`,
            {},
            adminHeaders
          )
          .catch((e) => e)

        expect(response.data).toEqual({
          type: "not_allowed",
          message: "Fulfillment has already been marked delivered",
        })
      })
    })
  },
})
