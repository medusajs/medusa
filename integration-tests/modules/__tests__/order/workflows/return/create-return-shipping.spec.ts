import {
  beginReturnOrderWorkflow,
  createReturnShippingMethodWorkflow,
} from "@medusajs/core-flows"
import { IOrderModuleService, OrderDTO, ReturnDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createOrderFixture, prepareDataFixtures } from "../__fixtures__"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: { MEDUSA_FF_MEDUSA_V2: true },
  testSuite: ({ getContainer }) => {
    let container

    beforeAll(() => {
      container = getContainer()
    })

    describe("Order change action workflows", () => {
      let order: OrderDTO
      let service: IOrderModuleService
      let returnOrder: ReturnDTO

      beforeEach(async () => {
        const fixtures = await prepareDataFixtures({ container })

        order = await createOrderFixture({
          container,
          product: fixtures.product,
          location: fixtures.location,
          inventoryItem: fixtures.inventoryItem,
        })

        await beginReturnOrderWorkflow(container).run({
          input: { order_id: order.id },
          throwOnError: true,
        })

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )

        const remoteQueryObject = remoteQueryObjectFromString({
          entryPoint: "return",
          variables: { order_id: order.id },
          fields: ["order_id", "id", "status", "order_change_id"],
        })

        service = container.resolve(ModuleRegistrationName.ORDER)
        ;[returnOrder] = await remoteQuery(remoteQueryObject)
      })

      describe("createReturnShippingMethodWorkflow", () => {
        it.only("should successfully add a return item to order change", async () => {
          const item = order.items![0]

          const shippingMethodData = {
            name: "Standard Shipping",
            amount: 1000,
          }

          const { result } = await createReturnShippingMethodWorkflow(
            container
          ).run({
            input: {
              returnId: returnOrder.id,
              shippingMethod: shippingMethodData,
            },
          })

          console.log("Result: ", result)

          //   expect(returnItem).toEqual(
          //     expect.objectContaining({
          //       id: expect.any(String),
          //       order_id: order.id,
          //       return_id: returnOrder.id,
          //       reference: "return",
          //       reference_id: returnOrder.id,
          //       details: {
          //         reference_id: item.id,
          //         return_id: returnOrder.id,
          //         quantity: 1,
          //       },
          //       internal_note: "test",
          //       action: "RETURN_ITEM",
          //     })
          //   )
        })
      })
    })
  },
})
