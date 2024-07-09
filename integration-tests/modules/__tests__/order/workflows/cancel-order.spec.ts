import {
  cancelOrderFulfillmentWorkflow,
  cancelOrderWorkflow,
  createOrderFulfillmentWorkflow,
} from "@medusajs/core-flows"
import {
  InventoryItemDTO,
  IOrderModuleService,
  OrderWorkflow,
  ProductDTO,
  RegionDTO,
  ShippingOptionDTO,
  StockLocationDTO,
} from "@medusajs/types"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  remoteQueryObjectFromString,
} from "@medusajs/utils"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import { createOrderFixture, prepareDataFixtures } from "./__fixtures__"

jest.setTimeout(500000)

const env = { MEDUSA_FF_MEDUSA_V2: true }

medusaIntegrationTestRunner({
  env,
  testSuite: ({ getContainer }) => {
    let container

    beforeAll(() => {
      container = getContainer()
    })

    describe("Order fulfillment workflow", () => {
      let shippingOption: ShippingOptionDTO
      let region: RegionDTO
      let location: StockLocationDTO
      let product: ProductDTO
      let inventoryItem: InventoryItemDTO
      let orderService: IOrderModuleService

      beforeEach(async () => {
        const fixtures = await prepareDataFixtures({
          container,
        })

        shippingOption = fixtures.shippingOption
        region = fixtures.region
        location = fixtures.location
        product = fixtures.product
        inventoryItem = fixtures.inventoryItem

        orderService = container.resolve(ModuleRegistrationName.ORDER)
      })

      it("should cancel an order", async () => {
        const order = await createOrderFixture({
          container,
          product,
          location,
          inventoryItem,
        })

        // Create a fulfillment
        const createOrderFulfillmentData: OrderWorkflow.CreateOrderFulfillmentWorkflowInput =
          {
            order_id: order.id,
            created_by: "user_1",
            items: [
              {
                id: order.items![0].id,
                quantity: 1,
              },
            ],
            no_notification: false,
            location_id: undefined,
          }

        await createOrderFulfillmentWorkflow(container).run({
          input: createOrderFulfillmentData,
        })
      })

      it("should fail to cancel an order that has fulfilled items", async () => {
        const order = await createOrderFixture({
          container,
          product,
          location,
          inventoryItem,
        })

        // Create a fulfillment
        const createOrderFulfillmentData: OrderWorkflow.CreateOrderFulfillmentWorkflowInput =
          {
            order_id: order.id,
            created_by: "user_1",
            items: [
              {
                id: order.items![0].id,
                quantity: 1,
              },
            ],
            no_notification: false,
            location_id: undefined,
          }

        await createOrderFulfillmentWorkflow(container).run({
          input: createOrderFulfillmentData,
        })

        await expect(
          cancelOrderWorkflow(container).run({
            input: {
              order_id: order.id,
            },
          })
        ).rejects.toMatchObject({
          message:
            "All fulfillments must be canceled before canceling an order",
        })

        // Cancel the fulfillment
        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )
        const remoteQueryObject = remoteQueryObjectFromString({
          entryPoint: "order",
          variables: {
            id: order.id,
          },
          fields: ["id", "fulfillments.id"],
        })

        const [orderFulfill] = await remoteQuery(remoteQueryObject)
        await cancelOrderFulfillmentWorkflow(container).run({
          input: {
            order_id: orderFulfill.id,
            fulfillment_id: orderFulfill.fulfillments[0].id,
          },
        })

        await cancelOrderWorkflow(container).run({
          input: {
            order_id: order.id,
          },
        })

        const finalOrderQuery = remoteQueryObjectFromString({
          entryPoint: "order",
          variables: {
            id: order.id,
          },
          fields: ["status", "fulfillments.canceled_at"],
        })
        const [finalOrder] = await remoteQuery(finalOrderQuery)

        expect(finalOrder).toEqual(
          expect.objectContaining({
            status: "canceled",
            fulfillments: [
              expect.objectContaining({
                canceled_at: expect.any(Date),
              }),
            ],
          })
        )
      })
    })
  },
})
