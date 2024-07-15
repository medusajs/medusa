import {
  beginExchangeOrderWorkflow,
  createExchangeReturnShippingMethodWorkflow,
} from "@medusajs/core-flows"
import { OrderDTO, OrderExchangeDTO } from "@medusajs/types"
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

    describe("Order change: Create exchange return shipping", () => {
      let order: OrderDTO
      let fixtures

      let exchangeOrder: OrderExchangeDTO

      beforeEach(async () => {
        fixtures = await prepareDataFixtures({ container })

        order = await createOrderFixture({
          container,
          product: fixtures.product,
          location: fixtures.location,
          inventoryItem: fixtures.inventoryItem,
        })

        await beginExchangeOrderWorkflow(container).run({
          input: { order_id: order.id },
          throwOnError: true,
        })

        const remoteQuery = container.resolve(
          ContainerRegistrationKeys.REMOTE_QUERY
        )

        const remoteQueryObject = remoteQueryObjectFromString({
          entryPoint: "order_exchange",
          variables: { order_id: order.id },
          fields: ["order_id", "id", "status", "order_change_id", "return_id"],
        })

        ;[exchangeOrder] = await remoteQuery(remoteQueryObject)
      })

      describe("createExchangeReturnShippingMethodWorkflow", () => {
        it("should successfully add exchange return shipping to order changes", async () => {
          const shippingOptionId = fixtures.shippingOption.id

          const { result } = await createExchangeReturnShippingMethodWorkflow(
            container
          ).run({
            input: {
              exchangeId: exchangeOrder.id,
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
                exchange_id: exchangeOrder.id,
                order_id: exchangeOrder.order_id,
                return_id: exchangeOrder.return_id,
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

          const { result } = await createExchangeReturnShippingMethodWorkflow(
            container
          ).run({
            input: {
              exchangeId: exchangeOrder.id,
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
                exchange_id: exchangeOrder.id,
                order_id: exchangeOrder.order_id,
                return_id: exchangeOrder.return_id,
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
