import {
  beginExchangeOrderWorkflow,
  createExchangeShippingMethodWorkflow,
  createOrderFulfillmentWorkflow,
  orderExchangeAddNewItemWorkflow,
  orderExchangeRequestItemReturnWorkflow,
  updateExchangeAddItemWorkflow,
} from "@zjedene-medusa/core-flows"
import { medusaIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { IFulfillmentModuleService, OrderDTO } from "@zjedene-medusa/types"
import {
  ContainerRegistrationKeys,
  Modules,
  remoteQueryObjectFromString,
} from "@zjedene-medusa/utils"
import { createOrderFixture, prepareDataFixtures } from "../__fixtures__"
jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ getContainer }) => {
    let container

    beforeAll(() => {
      container = getContainer()
    })

    describe("Order change: Exchange shipping", () => {
      let order: OrderDTO
      let service: IFulfillmentModuleService
      let fixtures

      let exchangeOrder: OrderDTO

      beforeEach(async () => {
        fixtures = await prepareDataFixtures({ container })

        order = await createOrderFixture({
          container,
          product: fixtures.product,
          location: fixtures.location,
          inventoryItem: fixtures.inventoryItem,
          salesChannel: fixtures.salesChannel,
          customer: fixtures.customer,
          region: fixtures.region,
          overrides: { quantity: 2 },
        })

        await createOrderFulfillmentWorkflow(container).run({
          input: {
            order_id: order.id,
            items: [
              {
                quantity: 2,
                id: order.items![0].id,
              },
            ],
          },
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
          fields: ["order_id", "id", "status", "order_change_id"],
        })

        service = container.resolve(Modules.FULFILLMENT)
        ;[exchangeOrder] = await remoteQuery(remoteQueryObject)
      })

      describe("createExchangeShippingMethodWorkflow", () => {
        it("should successfully add caluclated inbound and outbound shipping to order changes", async () => {
          const { result } = await orderExchangeAddNewItemWorkflow(
            container
          ).run({
            input: {
              exchange_id: exchangeOrder.id,
              items: [
                {
                  variant_id: fixtures.product.variants[0].id,
                  quantity: 1,
                  internal_note: "test",
                },
              ],
            },
          })

          const shippingOptionId = fixtures.shippingOptionCalculated.id

          const { result: orderChangePreview } =
            await createExchangeShippingMethodWorkflow(container).run({
              input: {
                exchange_id: exchangeOrder.id,
                shipping_option_id: shippingOptionId,
              },
            })

          // Original shipping + outbound
          expect(orderChangePreview.shipping_methods).toHaveLength(2)

          const outboundShippingMethod =
            orderChangePreview.shipping_methods?.find(
              (sm) => sm.shipping_option_id === shippingOptionId
            )

          expect((outboundShippingMethod as any).actions).toEqual([
            expect.objectContaining({
              id: expect.any(String),
              reference: "order_shipping_method",
              reference_id: expect.any(String),
              raw_amount: { value: "2.5", precision: 20 },
              return_id: null,
              exchange_id: exchangeOrder.id,
              applied: false,
              action: "SHIPPING_ADD",
              amount: 2.5,
            }),
          ])

          const { result: orderChangePreview2 } =
            await orderExchangeRequestItemReturnWorkflow.run({
              container,
              input: {
                exchange_id: exchangeOrder.id,
                items: [
                  {
                    id: result.items[0].id,
                    quantity: 1,
                  },
                ],
              },
            })

          const associatedReturnId = orderChangePreview2.order_change.return_id

          const { result: orderChangePreview3 } =
            await createExchangeShippingMethodWorkflow(container).run({
              input: {
                exchange_id: exchangeOrder.id,
                return_id: associatedReturnId,
                shipping_option_id: shippingOptionId,
              },
            })

          expect(orderChangePreview3.shipping_methods).toHaveLength(3)

          const inboundShippingMethod =
            orderChangePreview3.shipping_methods?.find(
              (sm) =>
                sm.shipping_option_id === shippingOptionId &&
                sm.actions?.find(
                  (a) =>
                    a.action === "SHIPPING_ADD" &&
                    a.return_id === associatedReturnId
                )
            )

          expect(inboundShippingMethod!.actions![0]).toEqual(
            expect.objectContaining({
              return_id: associatedReturnId,
              exchange_id: exchangeOrder.id,
              applied: false,
              action: "SHIPPING_ADD",
              amount: 2,
            })
          )

          // Update outbound quantity to test refresh caluclation

          const { result: orderChangePreview4 } =
            await updateExchangeAddItemWorkflow(container).run({
              input: {
                exchange_id: exchangeOrder.id,
                action_id: result.items.find(
                  (i) => i.variant_id === fixtures.product.variants[0].id
                )?.actions?.[0]?.id as string,
                data: {
                  quantity: 2,
                },
              },
            })

          const outboundShippingMethod2 =
            orderChangePreview4.shipping_methods?.find(
              (sm) => sm.shipping_option_id === shippingOptionId
            )

          expect((outboundShippingMethod2 as any).actions).toEqual([
            expect.objectContaining({
              id: expect.any(String),
              reference: "order_shipping_method",
              reference_id: expect.any(String),
              raw_amount: { value: "5", precision: 20 },
              return_id: null,
              exchange_id: exchangeOrder.id,
              applied: false,
              action: "SHIPPING_ADD",
              amount: 5,
            }),
          ])
        })
      })
    })
  },
})
