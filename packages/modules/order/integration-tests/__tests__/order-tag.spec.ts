import { CreateOrderDTO, IOrderModuleService } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import { moduleIntegrationTestRunner } from "@medusajs/test-utils"

jest.setTimeout(100000)

moduleIntegrationTestRunner<IOrderModuleService>({
  moduleName: Modules.ORDER,
  testSuite: ({ service }) => {
    describe("OrderTag", () => {
      const orderFixture = {
        email: "foo@bar.com",
        currency_code: "usd",
        customer_id: "joe",
      } as CreateOrderDTO

      it("creates an order tag and assigns it to an order via order.tags", async () => {
        const order = await service.createOrders({
          ...orderFixture,
          tags: [{ value: "priority" }],
        })

        const updated = await service.retrieveOrder(order.id, {
          relations: ["tags"],
        })

        expect(updated.tags?.map((t) => t.value)).toEqual(["priority"])

        const [tag] = await service.listOrderTags({ value: "priority" })
        expect(tag.value).toEqual("priority")
      })

      it("rejects creating a second tag with the same value", async () => {
        await service.createOrderTags({ value: "duplicate" })

        await expect(
          service.createOrderTags({ value: "duplicate" })
        ).rejects.toThrow()
      })
    })
  },
})
