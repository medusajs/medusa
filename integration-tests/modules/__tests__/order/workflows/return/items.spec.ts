import {
  beginReturnOrderWorkflow,
  requestItemReturnWorkflow,
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

      describe("requestItemReturnWorkflow", () => {
        it("should successfully add a return item to order change", async () => {
          const item = order.items![0]
          const {
            result: [returnItem],
          } = await requestItemReturnWorkflow(container).run({
            input: {
              return_id: returnOrder.id,
              items: [
                {
                  id: item.id,
                  quantity: 1,
                  internal_note: "test",
                },
              ],
            },
          })

          expect(returnItem).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              order_id: order.id,
              return_id: returnOrder.id,
              reference: "return",
              reference_id: returnOrder.id,
              details: {
                reference_id: item.id,
                quantity: 1,
              },
              internal_note: "test",
              action: "RETURN_ITEM",
            })
          )
        })

        it("should throw an error if return does not exist", async () => {
          const item = order.items![0]
          const {
            errors: [error],
          } = await requestItemReturnWorkflow(container).run({
            input: {
              return_id: "does-not-exist",
              items: [
                {
                  id: item.id,
                  quantity: 1,
                  internal_note: "test",
                },
              ],
            },
            throwOnError: false,
          })

          expect(error.error.message).toEqual(
            "order id not found: does-not-exist"
          )
        })

        it("should throw an error if order does not exist", async () => {
          const item = order.items![0]

          await service.deleteOrders(order.id)

          const {
            errors: [error],
          } = await requestItemReturnWorkflow(container).run({
            input: {
              return_id: returnOrder.id,
              items: [
                {
                  id: item.id,
                  quantity: 1,
                  internal_note: "test",
                },
              ],
            },
            throwOnError: false,
          })

          expect(error.error.message).toEqual(`order id not found: ${order.id}`)
        })

        it("should throw an error if order change does not exist", async () => {
          const item = order.items![0]

          const [orderChange] = await service.listOrderChanges(
            { order_id: order.id },
            {}
          )

          await service.deleteOrderChanges(orderChange.id)

          const {
            errors: [error],
          } = await requestItemReturnWorkflow(container).run({
            input: {
              return_id: returnOrder.id,
              items: [
                {
                  id: item.id,
                  quantity: 1,
                  internal_note: "test",
                },
              ],
            },
            throwOnError: false,
          })

          expect(error.error.message).toEqual(
            `An active Order Change is required to proceed`
          )
        })

        it("should throw an error if order change is not active", async () => {
          const item = order.items![0]

          const [orderChange] = await service.listOrderChanges(
            { order_id: order.id },
            {}
          )

          await service.cancelOrderChange(orderChange.id)

          const {
            errors: [error],
          } = await requestItemReturnWorkflow(container).run({
            input: {
              return_id: returnOrder.id,
              items: [
                {
                  id: item.id,
                  quantity: 1,
                  internal_note: "test",
                },
              ],
            },
            throwOnError: false,
          })

          expect(error.error.message).toEqual(
            `Order Change cannot be modified: ${orderChange.id}.`
          )
        })

        it("should throw an error if return item is not present in the order", async () => {
          const {
            errors: [error],
          } = await requestItemReturnWorkflow(container).run({
            input: {
              return_id: returnOrder.id,
              items: [
                {
                  id: "does-not-exist",
                  quantity: 1,
                  internal_note: "test",
                },
              ],
            },
            throwOnError: false,
          })

          expect(error.error.message).toEqual(
            `Items with ids does-not-exist does not exist in order with id ${order.id}.`
          )
        })
      })
    })
  },
})
