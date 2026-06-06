import {
  beginReturnOrderWorkflow,
  createOrderFulfillmentWorkflow,
  createReturnShippingMethodWorkflow,
  requestItemReturnWorkflow,
  updateRequestItemReturnWorkflow,
} from "@zjedene-medusa/core-flows"
import { medusaIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { IFulfillmentModuleService, OrderDTO, ReturnDTO } from "@zjedene-medusa/types"
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

        service = container.resolve(Modules.FULFILLMENT)
        ;[returnOrder] = await remoteQuery(remoteQueryObject)
      })

      describe("createReturnShippingMethodWorkflow", () => {
        it("should successfully add return shipping to order changes", async () => {
          const shippingOptionId = fixtures.shippingOption.id

          const { result: orderChangePreview } =
            await createReturnShippingMethodWorkflow(container).run({
              input: {
                return_id: returnOrder.id,
                shipping_option_id: shippingOptionId,
              },
            })

          const shippingMethod = orderChangePreview.shipping_methods?.find(
            (sm) => sm.shipping_option_id === shippingOptionId
          )

          expect((shippingMethod as any).actions).toEqual([
            expect.objectContaining({
              id: expect.any(String),
              reference: "order_shipping_method",
              reference_id: expect.any(String),
              raw_amount: { value: "10", precision: 20 },
              applied: false,
              action: "SHIPPING_ADD",
              amount: 10,
            }),
          ])
        })

        it("should successfully add return shipping with custom price to order changes", async () => {
          const shippingOptionId = fixtures.shippingOption.id

          const { result: orderChangePreview } =
            await createReturnShippingMethodWorkflow(container).run({
              input: {
                return_id: returnOrder.id,
                shipping_option_id: shippingOptionId,
                custom_amount: 20,
              },
            })

          const shippingMethod = orderChangePreview.shipping_methods?.find(
            (sm) => sm.shipping_option_id === shippingOptionId
          )

          expect((shippingMethod as any).actions).toEqual([
            expect.objectContaining({
              id: expect.any(String),
              reference: "order_shipping_method",
              reference_id: expect.any(String),
              raw_amount: { value: "20", precision: 20 },
              applied: false,
              action: "SHIPPING_ADD",
              amount: 20,
            }),
          ])
        })

        it("should successfully add calculated return shipping to order changes", async () => {
          const shippingOptionId = fixtures.shippingOptionCalculated.id

          const { result: orderChangePreview } =
            await createReturnShippingMethodWorkflow(container).run({
              input: {
                return_id: returnOrder.id,
                shipping_option_id: shippingOptionId,
              },
            })

          const shippingMethod = orderChangePreview.shipping_methods?.find(
            (sm) => sm.shipping_option_id === shippingOptionId
          )

          /**
           * Shipping is 0 because the shipping option is calculated based on the return items
           * and currently there are no return items.
           */

          expect((shippingMethod as any).actions).toEqual([
            expect.objectContaining({
              id: expect.any(String),
              reference: "order_shipping_method",
              reference_id: expect.any(String),
              raw_amount: { value: "0", precision: 20 },
              applied: false,
              action: "SHIPPING_ADD",
              amount: 0,
            }),
          ])

          const { result } = await requestItemReturnWorkflow(container).run({
            input: {
              return_id: returnOrder.id,
              items: [
                {
                  id: order.items![0].id,
                  quantity: 1,
                  internal_note: "test",
                },
              ],
            },
          })

          let updatedShippingMethod = result.shipping_methods?.find(
            (sm) => sm.shipping_option_id === shippingOptionId
          )

          /**
           * Caluclated shipping is 2$ per return item.
           */
          expect(updatedShippingMethod).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              shipping_option_id: shippingOptionId,
              amount: 2,
              actions: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  reference: "order_shipping_method",
                  reference_id: expect.any(String),
                  raw_amount: { value: "2", precision: 20 },
                  applied: false,
                  action: "SHIPPING_ADD",
                  amount: 2,
                }),
              ]),
            })
          )
          /**
           * Update the return item quantity to 2.
           */

          const { result: updatedResult } =
            await updateRequestItemReturnWorkflow(container).run({
              input: {
                return_id: returnOrder.id,
                action_id: result.items
                  .find((i) =>
                    i.actions?.find((a) => a.action === "RETURN_ITEM")
                  )
                  ?.actions?.find((a) => a.action === "RETURN_ITEM")?.id!,
                data: {
                  quantity: 2,
                },
              },
            })

          updatedShippingMethod = updatedResult.shipping_methods?.find(
            (sm) => sm.shipping_option_id === shippingOptionId
          )

          expect(updatedShippingMethod).toEqual(
            expect.objectContaining({
              id: expect.any(String),
              shipping_option_id: shippingOptionId,
              amount: 4,
              actions: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  reference: "order_shipping_method",
                  reference_id: expect.any(String),
                  raw_amount: { value: "4", precision: 20 },
                  applied: false,
                  action: "SHIPPING_ADD",
                  amount: 4,
                }),
              ]),
            })
          )
        })
      })
    })
  },
})
