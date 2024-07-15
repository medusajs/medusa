import {
  beginReturnOrderWorkflow,
  createReturnShippingMethodWorkflow,
} from "@medusajs/core-flows"
import { IFulfillmentModuleService, OrderDTO, ReturnDTO } from "@medusajs/types"
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

    describe("Order change: Create return shipping", () => {
      let order: OrderDTO
      let service: IFulfillmentModuleService
      let fixtures

      let returnOrder: ReturnDTO

      beforeEach(async () => {
        fixtures = await prepareDataFixtures({ container })

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

        service = container.resolve(ModuleRegistrationName.FULFILLMENT)
        ;[returnOrder] = await remoteQuery(remoteQueryObject)
      })

      describe("createReturnShippingMethodWorkflow", () => {
        it("should successfully add return shipping to order changes", async () => {
          const shippingOptionId = fixtures.shippingOption.id

          const { result } = await createReturnShippingMethodWorkflow(
            container
          ).run({
            input: {
              returnId: returnOrder.id,
              shippingOptionId: shippingOptionId,
            },
          })

          const orderChange = result?.[0]

          expect(orderChange).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              reference: "order_shipping_method",
              reference_id: expect.any(String),
              details: {
                order_id: returnOrder.order_id,
                return_id: returnOrder.id,
              },
              raw_amount: { value: "10", precision: 20 },
              applied: false,
              action: "SHIPPING_ADD",
              amount: 10,
            })
          )
        })

        it("should successfully add return shipping with custom price to order changes", async () => {
          const shippingOptionId = fixtures.shippingOption.id

          const { result } = await createReturnShippingMethodWorkflow(
            container
          ).run({
            input: {
              returnId: returnOrder.id,
              shippingOptionId: shippingOptionId,
              customShippingPrice: 20,
            },
          })

          const orderChange = result?.[0]

          expect(orderChange).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              reference: "order_shipping_method",
              reference_id: expect.any(String),
              details: {
                order_id: returnOrder.order_id,
                return_id: returnOrder.id,
              },
              raw_amount: { value: "20", precision: 20 },
              applied: false,
              action: "SHIPPING_ADD",
              amount: 20,
            })
          )
        })
      })
    })
  },
})
