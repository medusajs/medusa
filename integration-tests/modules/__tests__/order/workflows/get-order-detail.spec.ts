import { getOrderDetailWorkflow } from "@zjedene-medusa/core-flows"
import { medusaIntegrationTestRunner } from "@zjedene-medusa/test-utils"
import { OrderDTO } from "@zjedene-medusa/types"
import { createOrderFixture, prepareDataFixtures } from "./__fixtures__"

jest.setTimeout(50000)

medusaIntegrationTestRunner({
  env: {},
  testSuite: ({ getContainer }) => {
    let container

    beforeAll(() => {
      container = getContainer()
    })

    describe("Get order detail workflow", () => {
      let order: OrderDTO

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

        it("should get an order based on filters", async () => {
          const response = await getOrderDetailWorkflow(container).run({
            input: {
              fields: [],
              filters: {
                customer_id: order.customer_id ?? "",
              },
              order_id: order.id,
            },
            throwOnError: false,
          })

          expect(response).toBeDefined()
        })

        it("should throw an error when getting order if none is found with the provided customer id", async () => {
          const {
            errors: [error],
          } = await getOrderDetailWorkflow(container).run({
            input: {
              fields: [],
              filters: {
                customer_id: "wrong-id",
              },
              order_id: order.id,
            },
            throwOnError: false,
          })

          expect(error.error).toEqual(
            expect.objectContaining({
              message: `Order id not found: ${order.id}`,
            })
          )
        })
      })
    })
  },
})
