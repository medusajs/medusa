import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

jest.setTimeout(120000)

// query.graph returns totals as BigNumber instances; coerce for numeric assertions.
const num = (value) => Number(value)

medusaIntegrationTestRunner({
  testSuite: ({ getContainer }) => {
    describe("Cart totals via Query (query.graph)", () => {
      let query
      let cartModule
      let cartId

      // 2 x $10 item + $10 shipping, no taxes/discounts =>
      //   total 30, subtotal 30, item_subtotal 20, item[0].quantity 2, item[0].total 20
      const seedCart = async () => {
        const cart = await cartModule.createCarts({
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
        })
        await cartModule.addShippingMethods([
          { cart_id: cart.id, name: "Standard", amount: 10 },
        ])
        return cart.id
      }

      beforeAll(() => {
        const container = getContainer()
        query = container.resolve(ContainerRegistrationKeys.QUERY)
        cartModule = container.resolve(Modules.CART)
      })

      beforeEach(async () => {
        cartId = await seedCart()
      })

      afterEach(async () => {
        await cartModule.deleteCarts([cartId])
      })

      it("returns cart totals when explicit total fields are requested", async () => {
        const {
          data: [cart],
        } = await query.graph({
          entity: "cart",
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
          filters: { id: cartId },
        })

        expect(num(cart.total)).toEqual(30)
        expect(num(cart.subtotal)).toEqual(30)
        expect(num(cart.tax_total)).toEqual(0)
        expect(num(cart.shipping_total)).toEqual(10)
        expect(num(cart.item_subtotal)).toEqual(20)

        expect(num(cart.items[0].quantity)).toEqual(2)
        expect(num(cart.items[0].unit_price)).toEqual(10)
        expect(num(cart.items[0].total)).toEqual(20)
        expect(num(cart.items[0].subtotal)).toEqual(20)
      })

      it('returns cart totals when fields is a bare wildcard ("*")', async () => {
        const {
          data: [cart],
        } = await query.graph({
          entity: "cart",
          fields: ["*"],
          filters: { id: cartId },
        })

        // A bare "*" must NOT suppress the computed totals.
        expect(num(cart.total)).toEqual(30)
        expect(num(cart.subtotal)).toEqual(30)
        expect(num(cart.item_subtotal)).toEqual(20)
      })

      it('returns cart totals when "*" is combined with explicit total fields', async () => {
        const {
          data: [cart],
        } = await query.graph({
          entity: "cart",
          fields: ["*", "total", "subtotal"],
          filters: { id: cartId },
        })

        expect(num(cart.total)).toEqual(30)
        expect(num(cart.subtotal)).toEqual(30)
      })

      it("computes correct cart total when scoped item totals are requested alongside a total", async () => {
        // Regression: requesting computed item totals (`items.total`,
        // `items.subtotal`) next to a scoped scalar used to under-count the cart
        // total to shipping-only (10) with item totals of 0.
        const {
          data: [cart],
        } = await query.graph({
          entity: "cart",
          fields: [
            "total",
            "item_subtotal",
            "items.total",
            "items.subtotal",
            "items.product_title",
          ],
          filters: { id: cartId },
        })

        expect(num(cart.total)).toEqual(30)
        expect(num(cart.item_subtotal)).toEqual(20)
        expect(num(cart.items[0].total)).toEqual(20)
        expect(num(cart.items[0].subtotal)).toEqual(20)
        expect(cart.items[0].product_title).toEqual("Cool Product")
      })

      it("computes correct totals with a partial scoped item selection", async () => {
        // `items.quantity` without `items.unit_price` previously starved the
        // calc, zeroing the item total and under-counting the cart total.
        const {
          data: [cart],
        } = await query.graph({
          entity: "cart",
          fields: ["total", "item_subtotal", "items.quantity", "items.total"],
          filters: { id: cartId },
        })

        expect(num(cart.total)).toEqual(30)
        expect(num(cart.item_subtotal)).toEqual(20)
        expect(num(cart.items[0].quantity)).toEqual(2)
        expect(num(cart.items[0].total)).toEqual(20)
      })
    })
  },
})
