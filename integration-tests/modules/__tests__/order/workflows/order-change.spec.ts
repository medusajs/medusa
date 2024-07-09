import {
  cancelOrderChangeWorkflow,
  cancelOrderChangeWorkflowId,
  createOrderChangeWorkflow,
  deleteOrderChangeWorkflow,
  deleteOrderChangeWorkflowId,
} from "@medusajs/core-flows"
import { IOrderModuleService, OrderChangeDTO, OrderDTO } from "@medusajs/types"
import { ModuleRegistrationName } from "@medusajs/utils"
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

    describe("Order change workflows", () => {
      let order: OrderDTO
      let service: IOrderModuleService

      describe("createOrderChangeWorkflow", () => {
        beforeEach(async () => {
          const fixtures = await prepareDataFixtures({
            container,
          })

          order = await createOrderFixture({
            container,
            product: fixtures.product,
            location: fixtures.location,
            inventoryItem: fixtures.inventoryItem,
          })
        })

        it("should successfully create an order change", async () => {
          const { result } = await createOrderChangeWorkflow(container).run({
            input: {
              order_id: order.id,
            },
          })

          expect(result).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              order_id: order.id,
            })
          )
        })

        it("should throw an error when creating an order change when an active one already exists", async () => {
          await createOrderChangeWorkflow(container).run({
            input: {
              order_id: order.id,
            },
          })

          const {
            errors: [error],
          } = await createOrderChangeWorkflow(container).run({
            input: {
              order_id: order.id,
            },
            throwOnError: false,
          })

          expect(error.error).toEqual(
            expect.objectContaining({
              message: `Order (${order.id}) already has an existing active order change`,
            })
          )
        })
      })

      describe("cancelOrderChangeWorkflow", () => {
        let orderChange: OrderChangeDTO

        beforeEach(async () => {
          const fixtures = await prepareDataFixtures({
            container,
          })

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

        it("should successfully cancel an order change", async () => {
          await cancelOrderChangeWorkflow(container).run({
            input: {
              id: orderChange.id,
              canceled_by: "test",
            },
          })

          const orderChange2 = await service.retrieveOrderChange(orderChange.id)

          expect(orderChange2).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              canceled_by: "test",
              canceled_at: expect.any(Date),
            })
          )
        })

        it("should rollback to its original state when step throws error", async () => {
          const workflow = cancelOrderChangeWorkflow(container)

          workflow.appendAction("throw", cancelOrderChangeWorkflowId, {
            invoke: async function failStep() {
              throw new Error(`Fail`)
            },
          })

          const {
            errors: [error],
          } = await workflow.run({
            input: {
              id: orderChange.id,
              canceled_by: "test",
            },
            throwOnError: false,
          })

          expect(error.error).toEqual(
            expect.objectContaining({
              message: `Fail`,
            })
          )

          const orderChange2 = await service.retrieveOrderChange(orderChange.id)

          expect(orderChange2).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              canceled_by: null,
              canceled_at: null,
            })
          )
        })
      })

      describe("deleteOrderChangeWorkflow", () => {
        let orderChange: OrderChangeDTO

        beforeEach(async () => {
          const fixtures = await prepareDataFixtures({
            container,
          })

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

        it("should successfully delete an order change", async () => {
          await deleteOrderChangeWorkflow(container).run({
            input: { id: orderChange.id },
          })

          const orderChange2 = await service.retrieveOrderChange(
            orderChange.id,
            { withDeleted: true }
          )

          expect(orderChange2).toEqual(
            expect.objectContaining({
              id: orderChange.id,
              deleted_at: expect.any(Date),
            })
          )
        })

        it("should rollback to its original state when step throws error", async () => {
          const workflow = deleteOrderChangeWorkflow(container)

          workflow.appendAction("throw", deleteOrderChangeWorkflowId, {
            invoke: async function failStep() {
              throw new Error(`Fail`)
            },
          })

          const {
            errors: [error],
          } = await workflow.run({
            input: { id: orderChange.id },
            throwOnError: false,
          })

          expect(error.error).toEqual(
            expect.objectContaining({
              message: `Fail`,
            })
          )

          const orderChange2 = await service.retrieveOrderChange(
            orderChange.id,
            { withDeleted: true }
          )

          expect(orderChange2).toEqual(
            expect.objectContaining({
              id: orderChange.id,
              deleted_at: null,
            })
          )
        })
      })
    })
  },
})
