import {
  createOrderChangeActionsWorkflow,
  createOrderChangeWorkflow,
} from "@medusajs/core-flows"
import { IOrderModuleService, OrderChangeDTO, OrderDTO } from "@medusajs/types"
import { ChangeActionType } from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createOrderFixture, prepareDataFixtures } from "./__fixtures__"

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
      let orderChange: OrderChangeDTO

      describe("createOrderChangeActionWorkflow", () => {
        beforeEach(async () => {
          const fixtures = await prepareDataFixtures({ container })

          order = await createOrderFixture({
            container,
            product: fixtures.product,
            location: fixtures.location,
            inventoryItem: fixtures.inventoryItem,
          })

          const { result } = await createOrderChangeWorkflow(container).run({
            input: { order_id: order.id },
          })

          orderChange = result
        })

        it("should successfully create an order change action", async () => {
          const { result } = await createOrderChangeActionsWorkflow(
            container
          ).run({
            input: [
              {
                action: ChangeActionType.ITEM_ADD,
                order_change_id: orderChange.id,
                order_id: order.id,
              },
              {
                action: ChangeActionType.ITEM_REMOVE,
                order_change_id: orderChange.id,
                order_id: order.id,
              },
            ],
          })

          expect(result).toHaveLength(2)
          expect(result).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                order_id: order.id,
                order_change_id: orderChange.id,
                action: ChangeActionType.ITEM_ADD,
              }),
              expect.objectContaining({
                id: expect.any(String),
                order_id: order.id,
                order_change_id: orderChange.id,
                action: ChangeActionType.ITEM_REMOVE,
              }),
            ])
          )
        })

        it("should throw an error when creating an order change when an active one already exists", async () => {
          const {
            errors: [error],
          } = await createOrderChangeActionsWorkflow(container).run({
            input: [{ order_id: order.id } as any],
            throwOnError: false,
          })

          expect(error.error).toEqual(
            expect.objectContaining({
              message: expect.stringContaining(
                `Value for OrderChangeAction.action is required, 'undefined' found`
              ),
            })
          )
        })
      })
    })
  },
})
