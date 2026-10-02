import { CreateOrderDTO, IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(60000)

const baseInput = (quantity: number) =>
  ({
    email: "foo@bar.com",
    items: [
      {
        title: "Item 1",
        quantity,
        unit_price: 10,
      },
    ],
    sales_channel_id: "test",
    shipping_address: {
      first_name: "Test",
      last_name: "Test",
      address_1: "Test",
      city: "Test",
      country_code: "US",
      postal_code: "12345",
      phone: "12345",
    },
    billing_address: {
      first_name: "Test",
      last_name: "Test",
      address_1: "Test",
      city: "Test",
      country_code: "US",
      postal_code: "12345",
    },
    shipping_methods: [
      {
        name: "Test shipping method",
        amount: 10,
      },
    ],
    currency_code: "usd",
    customer_id: "joe",
  } as CreateOrderDTO)

moduleIntegrationTestRunner<IOrderModuleService>({
  moduleName: Modules.ORDER,
  testSuite: ({ service }) => {
    describe("Order Module Service - concurrent order changes", () => {
      it("should not lose a concurrent return's quantity when two returns for the same order race", async () => {
        const createdOrder = await service.createOrders(baseInput(2))
        const item = createdOrder.items![0]

        await service.registerFulfillment({
          order_id: createdOrder.id,
          items: [{ id: item.id, quantity: item.quantity }],
        })

        const attemptReturn = () =>
          service
            .createReturn({
              order_id: createdOrder.id,
              reference: Modules.FULFILLMENT,
              items: [{ id: item.id, quantity: 1 }],
            })
            .then(
              () => "ok",
              (e) => e.message
            )

        // Two concurrent returns for 1 unit each - together they exactly
        // exhaust the 2 fulfilled units, so both are legitimately valid and
        // both should succeed. What must not happen is one return's
        // contribution getting silently dropped by the other racing past it.
        const outcomes = await Promise.all([attemptReturn(), attemptReturn()])
        expect(outcomes).toEqual(["ok", "ok"])

        const refreshedOrder = await service.retrieveOrder(createdOrder.id, {
          select: ["id", "items.detail.return_requested_quantity"],
          relations: ["items", "items.detail"],
        })

        expect(
          (refreshedOrder.items![0] as any).detail.return_requested_quantity
        ).toEqual(2)

        const returns = await service.listReturns({
          order_id: createdOrder.id,
        })
        expect(returns).toHaveLength(2)
      })

      it("should not let two concurrent returns together over-return more than what was fulfilled", async () => {
        const createdOrder = await service.createOrders(baseInput(1))
        const item = createdOrder.items![0]

        await service.registerFulfillment({
          order_id: createdOrder.id,
          items: [{ id: item.id, quantity: item.quantity }],
        })

        const attemptReturn = () =>
          service
            .createReturn({
              order_id: createdOrder.id,
              reference: Modules.FULFILLMENT,
              items: [{ id: item.id, quantity: 1 }],
            })
            .then(
              () => "ok",
              (e) => e.message
            )

        // Only 1 unit was fulfilled - two concurrent returns each requesting
        // 1 unit must not both succeed, even though each is independently
        // valid against a stale, pre-race read of return_requested_quantity.
        const outcomes = await Promise.all([attemptReturn(), attemptReturn()])

        const succeeded = outcomes.filter((o) => o === "ok")
        const rejected = outcomes.filter((o) => o !== "ok")

        expect(succeeded).toHaveLength(1)
        expect(rejected).toHaveLength(1)
        expect(rejected[0]).toContain(
          "Cannot request to return more items than what was fulfilled"
        )

        const refreshedOrder = await service.retrieveOrder(createdOrder.id, {
          select: ["id", "items.detail.return_requested_quantity"],
          relations: ["items", "items.detail"],
        })

        expect(
          (refreshedOrder.items![0] as any).detail.return_requested_quantity
        ).toEqual(1)
      })
    })
  },
})
