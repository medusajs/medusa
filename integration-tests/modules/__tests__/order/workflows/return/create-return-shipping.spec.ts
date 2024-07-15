import {
  beginReturnOrderWorkflow,
  createReturnShippingMethodWorkflow,
} from "@medusajs/core-flows"
import { OrderDTO, ReturnDTO } from "@medusajs/types"
import {
  ContainerRegistrationKeys,
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

        ;[returnOrder] = await remoteQuery(remoteQueryObject)
      })

      describe("createReturnShippingMethodWorkflow", () => {
        it("should successfully add return shipping to order changes", async () => {
          const shippingOptionId = fixtures.shippingOption.id

          const { result } = await createReturnShippingMethodWorkflow(
            container
          ).run({
            input: {
              return_id: returnOrder.id,
              shipping_option_id: shippingOptionId,
            },
          })

          const shippingMethod = result.shipping_methods?.find(
            (sm) => sm.shipping_option_id === shippingOptionId
          )

          expect(shippingMethod).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "Shipping option",
              order_id: order.id,
              subtotal: 10,
              total: 10,
            })
          )
        })

        it("should successfully add return shipping with custom price to order changes", async () => {
          const shippingOptionId = fixtures.shippingOption.id

          const { result } = await createReturnShippingMethodWorkflow(
            container
          ).run({
            input: {
              return_id: returnOrder.id,
              shipping_option_id: shippingOptionId,
              custom_price: 20,
            },
          })

          const shippingMethod = result.shipping_methods?.find(
            (sm) => sm.shipping_option_id === shippingOptionId
          )

          expect(shippingMethod).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              name: "Shipping option",
              order_id: order.id,
              subtotal: 20,
              total: 20,
            })
          )
        })
      })
    })
  },
})
