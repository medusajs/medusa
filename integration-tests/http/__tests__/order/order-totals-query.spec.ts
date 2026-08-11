import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
  beginOrderEditOrderWorkflow,
  confirmOrderEditRequestWorkflow,
  orderEditUpdateItemQuantityWorkflow,
  requestOrderEditRequestWorkflow,
} from "@medusajs/core-flows"

jest.setTimeout(120000)

// query.graph returns totals as BigNumber instances; coerce for numeric assertions.
const num = (value) => Number(value)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Order totals via Query (query.graph)", () => {
      let query
      let orderModule
      let orderId

      // 2 x $10 item + $10 shipping, no taxes/discounts =>
      //   total 30, subtotal 30, item_subtotal 20, item[0].quantity 2, item[0].total 20
      const seedOrder = async () => {
        const created = await orderModule.createOrders({
          currency_code: "usd",
          email: "test@medusajs.com",
          items: [
            {
              title: "Test item",
              product_title: "Cool Product",
              thumbnail: "https://example.com/thumb.png",
              quantity: 2,
              unit_price: 10,
            },
          ],
          shipping_methods: [{ name: "Standard", amount: 10 }],
        })
        return created.id
      }

      beforeAll(() => {
        const container = getContainer()
        query = container.resolve(ContainerRegistrationKeys.QUERY)
        orderModule = container.resolve(Modules.ORDER)
      })

      beforeEach(async () => {
        orderId = await seedOrder()
      })

      afterEach(async () => {
        await orderModule.deleteOrders([orderId])
      })

      it("returns order totals when explicit total fields are requested", async () => {
        const {
          data: [order],
        } = await query.graph({
          entity: "order",
          fields: [
            "id",
            "currency_code",
            "total",
            "subtotal",
            "tax_total",
            "shipping_total",
            "item_subtotal",
            "items.*",
          ],
          filters: { id: orderId },
        })

        expect(num(order.total)).toEqual(30)
        expect(num(order.subtotal)).toEqual(30)
        expect(num(order.tax_total)).toEqual(0)
        expect(num(order.shipping_total)).toEqual(10)
        expect(num(order.item_subtotal)).toEqual(20)

        expect(num(order.items[0].quantity)).toEqual(2)
        expect(num(order.items[0].unit_price)).toEqual(10)
        expect(num(order.items[0].total)).toEqual(20)
        expect(num(order.items[0].subtotal)).toEqual(20)
      })

      it('returns order totals when fields is a bare wildcard ("*")', async () => {
        const {
          data: [order],
        } = await query.graph({
          entity: "order",
          fields: ["*"],
          filters: { id: orderId },
        })

        // A bare "*" must NOT suppress the computed totals.
        expect(num(order.total)).toEqual(30)
        expect(num(order.subtotal)).toEqual(30)
        expect(num(order.item_subtotal)).toEqual(20)
      })

      it('returns order totals when "*" is combined with explicit total fields', async () => {
        const {
          data: [order],
        } = await query.graph({
          entity: "order",
          fields: ["*", "total", "subtotal"],
          filters: { id: orderId },
        })

        expect(num(order.total)).toEqual(30)
        expect(num(order.subtotal)).toEqual(30)
      })

      it("computes correct order total when a scoped item field is requested alongside totals", async () => {
        // Regression: requesting `items.title` (a scoped scalar) next to a total
        // used to under-count the order total to shipping-only (10) because the
        // item's `quantity` was not loaded and its total computed as 0.
        const {
          data: [order],
        } = await query.graph({
          entity: "order",
          fields: [
            "total",
            "subtotal",
            "item_subtotal",
            "items.title",
            "items.product_title",
          ],
          filters: { id: orderId },
        })

        expect(num(order.total)).toEqual(30)
        expect(num(order.subtotal)).toEqual(30)
        expect(num(order.item_subtotal)).toEqual(20)
        expect(order.items[0].product_title).toEqual("Cool Product")
      })

      it("hydrates item quantity/unit_price and computes item totals with scoped item fields", async () => {
        const {
          data: [order],
        } = await query.graph({
          entity: "order",
          fields: [
            "total",
            "item_subtotal",
            "items.quantity",
            "items.unit_price",
            "items.total",
            "items.subtotal",
          ],
          filters: { id: orderId },
        })

        expect(num(order.total)).toEqual(30)
        expect(num(order.item_subtotal)).toEqual(20)
        expect(num(order.items[0].quantity)).toEqual(2)
        expect(num(order.items[0].unit_price)).toEqual(10)
        expect(num(order.items[0].total)).toEqual(20)
        expect(num(order.items[0].subtotal)).toEqual(20)
      })

      it("does not throw when requesting item detail fields alongside a total", async () => {
        // Regression: `items.detail.*` + a total used to throw
        // "Item version is required to load adjustments".
        const {
          data: [order],
        } = await query.graph({
          entity: "order",
          fields: ["total", "items.detail.quantity"],
          filters: { id: orderId },
        })

        expect(num(order.total)).toEqual(30)
        expect(num(order.items[0].detail.quantity)).toEqual(2)
      })

      it("returns correct totals for a versioned (order-edited) order", async () => {
        const container = getContainer()

        const {
          data: [preEdit],
        } = await query.graph({
          entity: "order",
          fields: ["items.id"],
          filters: { id: orderId },
        })
        const lineItemId = preEdit.items[0].id

        // Bump the order to version 2 by changing the item quantity 2 -> 5.
        await beginOrderEditOrderWorkflow(container).run({
          input: { order_id: orderId },
        })
        await orderEditUpdateItemQuantityWorkflow(container).run({
          input: {
            order_id: orderId,
            items: [{ id: lineItemId, quantity: 5 }],
          },
        })
        await requestOrderEditRequestWorkflow(container).run({
          input: { order_id: orderId },
        })
        await confirmOrderEditRequestWorkflow(container).run({
          input: { order_id: orderId },
        })

        // 5 x $10 + $10 shipping => total 60, item_subtotal 50, item[0].quantity 5.
        // Use a scoped item field (not `items.*`) so this also guards the fix on a
        // versioned order: previously this under-counted the total to 10.
        const {
          data: [order],
        } = await query.graph({
          entity: "order",
          fields: [
            "version",
            "total",
            "subtotal",
            "item_subtotal",
            "items.quantity",
            "items.total",
          ],
          filters: { id: orderId },
        })

        expect(order.version).toEqual(2)
        expect(num(order.total)).toEqual(60)
        expect(num(order.subtotal)).toEqual(60)
        expect(num(order.item_subtotal)).toEqual(50)
        expect(order.items).toHaveLength(1)
        expect(num(order.items[0].quantity)).toEqual(5)
        expect(num(order.items[0].total)).toEqual(50)
      })
    })
  },
})
