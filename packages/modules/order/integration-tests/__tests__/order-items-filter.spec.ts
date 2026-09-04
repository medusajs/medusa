import { IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IOrderModuleService>({
  moduleName: Modules.ORDER,
  testSuite: ({ service }) => {
    describe("Order - filter on order_item fields", () => {
      it("lists orders filtered by items.fulfilled_quantity", async () => {
        const [createdOrder] = await service.createOrders([
          {
            currency_code: "eur",
            items: [
              {
                title: "filtered item",
                quantity: 2,
                unit_price: 100,
              },
            ],
          },
        ])

        const orders = await service.listOrders(
          { id: [createdOrder.id], items: { fulfilled_quantity: 0 } },
          { relations: ["items"] }
        )

        expect(orders.length).toBe(1)
        expect(orders[0].id).toBe(createdOrder.id)
      })

      it("excludes orders when the order_item filter does not match", async () => {
        const [createdOrder] = await service.createOrders([
          {
            currency_code: "eur",
            items: [
              {
                title: "filtered item",
                quantity: 2,
                unit_price: 100,
              },
            ],
          },
        ])

        const orders = await service.listOrders({
          id: [createdOrder.id],
          items: { fulfilled_quantity: 999 },
        })

        expect(orders.length).toBe(0)
      })

      it("still supports filtering by items.quantity", async () => {
        const [createdOrder] = await service.createOrders([
          {
            currency_code: "eur",
            items: [
              {
                title: "quantity item",
                quantity: 2,
                unit_price: 100,
              },
            ],
          },
        ])

        const orders = await service.listOrders({
          id: [createdOrder.id],
          items: { quantity: 2 },
        })

        expect(orders.length).toBe(1)
      })
    })
  },
})
