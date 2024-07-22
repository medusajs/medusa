import {
  beginReturnOrderWorkflow,
  createOrderFulfillmentWorkflow,
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

        await createOrderFulfillmentWorkflow(container).run({
          input: {
            order_id: order.id,
            items: [
              {
                quantity: 1,
                id: order.items![0].id,
              },
            ],
          },
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
          const { result } = await requestItemReturnWorkflow(container).run({
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

          const returnItem = result.items?.[0]

          expect(returnItem).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              title: "Custom Item 2",
              unit_price: 50,
              quantity: 1,
              subtotal: 50,
              total: 50,
              fulfilled_total: 50,
              return_requested_total: 50,
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
            "Return id not found: does-not-exist"
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

          expect(error.error.message).toEqual(`Order id not found: ${order.id}`)
        })

        it("should throw an error if order change does not exist", async () => {
          const item = order.items![0]

          const [orderChange] = await service.listOrderChanges(
            { order_id: order.id, return_id: returnOrder.id },
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
            { order_id: order.id, return_id: returnOrder.id },
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
            `An active Order Change is required to proceed`
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
