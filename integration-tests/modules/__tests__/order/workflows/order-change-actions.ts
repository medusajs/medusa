import {
  createOrderChangeActionsWorkflow,
  createOrderChangeActionsWorkflowId,
  createOrderChangeWorkflow,
  deleteOrderChangeActionsWorkflow,
  deleteOrderChangeActionsWorkflowId,
} from "@medusajs/core-flows"
import { IOrderModuleService, OrderChangeDTO, OrderDTO } from "@medusajs/types"
import { ChangeActionType, ModuleRegistrationName } from "@medusajs/utils"
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
        service = container.resolve(ModuleRegistrationName.ORDER)
      })

      describe("createOrderChangeActionWorkflow", () => {
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

        it("should delete created actions when a rollback occurs on a workflow", async () => {
          const workflow = createOrderChangeActionsWorkflow(container)

          workflow.appendAction("throw", createOrderChangeActionsWorkflowId, {
            invoke: async function failStep() {
              throw new Error(`Fail`)
            },
          })

          const {
            errors: [error],
          } = await workflow.run({
            input: [
              {
                action: ChangeActionType.ITEM_ADD,
                order_change_id: orderChange.id,
                order_id: order.id,
              },
            ],
            throwOnError: false,
          })

          const orderChange1 = await service.retrieveOrderChange(
            orderChange.id,
            { relations: ["actions"] }
          )

          expect(error).toBeDefined()
          expect(orderChange1.actions).toHaveLength(0)
        })
      })

      describe("deleteOrderChangeActionsWorkflow", () => {
        it("should successfully delete an order change action", async () => {
          const { result: changeOrderActions } =
            await createOrderChangeActionsWorkflow(container).run({
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

          await deleteOrderChangeActionsWorkflow(container).run({
            input: { ids: changeOrderActions.map((coa) => coa.id) },
          })

          const orderChange2 = await service.retrieveOrderChange(
            orderChange.id,
            { relations: ["actions"], withDeleted: true }
          )

          expect(orderChange2.actions).toHaveLength(2)
          expect(orderChange2).toEqual(
            expect.objectContaining({
              id: orderChange.id,
              actions: expect.arrayContaining([
                expect.objectContaining({
                  deleted_at: expect.any(Date),
                }),
                expect.objectContaining({
                  deleted_at: expect.any(Date),
                }),
              ]),
            })
          )
        })

        it("should rollback to its original state when future step throws error", async () => {
          const { result: changeOrderActions } =
            await createOrderChangeActionsWorkflow(container).run({
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

          const workflow = deleteOrderChangeActionsWorkflow(container)

          workflow.appendAction("throw", deleteOrderChangeActionsWorkflowId, {
            invoke: async function failStep() {
              throw new Error(`Fail`)
            },
          })

          const {
            errors: [error],
          } = await workflow.run({
            input: { ids: changeOrderActions.map((coa) => coa.id) },
            throwOnError: false,
          })

          expect(error.error).toEqual(
            expect.objectContaining({
              message: `Fail`,
            })
          )

          const orderChange2 = await service.retrieveOrderChange(
            orderChange.id,
            { relations: ["actions"] }
          )

          expect(orderChange2.actions).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                deleted_at: null,
              }),
              expect.objectContaining({
                deleted_at: null,
              }),
            ])
          )
        })
      })
    })
  },
})
